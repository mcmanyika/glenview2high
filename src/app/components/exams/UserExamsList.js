import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { useGlobalState } from '../../store';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const UserExamsList = () => {
  const { data: session } = useSession();
  const [student, setStudent] = useState(null);
  const [examsMap, setExamsMap] = useState({});
  const [examResults, setExamResults] = useState({});
  const [admissionId] = useGlobalState('studentId');

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const admissionRef = ref(database, `admissions/${admissionId}`);
    const examsRef = ref(database, 'exams');
    const resultsRef = ref(database, 'examResults');

    const fetchData = async () => {
      onValue(examsRef, (snapshot) => {
        const examsData = snapshot.val();
        if (examsData) {
          const mappedExams = Object.keys(examsData).reduce((acc, key) => {
            const exam = examsData[key];
            acc[key] = exam.examName;
            return acc;
          }, {});
          setExamsMap(mappedExams);
        }
      });

      onValue(admissionRef, (snapshot) => {
        const admissionData = snapshot.val();
        if (admissionData) {
          setStudent({
            id: email,
            ...admissionData,
            exams: admissionData.exams || {},
          });
        }
      });

      onValue(resultsRef, (snapshot) => {
        const resultsData = snapshot.val() || {};
        setExamResults(resultsData);
      });
    };

    fetchData();
  }, [session, admissionId]);

  const filteredExams = Object.keys(student?.exams || {}).map((examId) => {
    const examName = examsMap[examId] || 'Unknown Exam';
    const score = examResults[`${student?.id}_${examId}`]?.score || 0;
    return { examName, score };
  });

  return (
    <div className="w-full bg-white  rounded px-8 pt-6 pb-8 mt-4  mb-4 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Recent Exams Results</h2>

      {filteredExams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <div className="flex justify-center">
          <PieChart width={600} height={300}>
            <Pie
              data={filteredExams}
              dataKey="score"
              nameKey="examName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {filteredExams.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default UserExamsList;
