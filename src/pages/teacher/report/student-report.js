import withAuth from '../../../../utils/withAuth';
import AdminLayout from '../../admin/adminLayout';
import StudentReport from '../../../app/components/student/reports/StudentReport';
const StudentReportPage = () => {
  return (
    <AdminLayout>
      <div className="pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Student Term Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and view end of term reports for students.
          </p>
          <button 
            onClick={() => window.location.href = '/teacher/report/all-reports'} 
            className="bg-main3 text-white mt-4 px-4 py-2 rounded-lg"
          >
            Show All Reports
          </button>
        </div>
        <StudentReport />
      </div>
    </AdminLayout>
  );
};

export default withAuth(StudentReportPage);