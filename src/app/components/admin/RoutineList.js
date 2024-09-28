import React, { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaTrashAlt } from 'react-icons/fa';

const RoutineList = () => {
  const [classRoutines, setClassRoutines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Update to show 20 items per page

  useEffect(() => {
    const routineRef = ref(database, 'classRoutine');
    onValue(routineRef, (snapshot) => {
      const routines = [];
      const today = new Date(); // Get today's date

      snapshot.forEach((childSnapshot) => {
        const routine = childSnapshot.val();
        
        // Parse routine date as a Date object
        const routineDate = new Date(routine.date);

        // Only include routines with a date that is today or in the future
        if (routineDate >= today) {
          routines.push({ id: childSnapshot.key, ...routine });
        }
      });

      setClassRoutines(routines);
    });
  }, []);

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

  return (
    <div className="p-6 bg-white rounded shadow mt-3">
      <h2 className="text-xl font-semibold mb-4">All Class Routines</h2>
      {classRoutines.length === 0 ? (
        <p>No class routines available.</p>
      ) : (
        <>
          <table className="min-w-full text-sm bg-white text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Teacher</th>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Class</th>
                <th className="py-2 px-4 border-b">Room</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoutines.map((routine) => (
                <tr key={routine.id}>
                  <td className="py-2 px-4 border-b">{routine.date}</td>
                  <td className="py-2 px-4 border-b">{routine.time}</td>
                  <td className="py-2 px-4 border-b capitalize">{routine.teacher}</td>
                  <td className="py-2 px-4 border-b">{routine.subject}</td>
                  <td className="py-2 px-4 border-b">{routine.studentclass}</td>
                  <td className="py-2 px-4 border-b">{routine.room}</td>
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
