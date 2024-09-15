/* eslint-disable react/display-name */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import spinner icon

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) router.push('/'); // Redirect to signin if not authenticated
    }, [router, session, status]);

    if (status === 'loading' || !session) {
      // Render spinner while loading or not authenticated
      return (
        <>
          
        </>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
