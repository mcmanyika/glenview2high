import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useGlobalState } from '../../app/store';

const generateTeacherId = () => {
  return `TEID-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
};

const TeacherForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    teacherId: '',
    email: '',
    schoolName: '',
    subject: '',
    yearsOfExperience: '',
  });
  const [teacherId, setTeacherId] = useGlobalState('teacherId');
  const router = useRouter();

  useEffect(() => {
    const newTeacherId = generateTeacherId();
    setFormData((prevFormData) => ({
      ...prevFormData,
      teacherId: newTeacherId,
      email: session?.user?.email || '',
    }));
  }, [session]);

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
      const teacherRef = ref(database, `teachers/${formData.teacherId}`);
      await set(teacherRef, formData);
      toast.success('Teacher information saved successfully');
      setTeacherId(formData.teacherId); // Save teacher ID in global state
      // Redirect to a teacher-specific page
      setTimeout(() => {
        router.push('/teachers_dashboard');
      }, 2000); // Redirect after 2 seconds to allow the toast message to be shown
    } catch (error) {
      toast.error('Error saving teacher information');
      console.error('Error saving teacher information: ', error);
    }
  };

  return (
    <SmartBlankLayout>
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Teacher Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="teacherId"
            value={formData.teacherId}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <input
            type="hidden"
            name="email"
            value={formData.email}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <div className="mb-4">
            <select
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select School</option>
              <option value="Divaris Makaharis High">Divaris Makaharis High</option>
              <option value="Glenview 2 High">Glenview 2 High</option>
            </select>
          </div>
          <div className="mb-4">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Physical Education">Physical Education</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
          <div className="mb-4">
            <select
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select Years of Experience</option>
              {[...Array(20).keys()].map((i) => (
                <option key={i} value={i}>
                  {i} {i === 1 ? 'year' : 'years'}
                </option>
              ))}
              <option value="20+">20 Plus</option>
            </select>
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
          rtl={true} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="dark"
        />
      </div>
    </SmartBlankLayout>
  );
};

export default TeacherForm;
