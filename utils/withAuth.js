/* eslint-disable react/display-name */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) router.push('/admin/login'); // Redirect to signin if not authenticated
    }, [router, session, status]);

    if (status === 'loading' || !session) {
      return <div></div>; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
