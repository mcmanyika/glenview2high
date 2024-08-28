import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';

const CompletedExamsPassRatePieChart = () => {
  const { data: session } = useSession();
  const [passRateData, setPassRateData] = useState({ pass: 0, fail: 0 });

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const resultsRef = ref(database, 'examResults');
    const examsRef = ref(database, 'exams');

    onValue(examsRef, (snapshot) => {
      const examsData = snapshot.val() || {};
      const completedExams = {};

      // Filter for exams with "Completed" status
      Object.keys(examsData).forEach(examId => {
        const exam = examsData[examId];
        if (exam.email === email) {
          completedExams[examId] = exam;
        }
      });

      onValue(resultsRef, (snapshot) => {
        const resultsData = snapshot.val() || {};
        let passCount = 0;
        let failCount = 0;

        Object.entries(resultsData).forEach(([resultKey, resultValue]) => {
          const [studentId, examId] = resultKey.split('_');
          if (completedExams[examId]) {
            if (resultValue.score >= 50) {
              passCount++;
            } else {
              failCount++;
            }
          }
        });

        setPassRateData({ pass: passCount, fail: failCount });
      });
    });
  }, [session]);

  const data = {
    labels: ['Pass', 'Fail'],
    datasets: [
      {
        data: [passRateData.pass, passRateData.fail],
        backgroundColor: ['#60A5FA', '#F44336'], // Blue and Red
        hoverBackgroundColor: ['#93C5FD', '#EF5350'], // Lighter Blue and Red
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Exams Pass Rate</h2>
      <div className="relative h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default CompletedExamsPassRatePieChart;
