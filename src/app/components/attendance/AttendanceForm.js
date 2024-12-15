import { useState, useEffect } from 'react';
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue, update, get } from 'firebase/database';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AttendanceForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { className, date, subject } = router.query; // Get className, date, and subject from query
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentDate = new Date().toISOString().split('T')[0];
  const isSubmittable = new Date(currentDate) >= new Date(date);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (session?.user?.email && className) {
      const admissionsRef = ref(database, 'userTypes');
      onValue(admissionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const studentsArray = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter(
              (student) =>
                student.userType === 'student' && student.class === className
            );
          setStudents(studentsArray);
          setFilteredStudents(studentsArray);
        } else {
          setStudents([]);
          setFilteredStudents([]);
        }
      });
    }
  }, [session, className]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter((student) =>
      student.userID.toLowerCase().includes(query) ||
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      (student.class && student.class.toLowerCase().includes(query))
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleStatusChange = (userID, status) => {
    setAttendance((prev) => ({ ...prev, [userID]: status }));
  };

  const updateAttendanceStats = async (userID) => {
    try {
      // Get current stats
      const statsRef = ref(database, `userTypes/${userID}/dashboardStats/attendance`);
      const statsSnapshot = await get(statsRef);
      const currentStats = statsSnapshot.val() || {};

      // Calculate new attendance percentage
      const attendanceRef = ref(database, `attendance`);
      const attendanceSnapshot = await get(attendanceRef);
      const attendanceData = attendanceSnapshot.val() || {};

      // Calculate attendance percentage for this student
      const studentAttendance = Object.values(attendanceData)
        .filter(day => day[userID])
        .map(day => day[userID].status);

      const totalClasses = studentAttendance.length;
      const presentClasses = studentAttendance.filter(status => 
        status === 'Present' || status === 'Late'
      ).length;

      const attendancePercentage = totalClasses ? 
        Math.round((presentClasses / totalClasses) * 100) : 0;

      // Calculate trend (comparing with previous value)
      const previousValue = parseInt(currentStats.value) || 0;
      const trend = attendancePercentage - previousValue;

      // Determine status
      let status = 'neutral';
      if (attendancePercentage >= 90) status = 'up';
      else if (attendancePercentage >= 75) status = 'neutral';
      else if (attendancePercentage >= 60) status = 'warning';
      else status = 'down';

      // Update stats
      const updates = {
        value: `${attendancePercentage}%`,
        trend: `${trend >= 0 ? '+' : ''}${trend}%`,
        status: status
      };

      await update(statsRef, updates);
    } catch (error) {
      console.error('Error updating attendance stats:', error);
    }
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    if (!isSubmittable) {
      toast.error('Attendance can only be submitted on or after the date of the lesson.');
      return;
    }

    try {
      const updates = {};
      for (const userID in attendance) {
        updates[`attendance/${date}/${userID}`] = { 
          status: attendance[userID], 
          subject 
        };
        // Update stats for each student
        await updateAttendanceStats(userID);
      }
      await update(ref(database), updates);
      toast.success('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error('Failed to submit attendance.');
    }
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Mark Attendance for {className} - {date} - {subject}</h2>
      
      <input
        type="text"
        placeholder="Search by ID, First/Last Name, or Class"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4 p-2 border rounded w-full"
      />

      <form onSubmit={submitAttendance}>
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Student ID</th>
              <th className="py-2 px-4 border-b">Student Name</th>
              <th className="py-2 px-4 border-b">Class</th>
              <th className="py-2 px-4 border-b">Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td className="py-2 px-4 border-b">{student.userID}</td>
                <td className="py-2 px-4 border-b">{student.firstName} {student.lastName}</td>
                <td className="py-2 px-4 border-b">{student.class}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    onChange={(e) => handleStatusChange(student.userID, e.target.value)}
                    className="p-2 border rounded w-full"
                    defaultValue=""
                  >
                    <option value=""></option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Submit button with conditional rendering based on date */}
        <button
          type="submit"
          className={`mt-4 p-2 rounded-full px-6 ${isSubmittable ? 'bg-main text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          disabled={!isSubmittable}
        >
          Submit Attendance
        </button>

        {!isSubmittable && (
          <p className="mt-2 text-sm text-red-600">
            Attendance can only be submitted on or after the date of the lesson.
          </p>
        )}
      </form>
    </div>
  );
}

export default AttendanceForm;
