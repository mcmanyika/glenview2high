'use client';
import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../../../../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from 'next-auth/react';

const UploadClassNameForm = () => {
  const { data: session } = useSession();
  const uploadedBy = session.user.email; // Use email instead of name

  const [className, setClassName] = useState("");
  const [uploadedByState, setUploadedBy] = useState(uploadedBy); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const classData = {
      className,
      uploadedBy: uploadedByState, 
    };

    try {
      await push(ref(database, "classes"), classData);
      toast.success("Class name uploaded successfully!");
      // Clear the form
      setClassName("");
      setUploadedBy(uploadedBy); // Reset uploadedBy to session user's email
    } catch (error) {
      console.error("Error uploading class name: ", error);
      toast.error("Failed to upload class name. Please try again.");
    }
  };

  return (
    <div className="bg-white border shadow-sm rounded p-4 ml-0 m-2">
      <div className="text-2xl font-bold pb-4">Upload Class Name</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Upload Class Name
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

export default UploadClassNameForm;
