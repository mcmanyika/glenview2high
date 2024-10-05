// components/AllocateClassToTeacher.js
'use client';
import { useEffect, useState } from "react";
import { ref, push, onValue } from "firebase/database";
import { database } from "../../../../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from 'next-auth/react';

const AllocateClassToTeacher = () => {
  const { data: session } = useSession();
  const uploadedBy = session?.user?.email || ""; // Safeguard in case session is not loaded

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    const classesRef = ref(database, "classes");
    const userTypesRef = ref(database, "userTypes"); // Base reference for user types

    // Fetch classes from Firebase
    onValue(classesRef, (snapshot) => {
      const classList = [];
      snapshot.forEach((childSnapshot) => {
        const classData = childSnapshot.val();
        classList.push(classData.className);
      });
      setClasses(classList);
    });

    // Fetch teachers from Firebase where userType is 'teacher'
    const fetchTeachers = async () => {
      const teacherList = [];
      // Assuming you have a way to fetch all userIDs for teachers
      const userIDsRef = ref(database, "userTypes");

      onValue(userIDsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.userType === "teacher") {
            teacherList.push({
              fullName: `${userData.firstname} ${userData.lastname}`, // Combine names
              id: childSnapshot.key // Store the key for allocation
            });
          }
        });
        setTeachers(teacherList);
      });
    };

    fetchTeachers();
  }, []);

  const handleAllocateClass = async (e) => {
    e.preventDefault();

    if (!selectedClass || !selectedTeacher) {
      toast.error("Please select both a class and a teacher.");
      return;
    }

    const allocationData = {
      className: selectedClass,
      allocatedTo: selectedTeacher,
      allocatedBy: uploadedBy,
    };

    try {
      await push(ref(database, "classAllocations"), allocationData); // Adjust the path if needed
      toast.success("Class allocated successfully!");
      // Clear the selections after submission
      setSelectedClass("");
      setSelectedTeacher("");
    } catch (error) {
      console.error("Error allocating class: ", error);
      toast.error("Failed to allocate class. Please try again.");
    }
  };

  return (
    <div className="bg-white border shadow-sm rounded p-4 ml-0 m-2">
      <div className="text-2xl font-bold pb-4">Allocate Class to Teacher</div>
      <form onSubmit={handleAllocateClass} className="space-y-4">
        <div>
          <label className="block">Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mt-2 border rounded p-2 w-full"
          >
            <option value="">-- Select a Class --</option>
            {classes.map((className, index) => (
              <option key={index} value={className}>{className}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Select Teacher:</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="mt-2 border rounded p-2 w-full"
          >
            <option value="">-- Select a Teacher --</option>
            {teachers.map((teacher, index) => (
              <option key={index} value={teacher.id}>{teacher.fullName}</option> // Use the id for the value
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Allocate Class
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

export default AllocateClassToTeacher;
