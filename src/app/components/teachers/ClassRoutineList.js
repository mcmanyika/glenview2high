import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaTrashAlt } from 'react-icons/fa';

const ClassRoutineList = () => {
  const { data: session } = useSession();
  const [classRoutines, setClassRoutines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    if (!session?.user?.email) return;

    const routineRef = ref(database, 'classRoutine');
    onValue(routineRef, (snapshot) => {
      const routines = [];
      const currentDate = new Date();
      const twoDaysAgo = new Date(currentDate);
      twoDaysAgo.setDate(currentDate.getDate() - 2);

      snapshot.forEach((childSnapshot) => {
        const routine = childSnapshot.val();
        const routineDate = new Date(routine.date);

        if (routine.email === session.user.email && routineDate >= twoDaysAgo) {
          routines.push({ id: childSnapshot.key, ...routine });
        }
      });
      setClassRoutines(routines);
    });
  }, [session?.user?.email]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const sortedRoutines = [...classRoutines].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastRoutine = currentPage * itemsPerPage;
  const indexOfFirstRoutine = indexOfLastRoutine - itemsPerPage;
  const currentRoutines = sortedRoutines.slice(indexOfFirstRoutine, indexOfLastRoutine);
  const totalPages = Math.ceil(sortedRoutines.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    const routineRef = ref(database, `classRoutine/${id}`);
    remove(routineRef)
      .then(() => {
        setClassRoutines(classRoutines.filter((routine) => routine.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting routine:', error);
      });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">My Class Routines</h2>
      {classRoutines.length === 0 ? (
        <p>No class routines found for you within the last two days.</p>
      ) : (
        <>
          {/* Sort Headers */}
          <div className="grid grid-cols-5 gap-4 text-sm font-semibold border-b pb-2 mb-4">
            <button onClick={() => handleSort('date')} className="cursor-pointer">
              Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('time')} className="cursor-pointer">
              Time {sortField === 'time' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('subject')} className="cursor-pointer">
              Subject {sortField === 'subject' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('studentclass')} className="cursor-pointer">
              Class {sortField === 'studentclass' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('room')} className="cursor-pointer">
              Room {sortField === 'room' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          {/* Routine Entries */}
          {currentRoutines.map((routine) => (
            <div
              key={routine.id}
              className="grid grid-cols-5 gap-4 text-sm border-b py-2 items-center"
            >
              <div>{routine.date}</div>
              <div>{routine.time}</div>
              <div>{routine.subject}</div>
              <div>{routine.studentclass}</div>
              <div>{routine.room}</div>
              {/* Uncomment if you want to add the delete option
              <div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(routine.id)}
                >
                  <FaTrashAlt className="w-5 h-5" />
                </button>
              </div> */}
            </div>
          ))}

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

export default ClassRoutineList;
