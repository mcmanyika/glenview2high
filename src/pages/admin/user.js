import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import UserTypeSelector from '../../app/components/user/UserType'; // Adjust the path to your UserTypeSelector component
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import withAuth from '../../../utils/withAuth';
import Image from 'next/image';
import Link from 'next/link';

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
      <Link href='https://glenview2high.com'>
          <Image
            src="/images/logo.png"
            alt=""
            width={90}
            height={90}
            className="mx-auto mb-4 rounded-full"
          />
          </Link>
      {userEmail && <UserTypeSelector userEmail={userEmail} />}
    </SmartBlankLayout>
  );
};

export default withAuth(User);
