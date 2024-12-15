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
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const routineRef = ref(database, 'classRoutine');
    setLoading(true);

    const handleData = (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const currentDate = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(currentDate.getDate() - 3); // Get the date 3 days ago

        const filteredRoutine = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(entry => {
            const entryDate = new Date(entry.date);
            return entry.studentclass === studentClass && entryDate >= threeDaysAgo; // Only show routines from today or within the last 3 days
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        setRoutine(filteredRoutine);
        setRoutineCount(filteredRoutine.length);
      } else {
        console.error('No data available');
      }

      setLoading(false);
    };

    onValue(routineRef, handleData, { onlyOnce: true });

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
    <div className="w-full text-sm p-6 bg-white dark:bg-gray-800 transition-colors duration-200">
      
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : routine.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          There are no upcoming classes assigned yet.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="uppercase bg-gray-50 dark:bg-gray-700">
                  <th className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Date</th>
                  <th className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Day</th>
                  <th className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Time</th>
                  <th className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Subject</th>
                  <th className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Teacher</th>
                  <th className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Room</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {currentItems.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{entry.date}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{getDayOfWeek(entry.date)}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{entry.time}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{entry.subject}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 capitalize">{entry.teacher}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{entry.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              className="bg-blue-500 dark:bg-blue-600 text-white py-1 px-3 rounded-md 
                hover:bg-blue-700 dark:hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-blue-500 dark:bg-blue-600 text-white py-1 px-3 rounded-md 
                hover:bg-blue-700 dark:hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
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

export default withAuth(ClassRoutine);
