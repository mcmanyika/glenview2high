import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import Students from '../../app/components/teachers/utils/Students';
import StudentGenderCount from '../../app/components/teachers/utils/StudentGenderCount';
import ClassRoutineList from '../../app/components/teachers/ClassRoutineList';
import TeacherClassesList from '../../app/components/teachers/utils/TeacherClassesList';

const TeacherDashboard = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col h-screen overflow-y-auto px-2 
        bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="w-full space-y-4">
          {/* Gender Count Section */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm 
            border dark:border-gray-700 transition-all duration-200">
            <StudentGenderCount />
          </div>

          {/* Middle Section */}
          <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Class Routine */}
            <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 
              rounded-lg shadow-sm border dark:border-gray-700 
              p-2 transition-all duration-200">
              <ClassRoutineList />
            </div>

            {/* Teacher Classes */}
            <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 
              rounded-lg shadow-sm border dark:border-gray-700 
              p-2 transition-all duration-200">
              <TeacherClassesList />
            </div>
          </div>

          {/* Students Section */}
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 
            shadow-sm rounded-lg p-4 mb-4 transition-all duration-200">
            <Students />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);
