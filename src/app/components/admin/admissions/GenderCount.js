// components/GenderCount.js

import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaMale, FaFemale, FaUsers } from 'react-icons/fa';

const GenderCount = () => {
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });

  useEffect(() => {
    const admissionsRef = ref(database, 'userTypes');
    const unsubscribe = onValue(admissionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const counts = { male: 0, female: 0 };

        Object.values(data).forEach((admission) => {
          const gender = admission.gender.toLowerCase();
          if (gender === 'male') {
            counts.male += 1;
          } else if (gender === 'female') {
            counts.female += 1;
          }
        });

        setGenderCounts(counts);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const totalStudents = genderCounts.male + genderCounts.female;

  return (
    <div className="w-full text-sm p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Accounts By Gender</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 text-blue-700 rounded-lg shadow flex flex-col items-center justify-center">
          <FaMale className="text-4xl mb-2" />
          <h3 className="text-lg font-semibold">Male</h3>
          <p className="text-2xl">{genderCounts.male}</p>
        </div>
        <div className="p-4 bg-pink-100 text-pink-700 rounded-lg shadow flex flex-col items-center justify-center">
          <FaFemale className="text-4xl mb-2" />
          <h3 className="text-lg font-semibold">Female</h3>
          <p className="text-2xl">{genderCounts.female}</p>
        </div>
        <div className="p-4 bg-gray-100 text-gray-700 rounded-lg shadow flex flex-col items-center justify-center">
          <FaUsers className="text-4xl mb-2" />
          <h3 className="text-lg font-semibold">Total Count</h3>
          <p className="text-2xl">{totalStudents}</p>
        </div>
      </div>
    </div>
  );
};

export default GenderCount;
