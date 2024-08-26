
import withAuth from '../../../utils/withAuth';
import AdminLayout from './administratorLayout';
import GenderCount from '../../app/components/admin/admissions/GenderCount';
import NoticeList from '../../app/components/notice/NoticeList';
import AllStudents from '../../app/components/student/AllStudents';

const AdminDashboard = () => {

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full">
          <GenderCount />
          <div className="w-full flex  mt-4">
            <div className="flex-1 bg-white border mr-1 shadow-sm rounded p-4">
            <AllStudents />
            </div>
            <div className="flex-1 bg-white border ml-1 shadow-sm rounded p-4">
            <h2 className="text-xl font-semibold mb-4">Events Board</h2>
              <NoticeList />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard);

