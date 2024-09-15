// components/PaymentModal.js

import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { toast } from 'react-toastify'; // Import toast

const PaymentModal = ({ id, onClose }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [purpose, setPurpose] = useState(''); // State for purpose
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate input
    if (!amount || !paymentMethod || !purpose) { // Check purpose
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.'); // Show error toast
      setLoading(false);
      return;
    }

    const paymentData = {
      id,
      amount: parseFloat(amount), // Ensure amount is a number
      paymentMethod,
      purpose, // Include purpose in payment data
      timestamp: new Date().toISOString(), // Optional: track when the payment was made
    };

    try {
      const paymentRef = ref(database, 'payments/' + id + '/' + Date.now());
      await set(paymentRef, paymentData);
      toast.success('Payment recorded successfully!'); // Show success toast
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error saving payment:', error);
      setError('Failed to record payment. Please try again.');
      toast.error('Failed to record payment. Please try again.'); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Record Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="" disabled>Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="" disabled>Select payment purpose</option>
              <option value="tuition">Tuition</option>
              <option value="registration">Registration</option>
              <option value="donation">Donation</option>
              <option value="other">Other</option>
            </select>
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded ${loading && 'opacity-50'}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-gray-500 hover:underline">Close</button>
      </div>
    </div>
  );
};

export default PaymentModal;
