import React, { useState, useEffect } from "react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, set, get, update } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeesManagement = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFees, setCurrentFees] = useState(null);

  // Fetch current fees on component mount
  useEffect(() => {
    const fetchCurrentFees = async () => {
      try {
        const feesRef = ref(database, 'globalFees');
        const snapshot = await get(feesRef);
        
        if (snapshot.exists()) {
          setCurrentFees(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching fees:', error);
        toast.error('Failed to fetch current fees.');
      }
    };

    fetchCurrentFees();
  }, []);

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

      // Create fees object
      const feesData = {
        amount: parseFloat(amount),
        description,
        datePosted: Date.now()
      };

      // Save global fees configuration
      await set(ref(database, 'globalFees'), feesData);

      // Post fees to each student
      const updates = {};
      Object.entries(students).forEach(([userId, user]) => {
        if (user.userType === 'student') {
          updates[`studentFees/${userId}`] = {
            totalAmount: parseFloat(amount),
            remainingAmount: parseFloat(amount),
            description,
            datePosted: Date.now(),
            payments: []
          };
        }
      });

      await update(ref(database), updates);
      
      toast.success('Fees successfully posted to all students!');
      setAmount('');
      setDescription('');
      setCurrentFees(feesData);

    } catch (error) {
      console.error('Error posting fees:', error);
      toast.error('Failed to post fees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Global Fees Management</h2>

      {/* Current Fees Display */}
      {currentFees && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current Posted Fees</h3>
          <p className="text-gray-700">Amount: ${currentFees.amount.toLocaleString()}</p>
          <p className="text-gray-700">Description: {currentFees.description}</p>
          <p className="text-gray-700">
            Posted on: {new Date(currentFees.datePosted).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Post New Fees Form */}
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
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter fee description"
            rows="3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
        >
          {loading ? 'Posting...' : 'Post Fees to All Students'}
        </button>
      </form>

      {/* Warning Message */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ Warning: This will set the same fee amount for all students. 
          The amount will automatically decrease as students make payments.
        </p>
      </div>
    </div>
  );
};

export default FeesManagement; 