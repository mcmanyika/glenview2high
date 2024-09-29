// StatusModal.js
import React, { useState, useEffect } from 'react';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the path if needed
import { ref, update } from 'firebase/database';
import { toast } from 'react-toastify';

const StatusModal = ({ isOpen, onClose, post, onStatusUpdate }) => {
  const [status, setStatus] = useState('Draft'); // Default status

  useEffect(() => {
    if (post) {
      setStatus(post.status || 'Draft'); // Set status from post if available
    }
  }, [post]);

  const handleStatusChange = async () => {
    if (!post) return; // Prevent further execution if post is null

    const postRef = ref(database, `blogs/${post.id}`);
    try {
      await update(postRef, { status });
      onStatusUpdate(post.id, status); // Update the local state in BlogList
      toast.success('Status updated successfully!');
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Update Status</h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-4 py-2 w-full mb-4"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
        <div className="flex justify-between">
          <button
            onClick={handleStatusChange}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
