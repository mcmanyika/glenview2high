
import withAuth from '../../../utils/withAuth';
import AdminLayout from './administratorLayout';
import GenderCount from '../../app/components/admin/admissions/GenderCount';
import AllStudents from '../../app/components/student/AllStudents';
import ContactsList from '../../app/components/notice/ContactsList';
import AdmissionsList from '../../app/components/admin/admissions/AdmissionsList';

const AdminDashboard = () => {

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full">
          <GenderCount />
          <div className="w-full flex  mt-4">
            <div className="flex-1 bg-white border mr-1 shadow-sm rounded p-4">
            <AdmissionsList />
            </div>
            <div className="flex-1 bg-white border ml-1 shadow-sm rounded p-4">
              <ContactsList />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard);

