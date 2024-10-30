import React, { useState, useEffect } from 'react';

const EditPostModal = ({ isOpen, onClose, post, onPostUpdate }) => {
  const [updatedPost, setUpdatedPost] = useState(post);

  useEffect(() => {
    if (post) {
      setUpdatedPost(post); // Pre-fill the form when the modal opens
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPost({ ...updatedPost, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPostUpdate(updatedPost); // Call the handler passed from the BlogList component
    onClose(); // Close the modal after submitting
  };

  if (!isOpen || !updatedPost) return null; // Don't render modal if it's closed or post is null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={updatedPost.title || ''}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={updatedPost.category || ''}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="createdAt">
              Created At
            </label>
            <input
              type="datetime-local"
              id="createdAt"
              name="createdAt"
              value={new Date(updatedPost.createdAt).toISOString().slice(0, 16)}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={updatedPost.status || ''}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
