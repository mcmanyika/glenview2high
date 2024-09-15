import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Adjust the path as necessary
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { useGlobalState } from '../../app/store'; // Adjust the path as necessary
import { useSession } from 'next-auth/react'; // Import useSession for accessing session data

const ProfileAttributes = () => {
  const { data: session, status } = useSession(); // Get session and status
  const [formData, setFormData] = useState({
    studentId: '',
    email: '', // Include email in formData
    gender: '',
    dob: '',
  });

  const [globalStudentId] = useGlobalState('studentId');
  const router = useRouter();

  useEffect(() => {
    if (status === '') {
      // Wait until the session status is determined
      return;
    }

    if (session) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        studentId: globalStudentId,
        email: session.user.email || '', // Fetch email from session
      }));
    }
  }, [session, status, globalStudentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const profileRef = ref(database, `profiles/${formData.studentId}`);
      await set(profileRef, formData);
      toast.success('Profile attributes saved successfully');
      router.push('/admin/student_dash'); // Redirect to student_dashboard
    } catch (error) {
      toast.error('Error saving profile attributes');
      console.error('Error saving profile attributes: ', error);
    }
  };

  return (
    <SmartBlankLayout>
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Profile Attributes Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="hidden"
              name="studentId"
              value={formData.studentId}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
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
    </SmartBlankLayout>
  );
};

export default ProfileAttributes;
