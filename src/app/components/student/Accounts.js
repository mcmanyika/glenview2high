import React, { useState, useEffect } from 'react';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the import based on your project structure
import { ref, onValue, update } from 'firebase/database';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import EditAdmissionForm from '../admin/admissions/EditAdmissionForm';

const Accounts = () => {
  const { data: session } = useSession();
  const loggedInUserEmail = session?.user?.email || ""; // Get the logged-in user's email

  const [admissions, setAdmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of admissions per page
  const [selectedAdmission, setSelectedAdmission] = useState(null); // For modal data
  const [modalOpen, setModalOpen] = useState(false); // For modal visibility
  const [formData, setFormData] = useState({}); // For the form data
  const [searchQuery, setSearchQuery] = useState(''); // For search query
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const admissionsRef = ref(database, 'userTypes');
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

  // Filter admissions based on search query AND userType
  const filteredAdmissions = admissions.filter((admission) =>
    admission.userType === "student" &&
    Object.values(admission).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastAdmission = currentPage * itemsPerPage;
  const indexOfFirstAdmission = indexOfLastAdmission - itemsPerPage;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAdmissions = [...filteredAdmissions].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'firstName') {
      aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
      bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const currentAdmissions = sortedAdmissions.slice(indexOfFirstAdmission, indexOfLastAdmission);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (admission) => {
    setSelectedAdmission(admission);
    setFormData(admission); // Set form data to the selected admission
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAdmission(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedData = {
      ...formData,
      editorEmail: loggedInUserEmail, // Add the logged-in user's email
      editedAt: new Date().toISOString(), // Add the current timestamp
    };

    if (formData.status === 'Accepted' && !formData.studentNumber) {
      // Generate a Student Number if the status is 'Accepted' and no Student Number exists
      updatedData.studentNumber = `STID-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const admissionsRef = ref(database, `userTypes/${selectedAdmission.id}`);
    update(admissionsRef, updatedData)
      .then(() => {
        closeModal(); // Close the modal after successful update
      })
      .catch((error) => {
        console.error("Error updating admission: ", error);
      });
  };

  const handleClickOutside = (event) => {
    const modal = document.getElementById('modal-content');
    if (modal && !modal.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-md">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search admissions..."
          className="border rounded w-full px-3 py-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-base">
          <thead>
            <tr className="bg-gray-100">
              <th 
                className="px-3 py-1.5 text-left text-sm font-medium cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('firstName')}
              >
                Name {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-1.5 text-left text-sm font-medium cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-1.5 text-left text-sm font-medium cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('phone')}
              >
                Phone {sortField === 'phone' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-1.5 text-left text-sm font-medium cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('status')}
              >
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAdmissions.map((admission) => (
              <tr
                key={admission.id}
                className="border-b hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => openModal(admission)}
              >
                <td className="px-3 py-1.5 capitalize">
                  {admission.firstName} {admission.lastName}
                </td>
                <td className="px-3 py-1.5">{admission.email}</td>
                <td className="px-3 py-1.5">{admission.phone || '-'}</td>
                <td className="px-3 py-1.5">{admission.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-base">
          Showing {indexOfFirstAdmission + 1} to{" "}
          {Math.min(indexOfLastAdmission, filteredAdmissions.length)} of{" "}
          {filteredAdmissions.length} admissions
        </p>
        <div>
          {Array.from({ length: Math.ceil(filteredAdmissions.length / itemsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 text-base rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div 
            id="modal-content"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold dark:text-white">Edit Admission</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <EditAdmissionForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                closeModal={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
