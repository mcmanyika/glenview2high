import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa'; // Import the spinner icon
import { useGlobalState, setStudentClass } from '../../../store'; // Update import statement

const UserProfileDisplay = ({ userEmail }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setGlobalStudentClass] = useGlobalState('studentClass'); // Access setGlobalState for studentClass

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = ref(database, `users/${userEmail.replace('.', '_')}/profile`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Fetched profile data:', data); // Debug message
          setProfileData(data);
          if (data.studentclass) {
            setGlobalStudentClass(data.studentclass); // Update studentClass in global state if available
          }
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
  }, [userEmail, setGlobalStudentClass]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center mt-4">No profile data found.</div>;
  }

  return (
    <div className="text-sm w-full  font-thin font-sans p-4 bg-white border shadow-sm rounded">
      <div className="flex flex-col mb-4">
        <div className="flex items-center mb-2">
          <div className="w-2/4">Student ID:</div>
          <div className="w-2/4 capitalize font-semibold">{profileData.studentId}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Level:</div>
          <div className="w-2/4 capitalize">{profileData.level}</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-2/4">Class:</div>
          <div className="w-2/4 capitalize">{profileData.studentclass}</div>
        </div>
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
