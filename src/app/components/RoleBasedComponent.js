import { useSession } from 'next-auth/react';
import { checkPermission } from '../utils/roleManagement';

const RoleBasedComponent = ({ children, requiredPermission }) => {
  const { data: session } = useSession();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (session?.user?.id) {
        const permitted = await checkPermission(session.user.id, requiredPermission);
        setHasPermission(permitted);
      }
    };

    checkAccess();
  }, [session, requiredPermission]);

  if (!hasPermission) return null;
  return children;
};

export default RoleBasedComponent;
