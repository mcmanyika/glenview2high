import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import withAuth from '../../utils/withAuth';
import AdminLayout from './admin/adminLayout';
import fetchUserType from '../../utils/fetchUserType';
import StudentProfileDisplay from '../app/components/user/utils/StudentProfileDisplay';

const UserDashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const checkUserType = async () => {
        const userType = await fetchUserType(session.user.email);
        if (!userType) {
          router.push('/user'); // Redirect if user type is not found
        } else {
          setLoading(false);
        }
      };
      checkUserType();
    }
  }, [session, router]);

  if (loading) {
    return <p></p>;
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 lg:w-1/3 border shadow-sm rounded mt-5 md:mt-20 p-4">
          <StudentProfileDisplay userEmail={session.user.email} />
        </div>
        <div className="w-full md:w-1/2 lg:w-2/3 mt-3 p-4">
          {/* <h2 className="text-xl font-bold mb-4">Other Content</h2>
          <p>Additional content for the dashboard will come here.</p> */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(UserDashboard);
