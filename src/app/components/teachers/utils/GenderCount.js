import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner, FaMale, FaFemale, FaUsers } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const GenderCount = () => {
  const { data: session, status } = useSession();
  const [genderCounts, setGenderCounts] = useState({ Male: 0, Female: 0, TotalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchGenderCounts = async () => {
        try {
          const userEmail = session.user.email;
          const admissionsRef = ref(database, 'userTypes');

          onValue(admissionsRef, (snapshot) => {
            const admissionsData = snapshot.val();
            if (admissionsData) {
              const counts = { Male: 0, Female: 0, TotalCount: 0 };
              Object.values(admissionsData).forEach((admission) => {
                if (admission.email === userEmail) {
                  if (admission.gender === 'male') {
                    counts.Male += 1;
                  } else if (admission.gender === 'female') {
                    counts.Female += 1;
                  }
                  counts.TotalCount += 1;
                }
              });
              setGenderCounts(counts);
            } else {
              console.log('No admissions data found.');
            }
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGenderCounts();
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full text-sm p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Students By Gender</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 text-blue-700 rounded-lg shadow flex flex-col items-center justify-center">
          <FaMale className="text-4xl mb-2" />
          <h3 className="text-lg font-semibold">Male</h3>
          <p className="text-2xl">{genderCounts.Male}</p>
        </div>
        <div className="p-4 bg-pink-100 text-pink-700 rounded-lg shadow flex flex-col items-center justify-center">
          <FaFemale className="text-4xl mb-2" />
          <h3 className="text-lg font-semibold">Female</h3>
          <p className="text-2xl">{genderCounts.Female}</p>
        </div>
        <div className="p-4 bg-gray-100 text-gray-700 rounded-lg shadow flex flex-col items-center justify-center">
          <FaUsers className="text-4xl mb-2" />
          <h3 className="text-lg font-semibold">Total Count</h3>
          <p className="text-2xl">{genderCounts.TotalCount}</p>
        </div>
      </div>
    </div>
  );
};

export default GenderCount;
