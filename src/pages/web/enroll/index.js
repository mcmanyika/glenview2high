import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import EnrollmentDetailsForm from '../../../app/components/student/enroll/EnrollmentDetailsForm';
import withAuth from '../../../../utils/withAuth';
import Layout from '../../../app/components/Layout2';

const Student = () => {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (session && session.user) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  return (
    <Layout>
    <div className="max-w-6xl mx-auto p-4">
      {userEmail && <EnrollmentDetailsForm userEmail={userEmail} />}
    </div>
    </Layout>
  );
};

export default withAuth(Student);
