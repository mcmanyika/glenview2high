import { useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import NoticeCount from '../../app/components/notice/NoticeCount';
import Teachers from '../../app/components/teachers/utils/Teachers';

const TeacherDashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full px-2">
          <NoticeCount />
          <div className="w-full flex flex-col mt-4">
            <div className="bg-white border shadow-sm rounded m-2 p-4">
              <Teachers />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
}
