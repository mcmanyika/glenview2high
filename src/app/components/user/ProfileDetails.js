import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import fetchUserType from '../../../../utils/fetchUserType';
import { useRouter } from 'next/router';

const ProfileDetails = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userType, setUserType] = useState('');
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  const renderProfileDetails = () => {
    switch (userType) {
      case 'student':
        return (
          <>
            <div>
              <strong>Student ID:</strong> {profileData.studentId}
            </div>
            <div>
              <strong>Level:</strong> {profileData.course}
            </div>
          </>
        );
      case 'teacher':
        return (
          <>
            <div>
              <strong>Employee ID:</strong> {profileData.employeeId}
            </div>
            <div>
              <strong>Subject:</strong> {profileData.subject}
            </div>
          </>
        );
      case 'staff':
        return (
          <>
            <div>
              <strong>Employee ID:</strong> {profileData.employeeId}
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
    return <div></div>;
  }

  return (
    <div className="pt-5">
      <div className="p-4 border rounded-md">
        {renderProfileDetails()}
      </div>
    </div>
  );
};

export default ProfileDetails;
