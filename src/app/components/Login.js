// components/Login.js
'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../utils/firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in');
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 w-full border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 w-full border rounded"
      />
      <button
        onClick={isLogin ? handleLogin : handleSignup}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="ml-4 text-blue-500 underline"
      >
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default Login;
