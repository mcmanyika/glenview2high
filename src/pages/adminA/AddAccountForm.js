import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

const AddAccountForm = () => {
  const [schoolName, setSchoolName] = useState('');
  const [address, setAddress] = useState('');
  const [tagline, setTagline] = useState('');
  const [logo, setLogo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const checkAccountExists = async () => {
    const accountRef = ref(database, 'account');
    const snapshot = await get(accountRef);
    if (snapshot.exists()) {
      const accounts = snapshot.val();
      // Check if any account matches the schoolName or email
      const existingAccounts = Object.values(accounts).some(
        (account) => account.schoolName === schoolName || account.email === email
      );
      return existingAccounts;
    }
    return false; // No accounts exist
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Clear previous error message

    // Check for existing accounts
    const accountExists = await checkAccountExists();
    if (accountExists) {
      setErrorMessage('An account already exists with the same school name or email.');
      setIsLoading(false);
      return;
    }

    try {
      // Create a new entry in the Account table
      const newAccountRef = ref(database, 'account');
      await set(newAccountRef, {
        schoolName,
        address,
        tagline,
        logo,
        phone,
        email,
      });

      // Reset form fields
      setSchoolName('');
      setAddress('');
      setTagline('');
      setLogo('');
      setPhone('');
      setEmail('');
      toast.success('Account added successfully!'); // Show success toast
      router.push('/admin/dashboard'); // Redirect to dashboard
    } catch (err) {
      toast.error('Error adding account: ' + err.message); // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add Account</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Error message display */}
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="schoolName">School Name</label>
        <input
          type="text"
          id="schoolName"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="tagline">Tagline</label>
        <input
          type="text"
          id="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="logo">Logo URL</label>
        <input
          type="text"
          id="logo"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <button type="submit" disabled={isLoading} className="bg-blue-500 text-white py-2 px-4 rounded">
        {isLoading ? 'Adding...' : 'Add Account'}
      </button>
    </form>
  );
};

export default AddAccountForm;
