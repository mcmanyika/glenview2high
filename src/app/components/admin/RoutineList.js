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
          <table className="min-w-full text-sm text-black dark:text-white text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer" onClick={() => handleSort('date')}>
                  Date {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer" onClick={() => handleSort('time')}>
                  Time {sortField === 'time' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer" onClick={() => handleSort('teacher')}>
                  Teacher {sortField === 'teacher' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer" onClick={() => handleSort('subject')}>
                  Subject {sortField === 'subject' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer" onClick={() => handleSort('studentclass')}>
                  Class {sortField === 'studentclass' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer" onClick={() => handleSort('room')}>
                  Room {sortField === 'room' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoutines.map((routine) => (
                <tr key={routine.id}>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{formatDate(routine.date)}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{routine.time}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 capitalize">{routine.teacher}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{routine.subject}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{routine.studentclass}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{routine.room}</td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      className="text-red-500 hover:underline" 
                      onClick={() => handleDelete(routine.id)}
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-end space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
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
