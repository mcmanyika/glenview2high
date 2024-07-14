import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import withAuth from '../../utils/withAuth';
import AdminLayout from './admin/adminLayout';
import fetchUserType from '../../utils/fetchUserType';

const Dashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const checkUserType = async () => {
        const userType = await fetchUserType(session.user.email);
        if (!userType) {
          router.push('/user'); // Adjust the path to your user type selector page
        } else {
          setLoading(false);
        }
      };
      checkUserType();
    }
  }, [session, router]);

  

  return (
    <AdminLayout>
    </AdminLayout>
  );
};

export default withAuth(Dashboard);
