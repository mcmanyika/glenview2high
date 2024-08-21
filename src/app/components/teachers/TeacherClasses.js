'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const TeacherClasses = () => {
  const { data: session } = useSession();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesRef = ref(database, 'classes');
        onValue(classesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const classesArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));

            // Filter classes to only show those associated with the logged-in teacher
            const filteredClasses = classesArray.filter(cls => cls.uploadedBy
                === session.user.email);
            setClasses(filteredClasses);
          } else {
            console.log('No classes data found.');
          }
        });
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchClasses();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (classes.length === 0) {
    return <div className="text-center mt-4">No classes found for you.</div>;
  }

  return (
    <div className="w-full text-sm p-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Class Name</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id}>
                <td className="p-2 border-b">{cls.className || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherClasses;
