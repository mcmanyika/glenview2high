import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';
import { ref, get, remove } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { setUserID } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const PAGE_SIZE = 12; // Change to limit to 12 contacts per page

const ContactUs = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email;
          const userRef = ref(database, 'userTypes');
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const users = snapshot.val();
            const foundUserID = Object.keys(users).find(id => users[id].email === userEmail);
            if (foundUserID) {
              const userData = users[foundUserID];
              setUserType(userData.userType);
              setUserID(foundUserID);
            } else {
              console.log('No user found with this email.');
              router.push('/admin/user');
            }
          } else {
            console.log('No user types found.');
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
          setError('Error fetching user type. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      const fetchContacts = async () => {
        try {
          const contactsRef = ref(database, 'contacts'); // Reference to the contacts node
          const snapshot = await get(contactsRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            const contactsArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key],
            }));

            // Sort contacts by submittedAt in descending order
            contactsArray.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

            setContacts(contactsArray);
          } else {
            console.log('No contacts found.');
          }
        } catch (error) {
          console.error('Error fetching contacts:', error);
          setError('Error fetching contacts. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchUserType();
      fetchContacts();
    }
  }, [status, session, router]);

  const openModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (contactId) => {
    try {
      const contactRef = ref(database, `contacts/${contactId}`);
      await remove(contactRef);
      setContacts(contacts.filter(contact => contact.id !== contactId));
      closeModal(); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('Error deleting contact. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-blue-500 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Calculate the current contacts to display based on pagination
  const indexOfLastContact = currentPage * PAGE_SIZE;
  const indexOfFirstContact = indexOfLastContact - PAGE_SIZE;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  // Calculate total pages
  const totalPages = Math.ceil(contacts.length / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className='bg-white p-4'>
        <h1 className='p-5 text-3xl'>Latest Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {currentContacts.map(contact => (
            <div 
              key={contact.id} 
              className="p-4 border rounded shadow-md bg-white cursor-pointer hover:bg-blue-100 transition duration-200" // Added hover effect
              onClick={() => openModal(contact)}
            >
              <h2 className="font-bold text-lg">{contact.name}</h2>
              <p className="text-gray-700"><strong>Email:</strong> {contact.email}</p>
              <p className="text-gray-700 truncate"><strong>Message:</strong> {contact.message}</p>
              <p className="text-gray-500 text-sm"><strong>Submitted At:</strong> {new Date(contact.submittedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-l"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">{currentPage} / {totalPages}</span>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-r"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="font-bold text-2xl mb-2">{selectedContact.name}</h2>
            <p className="text-gray-700"><strong>Email:</strong> {selectedContact.email}</p>
            <p className="text-gray-700"><strong>Message:</strong> {selectedContact.message}</p>
            <p className="text-gray-500 text-sm"><strong>Submitted At:</strong> {new Date(selectedContact.submittedAt).toLocaleString()}</p>
            <div className="flex justify-between mt-4">
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleDelete(selectedContact.id)} // Call delete function
              >
                Delete
              </button>
              <button 
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default withAuth(ContactUs);
