import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { useGlobalState } from '../../store';

const StudentExamsList = () => {
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
    const comment = examResults[`${student?.id}_${examId}`]?.comment || 'No comment'; // Fetching the comment
    return { examName, score, comment };
  });

  return (
    <div className="w-full bg-white rounded px-8 pt-6 pb-8 mt-4 mb-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Recent Exams Results</h2>

      {filteredExams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                  Exam Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    {exam.examName}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    {exam.score}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    {exam.comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentExamsList;
