import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner, FaMale, FaFemale, FaUsers } from 'react-icons/fa'; // Importing icons
import { useSession } from 'next-auth/react';

const StudentGenderCount = () => {
  const { data: session, status } = useSession();
  const [admissions, setAdmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchAdmissionsAndClasses = () => {
        const admissionsRef = ref(database, 'userTypes');
        const classesRef = ref(database, 'classes');

        onValue(admissionsRef, (snapshot) => {
          const admissionsData = snapshot.val();
          if (admissionsData) {
            const admissionsArray = Object.keys(admissionsData).map((key) => ({
              id: key,
              ...admissionsData[key],
            }));
            setAdmissions(admissionsArray);
          }
        });

        onValue(classesRef, (snapshot) => {
          const classesData = snapshot.val();
          if (classesData) {
            const classesArray = Object.keys(classesData).map((key) => ({
              id: key,
              ...classesData[key],
            }));
            setClasses(classesArray);
          }
        });

        setIsLoading(false);
      };

      fetchAdmissionsAndClasses();
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const filteredStudents = admissions.filter((student) => {
    const isClassValid = classes.some((cls) => cls.className === student.studentClassLevel);
    if (!isClassValid) return false;

    const term = searchTerm.toLowerCase();
    return (
      student.userID?.toLowerCase().includes(term) ||
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.studentClassLevel?.toLowerCase().includes(term) ||
      student.gender?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term)
    );
  });

  // Calculate gender counts
  const genderCounts = filteredStudents.reduce(
    (acc, student) => {
      const gender = student.gender ? student.gender.toLowerCase() : 'unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      acc.TotalCount = filteredStudents.length;
      return acc;
    },
    { male: 0, female: 0, TotalCount: 0 }
  );

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          <p className="text-2xl">{genderCounts.TotalCount}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentGenderCount;
