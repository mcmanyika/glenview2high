import React from 'react';
import { useSession } from 'next-auth/react';


import useFetchUserType from './utils/useFetchUserType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import AdminLayout from './adminLayout';
import UploadClassNameForm from '../../app/components/teachers/UploadClassNameForm';
import withAuth from '../../../utils/withAuth';
import TeacherClasses from '../../app/components/teachers/TeacherClasses';

function AddClasses() {
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
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <UploadClassNameForm />
        </div>
        <div className="w-full md:w-1/2 lg:w-4/5 bg-white m-2">
        <div className='text-2xl m-2 p-4'>My Classes</div>
          <div className="h-3/4 overflow-y-auto">
            <TeacherClasses />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AddClasses);
