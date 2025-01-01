import React, { useState } from "react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, set, get, update } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeesManagement = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Predefined fee descriptions
  const feeDescriptions = [
    'School Fees',
    'Development Fees',
    'Library Fees',
    'Laboratory Fees',
    'Sports Fees',
    'Computer Lab Fees',
    'Examination Fees',
    'Transport Fees',
    'Uniform Fees',
    'Books and Supplies'
  ];

  const handlePostFees = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get all students
      const studentsRef = ref(database, 'userTypes');
      const snapshot = await get(studentsRef);
      const students = snapshot.val();

      if (!students) {
        toast.error('No students found in the database');
        return;
      }

      // Create fees object with unique ID
      const feeId = Date.now().toString();
      const feesData = {
        amount: parseFloat(amount),
        description,
        datePosted: Date.now()
      };

      // Save to global fees with unique ID
      await set(ref(database, `globalFees/${feeId}`), feesData);

      // Post fees to each student with initial payment array
      const updates = {};
      Object.entries(students).forEach(([userId, user]) => {
        if (user.userType === 'student') {
          updates[`studentFees/${userId}/${feeId}`] = {
            totalAmount: parseFloat(amount),
            remainingAmount: parseFloat(amount),
            description,
            datePosted: Date.now(),
            payments: {} // Initialize empty payments object
          };
        }
      });

      await update(ref(database), updates);
      
      toast.success('Fees successfully posted to all students!');
      setAmount('');
      setDescription('');

    } catch (error) {
      console.error('Error posting fees:', error);
      toast.error('Failed to post fees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handlePostFees} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fee Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select fee type</option>
            {feeDescriptions.map((desc) => (
              <option key={desc} value={desc}>
                {desc}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-300 hover:bg-blue-400'
            } transition-colors`}
        >
          {loading ? 'Posting...' : 'Post Fees to All Students'}
        </button>
      </form>
    </div>
  );
};

export default FeesManagement; 