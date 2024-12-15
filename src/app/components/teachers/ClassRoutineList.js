import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useRouter } from 'next/router';

const ClassRoutineList = () => {
  const { data: session } = useSession();
  const router = useRouter();
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
    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const indexOfLastRoutine = currentPage * itemsPerPage;
  const indexOfFirstRoutine = indexOfLastRoutine - itemsPerPage;
  const currentRoutines = sortedRoutines.slice(indexOfFirstRoutine, indexOfLastRoutine);
  const totalPages = Math.ceil(sortedRoutines.length / itemsPerPage);

  const handleRoutineClick = (routine) => {
    router.push({
      pathname: '/attendance/attendanceForm',
      query: {
        className: routine.studentclass,
        date: routine.date,
        subject: routine.subject,
      },
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        My Class Routines
      </h2>

      {classRoutines.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No class routines found for you within the last two days.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th onClick={() => handleSort('date')} className="p-2 text-left cursor-pointer text-gray-800 dark:text-white">
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('time')} className="p-2 text-left cursor-pointer text-gray-800 dark:text-white">
                    Time {sortField === 'time' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('subject')} className="p-2 text-left cursor-pointer text-gray-800 dark:text-white">
                    Subject {sortField === 'subject' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('studentclass')} className="p-2 text-left cursor-pointer text-gray-800 dark:text-white">
                    Class {sortField === 'studentclass' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('room')} className="p-2 text-left cursor-pointer text-gray-800 dark:text-white">
                    Room {sortField === 'room' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRoutines.map((routine) => (
                  <tr
                    key={routine.id}
                    onClick={() => handleRoutineClick(routine)}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="p-2 text-gray-800 dark:text-gray-200">{routine.date}</td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">{routine.time}</td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">{routine.subject}</td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">{routine.studentclass}</td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">{routine.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
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
