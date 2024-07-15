'use client'
import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../../../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNoticeForm = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noticeData = {
        title,
        details,
        postedBy,
        date
      };

    try {
      await push( ref(database, "notices"), noticeData);
      
      toast.success("Notice added successfully!");
      // Clear the form
      setTitle("");
      setDetails("");
      setPostedBy("");
      setDate("");
    } catch (error) {
      console.error("Error adding notice: ", error);
      toast.error("Failed to add notice. Please try again.");
    }
  };

  return (
    <div className="bg-white border shadow-sm rounded p-4 ml-0 m-2">
        <div className="text-2xl text-bold pb-4">Create A Notice</div>
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Posted By
          </label>
          <input
            type="text"
            value={postedBy}
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
