import { useSession } from 'next-auth/react';
import AdminLayout from './admin/adminLayout';

const UserDashboard = () => {
  const { data: session } = useSession();

  return (
    <AdminLayout>
      <h1 className="text-2xl mb-4">Welcome to your Dashboard, {session?.user?.name}</h1>
      {/* Additional dashboard content goes here */}
    </AdminLayout>
  );
};

export default UserDashboard;
