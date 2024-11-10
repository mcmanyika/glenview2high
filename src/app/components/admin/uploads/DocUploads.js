import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { storage, database } from '../../../../../utils/firebaseConfig';
import { ref, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DocUploads = ({ closeModal }) => {
  const { data: session } = useSession();
  const [fileInputs, setFileInputs] = useState([{ file: null }]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Handle file selection and set state
  const handleDocumentUpload = (index, e) => {
    const file = e.target.files[0];
    setFileInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index].file = file;
      return newInputs;
    });
  };

  // Add new file input
  const addFileInput = () => {
    setFileInputs((prevInputs) => [...prevInputs, { file: null }]);
  };

  // Upload a file and return its download URL
  const uploadFileAndGetUrl = async (file, path) => {
    try {
      const fileRef = storageRef(storage, path);
      console.log(`Uploading file to path: ${path}`); // Logging the file path
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      console.log(`File uploaded successfully to: ${fileUrl}`); // Log file URL
      return fileUrl;
    } catch (error) {
      console.error(`Error uploading file ${file.name} to ${path}:`, error);
      throw new Error(`Failed to upload ${file.name}`);
    }
  };

  // Enable or disable submit button based on file selections
  useEffect(() => {
    const allDocumentsUploaded = fileInputs.every((input) => input.file !== null);
    setIsSubmitDisabled(!allDocumentsUploaded);
  }, [fileInputs]);

  // Sanitize email for Firebase paths
  const sanitizeEmail = (email) => email.replace(/\./g, ',');

  // Handle form submission and upload files
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session || !session.user.email) {
      toast.error("User is not logged in.");
      return;
    }

    try {
      const sanitizedEmail = sanitizeEmail(session.user.email);
      const dbRef = ref(database, `enrollments/${sanitizedEmail}/additionalDocuments`);

      // Upload documents and get URLs
      const documentUrls = await Promise.all(
        fileInputs.map(async (input, index) => {
          if (input.file) {
            const filePath = `enrollment_documents/${sanitizedEmail}/document_${index + 1}`;
            return { [`document_${index + 1}`]: await uploadFileAndGetUrl(input.file, filePath) };
          }
          return null;
        })
      ).then((results) => results.reduce((acc, curr) => ({ ...acc, ...curr }), {}));

      // Save URLs to Firebase database
      console.log('Uploading document URLs to database:', documentUrls); // Logging data
      await set(dbRef, documentUrls);

      toast.success('Documents uploaded successfully!');
      setFileInputs([{ file: null }]);
      setIsSubmitDisabled(true);

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error during document submission:', error);
      toast.error(`Failed to submit documents: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-semibold mb-4">Document Uploads</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {fileInputs.map((input, index) => (
              <div key={index}>
                <label className="block text-gray-700 mb-1">Upload Document {index + 1}</label>
                <input
                  type="file"
                  onChange={(e) => handleDocumentUpload(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addFileInput}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Add Another Document
          </button>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitDisabled}
            >
              Submit Documents
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocUploads;
