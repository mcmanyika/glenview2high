import React, { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig file
import { FaSpinner } from 'react-icons/fa';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalContacts, setTotalContacts] = useState(0);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const contactsRef = ref(database, 'contacts');
    onValue(contactsRef, (snapshot) => {
      const contactsData = snapshot.val();
      if (contactsData) {
        const contactsArray = Object.keys(contactsData)
          .map(key => ({
            id: key,
            ...contactsData[key],
          }))
          .reverse(); // Reverse the array for descending order
        setTotalContacts(contactsArray.length);
        setContacts(contactsArray.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      } else {
        setContacts([]);
        setTotalContacts(0);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching contacts:', error);
      setIsLoading(false);
    });
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < totalContacts) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      closeModal();
    }
  };

  const handleDeleteContact = async (id) => {
    const contactRef = ref(database, `contacts/${id}`);
    try {
      await remove(contactRef);
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      closeModal(); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return <div className="text-center mt-4">No contacts found.</div>;
  }

  return (
    <div className="md:container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Contacts List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white">
          <thead>
            <tr className='text-left'>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr 
                key={contact.id} 
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(contact)}
              >
                <td className="py-2 px-4 border-b">{contact.name}</td>
                <td className="py-2 px-4 border-b">{contact.email}</td>
                <td className="py-2 px-4 border-b">{new Date(contact.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-l hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage * itemsPerPage >= totalContacts}
          className="px-4 py-2 bg-gray-300 rounded-r hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for displaying contact details */}
      {isModalOpen && (
        <div 
          id="modal-overlay" 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-8 rounded shadow-md w-1/2"> {/* Increased width */}
            <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
            <p><strong>Name:</strong> {selectedContact?.name}</p>
            <p><strong>Email:</strong> {selectedContact?.email}</p>
            <p><strong>Message:</strong> {selectedContact?.message}</p>
            <p><strong>Submitted At:</strong> {new Date(selectedContact?.submittedAt).toLocaleString()}</p>
            <div className="flex justify-between mt-4">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
              <button 
                onClick={() => handleDeleteContact(selectedContact.id)} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
