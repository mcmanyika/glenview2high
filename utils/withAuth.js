// utils/withAuth.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from './firebaseConfig';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/login');
        } else {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
