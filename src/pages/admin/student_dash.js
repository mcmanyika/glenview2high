import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import { FaSpinner } from 'react-icons/fa';
import NoticeCount from '../../app/components/notice/NoticeCount';
import ClassRoutine from '../../app/components/student/ClassRoutine';
import { database } from '../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { useGlobalState, setStudentClass, setStatus } from '../../app/store';
import Student from '../../app/components/student/Student';
import CombinedExamsList from '../../app/components/exams/CombinedExamsList';
import StudentAssignmentsList from '../../app/components/student/assignments/StudentAssignmentsList';

const StudentDash = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [studentStatus, setGlobalStatus] = useGlobalState('status');
  const [studentId, setStudentId] = useGlobalState('studentId');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session) {
      fetchStudentData(session.user.email);
    }
  }, [session, status]);

  const fetchStudentData = async (email) => {
    try {
      const studentRef = ref(database, 'userTypes');
      const studentSnapshot = await get(studentRef);

      if (studentSnapshot.exists()) {
        const allStudentData = studentSnapshot.val();
        const matchedStudent = Object.entries(allStudentData).find(([_, student]) => student.email === email);

        if (matchedStudent) {
          const [studentId, studentInfo] = matchedStudent;
          setStudentData(studentInfo);
          setStudentClass(studentInfo.class);
          setStudentId(studentId);
          localStorage.setItem('studentId', studentId);
          setGlobalStatus(studentInfo.status);
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        console.log('No student data found.');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching student data: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="animate-spin text-blue-500 text-3xl" />
            </div>
          ) : (
            <div>
              {studentStatus === "Accepted" ? (
                <div className='h-screen overflow-y-auto'>
                  <NoticeCount />
                  {/* <div className="w-full flex flex-col md:flex-row mt-4">
                    <div className="md:w-2/4 bg-white p-4 m-2">
                      <Student />
                    </div>
                  </div> */}

                  <div className="w-full bg-white m-2">
                    <ClassRoutine />
                    </div>
                  <div className="w-full flex flex-col md:flex-row mt-4">
                    <div className="w-full  bg-white p-4 m-2">
                        <StudentAssignmentsList />
                  </div>
                    <div className="w-full bg-white m-2">
                      <CombinedExamsList />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='w-full border p-4 text-center'>Your account is under review</div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(StudentDash);
