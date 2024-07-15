import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';

const UserProfileDisplay = ({ userEmail }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = ref(database, `users/${userEmail.replace('.', '_')}/profile`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Fetched profile data:', data); // Debug message
          setProfileData(data);
        } else {
          console.log('No profile data found.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchUserProfile();
    }
  }, [userEmail]);

  if (isLoading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!profileData) {
    return <div className="text-center mt-4">No profile data found.</div>;
  }

  return (
    <div className="text-sm w-full md:text-lg font-thin p-4 md:p-8">
      <h1 className="text-xl md:text-2xl pb-4">About Me</h1>
      <div className="flex flex-col mb-4">
        <div className="flex items-center mb-2">
          <div className="w-2/4">Name:</div>
          <div className="w-2/4 capitalize">{profileData.firstName} {profileData.lastName}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Gender:</div>
          <div className="w-2/4 capitalize">{profileData.gender}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Email:</div>
          <div className="w-2/4">{profileData.email}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Address:</div>
          <div className="w-2/4 capitalize">{profileData.address}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Date of Birth:</div>
          <div className="w-2/4">{profileData.dateOfBirth}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Parent/Guardian Name:</div>
          <div className="w-2/4 capitalize">{profileData.parentName}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Parent/Guardian Contact:</div>
          <div className="w-2/4 capitalize">{profileData.parentContact}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDisplay;
