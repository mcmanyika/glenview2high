import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from 'next-themes';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderPieChart = () => {
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const admissionsRef = ref(database, 'userTypes');
    const unsubscribe = onValue(admissionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const counts = { male: 0, female: 0 };

        Object.values(data).forEach((admission) => {
          const gender = admission.gender?.toLowerCase();
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
        hoverBackgroundColor: ['#2196F3', '#FF4081'],
        borderColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
  };

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center 
      bg-white dark:bg-gray-800 p-4 rounded-lg 
      transition-colors duration-200">
      <h2 className="text-2xl font-semibold mb-4 
        text-gray-800 dark:text-white">
        Accounts by Gender
      </h2>
      <div className="w-full max-w-md p-4"> {/* Controlled container size */}
        <Pie 
          data={data} 
          options={options}
        />
      </div>
      
      {/* Optional: Add gender statistics */}
      {/* <div className="mt-4 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="text-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
          <p className="text-blue-800 dark:text-blue-200 font-semibold">
            Male: {genderCounts.male}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-pink-100 dark:bg-pink-900">
          <p className="text-pink-800 dark:text-pink-200 font-semibold">
            Female: {genderCounts.female}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default GenderPieChart;
