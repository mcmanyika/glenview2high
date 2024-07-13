import withAuth from '../../utils/withAuth';
import { useSession } from 'next-auth/react';
import AdminLayout from './admin/adminLayout';


const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <AdminLayout>
      <h1>Welcome to your Dashboard, {session?.user?.name}</h1>
      {/* Add your dashboard content here */}
    </AdminLayout>
  );
};

export default withAuth(Dashboard);
