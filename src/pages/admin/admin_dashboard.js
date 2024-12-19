import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import GenderCount from '../../app/components/admin/admissions/GenderCount';
import AdmissionsList from '../../app/components/admin/admissions/AdmissionsList';
import GenderPieChart from '../../app/components/admin/admissions/GenderPieChart';
import Dashboard from '../../app/components/admin';
const AdminDashboard = () => {
  const [userID] = useGlobalState('userID');

  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard);
