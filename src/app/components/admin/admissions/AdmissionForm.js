import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the import based on your project structure
import { ref, set } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdmissionForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    religion: '',
    email: session?.user?.email || '',
    class: '',
    bio: '',
    admissionId: '',
    phone: '',
    status: 'Pending', // Default value for Status
  });

  // Function to generate a random Admission ID
  const generateAdmissionId = () => {
    return `ADM${Math.floor(Math.random() * 1000000)}`;
  };

  useEffect(() => {
    // Auto-generate Admission ID on component mount
    setFormData((prevFormData) => ({
      ...prevFormData,
      admissionId: generateAdmissionId(),
      email: session?.user?.email || '',
    }));
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save form data to Firebase Realtime Database
    try {
      const admissionRef = ref(database, `admissions/${formData.admissionId}`);
      await set(admissionRef, formData);
      toast.success('Admission data submitted successfully!', {
        position: 'bottom-center',
      });

      // Reset the form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        religion: '',
        email: session?.user?.email || '',
        class: '',
        bio: '',
        admissionId: generateAdmissionId(), // Generate a new Admission ID
        phone: '',
        status: 'Pending', // Reset Status to default value
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Failed to submit admission data.', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Admission Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Religion</label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Short BIO</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            />
          </div>

          <div>
            <input
              type="hidden"
              name="admissionId"
              value={formData.admissionId}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Hidden Status Field */}
          <div>
            <input
              type="hidden"
              name="status"
              value={formData.status}
            />
          </div>
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AdmissionForm;
