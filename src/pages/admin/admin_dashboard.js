import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import { database } from '../../../utils/firebaseConfig';
import { ref, get, set } from 'firebase/database';
import Dashboard from '../../app/components/admin';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isActiveUser, setIsActiveUser] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (session?.user?.email) {
        try {
          const userRef = ref(database, 'userTypes');
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const allUserData = snapshot.val();
            const matchedAdmin = Object.entries(allUserData).find(
              ([_, user]) => user.email === session.user.email
            );

            if (matchedAdmin) {
              const [adminId, adminInfo] = matchedAdmin;
              setAdminData(adminInfo);
              setIsActiveUser(adminInfo.status === 'Active');
            }
          }
        } catch (error) {
          console.error('Error fetching teacher data: ', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdminData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isActiveUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Account under review</h1>
          <p className="mb-4">Your account is not approved for admin access.</p>
          <p className="mb-4">Come back later or  contact the system administrator. Thank you</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard);
