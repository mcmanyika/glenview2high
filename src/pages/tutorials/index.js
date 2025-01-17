import React from 'react'
import AdminLayout from '../admin/adminLayout'
import AddTutorial from '../../app/components/tutorials/AddTutorial'
import TutorialList from '../../app/components/tutorials/TutorialList'

export default function index() {
  return (
    <AdminLayout>
      <div className="flex gap-4">
        <div className='w-full'>
          <TutorialList />
        </div>
      </div>
    </AdminLayout>
  )
}
