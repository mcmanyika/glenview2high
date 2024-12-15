import React from 'react'
import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'; // Import useSession for session handling
import { database } from '../../../utils/firebaseConfig'; // Adjust the path if needed
import { setUserID } from '../../app/store'; // Adjust the path if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Spinner icon


import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';
import CreateExamForm from '../../app/components/exams/CreateExamForm';
import AssignedExamsList from '../../app/components/exams/AssignedExamsList';

const Exams = () => {
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
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-main3 dark:text-main2 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400 p-4">{error}</div>;
  }

  return (
    <AdminLayout>
      <div className='w-full flex flex-col md:flex-row bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-200'>
        <div className='w-full m-1'>
          <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-slate-700'>
            <AssignedExamsList />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Exams);
