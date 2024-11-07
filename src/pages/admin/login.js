'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import SignIn from '../../app/components/user/SignIn';
import SignUp from '../../app/components/user/SignUp';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); // For toggling between login and signup

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
    }
  };

  const handleAuth0SignIn = async () => {
    try {
      await signIn('auth0');
    } catch (error) {
      console.error('Error signing in with Auth0:', error);
      setError(error.message);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp); // Toggle between login and signup
    setError(null); // Clear any existing errors
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className='md:visible md:flex-1 h-screen bg-cover bg-center login-background'>
      </div>
      <div className='w-full md:flex-1'>
        <div className=" max-w-xl mx-auto p-6 bg-white bg-opacity-75 text-center">
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
          {!session && 
          <div className=' max-w-4xl mx-auto'>
            <button
              onClick={handleAuth0SignIn}
              className="px-4 py-2 bg-slate-200 text-gray-800 rounded  transition duration-200 mt-4 w-full"
            >
              Sign in with Email
            </button>
            <div className='p-4'>OR</div>
            <button
              onClick={handleGoogleSignIn}
              className="px-4 py-2 bg-red-500 text-white rounded  transition duration-200 w-full"
            >
              Sign in with Google
            </button>
          </div> }

          {session && <div className='w-full text-center'>Redirecting to Dashboard...</div>}
        </div>
      </div>
    </div>
  );
}
