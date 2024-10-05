'use client';
import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../../../../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from 'next-auth/react';

const UploadClassNameForm = () => {
  const { data: session } = useSession();
  const uploadedBy = session?.user?.email || ""; // Safeguard in case session is not loaded

  const [className, setClassName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className) {
      toast.error("Please select a class name.");
      return;
    }

    const classData = {
      className,
      uploadedBy,
    };

    try {
      await push(ref(database, "classes"), classData);
      toast.success("Class name uploaded successfully!");
      // Clear the form after submission
      setClassName("");
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
          <div className="mt-2 grid grid-cols-3 gap-4">
            {["1A", "2A", "3A", "4A", "5A", "6A"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  value={option}
                  checked={className === option}
                  onChange={(e) => setClassName(e.target.value)}
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
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
