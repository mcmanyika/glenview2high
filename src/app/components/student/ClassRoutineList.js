import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const ClassRoutineList = () => {
  const { data: session } = useSession();
  const [classRoutines, setClassRoutines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items to display per page

  useEffect(() => {
    if (!session?.user?.email) return;

    const routineRef = ref(database, 'classRoutine');
    onValue(routineRef, (snapshot) => {
      const routines = [];
      snapshot.forEach((childSnapshot) => {
        const routine = childSnapshot.val();
        const routineDate = new Date(routine.date);
        const currentDate = new Date();

        // Only include routines with a date that is current or in the future
        if (routine.email === session.user.email && routineDate >= currentDate) {
          routines.push({ id: childSnapshot.key, ...routine });
        }
      });
      setClassRoutines(routines);
    });
  }, [session?.user?.email]);

  // Calculate the routines to be displayed on the current page
  const indexOfLastRoutine = currentPage * itemsPerPage;
  const indexOfFirstRoutine = indexOfLastRoutine - itemsPerPage;
  const currentRoutines = classRoutines.slice(indexOfFirstRoutine, indexOfLastRoutine);

  // Calculate the total number of pages
  const totalPages = Math.ceil(classRoutines.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-white rounded shadow mt-3">
      <h2 className="text-xl font-semibold mb-4">My Class Routines</h2>
      {classRoutines.length === 0 ? (
        <p>No upcoming routines found for your email.</p>
      ) : (
        <>
          <table className="min-w-full text-sm bg-white text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Class</th>
                <th className="py-2 px-4 border-b">Room</th>
              </tr>
            </thead>
            <tbody>
              {currentRoutines.map((routine) => (
                <tr key={routine.id}>
                  <td className="py-2 px-4 border-b">{routine.date}</td>
                  <td className="py-2 px-4 border-b">{routine.time}</td>
                  <td className="py-2 px-4 border-b">{routine.subject}</td>
                  <td className="py-2 px-4 border-b">{routine.studentclass}</td>
                  <td className="py-2 px-4 border-b">{routine.room}</td>
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

export default ClassRoutineList;
