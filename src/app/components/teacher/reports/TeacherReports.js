import { useState, useEffect } from 'react';
import { ref, get, remove, set } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import withAuth from '../../../../../utils/withAuth';

const ReportModal = ({ report, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState({ ...report.subject });
  const { data: session } = useSession();

  const handleSave = async () => {
    try {
      // Calculate percentage
      const percentage = ((parseFloat(editedSubject.obtainedMark) / parseFloat(editedSubject.possibleMark)) * 100).toFixed(1);
      
      // Calculate grade using the existing function
      const grade = calculateGrade(parseFloat(editedSubject.obtainedMark), parseFloat(editedSubject.possibleMark));

      const updatedSubject = {
        ...editedSubject,
        percentage,
        grade,
        lastUpdatedBy: session?.user?.email,
        lastUpdateDate: new Date().toISOString()
      };

      const reportRef = ref(database, `reports/${report.studentId}/${report.term}_${report.year}`);
      const snapshot = await get(reportRef);
      
      if (snapshot.exists()) {
        const reportData = snapshot.val();
        
        // Find and update the specific subject
        const updatedSubjects = reportData.subjects.map(sub => 
          sub.name === report.subject.name && sub.teacherEmail === session?.user?.email 
            ? updatedSubject 
            : sub
        );

        // Update the report with new data
        await set(reportRef, {
          ...reportData,
          subjects: updatedSubjects,
          timestamp: Date.now()
        });

        toast.success('Report updated successfully');
        setIsEditing(false);
        onClose();
        onUpdate();
      } else {
        throw new Error('Report not found');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report: ' + error.message);
    }
  };

  const calculateGrade = (obtained, possible) => {
    const percentage = (obtained / possible) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md w-full max-w-6xl min-h-[80vh] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 h-full overflow-y-auto">
          {/* Report Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Academic Report Card</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{report.term} - {report.year}</p>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
                <span className="font-semibold">Student Name:</span> {report.studentName}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                <span className="font-semibold">Class:</span> {report.class}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
                <span className="font-semibold">Admission Number:</span> {report.admissionNumber}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                <span className="font-semibold">Last Updated:</span> {new Date(report.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="overflow-x-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Academic Performance</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm text-main3 border border-main3 
                         rounded-lg bg-green-600 hover:bg-main3 text-white transition-colors duration-200"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4 bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Possible Mark</label>
                    <input
                      type="number"
                      value={editedSubject.possibleMark}
                      onChange={(e) => setEditedSubject(prev => ({
                        ...prev,
                        possibleMark: e.target.value
                      }))}
                      className="w-full px-3 py-2 rounded border-gray-300 dark:border-gray-600 
                               dark:bg-slate-800 dark:text-white focus:ring-main3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Obtained Mark</label>
                    <input
                      type="number"
                      value={editedSubject.obtainedMark}
                      onChange={(e) => setEditedSubject(prev => ({
                        ...prev,
                        obtainedMark: e.target.value
                      }))}
                      className="w-full px-3 py-2 rounded border-gray-300 dark:border-gray-600 
                               dark:bg-slate-800 dark:text-white focus:ring-main3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Class Average</label>
                    <input
                      type="number"
                      value={editedSubject.classAverage}
                      onChange={(e) => setEditedSubject(prev => ({
                        ...prev,
                        classAverage: e.target.value
                      }))}
                      className="w-full px-3 py-2 rounded border-gray-300 dark:border-gray-600 
                               dark:bg-slate-800 dark:text-white focus:ring-main3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Effort Grade</label>
                    <select
                      value={editedSubject.effortGrade}
                      onChange={(e) => setEditedSubject(prev => ({
                        ...prev,
                        effortGrade: e.target.value
                      }))}
                      className="w-full px-3 py-2 rounded border-gray-300 dark:border-gray-600 
                               dark:bg-slate-800 dark:text-white focus:ring-main3"
                    >
                      <option value="A">A - Excellent</option>
                      <option value="B">B - Very Good</option>
                      <option value="C">C - Good</option>
                      <option value="D">D - Fair</option>
                      <option value="E">E - Poor</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Remarks</label>
                    <input
                      type="text"
                      value={editedSubject.remarks}
                      onChange={(e) => setEditedSubject(prev => ({
                        ...prev,
                        remarks: e.target.value
                      }))}
                      className="w-full px-3 py-2 rounded border-gray-300 dark:border-gray-600 
                               dark:bg-slate-800 dark:text-white focus:ring-main3"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-main3 text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <table className="w-full text-base text-left">
                <thead className="bg-gray-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-gray-800 dark:text-white font-semibold">Subject</th>
                    <th className="px-6 py-4 text-gray-800 dark:text-white font-semibold">Possible Mark</th>
                    <th className="px-6 py-4 text-gray-800 dark:text-white font-semibold">Obtained Mark</th>
                    <th className="px-6 py-4 text-gray-800 dark:text-white font-semibold">Percentage</th>
                    <th className="px-6 py-4 text-gray-800 dark:text-white font-semibold">Grade</th>
                    <th className="px-6 py-4 text-gray-800 dark:text-white font-semibold">Class Average</th>
                    <th className="px-6 py-4 text-gray-800 dark:text-white font-semibold">Effort Grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-gray-600">
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{report.subject.name}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{report.subject.possibleMark}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{report.subject.obtainedMark}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{report.subject.percentage}%</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{report.subject.grade}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{report.subject.classAverage}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{report.subject.effortGrade}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Print Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.print()}
              className="px-8 py-3 text-lg bg-main3 text-white rounded-lg hover:bg-opacity-90 
                       transition-colors print:hidden"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Delete Report
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherReports = () => {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  // Filter reports based on search term
  const filteredReports = reports.filter(report => {
    const searchString = searchTerm.toLowerCase();
    return (
      report.studentName?.toLowerCase().includes(searchString) ||
      report.subject.name?.toLowerCase().includes(searchString) ||
      report.class?.toLowerCase().includes(searchString) ||
      report.term?.toLowerCase().includes(searchString) ||
      report.year?.toString().includes(searchString)
    );
  });

  // Update pagination calculations to use filtered reports
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Move fetchTeacherReports outside useEffect so we can reuse it
  const fetchTeacherReports = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      const reportsRef = ref(database, 'reports');
      const snapshot = await get(reportsRef);

      if (snapshot.exists()) {
        const allReports = [];
        const reportsData = snapshot.val();

        // Iterate through all students
        Object.entries(reportsData).forEach(([studentId, studentReports]) => {
          // Iterate through each student's reports
          Object.entries(studentReports).forEach(([reportId, report]) => {
            // Create separate report entries for each subject taught by this teacher
            report.subjects.forEach(subject => {
              if (subject.teacherEmail === session.user.email) {
                allReports.push({
                  id: `${reportId}_${subject.name}`,
                  studentId,
                  studentName: report.studentName,
                  class: report.class,
                  term: report.term,
                  year: report.year,
                  timestamp: report.timestamp,
                  subject: subject,
                  admissionNumber: report.admissionNumber
                });
              }
            });
          });
        });

        // Sort reports by date (most recent first)
        allReports.sort((a, b) => b.timestamp - a.timestamp);
        setReports(allReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTeacherReports();
  }, [session?.user?.email]);

  // Update delete handler
  const handleDelete = async (report, e) => {
    e.stopPropagation(); // Prevent modal from opening
    setDeleteConfirmation(report);
  };

  // Add confirm delete handler
  const confirmDelete = async () => {
    try {
      const report = deleteConfirmation;
      const reportRef = ref(database, `reports/${report.studentId}/${report.term}_${report.year}`);
      await remove(reportRef);
      
      // Update local state to remove the deleted report
      setReports(prevReports => prevReports.filter(r => r.id !== report.id));
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    } finally {
      setDeleteConfirmation(null); // Close the confirmation modal
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main3"></div>
      </div>
    );
  }

  return (
    <div className='pt-6'>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          My Submitted Reports
        </h2>
        
        {/* Search Input */}
        <div className="w-full md:w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       dark:border-gray-600 dark:bg-slate-800 dark:text-white 
                       focus:ring-2 focus:ring-main3 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm ? 'No reports match your search.' : 'No reports submitted yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentReports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 
                         hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {report.studentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {report.term} - {report.year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs text-white font-medium bg-slate-600  text-main3 rounded-full">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => handleDelete(report, e)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete Report"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subject</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {report.subject.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Class</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {report.class}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {report.subject.grade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marks</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {report.subject.obtainedMark}/{report.subject.possibleMark}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReport(report)}
                  className="mt-4 w-full px-4 py-2 text-sm text-main3 border border-main3 
                           rounded-lg hover:bg-slate-600 hover:text-white  transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-main3 text-white hover:bg-opacity-90'
                } transition-colors`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-lg ${
                      currentPage === index + 1
                        ? 'bg-main3 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-main3 text-white hover:bg-opacity-90'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          )}

          {/* Report Modal */}
          {selectedReport && (
            <ReportModal
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
              onUpdate={fetchTeacherReports}
            />
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmation && (
            <DeleteConfirmationModal
              report={deleteConfirmation}
              onConfirm={confirmDelete}
              onCancel={() => setDeleteConfirmation(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default withAuth(TeacherReports); 