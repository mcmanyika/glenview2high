import React, { useState, useEffect } from 'react';
import { database } from '../../../../../utils/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { useSession } from 'next-auth/react';
import { HiCreditCard } from 'react-icons/hi'; // Import payment icon
import EditAdmissionForm from './EditAdmissionForm'; // Import the new form component
import PaymentModal from './PaymentModal'; // Import the new payment modal component

const AdmissionsList = () => {
  const { data: session } = useSession();
  const loggedInUserEmail = session?.user?.email || "";

  const [admissions, setAdmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false); // State for payment modal

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
    setFormData(admission); // Set the selected admission data to form
  };

  const closeModal = () => {
    setSelectedAdmission(null);
    setFormData({});
    setPaymentModalOpen(false); // Close payment modal when editing
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, ...dataToUpdate } = formData; // Remove id from formData
    const admissionsRef = ref(database, `userTypes/${selectedAdmission.id}`);

    // Log the data before updating
    console.log("Updating admission with ID:", selectedAdmission.id);
    console.log("Data being sent for update:", dataToUpdate);
    
    update(admissionsRef, dataToUpdate)
      .then(() => {
        console.log("Update successful");
        closeModal(); // Close the modal after successful update
      })
      .catch((error) => console.error("Error updating admission: ", error));
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admissions List</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded w-1/3 px-3 py-2"
        />
      </div>
      <table className="min-w-full text-sm text-left border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">Account ID</th>
            <th className="border border-gray-200 px-4 py-2">First Name</th>
            <th className="border border-gray-200 px-4 py-2">Last Name</th>
            <th className="border border-gray-200 px-4 py-2">Status</th>
            <th className="border border-gray-200 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAdmissions.map((admission) => (
            <tr key={admission.id}>
              <td className="border border-gray-200 px-4 py-2">{admission.id}</td>
              <td className="border border-gray-200 px-4 py-2">{admission.firstName}</td>
              <td className="border border-gray-200 px-4 py-2">{admission.lastName}</td>
              <td className="border border-gray-200 px-4 py-2">{admission.status}</td>
              <td className="border border-gray-200 px-4 py-2">
                <button
                  onClick={() => openModal(admission)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                {admission.status === 'Accepted' && (
                  <button
                    onClick={() => {
                      setSelectedAdmission(admission); // Set the selected admission for payment
                      setPaymentModalOpen(true);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded" 
                  >
                    <HiCreditCard className="inline-block mr-1" />
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <nav>
        <ul className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredAdmissions.length / itemsPerPage) }, (_, index) => (
            <li key={index + 1} className="mx-1">
              <button
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Edit Admission Modal */}
      {selectedAdmission && !paymentModalOpen && (
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

      {/* Payment Modal */}
      {paymentModalOpen && selectedAdmission && (
        <PaymentModal
          id={selectedAdmission.id} // Pass the id as id to PaymentModal
          onClose={() => {
            setPaymentModalOpen(false);
            closeModal(); // Close the Edit modal if it was open
          }}
        />
      )}
    </div>
  );
};

export default AdmissionsList;
