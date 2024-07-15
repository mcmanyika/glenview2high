import React from 'react';

const TeacherProfile = ({ profileData, handleChange }) => (
  <>
    <div>
      <label htmlFor="employeeId">Employee ID</label>
      <input
        id="employeeId"
        name="employeeId"
        type="text"
        value={profileData.employeeId || ''}
        readOnly
        className="block w-full mt-1 p-2 border rounded-md bg-gray-200"
      />
    </div>
    <div>
      <label htmlFor="department">Department</label>
      <input
        id="department"
        name="department"
        type="text"
        value={profileData.department || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        name="subject"
        type="text"
        value={profileData.subject || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
  </>
);

export default TeacherProfile;
