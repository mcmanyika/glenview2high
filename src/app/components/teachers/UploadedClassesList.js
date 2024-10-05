'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';

const UploadedClassesList = () => {
  const { data: session } = useSession();
  const uploadedBy = session?.user?.email || ""; // Safeguard in case session is not loaded
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('className'); // Default sort by className
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const classesPerPage = 15; // Number of classes per page

  useEffect(() => {
    const classesRef = ref(database, "classes");

    // Fetch class data from Firebase
    onValue(classesRef, (snapshot) => {
      const classList = [];
      snapshot.forEach((childSnapshot) => {
        const classData = childSnapshot.val();
        // Check if the class was uploaded by the logged-in user
        if (classData.uploadedBy === uploadedBy) {
          classList.push({
            className: classData.className,
            teacherFirstName: classData.teacherFirstName,
            teacherLastName: classData.teacherLastName,
            teacherID: classData.teacherID,  // Added teacheruserID
            teacherEmail: classData.teacherEmail,    // Added teacherEmail
          });
        }
      });
      setClasses(classList);
    }, {
      onlyOnce: true, // Fetch only once
    });

    return () => {
      // Cleanup if needed
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

  return (
    <div className="bg-white border shadow-sm rounded p-4 mt-2 md:m-4 md:mt-0">
      
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded px-2 py-1 mb-4"
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
