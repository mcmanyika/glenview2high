import React, { useState, useEffect } from 'react';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the import based on your project structure
import { ref, onValue, update } from 'firebase/database';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const AdmissionList = () => {
  const { data: session } = useSession();
  const loggedInUserEmail = session?.user?.email || ""; // Get the logged-in user's email

  const [admissions, setAdmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of admissions per page
  const [selectedAdmission, setSelectedAdmission] = useState(null); // For modal data
  const [modalOpen, setModalOpen] = useState(false); // For modal visibility
  const [formData, setFormData] = useState({}); // For the form data
  const [searchQuery, setSearchQuery] = useState(''); // For search query

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

  // Filter admissions based on search query
  const filteredAdmissions = admissions.filter((admission) =>
    Object.values(admission).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastAdmission = currentPage * itemsPerPage;
  const indexOfFirstAdmission = indexOfLastAdmission - itemsPerPage;
  const currentAdmissions = filteredAdmissions.slice(indexOfFirstAdmission, indexOfLastAdmission);

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

    const admissionsRef = ref(database, `admissions/${selectedAdmission.id}`);
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
    <div className="p-4 bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center w-full">
            <div className="text-2xl font-semibold mb-4">Admission List</div>
            <div className="three-dots flex flex-col justify-between h-4 space-y-1">
                <Link href="/admin/admission">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                </Link>
            </div>
            </div>

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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className='text-left'>
              <th className="py-2 px-4 text-sm">Admission ID</th>
              <th className="py-2 px-4 text-sm">Student ID</th>
              <th className="py-2 px-4 text-sm">First Name</th>
              <th className="py-2 px-4 text-sm">Last Name</th>
              <th className="py-2 px-4 text-sm">Gender</th>
              <th className="py-2 px-4 text-sm">Date of Birth</th>
              <th className="py-2 px-4 text-sm">Email</th>
              <th className="py-2 px-4 text-sm">Class</th>
              <th className="py-2 px-4 text-sm">Phone</th>
              <th className="py-2 px-4 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmissions.map((admission) => (
              <tr
                key={admission.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => openModal(admission)} // Open modal on row click
              >
                <td className="py-2 px-4 text-sm">{admission.admissionId}</td>
                <td className="py-2 px-4 text-sm">{admission.studentNumber || 'N/A'}</td>
                <td className="py-2 px-4 text-sm">{admission.firstName}</td>
                <td className="py-2 px-4 text-sm">{admission.lastName}</td>
                <td className="py-2 px-4 text-sm">{admission.gender}</td>
                <td className="py-2 px-4 text-sm">{admission.dateOfBirth}</td>
                <td className="py-2 px-4 text-sm">{admission.email}</td>
                <td className="py-2 px-4 text-sm">{admission.class}</td>
                <td className="py-2 px-4 text-sm">{admission.phone}</td>
                <td className="py-2 px-4 text-sm">{admission.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">
          Showing {indexOfFirstAdmission + 1} to{" "}
          {Math.min(indexOfLastAdmission, filteredAdmissions.length)} of{" "}
          {filteredAdmissions.length} admissions
        </p>
        <div>
          {Array.from({ length: Math.ceil(filteredAdmissions.length / itemsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 text-sm rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div id="modal-content" className="bg-white p-8 rounded-md w-full max-w-4xl mx-4">
            <h2 className="text-xl font-semibold mb-4">Edit Admission</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-2">Admission ID</label>
                  <input
                    type="text"
                    name="admissionId"
                    value={formData.admissionId}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="block mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Student Number</label>
                  <input
                    type="text"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                    disabled
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionList;
