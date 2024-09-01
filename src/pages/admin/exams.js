import React from 'react';
import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';
import CreateExamForm from '../../app/components/exams/CreateExamForm';
import AssignedExamsList from '../../app/components/exams/AssignedExamsList';

const Exams = () => {
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
