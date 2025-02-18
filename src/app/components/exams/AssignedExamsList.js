import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import ResultsModal from './ResultsModal';
import CreateExamForm from '../..//components/exams/CreateExamForm';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const ScoreInputModal = ({ student, examId, onClose }) => {
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (student && examId) {
      const resultKey = `${student.id}_${examId}`;
      try {
        await set(ref(database, `examResults/${resultKey}`), { score: Number(score), comment });
        toast.success('Score submitted successfully!'); // Success toast
      } catch (error) {
        toast.error('Failed to submit score. Please try again.'); // Error toast
      }
      onClose(); // Close the modal after submission
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded p-8 w-3/4 max-w-md">
        <h2 className="text-lg font-bold mb-4 dark:text-gray-100">Enter Score for {student.firstName} {student.lastName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Score:</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-main3 hover:bg-main2 text-white py-2 px-4 rounded transition-colors">Submit</button>
            <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssignedExamsList = () => {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [examsMap, setExamsMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);
  const [isScoreInputModalOpen, setIsScoreInputModalOpen] = useState(false);
  const [examResults, setExamResults] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const admissionsRef = ref(database, 'userTypes');
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
        setStudents(studentsWithExams);
      }
    });

    onValue(resultsRef, (snapshot) => {
      const resultsData = snapshot.val() || {};
      setExamResults(resultsData);
    });
  }, [session]);

  // Group students by exam names
  const groupedStudents = students.reduce((acc, student) => {
    Object.keys(student.exams).forEach((examId) => {
      if (examsMap[examId]) {
        const examName = examsMap[examId];
        if (!acc[examName]) {
          acc[examName] = [];
        }
        acc[examName].push({ ...student, examId });
      }
    });
    return acc;
  }, {});

  // Convert grouped students to an array for pagination
  const groupedStudentPages = Object.keys(groupedStudents);
  const totalPages = groupedStudentPages.length;

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentExamGroup = groupedStudentPages[currentPage - 1];
  const currentStudents = groupedStudents[currentExamGroup] || [];

  const getStatusIcon = (score) => {
    if (score > 0 && score < 50) return <FaTimesCircle className="text-red-500" />;
    if (score >= 50) return <FaCheckCircle className="text-green-500" />;
    return <FaHourglassHalf className="text-yellow-500" />;
  };

  const handleStudentClick = (student, examId) => {
    setSelectedStudent(student);
    setSelectedExamId(examId);
    setIsScoreInputModalOpen(true); // Open the score input modal
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold dark:text-gray-100">{`Students Assigned to ${currentExamGroup || 'Exam'}`}</h2>
        <button
          onClick={() => setIsCreateExamModalOpen(true)}
          className="bg-main3 hover:bg-main2 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          Create New Exam
        </button>
      </div>

      {currentStudents.length === 0 ? (
        <p className="dark:text-gray-300">No students found for this exam group.</p>
      ) : (
        <table className="min-w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left dark:text-gray-100">Student Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left dark:text-gray-100">Score</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left dark:text-gray-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => {
              const examId = student.examId;
              const score = examResults[`${student.id}_${examId}`]?.score || 0;
              return (
                <tr
                  key={student.id}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-100"
                  onClick={() => handleStudentClick(student, examId)}
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{score}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {getStatusIcon(score)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className="bg-main3 hover:bg-main2 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <span className="dark:text-gray-300">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
          className="bg-main3 hover:bg-main2 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>

      {isScoreInputModalOpen && (
        <ScoreInputModal
          student={selectedStudent}
          examId={selectedExamId}
          onClose={() => setIsScoreInputModalOpen(false)}
        />
      )}

      {isResultsModalOpen && (
        <ResultsModal
          examId={selectedExamId}
          student={selectedStudent}
          onClose={() => setIsResultsModalOpen(false)}
        />
      )}

      {isCreateExamModalOpen && (
        <CreateExamForm onClose={() => setIsCreateExamModalOpen(false)} />
      )}
    </div>
  );
};

export default AssignedExamsList;
