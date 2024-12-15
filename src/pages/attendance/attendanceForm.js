import AdminLayout from '../admin/adminLayout';
import withAuth from '../../../utils/withAuth';
import AttendanceForm from '../../app/components/attendance/AttendanceForm';

function attendanceForm() {

  return (
    <AdminLayout>
        <AttendanceForm />
    </AdminLayout>
  )
}
export default withAuth(attendanceForm);