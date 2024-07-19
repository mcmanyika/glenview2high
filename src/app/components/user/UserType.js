import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const UserTypeSelector = ({ userEmail }) => {
  const [userType, setUserType] = useState('');
  const router = useRouter();

  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async () => {
    if (userEmail && userType) {
      try {
        const userRef = ref(database, `userTypes/${userEmail.replace('.', '_')}`);
        await set(userRef, userType);
        toast.success('User type saved successfully');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000); // Redirect after 2 seconds to allow the toast message to be shown
      } catch (error) {
        toast.error('Error saving user type');
        console.error('Error saving user type: ', error);
      }
    } else {
      toast.warning('Please select a user type');
    }
  };

  return (
    <div className="mb-4">
      <select
        id="userType"
        value={userType}
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="" disabled>Select user type...</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="staff">Staff</option>
        <option value="parent">Parent</option>
        <option value="contractor">Contractor</option>
      </select>
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
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
  );
};

export default UserTypeSelector;
