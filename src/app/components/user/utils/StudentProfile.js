import React from 'react';

const StudentProfile = ({ profileData, handleChange }) => (
  <>
    <div>
      <label htmlFor="studentId">Student ID</label>
      <input
        id="studentId"
        name="studentId"
        type="text"
        value={profileData.studentId || ''}
        readOnly
        className="block w-full mt-1 p-2 border rounded-md bg-gray-200"
      />
    </div>
    <div>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={profileData.email || ''}
        readOnly
        className="block w-full mt-1 p-2 border rounded-md bg-gray-200"
      />
    </div>
    <div>
      <label htmlFor="level">Level</label>
      <select
        id="level"
        name="level"
        value={profileData.level || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      >
        <option value="">Select Level</option>
        <option value="form 1">Form 1</option>
        <option value="form 2">Form 2</option>
        <option value="form 3">Form 3</option>
        <option value="form 4">Form 4</option>
        <option value="A level">A Level</option>
      </select>
    </div>
    <div>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        value={profileData.firstName || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        value={profileData.lastName || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="gender">Gender</label>
      <select
        id="gender"
        name="gender"
        value={profileData.gender || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    <div>
      <label htmlFor="address">Address</label>
      <input
        id="address"
        name="address"
        type="text"
        value={profileData.address || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="dateOfBirth">Date of Birth</label>
      <input
        id="dateOfBirth"
        name="dateOfBirth"
        type="date"
        value={profileData.dateOfBirth || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="parentName">Parent/Guardian Name</label>
      <input
        id="parentName"
        name="parentName"
        type="text"
        value={profileData.parentName || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="parentContact">Parent/Guardian Contact</label>
      <input
        id="parentContact"
        name="parentContact"
        type="text"
        value={profileData.parentContact || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
  </>
);

export default StudentProfile;
