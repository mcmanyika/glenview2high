import AdminLayout from '../admin/adminLayout';
import withAuth from '../../../utils/withAuth';
import AttendanceDashboard from '../../app/components/attendance/AttendanceDashboard';

function index() {
  return (
    <AdminLayout>
        <AttendanceDashboard />
    </AdminLayout>
  )
}
export default withAuth(index);