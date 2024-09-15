import React from 'react'
import StudentsApplications from '../../app/components/student/StudentsApplications';
import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';

const admissions_list = () => {
  return (
    <AdminLayout>
        <StudentsApplications />
    </AdminLayout>
  )
}
export default withAuth(admissions_list);