'use client';
import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../../../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from 'next-auth/react';

const AddNoticeForm = ({ onClose }) => {
  const { data: session } = useSession();
  const postedBy = session.user.name;

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [postedByState, setPostedBy] = useState(postedBy); // Corrected state name
  const [date, setDate] = useState("");
  const [audience, setAudience] = useState("all"); // Add new state for audience

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const noticeData = {
      title,
      details,
      postedBy: postedByState,
      date,
      audience // Add audience to notice data
    };

    try {
      await push(ref(database, "notices"), noticeData);
      toast.success("Notice added successfully!");
      // Clear the form
      setTitle("");
      setDetails("");
      setPostedBy(postedBy); // Reset postedBy to session user's name
      setDate("");
      // Close the modal
      if (onClose) onClose();
    } catch (error) {
      console.error("Error adding notice: ", error);
      toast.error("Failed to add notice. Please try again.");
    }
  };

  return (
    <div className="bg-white  p-4 ml-0 m-2 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        type="button"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <div className="text-2xl font-bold pb-4">Create A Notice</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="5"
            minRows="5"
          />
        </div>
        <div>
          <input
            type="hidden"
            value={postedByState} // Use postedByState here
            onChange={(e) => setPostedBy(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All</option>
            <option value="teachers">Teachers</option>
            <option value="students">Students</option>
            <option value="parents">Parents</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Notice
        </button>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AddNoticeForm;
