import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';

const SubmissionModal = ({ submission, onClose }) => {
  if (!submission) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-lg p-6 
        max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {submission.studentName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
              dark:hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: submission.submissionText }} />
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 
              dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SubmissionCard = ({ submission, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col md:flex-row gap-2 items-start md:items-center p-4
      border border-gray-200 dark:border-gray-700 rounded-lg 
      bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
      cursor-pointer transition-all duration-200"
  >
    <div className="flex-1 font-medium text-gray-800 dark:text-gray-200">
      {submission.studentName}
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-400">
      {new Date(submission.submittedAt).toLocaleString()}
    </div>
  </div>
);

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
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-current 
          border-t-transparent rounded-full" />
        <p className="mt-2">Loading submissions...</p>
      </div>
    );
  }

  if (filteredAssignmentNames.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">
        No submissions found.
      </div>
    );
  }

  const currentAssignmentName = filteredAssignmentNames[currentGroupPage - 1];
  const currentSubmissions = groupedAssignments[currentAssignmentName];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Submitted Assignments
      </h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
            focus:border-transparent transition-all"
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {currentAssignmentName}
        </h3>
        
        <div className="space-y-2">
          {currentSubmissions.map((submission) => (
            <SubmissionCard
              key={submission.assignmentId}
              submission={submission}
              onClick={() => handleSubmissionClick(submission)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handlePreviousGroupPage}
          disabled={currentGroupPage === 1}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentGroupPage === 1 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
          }`}
        >
          Previous
        </button>
        
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentGroupPage} of {totalGroupPages}
        </span>
        
        <button
          onClick={handleNextGroupPage}
          disabled={currentGroupPage === totalGroupPages}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentGroupPage === totalGroupPages 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
          }`}
        >
          Next
        </button>
      </div>

      <SubmissionModal
        submission={selectedSubmission}
        onClose={closeModal}
      />
    </div>
  );
};

export default TeacherSubmittedAssignments;
