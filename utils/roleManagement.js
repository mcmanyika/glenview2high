import { ref, get, set, update } from 'firebase/database';
import { database } from './firebaseConfig';

// Get user's role
export const getUserRole = async (userId) => {
  const userRoleRef = ref(database, `roles/user_roles/${userId}`);
  const snapshot = await get(userRoleRef);
  return snapshot.exists() ? snapshot.val() : null;
};

// Check if user has specific permission
export const checkPermission = async (userId, permission) => {
  try {
    const userRole = await getUserRole(userId);
    if (!userRole || !userRole.isActive) return false;

    const roleRef = ref(database, `roles/role_definitions/${userRole.role}`);
    const roleSnapshot = await get(roleRef);
    
    if (!roleSnapshot.exists()) return false;
    
    const roleData = roleSnapshot.val();
    return roleData.permissions[permission] === true;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// Assign role to user
export const assignRole = async (userId, role, assignedBy) => {
  try {
    const userRoleRef = ref(database, `roles/user_roles/${userId}`);
    await set(userRoleRef, {
      role,
      assignedAt: new Date().toISOString(),
      assignedBy,
      isActive: true
    });
    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
};

// Custom hook for role-based access control
export const useRoleAccess = (userId, requiredPermission) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const hasPermission = await checkPermission(userId, requiredPermission);
      setHasAccess(hasPermission);
      setLoading(false);
    };

    checkAccess();
  }, [userId, requiredPermission]);

  return { hasAccess, loading };
};
