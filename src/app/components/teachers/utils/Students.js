import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const Students = () => {
  const { data: session, status } = useSession();
  const [admissions, setAdmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const userEmail = session.user.email;
      
      const fetchAdmissionsAndClasses = async () => {
        try {
          const admissionsRef = ref(database, 'userTypes');
          const classesRef = ref(database, 'classes');

          onValue(admissionsRef, (snapshot) => {
            const admissionsData = snapshot.val();
            if (admissionsData) {
              const admissionsArray = Object.keys(admissionsData)
                .map(key => ({
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
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  const filteredStudents = admissions.filter((student) => {
    const isClassValid = classes.some(cls => cls.className === student.studentClassLevel);
    if (!isClassValid) return false;

    const term = searchTerm.toLowerCase();
    return (
      student.userID?.toLowerCase().includes(term) ||
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.studentClassLevel?.toLowerCase().includes(term) ||
      student.gender?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term)
    );
  });

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

  if (filteredStudents.length === 0) {
    return <div className="text-center mt-4">No students found.</div>;
  }

  return (
    <div className="w-full p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">My Students</h2>
      <input
        type="text"
        placeholder="Search by Student ID, First Name, Last Name, Email, or Class"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <div 
            key={student.id} 
            className="p-4 border rounded shadow hover:shadow-lg transition cursor-pointer" 
            onClick={() => openModal(student)}
          >
            <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
            <p><strong>Student ID:</strong> {student.userID || 'N/A'}</p>
            <p><strong>Class:</strong> {student.studentClassLevel || 'N/A'}</p>
            <p><strong>Gender:</strong> {student.gender || 'N/A'}</p>
            <p><strong>Phone:</strong> {student.phone || 'N/A'}</p>
            <p><strong>Email:</strong> {student.email || 'N/A'}</p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Student Details</h3>
            <div className="flex flex-col mb-2">
              <div className="font-semibold">Student Number:</div>
              <div>{selectedStudent.userID}</div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="font-semibold">First Name:</div>
              <div>{selectedStudent.firstName}</div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="font-semibold">Last Name:</div>
              <div>{selectedStudent.lastName}</div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="font-semibold">Class:</div>
              <div>{selectedStudent.studentClassLevel}</div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="font-semibold">Gender:</div>
              <div>{selectedStudent.gender}</div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="font-semibold">Phone:</div>
              <div>{selectedStudent.phone}</div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="font-semibold">Email:</div>
              <div>{selectedStudent.email}</div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={closeModal}
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
