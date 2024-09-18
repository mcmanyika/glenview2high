import React from 'react';
import { useSession } from 'next-auth/react';

import useFetchUserType from './utils/useFetchUserType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import PaymentsList from '../../app/components/finance/PaymentsList';

const FinanceDashboard = () => {
  const { data: session, status } = useSession();
  const { userType, loading, error } = useFetchUserType(session, status);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-blue-500 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full">
          <div className="bg-white border shadow-sm rounded mt-4 p-4">
            <PaymentsList />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(FinanceDashboard);
