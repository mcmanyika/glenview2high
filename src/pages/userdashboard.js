import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import withAuth from '../../utils/withAuth';
import AdminLayout from './admin/adminLayout';
import fetchUserType from '../../utils/fetchUserType';
import StudentProfileDisplay from '../app/components/user/utils/StudentProfileDisplay';
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner
import NoticeList from '../app/components/notice/NoticeList';
import NoticeCount from '../app/components/notice/NoticeCount';

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
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-blue-400 text-4xl" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 lg:w-1/3 ">
          <StudentProfileDisplay userEmail={session.user.email} />
        </div>
        <div className="w-full md:w-1/2 lg:w-2/3 mt-3 md:mt-0 md:mr-4">
          <NoticeCount />
          {/* <div className='md:p-4 md:pr-0'>
            <div className='w-full bg-white border shadow-sm h-96'>
              &nbsp;
            </div>
          </div> */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(UserDashboard);
