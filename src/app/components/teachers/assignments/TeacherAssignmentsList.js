import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import CreateAssignment from '../../../components/teachers/assignments/CreateAssignment';
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Upload Score</h2>
        <input
          type="number"
          placeholder="Enter Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border rounded py-2 px-3 w-full mb-2"
        />
        <textarea
          placeholder="Enter Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded py-2 px-3 w-full mb-2"
          rows="3"
        />
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Upload
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
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
    return <div>Loading assignments and students...</div>;
  }

  if (assignments.length === 0) {
    return <div>No assignments found.</div>;
  }

  const currentAssignment = assignments[currentPage];

  return (
    <div className="w-full text-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className='mb-6'>
        <button
          className="bg-main3 text-white uppercase px-4 p-2 m-1 rounded-full"
          onClick={() => router.push('/teacher/students_assignments')}
        >
          Students Assignments
        </button>
      <button
          className="bg-main3 text-white uppercase px-4 p-2 m-1 rounded-full"
          onClick={() => setAssignmentModalOpen(true)}
        >
          Add Assignment
        </button>
      </div>
      <div className="w-full mb-8 flex  items-center">
        <h2 className="text-xl font-bold mb-2">{currentAssignment.assignmentName}</h2>
        
      </div>
      <p>Class: {currentAssignment.assignmentClass}</p>
      <p>Due Date: {new Date(currentAssignment.assignmentDueDate).toLocaleDateString()}</p>
      <p>Created Date: {new Date(currentAssignment.createdDate).toLocaleDateString()}</p>

      <h4 className="mt-4 font-semibold">Assigned Students:</h4>
      {students[currentAssignment.id] && students[currentAssignment.id].length > 0 ? (
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">User ID</th>
              <th className="border-b px-4 py-2">Name</th>
              <th className="border-b px-4 py-2">Email</th>
              <th className="border-b px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students[currentAssignment.id].map((student) => (
              <tr key={student.id}>
                <td className="border-b px-4 py-2">{student.userID}</td>
                <td className="border-b px-4 py-2">{student.firstName} {student.lastName}</td>
                <td className="border-b px-4 py-2">{student.email}</td>
                <td className="border-b px-4 py-2">
                  {uploadedScores[currentAssignment.id] && uploadedScores[currentAssignment.id][student.userID] ? (
                    <span className="text-green-600 font-bold">
                      Score: {uploadedScores[currentAssignment.id][student.userID].score}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedAssignment(currentAssignment);
                        setSelectedStudentID(student.userID);
                        setScoreModalOpen(true);
                      }}
                      className="bg-main3 text-white px-4 py-2 rounded-full"
                    >
                      Upload Score
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students assigned for this assignment.</p>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-800 text-white'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded ${currentPage === totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-800 text-white'}`}
        >
          Next
        </button>
      </div>

      {assignmentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg  p-6 w-full max-w-5xl"> {/* Increased size */}
          <div className="flex justify-end mt-16">
              <button
                onClick={() => setAssignmentModalOpen(false)} // This button will close the modal
                className="bg-main3 text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
            </div>
            <CreateAssignment onClose={() => setModalOpen(false)} onCreate={handleCreateAssignment} />
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
