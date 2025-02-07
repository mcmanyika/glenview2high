import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { database } from '../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import StudentDash from './student_dash';
import TeacherDashboard from './teachers_dashboard';
import AdminDashboard from './admin_dashboard';
import ParentDashboard from './parent_dashboard';
import { useGlobalState, setUserID } from '../../app/store';
import { toast } from 'react-toastify';

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
                  if (userData.accessLevel === 5) {
                    setSelectedComponent(<AdminDashboard />);
                  } else {
                    toast.error('Access denied. Your account is under review, please contact the system administrator.');
                    setTimeout(async () => {
                      await signOut({ redirect: false });
                      router.push('/');
                    }, 6000);
                  }
                  break;
                case 'parent':
                  setSelectedComponent(<ParentDashboard />);
                  break;
              }
            } else {
              toast.error('User not found. Please try again.');
              setTimeout(async () => {
                await signOut({ redirect: false });
                router.push('/');
              }, 2000);
            }
          } else {
            toast.error('System error. Please try again later.');
            setTimeout(async () => {
              await signOut({ redirect: false });
              router.push('/');
            }, 2000);
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
