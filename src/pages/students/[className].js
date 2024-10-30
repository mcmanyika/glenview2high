// pages/classes/[className].js
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { setUserID } from '../../app/store';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Spinner icon

import AdminLayout from '../admin/adminLayout';
import withAuth from '../../../utils/withAuth';

const StudentsByClassPage = () => {
  const { data: session, status } = useSession();
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { className } = router.query;
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 15; // Set number of students per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user type and ID if authenticated
        if (status === 'authenticated') {
          const userEmail = session.user.email; // Get the user's email from session
          const userRef = ref(database, 'userTypes'); // Reference to the userTypes node in Firebase
          const snapshot = await get(userRef); // Get the data from Firebase

          if (snapshot.exists()) {
            const users = snapshot.val(); // Get the user data
            const foundUserID = Object.keys(users).find(id => users[id].email === userEmail); // Find user by email

            if (foundUserID) {
              const userData = users[foundUserID];
              setUserType(userData.userType); // Set user type
              setUserID(foundUserID); // Store user ID in the state
            } else {
              console.log('No user found with this email.');
              router.push('/admin/user'); // Redirect if no user is found
            }
          } else {
            console.log('No user types found.');
          }
        }

        // Fetch students by class
        if (className) {
          setIsLoading(true);
          const studentsRef = ref(database, 'userTypes');
          onValue(studentsRef, (snapshot) => {
            if (snapshot.exists()) {
              const studentsData = snapshot.val();
              console.log("Fetched data:", studentsData); // Debug log

              // Filter to include only students in the specified class and userType as "student"
              const filteredStudents = Object.entries(studentsData)
                .filter(([, data]) => data.class === className && data.userType === "student")
                .map(([id, data]) => ({ id, ...data }));
              setStudents(filteredStudents);
            } else {
              console.log("No data found for classes");
              setStudents([]);
            }
            setIsLoading(false);
          }, (error) => {
            console.error("Firebase error:", error);
            setIsLoading(false);
          });
        }
      } catch (error) {
        console.error('Error fetching user type or students:', error); // Log any error
        setError('Error fetching data. Please try again later.'); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [status, session, router, className]);

  // Logic for pagination
  const indexOfLastStudent = currentPage * studentsPerPage; // Last student index
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage; // First student index
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent); // Get current students

  const totalPages = Math.ceil(students.length / studentsPerPage); // Total pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-blue-500 animate-spin"
        />
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading students...</p>;
  }

  return (
    <AdminLayout>
      <div className="p-4 bg-white border border-gray-200 h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Students in {className}</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left border border-gray-200 px-4 py-2">Student ID</th>
              <th className="text-left border border-gray-200 px-4 py-2">First Name</th>
              <th className="text-left border border-gray-200 px-4 py-2">Last Name</th>
              <th className="text-left border border-gray-200 px-4 py-2">Class</th>
              <th className="text-left border border-gray-200 px-4 py-2">Gender</th>
              <th className="text-left border border-gray-200 px-4 py-2">Email</th>
              <th className="text-left border border-gray-200 px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="border border-gray-200 px-4 py-2">{student.userID}</td>
                <td className="border border-gray-200 px-4 py-2">{student.firstName}</td>
                <td className="border border-gray-200 px-4 py-2">{student.lastName}</td>
                <td className="border border-gray-200 px-4 py-2">{student.class}</td>
                <td className="border border-gray-200 px-4 py-2 capitalize">{student.gender}</td>
                <td className="border border-gray-200 px-4 py-2">{student.email}</td>
                <td className="border border-gray-200 px-4 py-2">{student.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-4 py-2 border rounded-md ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(StudentsByClassPage);
