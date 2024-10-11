import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig
import { toast } from 'react-toastify'; // Import toast for notifications

const EditAdmissionForm = ({ formData, handleInputChange, handleSubmit, closeModal }) => {
  const [classOptions, setClassOptions] = useState([]);
  const [filteredClassOptions, setFilteredClassOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [religionOptions, setReligionOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]); // State for status options

  useEffect(() => {
    const fetchClasses = async () => {
      const classRef = ref(database, 't_dict'); // Reference to the t_dict table
      onValue(classRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const classArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setClassOptions(classArray);
        } else {
          setClassOptions([]);
        }
      });
    };

    const fetchGenderAndReligion = async () => {
      const genderRef = ref(database, 't_dict'); // Reference to the t_dict table
      onValue(genderRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const genderArray = Object.keys(data)
            .filter(key => data[key].category === 'Gender')
            .map(key => ({
              id: key,
              ...data[key],
            }));
          setGenderOptions(genderArray);

          const religionArray = Object.keys(data)
            .filter(key => data[key].category === 'Religion')
            .map(key => ({
              id: key,
              ...data[key],
            }));
          setReligionOptions(religionArray);

          const statusArray = Object.keys(data)
            .filter(key => data[key].category === 'Account Status') // Fetching status
            .map(key => ({
              id: key,
              ...data[key],
            }));
          setStatusOptions(statusArray); // Set status options
        } else {
          setGenderOptions([]);
          setReligionOptions([]);
          setStatusOptions([]); // Reset status options
        }
      });
    };

    fetchClasses(); // Call the function to fetch classes
    fetchGenderAndReligion(); // Call the function to fetch gender, religion, and status
  }, []); // Empty dependency array to fetch once on mount

  // Filter classes based on the selected level
  useEffect(() => {
    const filterClassesByLevel = () => {
      const filteredClasses = classOptions.filter(
        (classOption) => classOption.category === 'level' // Match category with the selected level
      );
      setFilteredClassOptions(filteredClasses);
    };

    filterClassesByLevel();
  }, [classOptions, formData.level]); // Run this effect when classOptions or level changes

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    handleSubmit(event); // Call the passed handleSubmit function
    toast.success('Changes saved successfully!'); // Show success toast
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-1 text-sm md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Admission ID</label>
          <input
            type="text"
            name="admissionId"
            value={formData.userID}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
            disabled
          />
        </div>
        <div>
          <label className="block mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="">Select Gender</option>
            {genderOptions.map((genderOption) => (
              <option key={genderOption.id} value={genderOption.title}>
                {genderOption.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-2">Religion</label>
          <select
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="">Select Religion</option>
            {religionOptions.map((religionOption) => (
              <option key={religionOption.id} value={religionOption.title}>
                {religionOption.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-2">Class</label>
          <select
            name="class" // Ensure this matches your formData structure
            value={formData.class} // Ensure this matches your formData structure
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="">Select Class</option>
            {filteredClassOptions.map((classOption) => (
              <option key={classOption.id} value={classOption.title}>
                {classOption.title} {/* Change this if your title field is named differently */}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-2">Status</label>
          <select
            name="status" // Ensure this matches your formData structure
            value={formData.status} // Ensure this matches your formData structure
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="">Select Status</option>
            {statusOptions.map((statusOption) => (
              <option key={statusOption.id} value={statusOption.title}>
                {statusOption.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditAdmissionForm;
