import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
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

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchAdmissionsAndClasses = async () => {
        try {
          const admissionsRef = ref(database, 'userTypes');
          const classesRef = ref(database, 'classes');

          onValue(admissionsRef, (snapshot) => {
            const admissionsData = snapshot.val();
            if (admissionsData) {
              const admissionsArray = Object.keys(admissionsData).map((key) => ({
                id: key,
                ...admissionsData[key],
              }));
              setAdmissions(admissionsArray);
            } else {
              console.log('No admissions data found.');
            }
          });

          onValue(classesRef, (snapshot) => {
            const classesData = snapshot.val();
            if (classesData) {
              const classesArray = Object.keys(classesData).map((key) => ({
                id: key,
                ...classesData[key],
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
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  const filteredStudents = admissions.filter((student) => {
    const isClassValid = classes.some((cls) => cls.className === student.studentClassLevel);
    const isStudent = student.userType === 'student'; // Filter only students
    if (!isClassValid || !isStudent) return false;

    const term = searchTerm.toLowerCase();
    return (
      student.userID?.toLowerCase().includes(term) ||
      student.studentNumber?.toLowerCase().includes(term) ||
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.studentClassLevel?.toLowerCase().includes(term) ||
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

  const handleClassLevelChange = (e) => {
    const { value } = e.target;
    setSelectedStudent((prev) => ({ ...prev, studentClassLevel: value }));
  };

  const handleUpdateStudent = async () => {
    const studentRef = ref(database, `userTypes/${selectedStudent.id}`);
    try {
      await update(studentRef, {
        studentClassLevel: selectedStudent.studentClassLevel,
      });
      closeModal();
    } catch (error) {
      console.error('Error updating student class level:', error);
    }
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
              {['userID', 'firstName', 'lastName', 'studentClassLevel', 'gender', 'phone', 'email'].map((column) => (
                <th
                  key={column}
                  className="p-2 border-b cursor-pointer text-blue-400 uppercase text-xs"
                  onClick={() => handleSort(column)}
                >
                  <div>
                    {column.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    {sortColumn === column && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => openModal(student)}
              >
                <td className="p-2 border-b">{student.userID || 'N/A'}</td>
                <td className="p-2 border-b">{student.firstName || 'N/A'}</td>
                <td className="p-2 border-b">{student.lastName || 'N/A'}</td>
                <td className="p-2 border-b">{student.studentClassLevel || 'N/A'}</td>
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
            <h3 className="text-xl font-semibold mb-4">Edit Student Class Level</h3>
            <div className="flex flex-col mb-4">
              <label className="font-semibold" htmlFor="studentClassLevel">Class Level:</label>
              <select
                id="studentClassLevel"
                value={selectedStudent.studentClassLevel}
                onChange={handleClassLevelChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>Select Class Level</option>
                <option value='1A'>1A</option>
                <option value='2A'>2A</option>
                <option value='3A'>3A</option>
                <option value='4A'>4A</option>
                <option value='5A'>5A</option>
                <option value='6A'>6A</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button onClick={handleUpdateStudent} className="bg-blue-500 text-white p-2 rounded">Save</button>
              <button onClick={closeModal} className="bg-gray-300 text-gray-700 p-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
