import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa'; // Importing icons
import { useSession } from 'next-auth/react';

const Students = () => {
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
  const [studentsPerPage] = useState(12); // Change this to adjust how many students to show per page

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchAdmissionsAndClasses = async () => {
        try {
          const admissionsRef = ref(database, 'userTypes');
          const classesRef = ref(database, 'classes');

          onValue(admissionsRef, (snapshot) => {
            const admissionsData = snapshot.val();
            if (admissionsData) {
              const admissionsArray = Object.keys(admissionsData).map(key => ({
                id: key,
                ...admissionsData[key]
              }));
              setAdmissions(admissionsArray);
            } else {
              console.log('No admissions data found.');
            }
          });

          onValue(classesRef, (snapshot) => {
            const classesData = snapshot.val();
            if (classesData) {
              // Filtering classes by teacherEmail to match logged-in user
              const classesArray = Object.keys(classesData).map(key => ({
                id: key,
                ...classesData[key]
              }));

              const filteredClasses = classesArray.filter(
                (classItem) => classItem.teacherEmail === session.user.email
              );
              setClasses(filteredClasses); // Set only the filtered classes
            } else {
              console.log('No classes data found.');
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
    // Filter to only show students
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
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination calculations
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center 
        bg-gray-200 dark:bg-gray-800 bg-opacity-75 z-50 transition-colors duration-200">
        <FaSpinner className="animate-spin text-4xl text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full text-sm p-4 bg-white dark:bg-gray-800 rounded-lg transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        My Students
      </h2>
      
      <input
        type="text"
        placeholder="Search by Student ID, First Name, Last Name, Email, or Class"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 w-full rounded-lg
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          placeholder-gray-500 dark:placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
          focus:border-blue-500 dark:focus:border-blue-600
          transition-colors duration-200"
      />

      {currentStudents.length === 0 ? (
        <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
          No students found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {currentStudents.map(student => (
            <div 
              key={student.id} 
              onClick={() => openModal(student)}
              className="border dark:border-gray-700 p-4 rounded-lg 
                bg-white dark:bg-gray-700 
                shadow-sm hover:shadow-md
                hover:bg-gray-50 dark:hover:bg-gray-600 
                cursor-pointer transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {`${student.firstName} ${student.lastName}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Student ID:</strong> {student.userID}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Class:</strong> {student.class}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg
            hover:bg-blue-600 dark:hover:bg-blue-700
            disabled:bg-gray-400 dark:disabled:bg-gray-600
            disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg
            hover:bg-blue-600 dark:hover:bg-blue-700
            disabled:bg-gray-400 dark:disabled:bg-gray-600
            disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
          bg-black bg-opacity-50">
          <div 
            ref={modalRef} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg 
              p-6 max-w-md w-full m-4 transition-colors duration-200"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {`${selectedStudent.firstName} ${selectedStudent.lastName}`}
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p><strong>Student ID:</strong> {selectedStudent.userID}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone}</p>
              <p><strong>Class:</strong> {selectedStudent.class}</p>
              <p className='capitalize'><strong>Gender:</strong> {selectedStudent.gender}</p>
            </div>
            <button 
              onClick={closeModal} 
              className="mt-6 w-full bg-blue-500 dark:bg-blue-600 text-white 
                p-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700
                transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
