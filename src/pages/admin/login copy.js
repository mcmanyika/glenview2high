'use client';
import { auth } from '../../../utils/firebaseConfig';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SmartBlankLayout from '../../app/components/SmartBlankLayout'

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); // For toggling between login and signup

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redirect will happen in the onAuthStateChanged listener
    } catch (e) {
      setError(e.message); // Use error message from Firebase
      console.error('Authentication error:', e);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp); // Toggle between login and signup
    setError(null); // Clear any existing errors
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_5929.jpg?alt=media&token=b6c69906-8efa-4e81-a09b-386e4457a0c3')" }}>
        <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-75 rounded shadow-md text-center">
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
          
          <div className='w-96'>
            <form onSubmit={handleAuth}>
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
                {loading ? (isSignUp ? 'Creating...' : 'Logging in...') : (isSignUp ? 'Sign up' : 'Sign in')}
              </button>
            </form>
            <p className="mt-6">OR</p>

            <button
              onClick={handleGoogleSignIn}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 mt-4 w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign in with Google'}
            </button>
            <p className="mt-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button onClick={toggleSignUp} className="text-blue-500 ml-1 underline">
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {session && <p>Redirecting to dashboard...</p>}
        </div>
      </div>
    </>
  );
}
