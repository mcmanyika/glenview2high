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
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full text-sm p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">My Classes</h2>
      {classes.length === 0 ? (
        <p className="text-gray-500">No classes found for your account.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left border border-gray-200 px-4 py-2">Class Name</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id} onClick={() => handleClassClick(classItem.className)} className="cursor-pointer hover:bg-gray-100">
                <td className="border border-gray-200 px-4 py-2">{classItem.className}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherClassesList;