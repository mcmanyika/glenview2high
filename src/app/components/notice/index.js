import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../../../../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

const AddNoticeForm = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const { data: session } = useSession(); // Retrieve session information

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!session) {
      toast.error("You need to be logged in to add a notice.");
      return;
    }

    // Check if required fields are filled
    if (!title || !details || !date) {
      toast.error("Please fill in all fields.");
      return;
    }

    const postedBy = session.user.name; // Assuming 'name' is available in session
    console.log(postedBy)
    try {
      const noticesRef = ref(database, "notices");
      const newNoticeRef = push(noticesRef);
      await newNoticeRef.set({
        title,
        details,
        posted_by: postedBy,
        date,
      });
      console.log("Notice added with ID: ", newNoticeRef.key);
      toast.success("Notice added successfully!");
      // Clear the form
      setTitle("");
      setDetails("");
      setDate("");
    } catch (error) {
      console.error("Error adding notice: ", error);
      toast.error("Failed to add notice. Please try again.");
    }
  };

  return (
    <>
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
    </>
  );
};

export default AddNoticeForm;
