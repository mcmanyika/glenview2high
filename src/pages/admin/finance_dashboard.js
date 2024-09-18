import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'; // Import useSession for session handling
import { database } from '../../../utils/firebaseConfig'; // Adjust the path if needed
import { setUserID } from '../../app/store'; // Adjust the path if needed

import withAuth from '../../../utils/withAuth'; // withAuth HOC for authentication
import AdminLayout from './adminLayout'; // Layout component for the admin dashboard
import PaymentsList from '../../app/components/finance/PaymentsList'; // PaymentsList component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Spinner icon

const FinanceDashboard = () => {
  const { data: session, status } = useSession(); // Get session and status from next-auth
  const [userType, setUserType] = useState(null); // State for user type
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email; // Get the user's email from session
          const userRef = ref(database, 'userTypes'); // Reference to the userTypes node in Firebase
          const snapshot = await get(userRef); // Get the data from Firebase

          if (snapshot.exists()) {
            const users = snapshot.val(); // Get the user data
            const foundUserID = Object.keys(users).find(id => users[id].email === userEmail); // Find user by email

            if (foundUserID) {
              const userData = users[foundUserID];
              setUserType(userData.userType); // Set user type
              setUserID(foundUserID); // Store user ID in the state
            } else {
              console.log('No user found with this email.');
              router.push('/admin/user'); // Redirect if no user is found
            }
          } else {
            console.log('No user types found.');
          }
        } catch (error) {
          console.error('Error fetching user type:', error); // Log any error
          setError('Error fetching user type. Please try again later.'); // Set error message
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchUserType();
    }
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-blue-500 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>; // Display error message if any
  }

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full">
          <div className="bg-white border shadow-sm rounded mt-4 p-4">
            <PaymentsList /> {/* Display Payments List */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(FinanceDashboard); // Export component wrapped with authentication HOC
