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
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center w-full">
        <div className="text-2xl font-semibold mb-4">Accounts List</div>
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

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentAdmissions.map((admission) => (
          <div
            key={admission.id}
            className="bg-gray-50 p-4 rounded-md shadow-md hover:bg-gray-100 cursor-pointer"
            onClick={() => openModal(admission)}
          >
            <p className="text-lg font-bold mb-2 capitalize">{admission.firstName} {admission.lastName}</p>
            <p className="text-sm mb-1"><span className="font-semibold">Email:</span> {admission.email}</p>
            { admission.class && (<p className="text-sm mb-1"><span className="font-semibold">Class:</span> {admission.class}</p>) }
            <p className="text-sm mb-1"><span className="font-semibold">Phone:</span> {admission.phone}</p>
            <p className="text-sm mb-1"><span className="font-semibold">Status:</span> {admission.status}</p>
          </div>
        ))}
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
         <div className="bg-white p-8 rounded-md max-w-screen-lg">
           <h2 className="text-xl font-semibold mb-4">Edit Admission</h2>
           <EditAdmissionForm
             formData={formData}
             handleInputChange={handleInputChange}
             handleSubmit={handleSubmit}
             closeModal={closeModal}
           /> 
         </div>
       </div>
      )}
    </div>
  );
};

export default Accounts;
