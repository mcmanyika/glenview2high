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
  const itemsPerPage = 10;

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
  const currentRecords = attendanceRecords.slice(indexOfFirstRecord, indexOfLastRecord);
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentRecords.map((record, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
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
                rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 
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
                rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentAttendanceHistory;
