import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import { database } from '../../../utils/firebaseConfig';
import { ref, get, set } from 'firebase/database';
import Students from '../../app/components/teachers/utils/Students';
import StudentGenderCount from '../../app/components/teachers/utils/StudentGenderCount';
import ClassRoutineList from '../../app/components/teachers/ClassRoutineList';
import TeacherClassesList from '../../app/components/teachers/utils/TeacherClassesList';
import Link from 'next/link';
const TeacherDashboard = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isActiveUser, setIsActiveUser] = useState(false);
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (session?.user?.email) {
        try {
          const userRef = ref(database, 'userTypes');
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const allUserData = snapshot.val();
            const matchedTeacher = Object.entries(allUserData).find(
              ([_, user]) => user.email === session.user.email
            );

            if (matchedTeacher) {
              const [teacherId, teacherInfo] = matchedTeacher;
              setTeacherData(teacherInfo);
              setIsActiveUser(teacherInfo.status === 'Accepted');
            }
          }
        } catch (error) {
          console.error('Error fetching teacher data: ', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTeacherData();
  }, [session]);

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div>Loading...</div>
        </div>
      )}

      {!loading && !isActiveUser && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500 text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="mb-4">Your account is not active and going through the approval process.</p>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {!loading && isActiveUser && (
        <AdminLayout>
          <div className="flex flex-col h-screen overflow-y-auto
            bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <div className="w-full space-y-4">
              {/* Middle Section */}
              <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                {/* Class Routine */}
                <div className="w-full md:w-2/4 bg-white dark:bg-gray-800 
                  rounded-lg shadow-sm border dark:border-gray-700 
                  p-2 transition-all duration-200">
                  <TeacherClassesList />
                </div>

                {/* Teacher Classes */}
                <div className="w-full md:w-2/4 bg-white dark:bg-gray-800 
                  rounded-lg shadow-sm border dark:border-gray-700 
                  p-2 transition-all duration-200">
                  <StudentGenderCount />
                </div>
              </div>
              {/* Gender Count Section */}
              <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm 
                border dark:border-gray-700 transition-all duration-200">
                <ClassRoutineList />
              </div>

              {/* Students Section */}
              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 
                shadow-sm rounded-lg p-4 mb-4 transition-all duration-200">
                <Students />
              </div>
            </div>
          </div>
        </AdminLayout>
      )}
    </>
  );
};

export default withAuth(TeacherDashboard);
