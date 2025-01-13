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
  const itemsPerPage = 3;
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

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

  const sortRoutines = (routines) => {
    return [...routines].sort((a, b) => {
      if (sortConfig.key === 'date' || sortConfig.key === 'time') {
        let valueA, valueB;
        
        if (sortConfig.key === 'date') {
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
        } else { // time
          valueA = a.time;
          valueB = b.time;
        }
        
        return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      // For other fields (subject, teacher)
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedRoutines = sortRoutines(routine);
  const currentItems = sortedRoutines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                  {[
                    { key: 'date', label: 'Date' },
                    { key: 'time', label: 'Time' },
                    { key: 'subject', label: 'Subject' },
                    { key: 'teacher', label: 'Teacher' }
                  ].map((column) => (
                    <th 
                      key={column.key}
                      className="p-3 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>
                        <span className="inline-flex flex-col">
                          <svg className={`w-3 h-3 ${
                            sortConfig.key === column.key && sortConfig.direction === 'asc' 
                              ? 'text-blue-500 dark:text-blue-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                          </svg>
                          <svg className={`w-3 h-3 ${
                            sortConfig.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-blue-500 dark:text-blue-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                          </svg>
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {currentItems.map((entry) => (
                  <tr 
                    key={entry.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                    onClick={() => {
                      setSelectedRoutine(entry);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="p-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{entry.date}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{entry.time}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">{entry.subject}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 capitalize">{entry.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-full 
                hover:bg-blue-700 dark:hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-full 
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

      {isModalOpen && selectedRoutine && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full shadow-xl transform animate-modalSlide"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Class Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedRoutine.date}
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      {getDayOfWeek(selectedRoutine.date)}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</p>
                  <p className="text-gray-800 dark:text-gray-200">{selectedRoutine.time}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</p>
                <p className="text-gray-800 dark:text-gray-200">{selectedRoutine.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Teacher</p>
                  <p className="text-gray-800 dark:text-gray-200 capitalize">{selectedRoutine.teacher}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Room</p>
                  <p className="text-gray-800 dark:text-gray-200">{selectedRoutine.room}</p>
                </div>
              </div>

              {selectedRoutine.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                  <p className="text-gray-800 dark:text-gray-200">{selectedRoutine.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 px-4 rounded-lg
                hover:bg-blue-600 dark:hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(ClassRoutine);
