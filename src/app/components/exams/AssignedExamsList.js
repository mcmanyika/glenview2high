import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResultsModal from './ResultsModal';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const AssignedExamsList = () => {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [examsMap, setExamsMap] = useState({});
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examResults, setExamResults] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set to 10 items per page

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const admissionsRef = ref(database, 'admissions');
    const examsRef = ref(database, 'exams');
    const resultsRef = ref(database, 'examResults');

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
        const studentsWithAssignedExams = studentsWithExams.filter(student => Object.keys(student.exams).length > 0);
        setStudents(studentsWithAssignedExams);
      }
    });

    onValue(resultsRef, (snapshot) => {
      const resultsData = snapshot.val() || {};
      setExamResults(resultsData);
    });
  }, [session]);

  const filteredStudents = selectedExam
    ? students.filter(student => student.exams[selectedExam])
    : students;

  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Assigned':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'Completed':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaTimesCircle className="text-red-500" />;
    }
  };

  const handleStudentClick = (student, examId) => {
    setSelectedStudent(student);
    setSelectedExamId(examId);
    setIsModalOpen(true);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Students Assigned Exams</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">All Exams</option>
          {Object.entries(examsMap).map(([examId, examName]) => (
            <option key={examId} value={examId}>
              {examName}
            </option>
          ))}
        </select>
      </div>

      {currentStudents.length === 0 ? (
        <p>No students with assigned exams found.</p>
      ) : (
        <div>
          <table className="min-w-full text-sm border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Student Name</th>
                <th className="border border-gray-300 px-4 py-2">Exam Name</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <React.Fragment key={student.id}>
                  {Object.entries(student.exams).map(([examId, examDetails]) => {
                    if (examId in examsMap && (selectedExam === '' || examId === selectedExam)) {
                      const score = examResults[`${student.id}_${examId}`]?.score || 0;
                      return (
                        <tr key={examId}>
                          <td className="border border-gray-300 px-4 py-2">
                            {student.firstName} {student.lastName}
                          </td>
                          <td
                            className="border border-gray-300 px-4 py-2 text-blue-500 hover:underline cursor-pointer"
                            onClick={() => handleStudentClick(student, examId)}
                          >
                            {examsMap[examId]}
                          </td>
                          <td
                            className={`border border-gray-300 px-4 py-2 ${
                              score >= 50 ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {score}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {getStatusIcon(examDetails.status)}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {isModalOpen && selectedStudent && (
        <ResultsModal
          student={selectedStudent}
          examId={selectedExamId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AssignedExamsList;
