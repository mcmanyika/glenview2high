import ProtectedRoute from '../ProtectedRoute';
import RoleBasedComponent from '../RoleBasedComponent';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredPermission="system_settings">
      <div>
        <h1>Admin Dashboard</h1>
        
        <RoleBasedComponent requiredPermission="financial_manage">
          <div>
            <h2>Financial Management</h2>
          </div>
        </RoleBasedComponent>

        <RoleBasedComponent requiredPermission="users_manage">
          <div>
            <h2>User Management</h2>
          </div>
        </RoleBasedComponent>
      </div>
    </ProtectedRoute>
  );
}
