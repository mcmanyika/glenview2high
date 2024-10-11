import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../utils/firebaseConfig"; // Firebase config path
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmailInput] = useState(''); // Global email state
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  // Handle form submission for sign-in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      setLoading(false);
      router.push('/'); // Redirect to dashboard after successful login
    } catch (error) {
      // Handle login error, like invalid credentials
      setLoading(false);
      setError('Invalid email or password. Please try again.');
      console.error("Sign-in Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            value={email} // Value from global state
            onChange={(e) => setEmailInput(e.target.value)} // Update global state
            required
            className="w-full p-2 border rounded-md focus:ring"
            placeholder="Email"
            aria-label="Email"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:ring"
            placeholder="Password"
            aria-label="Password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
