import React, { useState } from 'react';
import { ref, push } from 'firebase/database'; // Use push instead of set
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DictionaryForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dictRef = ref(database, `t_dict`); // Reference to the t_dict table

    try {
      // Use push to create a new entry with a unique ID
      await push(dictRef, {
        title: title,
        category: category,
      });
      // Show success toast
      toast.success('Entry added successfully!', {
        position: 'bottom-center', // Use string for position
      });
    } catch (error) {
      // Show error toast
      toast.error('Failed to add entry: ' + error.message, {
        position: 'bottom-center', // Use string for position
      });
    }

    // Clear the form after submission
    setTitle('');
    setCategory('');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Background Circle (optional, you can move this elsewhere if needed) */}
      <div className="absolute top-0 right-0 bg-blue-100 w-96 h-96 rounded-full  m-4"></div>
      
      {/* Form */}
      <div className="max-w-lg p-6 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Add to Dictionary</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default DictionaryForm;
