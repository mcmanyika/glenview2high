import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ExamResults = () => {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [examsMap, setExamsMap] = useState({});
  const [selectedExam, setSelectedExam] = useState('');
  const [examResults, setExamResults] = useState({});
  const [pieChartData, setPieChartData] = useState({});

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const admissionsRef = ref(database, 'userTypes');
    const examsRef = ref(database, 'exams');
    const resultsRef = ref(database, 'examResults');

    // Fetch exams for the logged-in teacher
    onValue(examsRef, (snapshot) => {
      const examsData = snapshot.val();
      if (examsData) {
        const mappedExams = Object.keys(examsData).reduce((acc, key) => {
          const exam = examsData[key];
          if (exam.email === email) {
            acc[key] = exam.examName;
          }
          return acc;
        }, {});
        setExamsMap(mappedExams);
      }
    });

    // Fetch student admissions and their assigned exams
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
        const studentsWithAssignedExams = studentsWithExams.filter(
          (student) => Object.keys(student.exams).length > 0
        );
        setStudents(studentsWithAssignedExams);
      }
    });

    // Fetch exam results
    onValue(resultsRef, (snapshot) => {
      const resultsData = snapshot.val() || {};
      setExamResults(resultsData);

      // Prepare data for pie chart
      const passCount = Object.values(resultsData).filter(result => result.score >= 50).length;
      const failCount = Object.values(resultsData).filter(result => result.score < 50).length;

      setPieChartData({
        labels: ['Passed', 'Failed'],
        datasets: [
          {
            data: [passCount, failCount],
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      });
    });
  }, [session]);

  // Filter students by selected exam
  const filteredStudents = selectedExam
    ? students.filter((student) => student.exams[selectedExam])
    : students;

  return (
    <div className="w-full rounded px-4 pt-6 pb-8 mb-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Exam Results Distribution</h2>
      {/* Flex container for table and pie chart */}
      <div className="flex flex-col md:flex-row">
        {/* Table showing students and exam details */}
        <div className="flex-1 mr-0 md:mr-4 mb-4 md:mb-0 overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <p>No students with assigned exams found.</p>
          ) : (
            <table className="w-full text-sm border-collapse mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Exam Name</th>
                  <th className="border border-gray-300 px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <React.Fragment key={student.id}>
                    {Object.entries(student.exams).map(([examId, examDetails]) => {
                      if (examId in examsMap && (selectedExam === '' || examId === selectedExam)) {
                        const score = examResults[`${student.id}_${examId}`]?.score;

                        // Only show rows where a score exists
                        if (score !== undefined) {
                          return (
                            <tr key={examId}>
                              <td className="border border-gray-300 px-4 py-2 text-blue-500">
                                {examsMap[examId]}
                              </td>
                              <td className={`border border-gray-300 px-4 py-2 ${score >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                {score}
                              </td>
                            </tr>
                          );
                        }
                      }
                      return null;
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pie Chart for Exam Results */}
        <div className="flex-1">
          {pieChartData.labels && (
            <div className="mt-4 flex justify-center">
              <Pie data={pieChartData} style={{ maxHeight: '300px', maxWidth: '300px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
