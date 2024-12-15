import React, { useState, useEffect } from 'react';
import { database } from '../../../../../utils/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { useSession } from 'next-auth/react';
import { HiCreditCard } from 'react-icons/hi';
import EditAdmissionForm from './EditAdmissionForm';
import PaymentModal from './PaymentModal';

const AdmissionsList = () => {
  const { data: session } = useSession();
  const [admissions, setAdmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    const admissionsRef = ref(database, 'userTypes');
    const unsubscribe = onValue(admissionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const admissionsArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter(admission => admission.userType === 'student');
        setAdmissions(admissionsArray);
      } else {
        setAdmissions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredAdmissions = admissions.filter((admission) =>
    Object.values(admission).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastAdmission = currentPage * itemsPerPage;
  const indexOfFirstAdmission = indexOfLastAdmission - itemsPerPage;
  const currentAdmissions = filteredAdmissions.slice(indexOfFirstAdmission, indexOfLastAdmission);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (admission) => {
    setSelectedAdmission(admission);
    setFormData(admission);
  };

  const closeModal = () => {
    setSelectedAdmission(null);
    setFormData({});
    setPaymentModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...dataToUpdate } = formData;
      const admissionsRef = ref(database, `userTypes/${selectedAdmission.id}`);
      await update(admissionsRef, dataToUpdate);
      closeModal();
    } catch (error) {
      console.error("Error updating admission: ", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Total Admissions: {filteredAdmissions.length}
        </h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border dark:border-gray-600 rounded w-1/3 px-3 py-2 
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Account ID</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">First Name</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Last Name</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentAdmissions.map((admission) => (
              <tr key={admission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => openModal(admission)}>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{admission.id}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 capitalize">{admission.firstName}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 capitalize">{admission.lastName}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{admission.status}</td>
                {/* <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(admission)}
                    className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 
                      dark:hover:bg-yellow-700 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button> */}
                  {/* {admission.status === 'Accepted' && (
                    <button
                      onClick={() => {
                        setSelectedAdmission(admission);
                        setPaymentModalOpen(true);
                      }}
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 
                        dark:hover:bg-green-700 text-white px-2 py-1 rounded"
                    >
                      <HiCreditCard className="inline-block mr-1" />
                      Pay
                    </button>
                  )} */}
                {/* </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredAdmissions.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? 'bg-blue-500 dark:bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedAdmission && !paymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Edit Admission
            </h2>
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
          id={selectedAdmission.id}
          onClose={() => {
            setPaymentModalOpen(false);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default AdmissionsList;
