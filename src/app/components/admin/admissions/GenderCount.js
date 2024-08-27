import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { MdMale, MdFemale, MdPeople } from 'react-icons/md'; // Import icons for Male, Female, and Total Students

const GenderCount = () => {
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });

  useEffect(() => {
    const admissionsRef = ref(database, 'admissions');
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
    <div className="w-full flex flex-col md:flex-row text-center">
      <div className="w-full md:w-1/3 flex bg-white border shadow-sm rounded m-2 mt-0 ml-0">
        <div className='w-1/3 flex items-center justify-center p-4 md:p-2'>
          <MdFemale className='w-16 h-16 rounded-full bg-pink-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-sm p-4 md:p-6 text-right">
          Female Students <br />{genderCounts.female}
        </div>
      </div>
      <div className="w-full md:w-1/3 flex bg-white border shadow-sm rounded m-2 mt-0 ml-0">
        <div className='w-1/3 flex items-center justify-center p-4 md:p-2'>
          <MdMale className='w-16 h-16 rounded-full bg-blue-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-sm p-4 md:p-6 text-right">
          Male Students <br />{genderCounts.male}
        </div>
      </div>
      <div className="w-full md:w-1/3 flex bg-white border shadow-sm rounded m-2 mt-0 ml-0">
        <div className='w-1/3 flex items-center justify-center p-4 md:p-2'>
          <MdPeople className='w-16 h-16 rounded-full bg-green-300 text-white p-2' />
        </div>
        <div className="w-2/3 text-sm p-4 md:p-6 text-right">
          Total Students <br />{totalStudents}
        </div>
      </div>
    </div>
  );
};

export default GenderCount;
