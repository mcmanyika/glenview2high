import React from 'react'
import StudentPayments from '../../../app/components/student/finance';
import AdminLayout from '../../admin/adminLayout';
import withAuth from '../../../../utils/withAuth';

function index() {
  return (
    <AdminLayout>
        <StudentPayments />
    </AdminLayout>
  )
}

export default withAuth(index);