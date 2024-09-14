import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderPieChart = () => {
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });

  useEffect(() => {
    const admissionsRef = ref(database, 'userTypes');
    const unsubscribe = onValue(admissionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const counts = { male: 0, female: 0 };

        Object.values(data).forEach((admission) => {
          const gender = admission.gender.toLowerCase();
          if (gender === 'male') {
            counts.male += 1;
          } else if (gender === 'female') {
            counts.female += 1;
          }
        });

        setGenderCounts(counts);
      }
    });

    return () => unsubscribe();
  }, []);

  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [genderCounts.male, genderCounts.female],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white p-4 shadow-sm rounded">
      <h2 className="text-2xl font-semibold mb-4">Students by Gender</h2>
      <div className="w-1/2"> {/* Adjusted container size */}
        <Pie data={data} />
      </div>
    </div>
  );
};

export default GenderPieChart;
