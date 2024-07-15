import React from 'react';

const ParentProfile = ({ profileData, handleChange }) => (
  <>
    <div>
      <label htmlFor="studentName">Student Name</label>
      <input
        id="studentName"
        name="studentName"
        type="text"
        value={profileData.studentName || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="relation">Relation</label>
      <input
        id="relation"
        name="relation"
        type="text"
        value={profileData.relation || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
  </>
);

export default ParentProfile;
