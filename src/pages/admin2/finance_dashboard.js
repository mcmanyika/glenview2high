
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import PaymentsList from '../../app/components/finance/PaymentsList';

const FinanceDashboard = () => {

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
