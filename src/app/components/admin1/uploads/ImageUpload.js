import React, { useState } from 'react';
import { storage, database } from '../../../../../utils/firebaseConfig'; // Adjust the path as necessary
import { ref, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState(''); // State for title
  const [description, setDescription] = useState(''); // State for description
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !title || !description) {
      setError('Please fill in all fields and select an image.');
      return;
    }

    setUploading(true);
    const imageRef = storageRef(storage, `images/`);
    
    try {
      // Upload the image to Firebase Storage
      await uploadBytes(imageRef, selectedImage);
      
      // Get the download URL of the uploaded image
      const url = await getDownloadURL(imageRef);
      
      // Store the image URL along with title and description in Firebase Realtime Database
      await set(ref(database, 'images/' + selectedImage.name), {
        url,
        name: selectedImage.name,
        title,
        description,
        createdAt: new Date().toISOString()
      });
      
      // Reset the state after successful upload
      setSelectedImage(null);
      setTitle(''); // Reset title
      setDescription(''); // Reset description
      setError('');
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container p-4 border border-gray-300 rounded">
      <h2 className="text-2xl mb-4">Upload Image</h2>
      <input type="file" onChange={handleImageChange} className="mb-4" />
      {selectedImage && (
        <div className="mb-4">
          <p>Selected File: {selectedImage.name}</p>
        </div>
      )}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block mb-2 w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block mb-4 w-full p-2 border border-gray-300 rounded"
        rows="4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`mt-2 p-2 bg-blue-500 text-white rounded ${uploading ? 'opacity-50' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
