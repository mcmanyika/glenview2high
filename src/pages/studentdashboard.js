import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import fetchStudentData from '../../utils/fetchStudentData'; // Fetch student-specific data
import withAuth from '../../utils/withAuth';
import AdminLayout from './admin/adminLayout';
import ProfileCard from '../components/student/ProfileCard';

const StudentDashboard = () => {
  const { data: session } = useSession();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchStudentData(session.user.email).then((data) => {
        setStudentData(data);
        setLoading(false);
      });
    }
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <ProfileCard profile={studentData.profile} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(StudentDashboard);
