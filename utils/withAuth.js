/* eslint-disable react/display-name */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent, requiredRole = null) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
      if (!session) {
        router.push('/admin/login');
        return;
      }
      // Add role check
      if (requiredRole && session.user?.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }, [router, session, status]);

    if (status === 'loading' || !session) {
      return <div></div>;
    }

    // Add role check for render
    if (requiredRole && session.user?.role !== requiredRole) {
      return <div></div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
