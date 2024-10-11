// components/EditAdmissionForm.js

import React from 'react';

const EditAdmissionForm = ({ formData, handleInputChange, handleSubmit, closeModal }) => {
  return (
    <form onSubmit={handleSubmit}>
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
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
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
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
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
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          />
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
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        {/* <div>
          <label className="block mb-2">Student Number</label>
          <input
            type="text"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleInputChange}
            className="border rounded w-full px-3 py-2"
            disabled
          />
        </div> */}
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
