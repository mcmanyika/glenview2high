import { useState, useEffect } from 'react';
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useSession } from 'next-auth/react';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

function StudentAttendanceHistory() {
  const { data: session } = useSession();
  const [userID, setUserID] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Move sortRecords function before it's used
  const sortRecords = (records) => {
    const sortedRecords = [...records].sort((a, b) => {
      if (sortConfig.key === 'date') {
        // Convert dates to timestamps for comparison
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortedRecords;
  };

  // Handle sort function
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Fetch userID from userTypes table based on logged-in user's email
  useEffect(() => {
    const userEmail = session?.user?.email;
    if (userEmail) {
      const userRef = ref(database, 'userTypes');
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const user = Object.values(data).find((user) => user.email === userEmail);
          if (user) {
            setUserID(user.userID);
          }
        }
      });
    }
  }, [session]);

  // Fetch attendance data based on userID
  useEffect(() => {
    if (userID) {
      const attendanceRef = ref(database, 'attendance');
      
      onValue(attendanceRef, (snapshot) => {
        const data = snapshot.val();
        const records = [];

        if (data) {
          Object.keys(data).forEach((date) => {
            const dailyRecords = data[date];
            if (dailyRecords[userID]) {
              records.push({
                date,
                subject: dailyRecords[userID].subject || 'N/A',
                status: dailyRecords[userID].status,
              });
            }
          });
        }

        setAttendanceRecords(records);
      });
    }
  }, [userID]);

  // Pagination logic
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const sortedRecords = sortRecords(attendanceRecords);
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(attendanceRecords.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Map statuses to icons
  const statusIcons = {
    Present: <FaCheckCircle className="text-green-500" />,
    Absent: <FaTimesCircle className="text-red-500" />,
    Late: <FaClock className="text-yellow-500" />,
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
      {attendanceRecords.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No attendance records found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    { key: 'date', label: 'Date' },
                    { key: 'subject', label: 'Subject' },
                    { key: 'status', label: 'Status' },
                  ].map((column) => (
                    <th 
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        <span className="inline-flex flex-col text-gray-400 dark:text-gray-500">
                          <svg className={`w-3 h-3 ${
                            sortConfig.key === column.key && sortConfig.direction === 'asc' 
                              ? 'text-blue-500 dark:text-blue-400' 
                              : ''
                          }`} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                          </svg>
                          <svg className={`w-3 h-3 ${
                            sortConfig.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-blue-500 dark:text-blue-400'
                              : ''
                          }`} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                          </svg>
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentRecords.map((record, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                    onClick={() => {
                      setSelectedRecord(record);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {record.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${record.status === 'Present' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 
                rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {Math.ceil(attendanceRecords.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => 
                Math.min(prev + 1, Math.ceil(attendanceRecords.length / itemsPerPage))
              )}
              disabled={currentPage >= Math.ceil(attendanceRecords.length / itemsPerPage)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 
                rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Add Modal */}
      {isModalOpen && selectedRecord && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full shadow-xl transform animate-modalSlide"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Attendance Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="text-gray-800 dark:text-gray-200">{selectedRecord.date}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</p>
                <p className="text-gray-800 dark:text-gray-200">{selectedRecord.subject}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <div className="flex items-center space-x-2">
                  {statusIcons[selectedRecord.status]}
                  <span className={`text-gray-800 dark:text-gray-200 ${
                    selectedRecord.status === 'Present' 
                      ? 'text-green-600 dark:text-green-400'
                      : selectedRecord.status === 'Late'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 px-4 rounded-lg
                hover:bg-blue-600 dark:hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAttendanceHistory;
