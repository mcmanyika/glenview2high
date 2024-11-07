import React, { useState, useEffect } from 'react';
import { storage, database } from '../../../../../utils/firebaseConfig'; // Adjust the path as necessary
import { ref, set, get } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';

const EnrollmentDetailsForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    class: '',
    contactEmail: '',
    contactPhone: '',
    parentName: '',
    parentPhone: '',
    academicPreviousSchool: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  // Set email to the logged-in user's email when session is loaded
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prevData) => ({
        ...prevData,
        contactEmail: session.user.email,
      }));

      // Check if enrollment details already exist in the database
      const sanitizedEmail = sanitizeEmail(session.user.email);
      const dbRef = ref(database, `enrollments/${sanitizedEmail}`);
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          setIsSubmitted(true);  // User has already submitted
        }
        setLoading(false); // Set loading to false after check is done
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sanitizeEmail = (email) => email.replace(/\./g, ',');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitted) {
      toast.error('You have already submitted your enrollment details.');
      return; // Prevent further submission
    }

    try {
      const sanitizedEmail = sanitizeEmail(formData.contactEmail);
      const dbRef = ref(database, `enrollments/${sanitizedEmail}`);
      
      await set(dbRef, formData);

      toast.success('Enrollment details submitted successfully!');
      setIsSubmitted(true);  // Set as submitted after successful form submission

      setFormData({
        class: '',
        contactEmail: session?.user?.email || '', // Reset to logged-in user’s email
        contactPhone: '',
        parentName: '',
        parentPhone: '',
        academicPreviousSchool: '',
      });
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error(`Failed to submit enrollment details: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-16 h-16"></div> {/* Spinner */}
      </div>
    );
  }

  return (
    <div className="flex justify-center h-screen">
      <div className="p-6 bg-white  rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl text-center font-semibold mb-4">Enrollment Details</h2>
        {isSubmitted ? (
          <div className="text-center text-xl text-green-500">
            You have already submitted your enrollment details.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Class Selection */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select Grade...</option>
                  <option value="Form 1">Form 1</option>
                  <option value="Form 2">Form 2</option>
                  <option value="O' Level">O Level</option>
                  <option value="A' Level">A Level</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <h3 className="text-xl font-semibold mt-6 mb-2">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <h3 className="text-xl font-semibold mt-6 mb-2">Parent/Guardian Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Parent/Guardian Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Parent/Guardian Phone</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            {/* Academic Information */}
            <h3 className="text-xl font-semibold mt-6 mb-2">Academic Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Previous School</label>
                <input
                  type="text"
                  name="academicPreviousSchool"
                  value={formData.academicPreviousSchool}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full p-2 bg-main3 text-white rounded hover:bg-blue-600"
                disabled={isSubmitted} // Disable the button if already submitted
              >
                Submit Enrollment Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnrollmentDetailsForm;
