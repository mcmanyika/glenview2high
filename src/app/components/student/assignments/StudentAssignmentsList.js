import React, { useEffect, useState } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';

const StudentAssignmentsList = () => {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentClass, setStudentClass] = useState('');
  const [userID, setUserID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);

  // Fetch student information on component mount
  useEffect(() => {
    if (session) {
      const studentEmail = session.user.email;
      const studentRef = ref(database, 'userTypes');
      onValue(studentRef, (snapshot) => {
        const studentsData = snapshot.val();
        const student = Object.values(studentsData).find((s) => s.email === studentEmail);
        if (student) {
          setStudentClass(student.class);
          setUserID(student.userID);
          setFirstName(student.firstName);
          setLastName(student.lastName);
        }
      }, (error) => {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student data.");
      });
    }
  }, [session]);

  // Fetch assignments based on student's class
  useEffect(() => {
    if (studentClass && userID) {
      const assignmentsRef = ref(database, 'assignment');
      onValue(assignmentsRef, (snapshot) => {
        const assignmentsData = snapshot.val();
        if (assignmentsData) {
          const filteredAssignments = Object.keys(assignmentsData)
            .filter((key) => assignmentsData[key].assignmentClass === studentClass)
            .map((key) => ({ id: key, ...assignmentsData[key] }));
          setAssignments(filteredAssignments);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching assignments:", error);
        toast.error("Failed to load assignments.");
        setLoading(false);
      });
    }
  }, [studentClass, userID]);

  // Show modal with assignment details and check submission status
  const handleShowModal = async (assignment) => {
    setIsLoadingSubmission(true);
    try {
      setSelectedAssignment(assignment);
      setShowModal(true);
      setSubmission('');

      const submissionRef = ref(database, `submissions/${userID}/${assignment.id}`);
      const submissionSnapshot = await get(submissionRef);
      setHasSubmitted(submissionSnapshot.exists());
    } finally {
      setIsLoadingSubmission(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
    setHasSubmitted(false);
  };

  // Submit assignment
  const handleSubmitAssignment = async () => {
    if (submission.trim() === '') {
      toast.error('Please provide a submission before submitting.');
      return;
    }

    const submissionRef = ref(database, `submissions/${userID}/${selectedAssignment.id}`);
    const submissionData = {
      submissionText: submission,
      submittedAt: new Date().toISOString(),
      teacherEmail: selectedAssignment.email,
      firstName,
      lastName,
      userID,
      assignmentName: selectedAssignment.assignmentName,
    };

    try {
      await set(submissionRef, submissionData);
      toast.success('Assignment submitted successfully!');
      setSubmission('');
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment. Please try again.');
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = assignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const isAssignmentOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) return <div className="text-center mt-4 dark:text-white">Loading assignments...</div>;
  if (!assignments.length) return <div className="text-center mt-4 dark:text-white">No assignments found for your class or user.</div>;

  return (
    <div className="w-full px-4 mx-auto text-sm  dark:bg-gray-800 dark:text-white">
      {currentAssignments.map((assignment) => (
        <>
        <div className="flex justify-between items-start mb-4">
          <div
            key={assignment.id}
            className="flex-1 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
            onClick={() => handleShowModal(assignment)}
          >
            <h3 className="text-md font-semibold dark:text-white">{assignment.assignmentName}</h3>
            <p className="dark:text-gray-300"><strong>Due:</strong> {new Date(assignment.assignmentDueDate).toLocaleDateString()}</p>
            <p className="dark:text-gray-300"><strong>Teacher:</strong> {assignment.email}</p>
          </div>
          {isAssignmentOverdue(assignment.assignmentDueDate) && 
            <button className="text-red-500 font-semibold px-2 py-1 ml-4 h-fit rounded border border-red-500 hover:bg-red-500 hover:text-white transition-colors">Overdue</button>
          }
        </div>
        </>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500 text-white'}`}
          >
            Previous
          </button>
          <span className="text-sm dark:text-white">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500 text-white'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Assignment submission modal */}
      {showModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 w-full max-w-6xl rounded-md shadow-lg">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">{selectedAssignment.assignmentName}</h3>
            <div className="mb-4 dark:text-gray-300 prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedAssignment.description }} />
            </div>
            {hasSubmitted ? (
              <div className="text-center text-red-600 dark:text-red-400 font-bold">You have already submitted this assignment.</div>
            ) : (
              <>
                <SunEditor
                  setContents={submission}
                  onChange={setSubmission}
                  setOptions={{
                    height: 250,
                    buttonList: [
                      ['undo', 'redo', 'bold', 'italic', 'underline'],
                      ['list', 'align', 'fontSize'],
                      ['link', 'image', 'video'],
                      ['preview', 'print'],
                    ],
                  }}
                />
                <button
                  className="mt-4 w-full bg-main3 text-white font-bold py-2 rounded hover:bg-opacity-90"
                  onClick={handleSubmitAssignment}
                >
                  Submit
                </button>
              </>
            )}
            <button
              className="mt-4 w-full bg-gray-500 text-white font-bold py-2 rounded hover:bg-opacity-90 dark:bg-gray-600"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsList;
