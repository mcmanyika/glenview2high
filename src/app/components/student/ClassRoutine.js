import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useGlobalState } from '../../store';

import withAuth from '../../../../utils/withAuth';

const ClassRoutine = () => {
  const [routine, setRoutine] = useState([]);
  const [studentClass] = useGlobalState('studentClass');
  const [, setRoutineCount] = useGlobalState('routineCount');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log('Fetching routines for studentClass:', studentClass); // Debug log

    const routineRef = ref(database, 'classRoutine');
    const handleData = (snapshot) => {
      const data = snapshot.val();
      console.log('Fetched data:', data); // Debug log

      if (data) {
        const currentDate = new Date();
        const filteredRoutine = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(entry => {
            console.log('Evaluating entry:', entry); // Debug log
            return entry.studentclass === studentClass && new Date(entry.date) > currentDate;
          });

        console.log('Filtered routine:', filteredRoutine); // Debug log
        setRoutine(filteredRoutine);
        setRoutineCount(filteredRoutine.length);
      }
    };

    onValue(routineRef, handleData, {
      onlyOnce: true
    });

  }, [studentClass, setRoutineCount]);

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(routine.length / itemsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
  };

  const currentItems = routine.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full text-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Class Routine</h2>
      {routine.length === 0 ? (
        <p className="text-center">There are no upcoming classes assigned yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className='uppercase'>
                  <th className="p-2 border-b">Day</th>
                  <th className="p-2 border-b">Time</th>
                  <th className="p-2 border-b">Subject</th>
                  <th className="p-2 border-b">Teacher</th>
                  <th className="p-2 border-b">Date</th>
                  <th className="p-2 border-b">Room</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((entry) => (
                  <tr key={entry.id}>
                    <td className="p-2 border-b">{getDayOfWeek(entry.date)}</td>
                    <td className="p-2 border-b">{entry.time}</td>
                    <td className="p-2 border-b">{entry.subject}</td>
                    <td className="p-2 border-b capitalize">{entry.teacher}</td>
                    <td className="p-2 border-b">{entry.date}</td>
                    <td className="p-2 border-b">{entry.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={currentPage === Math.ceil(routine.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default withAuth(ClassRoutine)
