import React, { useState } from 'react';

const StatusModal = ({ isOpen, onClose, post, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(post ? post.status : '');

  const handleSave = () => {
    onStatusUpdate(post.id, newStatus);
    onClose(); // Close the modal
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Update Status</h2>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
