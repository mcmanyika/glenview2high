import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { useGlobalState } from '../../store';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CombinedExamsList = () => {
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
    const comment = examResults[`${student?.id}_${examId}`]?.comment || 'No comment';
    return { examName, score, comment };
  });

  return (
    <div className="w-full bg-white rounded px-4 sm:px-8 pt-6 pb-8 mt-4 mb-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8 text-center">Recent Exams Results</h2>

      {filteredExams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 overflow-x-auto mb-6">
            <table className="min-w-full text-sm bg-white border">
              <thead>
                <tr>
                  <th className="px-2 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs sm:text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">
                    Exam Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs sm:text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-2 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs sm:text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam, index) => (
                  <tr key={index}>
                    <td className="px-2 sm:px-6 py-2 whitespace-no-wrap border-b border-gray-300">
                      {exam.examName}
                    </td>
                    <td className="px-2 sm:px-6 py-2 whitespace-no-wrap border-b border-gray-300">
                      {exam.score}
                    </td>
                    <td className="px-2 sm:px-6 py-2 whitespace-no-wrap border-b border-gray-300">
                      {exam.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-1 flex justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={filteredExams}
                dataKey="score"
                nameKey="examName"
                cx="50%"
                cy="50%"
                outerRadius={80}
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
        </div>
      )}
    </div>
  );
};

export default CombinedExamsList;
