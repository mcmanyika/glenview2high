import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';

const Students = ({ userEmail }) => {
  const [admissions, setAdmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchAdmissionsAndClasses = async () => {
      try {
        const admissionsRef = ref(database, 'admissions');
        const classesRef = ref(database, 'classes');

        onValue(admissionsRef, (snapshot) => {
          const admissionsData = snapshot.val();
          if (admissionsData) {
            const admissionsArray = Object.keys(admissionsData)
              .map(key => ({
                id: key,
                ...admissionsData[key]
              }))
              .filter(student => student.email === userEmail); // Filter by logged-in user's email
            setAdmissions(admissionsArray);
          } else {
            console.log('No admissions data found.');
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

    fetchAdmissionsAndClasses();
  }, [userEmail]);

  const filteredStudents = admissions.filter((student) => {
    // Check if the student's class exists in the classes list
    const isClassValid = classes.some(cls => cls.className === student.class);
    if (!isClassValid) return false;

    const term = searchTerm.toLowerCase();
    return (
      student.admissionId?.toLowerCase().includes(term) ||
      student.studentNumber?.toLowerCase().includes(term) ||
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
        placeholder="Search by Student ID, First Name, Last Name, Email, or Class"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              {['studentNumber', 'firstName', 'lastName', 'class name', 'gender', 'phone', 'email'].map((column) => (
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
                <td className="p-2 border-b">{student.studentNumber || 'N/A'}</td>
                <td className="p-2 border-b">{student.firstName || 'N/A'}</td>
                <td className="p-2 border-b">{student.lastName || 'N/A'}</td>
                <td className="p-2 border-b">{student.class || 'N/A'}</td>
                <td className="p-2 border-b capitalize">{student.gender || 'N/A'}</td>
                <td className="p-2 border-b">{student.phone || 'N/A'}</td>
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
            <p><strong>Student Number:</strong> {selectedStudent.studentNumber}</p>
            <p><strong>First Name:</strong> {selectedStudent.firstName}</p>
            <p><strong>Last Name:</strong> {selectedStudent.lastName}</p>
            <p><strong>Class:</strong> {selectedStudent.class}</p>
            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
            <p><strong>Phone:</strong> {selectedStudent.phone}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
