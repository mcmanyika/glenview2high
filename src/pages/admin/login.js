'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { database } from '../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import SignIn from '../../app/components/user/SignIn';
import SignUp from '../../app/components/user/SignUp';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); // For toggling between login and signup
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  // Add this useEffect to fetch website URL
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const accountRef = ref(database, 'account');
        const accountSnapshot = await get(accountRef);
        if (accountSnapshot.exists()) {
          const accountData = accountSnapshot.val();
          setWebsiteUrl(accountData.website);
          setLogoUrl(accountData.logo);
        } else {
          console.error('No account data found');
          setWebsiteUrl('#'); // Fallback URL
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
        setWebsiteUrl('#'); // Fallback URL
      }
    };

    fetchAccountData();
  }, []);

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
    const fetchLogo = async () => {
      try {
        const accountRef = ref(database, `account`);
        const accountSnapshot = await get(accountRef);
        if (accountSnapshot.exists()) {
          const accountData = accountSnapshot.val();
          setLogoUrl(accountData.logo);
          setWebsiteUrl(accountData.website);
        } else {
          console.error('No account data found');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp); // Toggle between login and signup
    setError(null); // Clear any existing errors
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className='hidden md:block md:flex-1 h-screen bg-cover bg-center login-background'>
      </div>
      <div className='w-full md:flex-1 p-4'>
        <div className="max-w-xl mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
          <Link href={websiteUrl || '#'} className="block transition-transform hover:scale-105 duration-200">
            <Image
              src={logoUrl}
              alt="Logo"
              width={90}
              height={90}
              className="mx-auto mb-6 rounded-full shadow-md"
              priority
            />
          </Link>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {!session && (
            <div className='max-w-sm mx-auto space-y-6'>
              <button
                onClick={handleAuth0SignIn}
                className="px-6 py-3 bg-gray-50 text-gray-800 rounded-lg shadow-sm hover:shadow-md w-full transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 hover:bg-gray-100"
              >
                <span>Sign in with Email</span>
              </button>

              <div className='flex items-center justify-center space-x-4'>
                <div className='flex-1 h-px bg-gray-300'></div>
                <span className='text-gray-500 text-sm font-medium'>OR</span>
                <div className='flex-1 h-px bg-gray-300'></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="px-6 py-3 bg-main3 hover:bg-main2 text-white rounded-lg shadow-sm hover:shadow-md w-full transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          {session && (
            <div className='w-full text-center text-gray-600 animate-pulse'>
              Redirecting to Dashboard...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
