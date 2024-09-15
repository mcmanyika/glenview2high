import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { database } from '../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import StudentDash from './student_dash';
import TeacherDashboard from './teachers_dashboard';
import AdminDashboard from './admin_dashboard';
import { useGlobalState, setUserID } from '../../app/store';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Access userID from global state
  const [userID] = useGlobalState('userID'); // Assuming 'userID' is where the user ID is stored

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email; // Get the email of the logged-in user
          const userRef = ref(database, 'userTypes'); // Reference to the userTypes node
          
          // Fetch all userTypes
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const users = snapshot.val();
            // Find the user ID based on the email
            const foundUserID = Object.keys(users).find(id => users[id].email === userEmail);
            
            if (foundUserID) {
              const userData = users[foundUserID];
              setUserType(userData.userType);
              setUserID(foundUserID); // Store the userID in global state
              
              // Determine which component to render based on userType
              switch (userData.userType) {
                case 'student':
                  setSelectedComponent(<StudentDash />);
                  break;
                case 'teacher':
                  setSelectedComponent(<TeacherDashboard />);
                  break;
                case 'staff':
                  setSelectedComponent(<AdminDashboard />);
                  break;
              }
            } else {
              console.log('No user found with this email.');
              router.push('/admin/user'); // Redirect if user not found
            }
          } else {
            console.log('No userTypes found.');
            router.push('/admin/user'); // Redirect if no userTypes are found
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
          setError('Error fetching user type. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchUserType();
    }
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div>
      {selectedComponent}
    </div>
  );
};

export default withAuth(Dashboard);
