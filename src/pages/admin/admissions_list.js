import React from 'react';
import { useSession } from 'next-auth/react';


import useFetchUserType from './utils/useFetchUserType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
 
import StudentsApplications from '../../app/components/student/StudentsApplications';
import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';

const admissions_list = () => {
  const { data: session, status } = useSession();
  const { userType, loading, error } = useFetchUserType(session, status);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-blue-500 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <AdminLayout>
        <StudentsApplications />
    </AdminLayout>
  )
}
export default withAuth(admissions_list);