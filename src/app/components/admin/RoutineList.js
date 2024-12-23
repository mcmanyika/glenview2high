import React, { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaTrashAlt } from 'react-icons/fa';

// Utility function to format date to Zimbabwean format (DD/MM/YYYY)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Return formatted date
};

const RoutineList = () => {
  const [classRoutines, setClassRoutines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortField, setSortField] = useState('date'); // Default sort field
  const [sortDirection, setSortDirection] = useState('desc'); // Default sort direction

  useEffect(() => {
    const routineRef = ref(database, 'classRoutine');
    onValue(routineRef, (snapshot) => {
      const routines = [];

      snapshot.forEach((childSnapshot) => {
        const routine = childSnapshot.val();
        routines.push({ id: childSnapshot.key, ...routine });
      });

      // Sort routines based on current sort field and direction
      routines.sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];
        if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setClassRoutines(routines);
    });
  }, [sortField, sortDirection]); // Re-run effect when sortField or sortDirection changes

  // Calculate the routines to be displayed on the current page
  const indexOfLastRoutine = currentPage * itemsPerPage;
  const indexOfFirstRoutine = indexOfLastRoutine - itemsPerPage;
  const currentRoutines = classRoutines.slice(indexOfFirstRoutine, indexOfLastRoutine);

  // Calculate the total number of pages
  const totalPages = Math.ceil(classRoutines.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    const routineRef = ref(database, `classRoutine/${id}`);
    remove(routineRef)
      .then(() => {
        setClassRoutines(classRoutines.filter(routine => routine.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting routine:', error);
      });
  };

  const handleSort = (field) => {
    const newSortDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newSortDirection);
  };

  return (
    <div className="p-6 rounded shadow mt-3">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">All Class Routines</h2>

      {classRoutines.length === 0 ? (
        <p className="dark:text-white">No class routines available.</p>
      ) : (
        <>
          {/* Header */}
          <div className="grid grid-cols-[1fr_1.5fr_1.3fr_1fr_0.3fr] gap-4 mb-4 font-semibold text-sm text-black dark:text-white">
            <div className="cursor-pointer" onClick={() => handleSort('date')}>
              Date & Time {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </div>
            <div className="cursor-pointer" onClick={() => handleSort('teacher')}>
              Teacher {sortField === 'teacher' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </div>
            <div className="cursor-pointer" onClick={() => handleSort('subject')}>
              Subject {sortField === 'subject' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </div>
            <div className="cursor-pointer" onClick={() => handleSort('studentclass')}>
              Class {sortField === 'studentclass' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </div>
          </div>

          {/* Routine Items */}
          <div className="space-y-2">
            {currentRoutines.map((routine) => (
              <div 
                key={routine.id} 
                className="grid grid-cols-[1fr_1.5fr_1.3fr_1fr_0.3fr] gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-sm dark:text-white">
                  <div className="font-medium">{formatDate(routine.date)}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">{routine.time}</div>
                </div>
                <div className="text-sm dark:text-white capitalize">{routine.teacher}</div>
                <div className="text-sm dark:text-white">{routine.subject}</div>
                <div className="text-sm dark:text-white">{routine.studentclass}</div>
                <div className="flex justify-center">
                  <button 
                    className="text-red-500 hover:text-red-700 transition-colors" 
                    onClick={() => handleDelete(routine.id)}
                  >
                    <FaTrashAlt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-end space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === i + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RoutineList;
