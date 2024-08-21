import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef(null); // Reference for the modal content

  useEffect(() => {
    const fetchStudentsAndClasses = async () => {
      try {
        const studentsRef = ref(database, 'students');
        const classesRef = ref(database, 'classes');

        onValue(studentsRef, (snapshot) => {
          const studentsData = snapshot.val();
          if (studentsData) {
            const studentsArray = Object.keys(studentsData).map(key => ({
              id: key,
              ...studentsData[key]
            }));
            setStudents(studentsArray);
          } else {
            console.log('No students data found.');
          }
        });

        onValue(classesRef, (snapshot) => {
          const classesData = snapshot.val();
          if (classesData) {
            const classesArray = Object.keys(classesData).map(key => ({
              id: key,
              ...classesData[key]
            }));
            setClasses(classesArray);
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

    fetchStudentsAndClasses();
  }, []);

  const filteredStudents = students.filter(student =>
    student.studentId?.startsWith('STID') &&
    classes.some(cls => cls.className === student.studentClass) &&
    (student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.graduationYear.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedStudents = filteredStudents.sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn].toLowerCase();
    const valB = b[sortColumn].toLowerCase();
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

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (sortedStudents.length === 0) {
    return <div className="text-center mt-4">No students found.</div>;
  }

  return (
    <div className="w-full text-sm p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">My Students</h2>
      <input
        type="text"
        placeholder="Search by Student ID, Email, Class, Level, or Year"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              {['studentId', 'studentClass', 'gradeLevel', 'graduationYear', 'email'].map((column) => (
                <th
                  key={column}
                  className="p-2 border-b cursor-pointer text-blue-400 uppercase text-xs"
                  onClick={() => handleSort(column)}
                >
                  {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  {sortColumn === column && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => openModal(student)}>
                <td className="p-2 border-b">{student.studentId || 'N/A'}</td>
                <td className="p-2 border-b">{student.studentClass || 'N/A'}</td>
                <td className="p-2 border-b capitalize">{student.gradeLevel || 'N/A'}</td>
                <td className="p-2 border-b">{student.graduationYear || 'N/A'}</td>
                <td className="p-2 border-b">{student.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Student Details</h3>
            <p><strong>ID:</strong> {selectedStudent.studentId}</p>
            <p><strong>Class:</strong> {selectedStudent.studentClass}</p>
            <p><strong>Level:</strong> {selectedStudent.gradeLevel}</p>
            <p><strong>Graduation Year:</strong> {selectedStudent.graduationYear}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            {/* Add more details if available */}
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
