import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, get, set } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import fetchUserType from '../../../../utils/fetchUserType';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StudentProfile from './utils/StudentProfile'; // Import StudentProfile component

const generateId = (prefix) => `${prefix}-${Math.floor(Math.random() * 100000)}`;

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userType, setUserType] = useState('');
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (session?.user?.email) {
        const userRef = ref(database, `users/${session.user.email.replace('.', '_')}/profile`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          router.push('/userdashboard');
        } else {
          const userType = await fetchUserType(session.user.email);
          setUserType(userType);
          if (userType === 'student') {
            setProfileData({ studentId: generateId('STU'), email: session.user.email });
          } else if (userType === 'teacher' || userType === 'staff') {
            setProfileData({ employeeId: generateId('EMP'), email: session.user.email });
          }
          setIsLoading(false);
        }
      }
    };

    checkUserProfile();
  }, [session, router]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (session?.user?.email) {
      try {
        const userRef = ref(database, `users/${session.user.email.replace('.', '_')}/profile`);
        await set(userRef, profileData);
        toast.success('Profile updated successfully');
        router.push('/userdashboard'); // Redirect to user dashboard
      } catch (error) {
        toast.error('Error updating profile');
        console.error('Error updating profile:', error);
      }
    }
  };

  const renderProfileFields = () => {
    switch (userType) {
      case 'student':
        return <StudentProfile profileData={profileData} handleChange={handleChange} />;
      case 'teacher':
      case 'staff':
        // Return teacher or staff profile form component
        return null;
      case 'parent':
        // Return parent profile form component
        return null;
      case 'contractor':
        // Return contractor profile form component
        return null;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        {renderProfileFields()}
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Save Profile
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

export default UserProfile;
