import React from 'react';
import { useSession } from 'next-auth/react';

import ClassRoutineForm from '../../app/components/student/ClassRoutineForm'
import ClassRoutineList  from '../../app/components/student/ClassRoutineList'
import AdminLayout from './adminLayout'
import withAuth from '../../../utils/withAuth';


import useFetchUserType from './utils/useFetchUserType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function ClassRoutine() {
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
      <div className='w-full flex flex-col lg:flex-row'>
        <div className='w-full lg:w-1/4 m-3 ml-0'>
          <ClassRoutineForm />
        </div>
        <div className='w-full lg:w-3/4 m-3 lg:ml-0 lg:mt-0'>
          <ClassRoutineList />
        </div>
      </div>
    </AdminLayout>
  )
}
export default withAuth(ClassRoutine);
