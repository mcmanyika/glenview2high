import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import GenderCount from '../../app/components/admin/admissions/GenderCount';
import AdmissionsList from '../../app/components/admin/admissions/AdmissionsList';
import GenderPieChart from '../../app/components/admin/admissions/GenderPieChart';

const AdminDashboard = () => {

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full">
          <GenderCount />
          <div className="w-full flex flex-col md:flex-row mt-4" style={{ height: '400px', overflowY: 'auto' }}>
            <div className="w-full md:w-2/4 bg-white border mb-4 md:mb-0 md:mr-1 shadow-sm rounded p-4">
              <AdmissionsList />
            </div>
            <div className="w-full md:w-2/4 bg-white border md:ml-1 shadow-sm rounded p-4">
              <GenderPieChart />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard);
