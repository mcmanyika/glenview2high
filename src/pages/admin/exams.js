import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { ref, get } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { setUserID } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';
import CreateExamForm from '../../app/components/exams/CreateExamForm';
import AssignedExamsList from '../../app/components/exams/AssignedExamsList';

const Exams = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email;
          const userRef = ref(database, 'userTypes');
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const users = snapshot.val();
            const foundUserID = Object.keys(users).find(id => users[id].email === userEmail);
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
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-blue-500 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <AdminLayout>
      <div className='w-full flex flex-col md:flex-row'>
        <div className='w-full md:w-1/4 m-1'>
          <CreateExamForm />
        </div>
        <div className='w-full md:w-3/4 m-1'>
          <AssignedExamsList />
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Exams);