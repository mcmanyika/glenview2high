import React from 'react'
import ClassRoutineForm from '../../app/components/student/ClassRoutineForm'
import ClassRoutineList  from '../../app/components/student/ClassRoutineList'
import AdminLayout from './adminLayout'
import withAuth from '../../../utils/withAuth';

function ClassRoutine() {
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
