import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { FaSpinner } from 'react-icons/fa'; 
import { useRouter } from 'next/router';

const TeacherClassesList = () => {
  const { data: session, status } = useSession();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const classesRef = ref(database, 'classes'); 

      onValue(classesRef, (snapshot) => {
        const classesData = snapshot.val();
        if (classesData) {
          const classesArray = Object.keys(classesData).map((key) => ({
            id: key,
            ...classesData[key],
          }));
          const filteredClasses = classesArray.filter(
            (classItem) => classItem.teacherEmail === session.user.email
          );
          setClasses(filteredClasses);
        } else {
          console.error('No classes data found');
        }
        setIsLoading(false);
      }, (error) => {
        console.error('Error fetching classes:', error);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [status, session]);

  const handleClassClick = (className) => {
    router.push(`/students/${className}`); 
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center 
        bg-gray-200 dark:bg-gray-800 bg-opacity-75 z-50 
        transition-colors duration-200">
        <FaSpinner className="animate-spin text-4xl text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full text-sm p-4 bg-white dark:bg-gray-800 
      rounded-lg transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        My Classes
      </h2>
      
      {classes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No classes found for your account.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 dark:text-gray-200 
                  font-semibold">
                  Class Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {classes.map((classItem) => (
                <tr 
                  key={classItem.id} 
                  onClick={() => handleClassClick(classItem.className)} 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 
                    transition-colors duration-150"
                >
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                    {classItem.className}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherClassesList;