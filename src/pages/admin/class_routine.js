import React from 'react'
import ClassRoutineForm from '../../app/components/student/ClassRoutineForm'
import AdminLayout from './adminLayout'
import withAuth from '../../../utils/withAuth';

function ClassRoutine() {
  return (
    <AdminLayout>
        <ClassRoutineForm />
    </AdminLayout>
  )
}
export default  withAuth(ClassRoutine)