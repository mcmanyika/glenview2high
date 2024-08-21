'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/students.png')" }} // Replace with your background image URL
    >
      <div className="max-w-lg mx-auto p-6 bg-white bg-opacity-75 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to GlenView 2 High School</h1>
        <p className="mb-6">Please sign in to continue.</p>
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
