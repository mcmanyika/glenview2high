// components/student/ClassRoutine.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const ClassRoutine = () => {
  const [routine, setRoutine] = useState([]);

  useEffect(() => {
    const routineRef = ref(database, 'classRoutine');
    onValue(routineRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoutine(Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })));
      }
    });
  }, []);

  return (
    <div className="w-full text-sm p-6 ">
      <h2 className="text-xl font-semibold mb-4">Class Routine</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b">Day</th>
              <th className="p-2 border-b">Time</th>
              <th className="p-2 border-b">Subject</th>
              <th className="p-2 border-b">Teacher</th>
              <th className="p-2 border-b">Room</th>
            </tr>
          </thead>
          <tbody>
            {routine.map((entry) => (
              <tr key={entry.id}>
                <td className="p-2 border-b">{entry.day}</td>
                <td className="p-2 border-b">{entry.time}</td>
                <td className="p-2 border-b">{entry.subject}</td>
                <td className="p-2 border-b">{entry.teacher}</td>
                <td className="p-2 border-b">{entry.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRoutine;
