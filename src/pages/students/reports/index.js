import StudentReportView from '../../../app/components/student/reports/StudentReportView';
import AdminLayout from '../../admin/adminLayout';

import withAuth from '../../../../utils/withAuth';

function ReportsPage() {
  return (
    <AdminLayout>
      <StudentReportView />
    </AdminLayout>
  )
}
export default withAuth(ReportsPage);