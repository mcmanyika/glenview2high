import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';

const TeacherRoutineCount = () => {
  const { data: session, status } = useSession();
  const [routineCount, setRoutineCount] = useState(0);

  useEffect(() => {
    if (status === 'authenticated') {
      const userEmail = session.user.email;
      const currentDate = new Date();

      const routineRef = ref(database, 'classRoutine');
      onValue(routineRef, (snapshot) => {
        const routinesData = snapshot.val();
        if (routinesData) {
          const filteredRoutines = Object.values(routinesData).filter(
            (routine) => {
              const routineDate = new Date(routine.date);
              return routine.email === userEmail && routineDate >= currentDate;
            }
          );
          setRoutineCount(filteredRoutines.length);
        } else {
          setRoutineCount(0);
        }
      });
    }
  }, [session, status]);

  return (
    <>
      {routineCount}
    </>
  );
};

export default TeacherRoutineCount;
