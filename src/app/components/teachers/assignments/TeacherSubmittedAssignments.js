import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';

const TeacherSubmittedAssignments = () => {
  const { data: session } = useSession();
  const [groupedAssignments, setGroupedAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentGroupPage, setCurrentGroupPage] = useState(1); // Page for group pagination
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  useEffect(() => {
    if (session) {
      const teacherEmail = session.user.email;
      const submissionsRef = ref(database, 'submissions');

      onValue(submissionsRef, (snapshot) => {
        const submissionsData = snapshot.val();
        const groupedData = {};

        if (submissionsData) {
          Object.keys(submissionsData).forEach((studentId) => {
            Object.keys(submissionsData[studentId]).forEach((assignmentId) => {
              const submission = submissionsData[studentId][assignmentId];
              
              if (submission && submission.teacherEmail === teacherEmail) {
                const assignmentName = submission.assignmentName;

                if (!groupedData[assignmentName]) {
                  groupedData[assignmentName] = [];
                }
                
                groupedData[assignmentName].push({
                  assignmentId,
                  studentId,
                  studentName: `${submission.firstName} ${submission.lastName}`,
                  submissionText: submission.submissionText,
                  submittedAt: submission.submittedAt,
                });
              }
            });
          });
        }

        // Sort each assignment's submissions by submittedAt in descending order
        Object.values(groupedData).forEach((submissions) => {
          submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        });

        setGroupedAssignments(groupedData);
        setLoading(false);
      });
    }
  }, [session]);

  const assignmentNames = Object.keys(groupedAssignments);
  const filteredAssignmentNames = assignmentNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGroupPages = filteredAssignmentNames.length;

  const handleNextGroupPage = () => {
    if (currentGroupPage < totalGroupPages) {
      setCurrentGroupPage(currentGroupPage + 1);
    }
  };

  const handlePreviousGroupPage = () => {
    if (currentGroupPage > 1) {
      setCurrentGroupPage(currentGroupPage - 1);
    }
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentGroupPage(1); // Reset to the first page of the filtered results
  };

  if (loading) {
    return <div>Loading submitted assignments...</div>;
  }

  if (filteredAssignmentNames.length === 0) {
    return <div>No submissions found.</div>;
  }

  // Current assignment group to display based on the current page
  const currentAssignmentName = filteredAssignmentNames[currentGroupPage - 1];
  const currentSubmissions = groupedAssignments[currentAssignmentName];

  return (
    <div className="w-full bg-white text-sm text-md mx-auto rounded p-4 md:px-8 md:pt-6 pb-8 mb-4">
      <h2 className="text-lg md:text-xl font-bold mb-4">Submitted Assignments</h2>
      
      {/* Search Input */}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search by Assignment Name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div key={currentAssignmentName} className="mb-8">
        <h3 className="text-md font-semibold mb-3">{currentAssignmentName}</h3>
        
        {currentSubmissions.map((submission) => (
          <div
            key={submission.assignmentId}
            onClick={() => handleSubmissionClick(submission)}
            className="flex flex-col md:flex-row items-start md:items-center mb-4 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="w-full md:w-1/2 p-1 truncate">{submission.studentName}</div>
            <div className="w-full md:w-1/2 p-1 text-gray-600 text-sm">
              {new Date(submission.submittedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          onClick={handlePreviousGroupPage}
          disabled={currentGroupPage === 1}
          className={`px-4 py-2 rounded ${
            currentGroupPage === 1 ? 'bg-gray-300' : 'bg-gray-800 text-white'
          }`}
        >
          Previous Assignment
        </button>
        <span>
          Assignment {currentGroupPage} of {totalGroupPages}
        </span>
        <button
          onClick={handleNextGroupPage}
          disabled={currentGroupPage === totalGroupPages}
          className={`px-4 py-2 rounded ${
            currentGroupPage === totalGroupPages ? 'bg-gray-300' : 'bg-gray-800 text-white'
          }`}
        >
          Next Assignment
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full h-full rounded-lg p-6 overflow-y-auto">
            <p className="text-lg font-semibold">{selectedSubmission.studentName}</p>
            <p className="text-sm font-semibold mb-2">Assignment: {selectedSubmission.assignmentName}</p>
            <p className="text-sm text-gray-600 mb-4">
              {new Date(selectedSubmission.submittedAt).toLocaleString()}
            </p>
            <div
              className="blog-content mb-2 text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedSubmission.submissionText }}
            />
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-3 bg-main3 text-white rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmittedAssignments;
