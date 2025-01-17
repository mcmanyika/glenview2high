'use client';
import React, { useState } from 'react';
import { database } from "../../../../utils/firebaseConfig";
import { ref, push } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTutorial = () => {
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    category: '',
    difficulty: 'beginner',
    instructor: '',
    language: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const tutorialsRef = ref(database, 'tutorials');
      await push(tutorialsRef, {
        ...formData,
        dateAdded: new Date().toISOString(),
        status: 'active',
        views: 0,
        likes: 0
      });
      
      // Reset form
      setFormData({
        title: '',
        youtubeUrl: '',
        thumbnailUrl: '',
        category: '',
        difficulty: 'beginner',
        instructor: '',
        language: ''
      });
      
      toast.success('Tutorial added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding tutorial:', error);
      toast.error('Error adding tutorial', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Tutorial</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
          <input
            type="url"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Tutorial
        </button>
      </div>
    </form>
  );
};

export default AddTutorial; 