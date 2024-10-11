import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../utils/firebaseConfig";
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const router = useRouter();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Reset error
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to the desired page after successful sign-up
      router.push('/');
    } catch (error) {
      // Handle common Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to sign up. Please try again.");
      }
    }
    setLoading(false); // Stop loading
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
      <div className="mb-4">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 p-2 block w-full h-10 focus:ring"
          placeholder="Email"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 p-2 block w-full h-10 focus:ring"
          placeholder="Password"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        type="submit"
        className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 ${loading && 'opacity-50 cursor-not-allowed'}`}
        disabled={loading}
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUp;
