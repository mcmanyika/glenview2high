import { useEffect, useState } from 'react';
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Pie } from 'react-chartjs-2';
import { useRouter } from 'next/router';
import 'chart.js/auto';

function AttendanceDashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [detailedAttendance, setDetailedAttendance] = useState({ Present: [], Absent: [], Late: [] });
  const [studentDetails, setStudentDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch student details from userTypes table
  useEffect(() => {
    const fetchStudentDetails = () => {
      const studentsRef = ref(database, 'userTypes');
      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        const details = {};
        if (data) {
          for (const userID in data) {
            if (data[userID].userType === 'student') {
              details[userID] = {
                firstName: data[userID].firstName,
                lastName: data[userID].lastName,
                class: data[userID].class || '', // Fetch class info
              };
            }
          }
        }
        setStudentDetails(details);
      });
    };

    fetchStudentDetails();
  }, []);

  // Fetch attendance data whenever the selected date changes
  useEffect(() => {
    const fetchAttendance = () => {
      const attendanceRef = ref(database, `attendance/${selectedDate}`);
      onValue(attendanceRef, (snapshot) => {
        const data = snapshot.val();
        const stats = { Present: 0, Absent: 0, Late: 0 };
        const details = { Present: [], Absent: [], Late: [] };

        if (data) {
          for (const userID in data) {
            const status = data[userID].status;
            stats[status] = (stats[status] || 0) + 1;
            details[status].push({
              userID,
              firstName: studentDetails[userID]?.firstName || '',
              lastName: studentDetails[userID]?.lastName || '',
              class: studentDetails[userID]?.class || '', // Include class in details
            });
          }
          setAttendanceData(stats);
          setDetailedAttendance(details);
        } else {
          setAttendanceData(null); // No data found
        }
      });
    };

    fetchAttendance();
  }, [selectedDate, studentDetails]);

  // Handle date selection
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  

  // Filtered attendance data based on search query
  const filteredAttendance = ['Present', 'Absent', 'Late']
    .flatMap((status) => detailedAttendance[status].map((student) => ({ ...student, status })))
    .filter((student) =>
      student.userID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Count filtered data for pie chart
  const filteredSummary = filteredAttendance.reduce(
    (acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1;
      return acc;
    },
    { Present: 0, Absent: 0, Late: 0 }
  );

  // Paginate filtered data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

  // Prepare data for pie chart using filteredSummary
  const pieData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [
          filteredSummary.Present || 0,
          filteredSummary.Absent || 0,
          filteredSummary.Late || 0,
        ],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'], // Colors for each status
      },
    ],
  };

  // Map statuses to icons
  const statusIcons = {
    Present: '✅',
    Absent: '❌',
    Late: '🕒',
  };

  return (
    <div className="p-4">
      <div className='flex justify-between'>
        <div className="text-lg font-semibold mb-4">Attendance Dashboard</div>
      </div>
      
      <label className="block mb-4">
        Select Date:
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="ml-2 p-2 border rounded"
        />
      </label>

      {attendanceData ? (
        <div>
          {/* Pie Chart with reduced size */}
          <div className="mb-4 w-96" style={{ width: '20%', margin: '0 auto' }}>
            <Pie data={pieData} />
          </div>
          
          <div className="mt-10">
            {/* Search Field */}
            <input
              type="text"
              placeholder="Search by Student ID, First or Last Name, or Class"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
            />
            <table className="min-w-full text-left bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Student ID</th>
                  <th className="py-2 px-4 border-b">First Name</th>
                  <th className="py-2 px-4 border-b">Last Name</th>
                  <th className="py-2 px-4 border-b">Class</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? currentItems.map((student) => (
                  <tr key={student.userID}>
                    <td className="py-2 px-4 border-b">{student.userID}</td>
                    <td className="py-2 px-4 border-b">{student.firstName}</td>
                    <td className="py-2 px-4 border-b">{student.lastName}</td>
                    <td className="py-2 px-4 border-b">{student.class}</td>
                    <td className="py-2 px-4 border-b">
                      {statusIcons[student.status]}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                      There is no information.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 border rounded bg-gray-200 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="px-3 py-1 mx-1 border">{currentPage}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 border rounded bg-gray-200 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">There is no information.</p>
      )}
    </div>
  );
}

export default AttendanceDashboard;
