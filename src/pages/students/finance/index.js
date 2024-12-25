import React from 'react'
import StudentPayments from '../../../app/components/student/finance';
import AdminLayout from '../../admin/adminLayout';

function index() {
  return (
    <AdminLayout>
        <StudentPayments />
    </AdminLayout>
  )
}

export default index