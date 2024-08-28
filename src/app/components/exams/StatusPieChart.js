import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';

const StatusPieChart = () => {
  const { data: session } = useSession();
  const [statusData, setStatusData] = useState({ completed: 0, pending: 0 });

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const admissionsRef = ref(database, 'admissions');

    onValue(admissionsRef, (snapshot) => {
      const admissionsData = snapshot.val();
      if (admissionsData) {
        const studentsWithExams = Object.keys(admissionsData).map((key) => {
          const student = admissionsData[key];
          return {
            id: key,
            ...student,
            exams: student.exams || {},
          };
        });

        let completedCount = 0;
        let pendingCount = 0;

        studentsWithExams.forEach(student => {
          Object.values(student.exams).forEach(examDetails => {
            if (examDetails.status === 'Completed') {
              completedCount++;
            } else {
              pendingCount++;
            }
          });
        });

        setStatusData({ completed: completedCount, pending: pendingCount });
      }
    });
  }, [session]);

  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [statusData.completed, statusData.pending],
        backgroundColor: ['#60A5FA', '#FF9800'], // Replaced green with blue-400
        hoverBackgroundColor: ['#93C5FD', '#FFB74D'], // Lighter blue for hover
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Exams Marking Status</h2>
      <div className="relative h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default StatusPieChart;
