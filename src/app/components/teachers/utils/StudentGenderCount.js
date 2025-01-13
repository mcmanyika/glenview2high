import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const StudentGenderCount = () => {
  const { data: session, status } = useSession();
  const [admissions, setAdmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdmissionsAndClasses = () => {
      const admissionsRef = ref(database, 'userTypes');
      const classesRef = ref(database, 'classes');

      onValue(admissionsRef, (snapshot) => {
        const admissionsData = snapshot.val();
        if (admissionsData) {
          const admissionsArray = Object.keys(admissionsData).map((key) => ({
            id: key,
            ...admissionsData[key],
          }));
          setAdmissions(admissionsArray);
        } else {
          console.error('No admissions data found.');
        }
      });

      onValue(classesRef, (snapshot) => {
        const classesData = snapshot.val();
        if (classesData) {
          const classesArray = Object.keys(classesData).map(key => ({
            id: key,
            ...classesData[key]
          }));

          // Filtering classes by teacherEmail to match logged-in user
          const filteredClasses = classesArray.filter(
            (classItem) => classItem.teacherEmail === session.user.email
          );
          setClasses(filteredClasses); // Set only the filtered classes
        } else {
          console.error('No classes data found.');
        }
      });

      setIsLoading(false);
    };

    if (status === 'authenticated') {
      fetchAdmissionsAndClasses();
    } else {
      setIsLoading(false);
    }
  }, [status, session?.user?.email]);

  const filteredStudents = admissions.filter((student) => {
    const isClassValid = classes.some((cls) => cls.className === student.class);
    if (!isClassValid) return false;

    const term = searchTerm.toLowerCase();
    return (
      student.userID?.toLowerCase().includes(term) ||
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.class?.toLowerCase().includes(term) ||
      student.gender?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term)
    );
  });

  const genderCounts = filteredStudents.reduce(
    (acc, student) => {
      const gender = student.gender ? student.gender.toLowerCase() : 'unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      acc.TotalCount = filteredStudents.length;
      return acc;
    },
    { male: 0, female: 0, TotalCount: 0 }
  );

  const chartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [genderCounts.male, genderCounts.female],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)', // blue for male
          'rgba(255, 99, 132, 0.8)', // pink for female
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(156, 163, 175)', // text-gray-400
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = genderCounts.TotalCount;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center 
        bg-gray-200 dark:bg-gray-800 bg-opacity-75 z-50 transition-colors duration-200">
        <FaSpinner className="animate-spin text-4xl text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full text-sm p-4 bg-white dark:bg-gray-800 transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        My Students By Gender
      </h2>
      
      <div className="relative h-[300px] mb-4">
        <Pie data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg text-center">
          <p className="text-sm text-blue-600 dark:text-blue-200">Male</p>
          <p className="text-2xl font-semibold text-blue-700 dark:text-blue-100">
            {genderCounts.male}
          </p>
        </div>
        <div className="p-4 bg-pink-100 dark:bg-pink-900 rounded-lg text-center">
          <p className="text-sm text-pink-600 dark:text-pink-200">Female</p>
          <p className="text-2xl font-semibold text-pink-700 dark:text-pink-100">
            {genderCounts.female}
          </p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-200">Total</p>
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-100">
            {genderCounts.TotalCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentGenderCount;
