import React, { useState, useEffect } from 'react';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the import based on your project structure
import { ref, onValue } from 'firebase/database';

const AdmissionList = () => {
  const [admissions, setAdmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of admissions per page

  useEffect(() => {
    const admissionsRef = ref(database, 'admissions');
    onValue(admissionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const admissionsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAdmissions(admissionsArray);
      } else {
        setAdmissions([]);
      }
    });
  }, []);

  // Get current admissions for the current page
  const indexOfLastAdmission = currentPage * itemsPerPage;
  const indexOfFirstAdmission = indexOfLastAdmission - itemsPerPage;
  const currentAdmissions = admissions.slice(indexOfFirstAdmission, indexOfLastAdmission);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(admissions.length / itemsPerPage);

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Admission List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border text-sm">Admission ID</th>
              <th className="py-2 px-4 border text-sm">First Name</th>
              <th className="py-2 px-4 border text-sm">Last Name</th>
              <th className="py-2 px-4 border text-sm">Gender</th>
              <th className="py-2 px-4 border text-sm">Date of Birth</th>
              <th className="py-2 px-4 border text-sm">Religion</th>
              <th className="py-2 px-4 border text-sm">Email</th>
              <th className="py-2 px-4 border text-sm">Class</th>
              <th className="py-2 px-4 border text-sm">Phone</th>
              <th className="py-2 px-4 border text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmissions.map((admission) => (
              <tr
                key={admission.id}
                className="hover:bg-gray-100" // Background color on hover
              >
                <td className="py-2 px-4 border text-sm">{admission.admissionId}</td>
                <td className="py-2 px-4 border text-sm">{admission.firstName}</td>
                <td className="py-2 px-4 border text-sm">{admission.lastName}</td>
                <td className="py-2 px-4 border text-sm">{admission.gender}</td>
                <td className="py-2 px-4 border text-sm">{admission.dateOfBirth}</td>
                <td className="py-2 px-4 border text-sm">{admission.religion}</td>
                <td className="py-2 px-4 border text-sm">{admission.email}</td>
                <td className="py-2 px-4 border text-sm">{admission.class}</td>
                <td className="py-2 px-4 border text-sm">{admission.phone}</td>
                <td className="py-2 px-4 border text-sm">{admission.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'} rounded`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'} rounded`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdmissionList;
