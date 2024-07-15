import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import fetchUserType from '../../../../utils/fetchUserType';
import { useRouter } from 'next/router';
import UserProfile from './UserProfile';
import ProfileCard from '../student/ProfileCard';

const ProfileDetails = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userType, setUserType] = useState('');
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        const userType = await fetchUserType(session.user.email);
        setUserType(userType);

        const profileRef = ref(database, `users/${session.user.email.replace('.', '_')}/profile`);
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          setProfileData(snapshot.val());
        } else {
          router.push('/userprofile'); // Redirect to user profile if profile does not exist
        }
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session, router]);

  const handleEditProfile = () => {
    setShowOverlay(true);
  };

  const renderProfileDetails = () => {
    switch (userType) {
      case 'student':
        return (
          <>
            <div className="flex items-center justify-between">
              <strong>Student ID:</strong>
              <span 
                className="font-medium text-blue-500 cursor-pointer" 
                onClick={handleEditProfile}
              >
                {profileData.studentId}
              </span>
            </div>
            <div>
              <strong>Course:</strong> {profileData.course}
            </div>
          </>
        );
      case 'teacher':
        return (
          <>
            <div className="flex items-center justify-between">
              <strong>Employee ID:</strong>
              <span 
                className="font-medium text-blue-500 cursor-pointer" 
                onClick={handleEditProfile}
              >
                {profileData.employeeId}
              </span>
            </div>
            <div>
              <strong>Subject:</strong> {profileData.subject}
            </div>
          </>
        );
      case 'staff':
        return (
          <>
            <div className="flex items-center justify-between">
              <strong>Employee ID:</strong>
              <span 
                className="font-medium text-blue-500 cursor-pointer" 
                onClick={handleEditProfile}
              >
                {profileData.employeeId}
              </span>
            </div>
            <div>
              <strong>Department:</strong> {profileData.department}
            </div>
          </>
        );
      case 'parent':
        return (
          <>
            <div>
              <strong>Student Name:</strong> {profileData.studentName}
            </div>
            <div>
              <strong>Relation:</strong> {profileData.relation}
            </div>
          </>
        );
      case 'contractor':
        return (
          <>
            <div>
              <strong>Company Name:</strong> {profileData.companyName}
            </div>
            <div>
              <strong>Service:</strong> {profileData.service}
            </div>
          </>
        );
      default:
        return <div>No profile data available</div>;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-5">
      <div className="p-4 border rounded-md">
        {renderProfileDetails()}
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-blue-400 z-50 flex items-center justify-center transition-transform transform translate-x-0 duration-500">
          <div className="absolute top-0 right-0 p-4">
            <button
              className="text-2xl"
              onClick={() => setShowOverlay(false)}
            >
              &times;
            </button>
          </div>
          <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
            <ProfileCard />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
