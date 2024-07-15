import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ref, get, set } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';

const ProfileCard = ({ profile }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: session?.user?.email || '',
    studentId: '',
    course: '',
    year: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user?.email) {
        // Encode email for Firebase path
        const encodedEmail = session.user.email.replace('.', '_');
        const profileRef = ref(database, `profiles/${encodedEmail}`);
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFormData(data);
        }
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [session]);

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: '',
      email: session?.user?.email || '',
      studentId: '',
      course: '',
      year: '',
      phone: '',
    });
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save form data to database
    const encodedEmail = session.user.email.replace('.', '_');
    const profileRef = ref(database, `profiles/${encodedEmail}`);
    try {
      await set(profileRef, formData);
      setEditing(false);
      // Optionally, you can handle success message or redirect after save
      router.push('/userprofile'); // Redirect to user profile page
    } catch (error) {
      console.error('Error updating profile:', error);
      // Optionally, handle error state or show error message
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <div>
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p className="text-gray-600">{formData.email}</p>
          </div>
        </div>
        <div className="mt-4">
          {editing ? (
            <>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">Student ID:</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="font-medium text-blue-500 cursor-pointer focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <label className="text-gray-600">Course:</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="font-medium focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <label className="text-gray-600">Year/Semester:</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="font-medium focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <label className="text-gray-600">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="font-medium focus:outline-none"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Student ID:</span>
                <span
                  className="font-medium text-blue-500 cursor-pointer"
                  onClick={handleEditProfile}
                >
                  {formData.studentId}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-600">Course:</span>
                <span className="font-medium">{formData.course}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-600">Year/Semester:</span>
                <span className="font-medium">{formData.year}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileCard;
