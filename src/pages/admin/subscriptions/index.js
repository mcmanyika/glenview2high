import React from 'react'
import AdminLayout from '../adminLayout'
import withAuth from '../../../../utils/withAuth'      
import AllSubscriptions from '../../../app/components/admin/AllSubscriptions'
function index() {
  return (
    <AdminLayout>
      <AllSubscriptions />
    </AdminLayout>
  )
}

export default withAuth(index)