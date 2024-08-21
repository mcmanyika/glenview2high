import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { database } from '../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import StudentDash from './student_dash';
import TeacherDashboard from './teachers_dashboard';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // State to hold user type
  const [selectedComponent, setSelectedComponent] = useState(null); // State to hold the selected component
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email.replace('.', '_');
          const userRef = ref(database, `userTypes/${userEmail}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserType(userData.userType);
            if (userData.userType === 'student') {
              setSelectedComponent(<StudentDash />);
            } else if (userData.userType === 'teacher') {
              setSelectedComponent(<TeacherDashboard />);
            } else {
              // Handle other user types or a default component
              setSelectedComponent(<div>Welcome, {userData.userType}</div>);
            }
          } else {
            // Redirect to /user if the user is not found in userTypes
            router.push('/admin/user');
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserType();
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <>
      {selectedComponent}
    </>
  );
};

export default withAuth(Dashboard);
