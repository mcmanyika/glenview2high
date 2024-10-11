'use client';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  const handleSignInWithCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,  // Prevents auto-redirect on error
        email,
        password,
      });

      if (res.error) {
        setError(res.error); // Show error if sign-in fails
      } else {
        // Redirection will happen in useEffect after successful login
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google');
      // Redirection will happen in useEffect after successful login
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8741.jpg?alt=media&token=73f1cfaf-ea7d-454e-8230-bd301ee4da81')" }}>
        
      <div className="w-7xl mx-auto p-6 bg-white bg-opacity-75 rounded shadow-md text-center">
        <Link href='/'>
          <Image
            src="/images/logo.png"
            alt=""
            width={90}
            height={90}
            className="mx-auto mb-4 rounded-full"
          />
        </Link>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {!session && (
          <>
            {/* <form onSubmit={handleSignInWithCredentials}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full mb-3 px-4 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full mb-4 px-4 py-2 border rounded"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign in'}
              </button>
            </form>
            <p className="mt-6">OR</p> */}

            <button
              onClick={handleGoogleSignIn}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 mt-4 w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign in with Google'}
            </button>
          </>
        )}

        {session && <p>Redirecting to dashboard...</p>}
      </div>
      </div>
    </>
  );
}
