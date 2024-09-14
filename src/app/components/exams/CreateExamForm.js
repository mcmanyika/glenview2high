import React, { useState, useEffect } from 'react';
import { ref, push, onValue, update } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const CreateExamForm = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examClass, setExamClass] = useState('');

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleCreateExam = () => {
    const examsRef = ref(database, 'exams');
    const newExam = {
      email,
      examName,
      examDate,
      examClass,
    };

    push(examsRef, newExam)
      .then((examSnapshot) => {
        // Get the exam ID
        const examId = examSnapshot.key;

        // Fetch students of the assigned class
        const studentsRef = ref(database, 'userTypes');
        onValue(studentsRef, (snapshot) => {
          const studentsData = snapshot.val();
          if (studentsData) {
            const studentsInClass = Object.keys(studentsData)
              .filter((key) => studentsData[key].studentClassLevel === examClass)
              .map((key) => ({ id: key, ...studentsData[key] }));

            // Update each student to assign the exam
            studentsInClass.forEach((student) => {
              const studentRef = ref(database, `userTypes/${student.userID}/exams/${examId}`);
              update(studentRef, {
                examId: examId,
                status: 'Assigned',
              });
            });
          }
        });

        toast.success('Exam created successfully and assigned to students!'); // Show success toast
        setExamName('');
        setExamDate('');
        setExamClass('');
      })
      .catch((error) => {
        console.error('Error creating exam:', error);
        toast.error('Error creating exam. Please try again.'); // Show error toast
      });
  };

  return (
    <div className="w-full text-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Create New Exam</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Exam Name</label>
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Exam Date</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
        <input
          type="text"
          value={examClass}
          onChange={(e) => setExamClass(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          type="hidden"
          value={email}
          readOnly
        />
      </div>
      <button
        onClick={handleCreateExam}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Exam
      </button>
     
    </div>
  );
};

export default CreateExamForm;
