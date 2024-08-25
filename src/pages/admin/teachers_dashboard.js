import { useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './teacherLayout';
import NoticeCount from '../../app/components/notice/NoticeCount';
import Students from '../../app/components/teachers/utils/Students';

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
              <Students />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);

