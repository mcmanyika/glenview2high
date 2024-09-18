import React from 'react';
import { useSession } from 'next-auth/react';

import useFetchUserType from './utils/useFetchUserType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';
import CreateExamForm from '../../app/components/exams/CreateExamForm';
import AssignedExamsList from '../../app/components/exams/AssignedExamsList';

const Exams = () => {
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
      <div className='w-full flex flex-col md:flex-row'>
        <div className='w-full md:w-1/4 m-1'>
          <CreateExamForm />
        </div>
        <div className='w-full md:w-3/4 m-1'>
          <AssignedExamsList />
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Exams);
