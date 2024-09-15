import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const AssignExam = () => {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

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

  const handleAssignExam = () => {
    selectedStudents.forEach((studentId) => {
      const studentRef = ref(database, `admissions/${studentId}/exams`); // Changed to 'admissions'
      update(studentRef, {
        [selectedExam]: {
          examId: selectedExam,
          status: 'Assigned',
        },
      });
    });

    // Show toast notification after assigning exams
    toast.success('Exam assigned to selected students.');
  };

  const handleSelectStudent = (e) => {
    const studentId = e.target.value;
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  // Filter students based on selected exam class
  const filteredStudents = selectedExam
    ? students.filter((student) => student.class === exams.find((exam) => exam.id === selectedExam)?.examClass)
    : students;

  return (
    <div className="w-full mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Assign Exam to Students</h2>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Students</label>
        {filteredStudents.map((student) => (
          <div key={student.id} className="mb-2">
            <label>
              <input
                type="checkbox"
                value={student.id}
                onChange={handleSelectStudent}
                className="mr-2 leading-tight"
              />
              {student.firstName} {student.lastName} ({student.class})
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleAssignExam}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Assign Exam
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

export default AssignExam;
