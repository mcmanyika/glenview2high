import React from 'react'
import withAuth from '../../../utils/withAuth'
import PaymentsTable from '../../app/components/finance/PaymentsTable'
import AdminLayout from '../admin/adminLayout'

function index() {
  return (
    <AdminLayout>
        <PaymentsTable />
    </AdminLayout>
  )
}

export default withAuth(index);
