import React, { useEffect, useState } from 'react';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the path as necessary
import { ref, onValue } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrls, setFileUrls] = useState({}); // To store file URLs

  useEffect(() => {
    const fetchApplicants = () => {
      const dbRef = ref(database, 'enrollments/');
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const applicantsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setApplicants(applicantsArray);
        } else {
          setApplicants([]);
        }
      }, (error) => {
        console.error('Error fetching applicants:', error);
        toast.error('Failed to fetch applicants');
      });
    };

    fetchApplicants();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleApplicantClick = (applicant) => {
    fetchFiles(applicant.contactEmail, applicant.id); // Fetch files for the clicked applicant
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const fetchFiles = async (contactEmail, applicantId) => {
    const storage = getStorage();
    const files = []; // Array to hold the file objects

    try {
      // Construct the file path
      const filePath = `enrollment_documents/${contactEmail}`;
      // Simulate fetching file names (this could come from your database)
      const fileNames = ["Application_Form.pdf", "Report_Card.pdf"]; // Example file names

      // Fetch each file URL
      for (const fileName of fileNames) {
        const fileRef = storageRef(storage, `${filePath}/${fileName}`);
        const url = await getDownloadURL(fileRef);
        files.push({ name: fileName, url });
      }
      
      // Update state with fetched file URLs
      setFileUrls((prev) => ({
        ...prev,
        [applicantId]: files,
      }));
    } catch (error) {
      console.error('Error fetching file URLs:', error);
      toast.error('Failed to fetch file URLs');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const filteredApplicants = applicants.filter((applicant) =>
    applicant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Applicants List</h2>
      <input
        type="text"
        placeholder="Search by email or parent name..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-1/2 p-2 border border-gray-300 rounded mb-4"
      />
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Enrollment Date</th>
              <th className="border border-gray-300 p-2">Class Level</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Parent Name</th>
              <th className="border border-gray-300 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleApplicantClick(applicant)}>
                  <td className="border border-gray-300 p-2">{applicant.id}</td>
                  <td className="border border-gray-300 p-2">{applicant.enrollmentDate}</td>
                  <td className="border border-gray-300 p-2">{applicant.studentClassLevel}</td>
                  <td className="border border-gray-300 p-2">{applicant.contactEmail}</td>
                  <td className="border border-gray-300 p-2">{applicant.parentName}</td>
                  <td className="border border-gray-300 p-2">{applicant.parentPhone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center border border-gray-300 p-2">No applicants found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing attached files */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Attached Files"
        ariaHideApp={false}
        className="w-full max-w-lg mx-auto p-4 bg-white rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-lg font-semibold mb-2">Attached Files for {selectedApplicant?.parentName}</h2>
        <button onClick={closeModal} className="text-red-500 mb-4">Close</button>
        {selectedApplicant && fileUrls[selectedApplicant.id] && fileUrls[selectedApplicant.id].length > 0 ? (
          <ul>
            {fileUrls[selectedApplicant.id].map((file, index) => (
              <li key={index} className="border-b border-gray-300 p-2">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files attached for this applicant.</p>
        )}
      </Modal>
    </div>
  );
};

export default ApplicantsList;
