import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa'; 
import { useSession } from 'next-auth/react';

const StudentsByClassName = ({ className }) => {
  const { data: session, status } = useSession();
  const [admissions, setAdmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(12); 

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchAdmissionsAndClasses = async () => {
        try {
          const admissionsRef = ref(database, 'userTypes');
          const classesRef = ref(database, `classes`);

          onValue(admissionsRef, (snapshot) => {
            const admissionsData = snapshot.val();
            if (admissionsData) {
              const admissionsArray = Object.keys(admissionsData).map(key => ({
                id: key,
                ...admissionsData[key]
              }));
              setAdmissions(admissionsArray);
            }
          });

          onValue(classesRef, (snapshot) => {
            const classesData = snapshot.val();
            if (classesData) {
              const classesArray = Object.keys(classesData).map(key => ({
                id: key,
                ...classesData[key]
              }));
              const filteredClasses = classesArray.filter(
                (classItem) => classItem.teacherEmail === session.user.email
              );
              setClasses(filteredClasses);
            }
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAdmissionsAndClasses();
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  const filteredStudents = admissions.filter((student) => {
    if (student.userType !== 'student') return false;
    const isClassValid = classes.some(cls => cls.className === student.class);
    if (!isClassValid) return false;

    const term = searchTerm.toLowerCase();
    return (
      student.userID?.toLowerCase().includes(term) ||
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.class?.toLowerCase().includes(term) ||
      student.gender?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term)
    );
  });

  const sortedStudents = filteredStudents.sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn]?.toLowerCase();
    const valB = b[sortColumn]?.toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(order);
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto text-sm p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Students in {className}</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search students..."
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      {currentStudents.length === 0 ? (
        <p className="text-gray-500">No students found for this class.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th onClick={() => handleSort('userID')} className="cursor-pointer text-left border border-gray-200 px-4 py-2">Student ID</th>
              <th onClick={() => handleSort('firstName')} className="cursor-pointer text-left border border-gray-200 px-4 py-2">First Name</th>
              <th onClick={() => handleSort('lastName')} className="cursor-pointer text-left border border-gray-200 px-4 py-2">Last Name</th>
              <th onClick={() => handleSort('class')} className="cursor-pointer text-left border border-gray-200 px-4 py-2">Class</th>
              <th onClick={() => handleSort('gender')} className="cursor-pointer text-left border border-gray-200 px-4 py-2">Gender</th>
              <th onClick={() => handleSort('email')} className="cursor-pointer text-left border border-gray-200 px-4 py-2">Email</th>
              <th onClick={() => handleSort('phone')} className="cursor-pointer text-left border border-gray-200 px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id} onClick={() => openModal(student)} className="cursor-pointer hover:bg-gray-100">
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
      )}
      <div className="flex justify-between mt-4">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => prev - 1)} 
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(prev => prev + 1)} 
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div ref={modalRef} className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Student Details</h3>
            <p><strong>ID:</strong> {selectedStudent.userID}</p>
            <p><strong>First Name:</strong> {selectedStudent.firstName}</p>
            <p><strong>Last Name:</strong> {selectedStudent.lastName}</p>
            <p><strong>Class:</strong> {selectedStudent.class}</p>
            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Phone:</strong> {selectedStudent.phone}</p>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsByClassName;
