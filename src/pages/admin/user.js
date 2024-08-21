import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserTypeSelector from '../../app/components/user/UserType'; // Adjust the path to your UserTypeSelector component
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import withAuth from '../../../utils/withAuth';

const User = () => {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (session && session.user) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  return (
    <SmartBlankLayout>
    <div>
      {userEmail && <UserTypeSelector userEmail={userEmail} />}
    </div>
    </SmartBlankLayout>
  );
};

export default withAuth(User);
