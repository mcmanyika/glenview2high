import React from 'react';
import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';
import AdmissionForm from '../../app/components/admin/admissions/AdmissionForm';

function Admission() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          <AdmissionForm />
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Admission);
