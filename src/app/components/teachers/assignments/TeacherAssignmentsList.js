import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import CreateAssignment from './CreateAssignment';
import { useRouter } from 'next/router';

const ScoreUploadModal = ({ isOpen, onClose, onUpload, studentID }) => {
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');

  const handleUpload = () => {
    onUpload(studentID, score, comment);
    setScore('');
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Upload Score</h2>
        <input
          type="number"
          placeholder="Enter Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <textarea
          placeholder="Enter Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows="3"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherAssignmentsList = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedStudentID, setSelectedStudentID] = useState('');
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [uploadedScores, setUploadedScores] = useState({});

  useEffect(() => {
    if (session) {
      const userEmail = session.user.email;
      setEmail(userEmail);

      const assignmentsRef = ref(database, 'assignment');
      onValue(assignmentsRef, (snapshot) => {
        const assignmentsData = snapshot.val();
        if (assignmentsData) {
          const teacherAssignments = Object.keys(assignmentsData)
            .filter((key) => assignmentsData[key].email === userEmail)
            .map((key) => ({
              id: key,
              ...assignmentsData[key],
            }))
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
          setAssignments(teacherAssignments);

          teacherAssignments.forEach((assignment) => {
            const studentsRef = ref(database, 'userTypes');
            onValue(studentsRef, (studentsSnapshot) => {
              const studentsData = studentsSnapshot.val();
              if (studentsData) {
                const filteredStudents = Object.keys(studentsData)
                  .filter(
                    (key) =>
                      studentsData[key].class === assignment.assignmentClass &&
                      studentsData[key].userType === 'student'
                  )
                  .map((key) => ({
                    id: key,
                    ...studentsData[key],
                  }));

                setStudents((prevStudents) => ({
                  ...prevStudents,
                  [assignment.id]: filteredStudents,
                }));

                const scoresRef = ref(database, `assignmentScore/${assignment.id}/scores`);
                onValue(scoresRef, (scoresSnapshot) => {
                  const scoresData = scoresSnapshot.val();
                  if (scoresData) {
                    const scoresMap = Object.keys(scoresData).reduce((acc, key) => {
                      acc[key] = scoresData[key];
                      return acc;
                    }, {});
                    setUploadedScores((prev) => ({ ...prev, [assignment.id]: scoresMap }));
                  }
                });
              }
            });
          });
        } else {
          setAssignments([]);
        }
        setLoading(false);
      });
    }
  }, [session]);

  const totalPages = assignments.length;

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleScoreUpload = (studentID, score, comment) => {
    const scoreRef = ref(database, `assignmentScore/${selectedAssignment.id}/scores/${studentID}`);
    update(scoreRef, {
      score,
      comment,
    })
      .then(() => {
        toast.success('Score uploaded successfully!');
        const scoresRef = ref(database, `assignmentScore/${selectedAssignment.id}/scores`);
        onValue(scoresRef, (scoresSnapshot) => {
          const scoresData = scoresSnapshot.val();
          if (scoresData) {
            const scoresMap = Object.keys(scoresData).reduce((acc, key) => {
              acc[key] = scoresData[key];
              return acc;
            }, {});
            setUploadedScores((prev) => ({ ...prev, [selectedAssignment.id]: scoresMap }));
          }
        });
        setSelectedStudentID('');
      })
      .catch((error) => {
        console.error('Error uploading score:', error);
        toast.error('Error uploading score. Please try again.');
      });
  };

  const handleCreateAssignment = () => {
    setAssignmentModalOpen(false);
    // Refresh assignments list if needed
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400">
        Loading assignments and students...
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400">
        No assignments found.
      </div>
    );
  }

  const currentAssignment = assignments[currentPage];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-6 space-x-2">
        <button
          onClick={() => router.push('/teacher/students_assignments')}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Students Assignments
        </button>
        <button
          onClick={() => setAssignmentModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Add Assignment
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          {currentAssignment.assignmentName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Class: {currentAssignment.assignmentClass}</p>
        <p className="text-gray-600 dark:text-gray-400">
          Due Date: {new Date(currentAssignment.assignmentDueDate).toLocaleDateString()}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">User ID</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Name</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Email</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-200">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {students[currentAssignment.id]?.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 text-gray-800 dark:text-gray-200">{student.userID}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">
                  {student.firstName} {student.lastName}
                </td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{student.email}</td>
                <td className="p-3">
                  {uploadedScores[currentAssignment.id]?.[student.userID] ? (
                    <span className="text-green-500 dark:text-green-400 font-semibold">
                      Score: {uploadedScores[currentAssignment.id][student.userID].score}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedAssignment(currentAssignment);
                        setSelectedStudentID(student.userID);
                        setScoreModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      Upload Score
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${
            currentPage === 0
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages - 1
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          Next
        </button>
      </div>

      {assignmentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
            <CreateAssignment
              onClose={() => setAssignmentModalOpen(false)}
              onCreate={handleCreateAssignment}
            />
          </div>
        </div>
      )}

      <ScoreUploadModal
        isOpen={scoreModalOpen}
        onClose={() => setScoreModalOpen(false)}
        onUpload={handleScoreUpload}
        studentID={selectedStudentID}
      />
    </div>
  );
};

export default TeacherAssignmentsList;
