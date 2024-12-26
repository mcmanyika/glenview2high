// pages/protected.js
import withAuth from '../utils/withAuth';
import { useRoleAccess } from '../utils/roleManagement';

const ProtectedComponent = ({ userId, children }) => {
  const { hasAccess, loading } = useRoleAccess(userId, 'users_manage');

  if (loading) return <div>Loading...</div>;
  if (!hasAccess) return <div>Access denied</div>;
  
  return children;
};

const ProtectedPage = () => {
  return (
    <ProtectedComponent userId={session?.user?.id}>
      <div>
        <h1>This is a protected page</h1>
      </div>
    </ProtectedComponent>
  );
};

export default withAuth(ProtectedPage);
