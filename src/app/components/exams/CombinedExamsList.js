import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { useGlobalState } from '../../store';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useTheme } from 'next-themes';

const CombinedExamsList = () => {
  const { data: session } = useSession();
  const [student, setStudent] = useState(null);
  const [examsMap, setExamsMap] = useState({});
  const [examResults, setExamResults] = useState({});
  const [userID] = useGlobalState('userID');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const admissionRef = ref(database, `userTypes/${userID}`);
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
  }, [session, userID]);

  const filteredExams = Object.keys(student?.exams || {})
    .map((examId) => {
      const examName = examsMap[examId] || 'Unknown Exam';
      const score = examResults[`${student?.userID}_${examId}`]?.score || 0;
      const comment = examResults[`${student?.userID}_${examId}`]?.comment || 'No comment';
      return { examName, score, comment };
    })
    .filter(exam => exam.score > 0)  // Filter exams with score greater than 0
    .slice(-10);  // Get the last 10 exams

  if (!mounted) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded pt-6 pb-8 mt-4 mb-4 transition-colors duration-200">
      {filteredExams.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">No exams found.</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <PieChart width={500} height={300}>
              <Pie
                data={filteredExams}
                dataKey="score"
                nameKey="examName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={{
                  fill: theme === 'dark' ? '#fff' : '#000'
                }}
              >
                {filteredExams.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  color: theme === 'dark' ? '#fff' : '#000'
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span className="text-gray-800 dark:text-gray-200">{value}</span>
                )}
              />
            </PieChart>
          </div>

          <div className="w-full px-4 overflow-x-auto mb-6">
            <table className="min-w-full text-sm bg-white dark:bg-gray-800 border dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-2 sm:px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 
                    text-left text-xs sm:text-sm leading-4 font-medium 
                    text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Exam Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 
                    text-left text-xs sm:text-sm leading-4 font-medium 
                    text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-2 sm:px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 
                    text-left text-xs sm:text-sm leading-4 font-medium 
                    text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                {filteredExams.map((exam, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-2 sm:px-6 py-2 whitespace-no-wrap border-b 
                      border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {exam.examName}
                    </td>
                    <td className="px-2 sm:px-6 py-2 whitespace-no-wrap border-b 
                      border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {exam.score}
                    </td>
                    <td className="px-2 sm:px-6 py-2 whitespace-no-wrap border-b 
                      border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {exam.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedExamsList;
