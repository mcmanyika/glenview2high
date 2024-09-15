import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const InputResults = () => {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [results, setResults] = useState({});

  useEffect(() => {
    const admissionsRef = ref(database, 'admissions'); // Changed to 'admissions'
    const examsRef = ref(database, 'exams');

    onValue(admissionsRef, (snapshot) => {
      const admissionsData = snapshot.val();
      if (admissionsData) {
        setStudents(Object.keys(admissionsData).map((key) => ({ id: key, ...admissionsData[key] })));
      }
    });

    onValue(examsRef, (snapshot) => {
      const examsData = snapshot.val();
      if (examsData) {
        setExams(Object.keys(examsData).map((key) => ({ id: key, ...examsData[key] })));
      }
    });
  }, []);

  const handleInputChange = (e, studentId) => {
    const score = e.target.value;
    setResults((prev) => ({
      ...prev,
      [studentId]: score,
    }));
  };

  const handleSubmitResults = () => {
    if (selectedExam) {
      Object.keys(results).forEach((studentId) => {
        const studentExamRef = ref(database, `admissions/${studentId}/exams/${selectedExam}`); // Changed to 'admissions'
        update(studentExamRef, {
          score: results[studentId],
          status: 'Completed',
        });
      });

      // Show toast notification after submitting results
      toast.success('Results submitted successfully.');
    } else {
      toast.error('Please select an exam.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Input Exam Results</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Exam</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.examName} ({exam.examClass})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        {students.map((student) => (
          <div key={student.id} className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {student.firstName} {student.lastName} ({student.class})
            </label>
            <input
              type="number"
              value={results[student.id] || ''}
              onChange={(e) => handleInputChange(e, student.id)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmitResults}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit Results
      </button>
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
    </div>
  );
};

export default InputResults;
