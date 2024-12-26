import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { checkPermission } from '../utils/roleManagement';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (session?.user?.id) {
        const permitted = await checkPermission(session.user.id, requiredPermission);
        setHasPermission(permitted);
      }
      setLoading(false);
    };

    checkAccess();
  }, [session, requiredPermission]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/');
    return null;
  }

  if (!hasPermission) {
    router.push('/unauthorized');
    return null;
  }

  return children;
};

export default ProtectedRoute; 