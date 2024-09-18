// utils/useFetchUserType.js
import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the path if needed
import { setUserID } from '../../../app/store'; // Ensure the correct path to the store is used

const useFetchUserType = (session, status) => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  return { userType, loading, error };
};

export default useFetchUserType;
