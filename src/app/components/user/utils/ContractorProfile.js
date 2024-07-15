import React from 'react';

const ContractorProfile = ({ profileData, handleChange }) => (
  <>
    <div>
      <label htmlFor="companyName">Company Name</label>
      <input
        id="companyName"
        name="companyName"
        type="text"
        value={profileData.companyName || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
    <div>
      <label htmlFor="service">Service</label>
      <input
        id="service"
        name="service"
        type="text"
        value={profileData.service || ''}
        onChange={handleChange}
        className="block w-full mt-1 p-2 border rounded-md"
      />
    </div>
  </>
);

export default ContractorProfile;
