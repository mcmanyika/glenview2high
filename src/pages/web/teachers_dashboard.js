import React from 'react'
import AdminLayout from '../admin/adminLayout';
import Teachers from '../../app/components/teachers/utils/Teachers';

export default function TeachersDashboard() {
  return (
    <AdminLayout>
        <Teachers />
    </AdminLayout>
  )
}
