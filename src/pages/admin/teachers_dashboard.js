import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import Students from '../../app/components/teachers/utils/Students';
import StudentGenderCount from '../../app/components/teachers/utils/StudentGenderCount';
import ClassRoutineList from '../../app/components/teachers/ClassRoutineList';
import TeacherClassesList from '../../app/components/teachers/utils/TeacherClassesList';

const TeacherDashboard = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col h-screen overflow-y-auto px-2">
        <div className="w-full">
          <StudentGenderCount />
          <div className="w-full flex flex-col md:flex-row md:space-x-4 mt-4 space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2 bg-white rounded-md shadow-sm p-2">
              <ClassRoutineList />
            </div>
            <div className="w-full md:w-1/2 bg-white rounded-md shadow-sm p-2">
              <TeacherClassesList />
            </div>
          </div>

          <div className="bg-white border shadow-sm rounded-md p-4 mt-4 mb-4">
            <Students />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);
