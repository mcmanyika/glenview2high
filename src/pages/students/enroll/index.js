import React from 'react'
import ApplicantsList from '../../../app/components/student/enroll/ApplicantsList'
import AdminLayout from '../../admin/adminLayout'
import withAuth from '../../../../utils/withAuth';

function index() {
  return (
    <AdminLayout>
        <ApplicantsList />
    </AdminLayout>
  )
}
export default withAuth(index);