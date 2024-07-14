import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, get, set } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import fetchUserType from '../../../../utils/fetchUserType';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            setProfileData({ studentId: generateId('STU') });
          } else if (userType === 'teacher' || userType === 'staff') {
            setProfileData({ employeeId: generateId('EMP') });
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

  const handleSubmit = async () => {
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
        return (
          <>
            <div>
              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                value={profileData.studentId || ''}
                readOnly
                className="block w-full mt-1 p-2 border rounded-md bg-gray-200"
              />
            </div>
            <div>
              <label htmlFor="course">Grade</label>
              <input
                id="course"
                name="course"
                type="text"
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded-md"
              />
            </div>
          </>
        );
      case 'teacher':
      case 'staff':
        return (
          <>
            <div>
              <label htmlFor="employeeId">Employee ID</label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                value={profileData.employeeId || ''}
                readOnly
                className="block w-full mt-1 p-2 border rounded-md bg-gray-200"
              />
            </div>
            <div>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded-md"
              />
            </div>
            {userType === 'teacher' && (
              <div>
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border rounded-md"
                />
              </div>
            )}
          </>
        );
      case 'parent':
        return (
          <>
            <div>
              <label htmlFor="studentName">Student Name</label>
              <input
                id="studentName"
                name="studentName"
                type="text"
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="relation">Relation</label>
              <input
                id="relation"
                name="relation"
                type="text"
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded-md"
              />
            </div>
          </>
        );
      case 'contractor':
        return (
          <>
            <div>
              <label htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="service">Service</label>
              <input
                id="service"
                name="service"
                type="text"
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded-md"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        {renderProfileFields()}
        <button
          type="button"
          onClick={handleSubmit}
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
