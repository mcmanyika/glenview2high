import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import withAuth from '../../../../../utils/withAuth';

const StudentReportView = () => {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Fetch school name from account table
  useEffect(() => {
    const fetchSchoolName = async () => {
      try {
        const accountRef = ref(database, 'account');
        const snapshot = await get(accountRef);

        if (snapshot.exists()) {
          const accountData = snapshot.val();
          setSchoolName(accountData.schoolName);
        }
      } catch (error) {
        console.error('Error fetching school name:', error);
      }
    };

    fetchSchoolName();
  }, []);

  // First, fetch the student's userID from userTypes
  useEffect(() => {
    const fetchStudentId = async () => {
      if (!session?.user?.email) return;

      try {
        const userTypesRef = ref(database, 'userTypes');
        const snapshot = await get(userTypesRef);

        if (snapshot.exists()) {
          const userTypes = snapshot.val();
          // Find the user entry that matches the logged-in user's email and get their userID
          const userEntry = Object.values(userTypes).find(userData => 
            userData.email === session.user.email
          );

          if (userEntry?.userID) {
            setStudentId(userEntry.userID);
          }
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchStudentId();
  }, [session?.user?.email]);

  // Then fetch reports using the student's userID
  useEffect(() => {
    const fetchReports = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        const reportsRef = ref(database, `reports/${studentId}`);
        const reportsSnapshot = await get(reportsRef);

        if (reportsSnapshot.exists()) {
          const reportsData = reportsSnapshot.val();
          const formattedReports = Object.entries(reportsData).map(([key, report]) => ({
            id: key,
            ...report
          }));

          // Sort reports by date (most recent first)
          formattedReports.sort((a, b) => b.timestamp - a.timestamp);
          setReports(formattedReports);
          
          // Set most recent report as default
          if (formattedReports.length > 0) {
            setSelectedReport(formattedReports[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main3"></div>
      </div>
    );
  }

  const handleBackClick = () => {
    setSelectedReport(null);
  };

  // Show detailed report view when a report is selected
  if (selectedReport) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-main3 dark:hover:text-main3 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reports List
        </button>

        {/* Existing Report Display Code */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          {/* School Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{schoolName}</h1>
            <p className="text-gray-600 dark:text-gray-300">Academic Report Card</p>
            <p className="text-gray-600 dark:text-gray-300">{selectedReport.term} - {selectedReport.year}</p>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Name:</span> {selectedReport.studentName}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Student ID:</span> {selectedReport.admissionNumber}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Class:</span> {selectedReport.class}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Term:</span> {selectedReport.term}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Year:</span> {selectedReport.year}
              </p>
            </div>
          </div>

          {/* Academic Performance Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Subject</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Possible Mark</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Obtained Mark</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Percentage</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Grade</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Class Average</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Effort Grade</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.subjects.map((subject, index) => (
                  <tr 
                    key={index} 
                    className="border-b dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700"
                    onClick={() => {
                      if (subject.remarks) {
                        setSelectedSubject(subject);
                        setShowRemarksModal(true);
                      }
                    }}
                  >
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.name}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.possibleMark}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.obtainedMark}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.percentage}%</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.grade}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.classAverage}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.effortGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-main3 text-white rounded-lg hover:bg-opacity-90 transition-colors print:hidden"
            >
              Print Report
            </button>
          </div>
        </div>

        {/* Add Modal Rendering */}
        {showRemarksModal && (
          <RemarksModal
            subject={selectedSubject}
            onClose={() => {
              setShowRemarksModal(false);
              setSelectedSubject(null);
            }}
          />
        )}
      </div>
    );
  }

  // Show reports list view
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Academic Reports</h2>
      
      {reports.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-600 dark:text-gray-300">No reports available.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 cursor-pointer 
                         hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {report.term}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{report.year}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-main3 bg-opacity-10 text-main3 rounded-full">
                  {new Date(report.timestamp).toLocaleDateString()}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subjects</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {report.subjects.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Class</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {report.class}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <button
                className="mt-4 w-full px-4 py-2 text-sm text-main3 border border-main3 
                           rounded-lg hover:bg-main3 hover:text-white transition-colors duration-200"
              >
                View Full Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RemarksModal = ({ subject, onClose }) => {
  if (!subject) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {subject.name} - Teacher Remarks
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {subject.remarks || 'No remarks available'}
        </p>
      </div>
    </div>
  );
};

export default withAuth(StudentReportView);