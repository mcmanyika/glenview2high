'use client';
import { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadedClassesList = () => {
  const { data: session } = useSession();
  const uploadedBy = session?.user?.email || ""; // Safeguard in case session is not loaded
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('className'); // Default sort by className
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const classesPerPage = 15; // Number of classes per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  useEffect(() => {
    const classesRef = ref(database, "classes");

    // Fetch class data from Firebase
    const unsubscribe = onValue(classesRef, (snapshot) => {
      const classList = [];
      snapshot.forEach((childSnapshot) => {
        const classData = childSnapshot.val();
        // Check if the class was uploaded by the logged-in user
        if (classData.uploadedBy === uploadedBy) {
          classList.push({
            className: classData.className,
            teacherFirstName: classData.teacherFirstName,
            teacherLastName: classData.teacherLastName,
            teacherID: classData.teacherID,
            teacherEmail: classData.teacherEmail,
          });
        }
      });
      setClasses(classList);
    });

    return () => {
      // Cleanup subscription on unmount
      unsubscribe();
    };
  }, [uploadedBy]);

  // Filter classes based on search term
  const filteredClasses = classes.filter((classData) =>
    classData.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classData.teacherFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classData.teacherLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classData.teacherID?.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Include teacheruserID in filter
    classData.teacherEmail?.toLowerCase().includes(searchTerm.toLowerCase())      // Include teacherEmail in filter
  );

  // Sort classes
  const sortedClasses = filteredClasses.sort((a, b) => {
    const comparison = a[sortKey]?.localeCompare(b[sortKey]);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Get current classes for pagination
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = sortedClasses.slice(indexOfFirstClass, indexOfLastClass);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleHeaderClick = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  const initiateDelete = (className) => {
    setClassToDelete(className);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const classesRef = ref(database, "classes");
      onValue(classesRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const classData = childSnapshot.val();
          if (classData.className === classToDelete && classData.uploadedBy === uploadedBy) {
            remove(ref(database, `classes/${childSnapshot.key}`));
            toast.success(`Successfully deleted ${classToDelete}`);
          }
        });
      }, { onlyOnce: true });
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class. Please try again.");
    }
    setIsModalOpen(false);
    setClassToDelete(null);
  };

  return (
    <div className="bg-white p-4 mt-4 border shadow-sm rounded">
      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete {classToDelete}? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
      />

      {currentClasses.length > 0 ? (
        <>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th 
                  className="border border-gray-300 px-4 py-2 cursor-pointer" 
                  onClick={() => handleHeaderClick('teacheruserID')}
                >
                  Teacher ID {sortKey === 'teacherID' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 cursor-pointer" 
                  onClick={() => handleHeaderClick('className')}
                >
                  Class Name {sortKey === 'className' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 cursor-pointer" 
                  onClick={() => handleHeaderClick('teacherFirstName')}
                >
                  Teacher First Name {sortKey === 'teacherFirstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 cursor-pointer" 
                  onClick={() => handleHeaderClick('teacherLastName')}
                >
                  Teacher Last Name {sortKey === 'teacherLastName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 cursor-pointer" 
                  onClick={() => handleHeaderClick('teacherEmail')}
                >
                  Teacher Email {sortKey === 'teacherEmail' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentClasses.map((classData, index) => (
                <tr key={index} className="hover:bg-gray-100 capitalize">
                  <td className="border border-gray-300 px-4 py-2">{classData.teacherID || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{classData.className}</td>
                  <td className="border border-gray-300 px-4 py-2">{classData.teacherFirstName || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{classData.teacherLastName || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2 lowercase">{classData.teacherEmail || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => initiateDelete(classData.className)}
                      className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-full font-medium shadow-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 mx-1 border rounded ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No classes uploaded yet.</p>
      )}
    </div>
  );
};

export default UploadedClassesList;
