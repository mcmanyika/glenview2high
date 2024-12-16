import React from 'react'
import AdminLayout from '../../admin/adminLayout'
import StudentAssignmentsList from '../../../app/components/student/assignments/Assignments'
import withAuth from '../../../../utils/withAuth';

function index() {
  return (
    <AdminLayout>
        <StudentAssignmentsList />
    </AdminLayout>
  )
}
export default withAuth(index);