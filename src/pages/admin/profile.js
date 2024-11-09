import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { database } from '../../../utils/firebaseConfig';
import { setUserID } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Student from '../../app/components/student/Student';
import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';

function Profile() {
  const { data: session, status } = useSession();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const controller = new AbortController();
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email;
          const userRef = ref(database, 'userTypes');
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const users = snapshot.val();
            const foundUserID = Object.keys(users).find(
              (id) => users[id].email === userEmail
            );

            if (foundUserID) {
              const userData = users[foundUserID];
              setUserType(userData.userType);
              setUserID(foundUserID);
            } else {
              console.log('No user found with this email.');
              router.push('/admin/user');
            }
          } else {
            console.log('No user types found.');
            setError('No user types found. Please contact support.');
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Error fetching user type:', error);
            setError('Error fetching user type. Please try again later.');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchUserType();

      // Cleanup function
      return () => controller.abort();
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
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <AdminLayout>
      <Student />
    </AdminLayout>
  );
}
export default withAuth(Profile)