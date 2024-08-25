import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import { FaSpinner } from 'react-icons/fa';
import NoticeCount from '../../app/components/notice/NoticeCount';
import ClassRoutine from '../../app/components/student/ClassRoutine';
import { database } from '../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import StudentDetails from '../../app/components/student/StudentDetails';
import { useRouter } from 'next/router';
import { useGlobalState, setStudentClass, setStatus } from '../../app/store';
import Student from '../../app/components/student/Student';

const StudentDash = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [studentStatus, setGlobalStatus] = useGlobalState('status');
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
      const studentRef = ref(database, 'students');
      const studentSnapshot = await get(studentRef);

      if (studentSnapshot.exists()) {
        const allStudentData = studentSnapshot.val();
        const matchedStudent = Object.entries(allStudentData).find(([_, student]) => student.email === email);

        if (matchedStudent) {
          const [studentId, studentInfo] = matchedStudent;
          setStudentData(studentInfo);
          setStudentClass(studentInfo.studentClass);
          localStorage.setItem('studentId', studentId);

          // Fetch admission status using the student's email
          await fetchStudentStatus(email);
        } else {
          router.push('/admin/student_form');
        }
      } else {
        console.log('No student data found.');
        router.push('/admin/student_form');
      }
    } catch (error) {
      console.error('Error fetching student data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentStatus = async (email) => {
    try {
      const admissionsSnapshot = await get(ref(database, 'admissions'));
      if (admissionsSnapshot.exists()) {
        const admissionEntries = Object.entries(admissionsSnapshot.val());
        const userStatusEntry = admissionEntries.find(([_, admission]) => admission.email === email);
        if (userStatusEntry) {
          const [, admissionInfo] = userStatusEntry;
          setGlobalStatus(admissionInfo.status);
        } else {
          setGlobalStatus("Status not found"); // Optional handling
        }
      }
    } catch (error) {
      console.error('Error fetching admissions data: ', error);
    }
  };

  return (
    <>
      {session && (
        <AdminLayout>
          <div className="flex flex-col md:flex-row">
            <div className="w-full">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <FaSpinner className="animate-spin text-blue-500 text-3xl" />
                </div>
              ) : (
                <>
                  {studentStatus === "Accepted" ? (
                    <>
                      <NoticeCount />
                      <div className="w-full flex flex-col md:flex-row mt-4">
                        <div className="w-1/3 mr-1">
                          <Student />
                        </div>
                        <div className="w-2/3 bg-white border shadow-sm rounded m-2 mt-0 ml-1">
                          <ClassRoutine />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='w-full border p-4 text-center'>Your account is under review</div>
                  )}
                </>
              )}
            </div>
          </div>
        </AdminLayout>
      )}
    </>
  );
};

export default withAuth(StudentDash);
