import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { database } from '../../../../../../utils/firebaseConfig';
import { ref, get, update } from 'firebase/database';
import { toast } from 'react-toastify';

const AddPaymentModal = ({ isOpen, onClose, studentId, studentName }) => {
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Cash',
    feeId: '',
    notes: ''
  });

  const [studentFees, setStudentFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedFee = newPayment.feeId 
    ? studentFees.find(fee => fee.id === newPayment.feeId) 
    : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feesSnapshot = await get(ref(database, `studentFees/${studentId}`));
        
        if (feesSnapshot.exists()) {
          const feesData = feesSnapshot.val();
          const feesArray = Object.entries(feesData).map(([id, fee]) => ({
            id,
            ...fee
          }))
          .filter(fee => fee.remainingAmount > 0)
          .sort((a, b) => b.datePosted - a.datePosted);
          
          setStudentFees(feesArray);
          
          if (!newPayment.feeId && feesArray.length > 0) {
            setNewPayment(prev => ({
              ...prev,
              feeId: feesArray[0].id
            }));
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch required data');
        setLoading(false);
      }
    };

    if (isOpen && studentId) {
      fetchData();
    }
  }, [isOpen, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedFee = studentFees.find(fee => fee.id === newPayment.feeId);
    if (!selectedFee) {
      toast.error('Please select a valid fee to pay');
      return;
    }

    const paymentAmount = parseFloat(newPayment.amount);
    if (paymentAmount > selectedFee.remainingAmount) {
      toast.error('Payment amount cannot exceed remaining fees');
      return;
    }

    const paymentData = {
      ...newPayment,
      amount: paymentAmount,
      remainingBeforePayment: selectedFee.remainingAmount,
      remainingAfterPayment: selectedFee.remainingAmount - paymentAmount,
      timestamp: Date.now()
    };

    try {
      const { feeId, amount } = paymentData;
      
      // Create payment record
      const paymentId = Date.now().toString();
      const updates = {};
      
      // Update the specific fee's remaining amount
      updates[`studentFees/${studentId}/${feeId}/remainingAmount`] = paymentData.remainingAfterPayment;
      
      // Add the payment record
      updates[`studentFees/${studentId}/${feeId}/payments/${paymentId}`] = {
        ...paymentData,
        id: paymentId
      };

      // Update the database
      await update(ref(database), updates);
      
      // Refresh the fees data after payment
      const feesSnapshot = await get(ref(database, `studentFees/${studentId}`));
      if (feesSnapshot.exists()) {
        const feesData = feesSnapshot.val();
        const feesArray = Object.entries(feesData).map(([id, fee]) => ({
          id,
          ...fee
        }))
        .filter(fee => fee.remainingAmount > 0)
        .sort((a, b) => b.datePosted - a.datePosted);
        
        setStudentFees(feesArray);
      }

      setNewPayment(prev => ({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        method: 'Cash',
        feeId: prev.feeId,
        notes: ''
      }));

      toast.success('Payment recorded successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center p-4 z-[80] bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Add New Payment</h2>
              <p className="text-sm text-gray-600">{studentName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading fees information...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Fee to Pay
                </label>
                <select
                  value={newPayment.feeId}
                  onChange={(e) => setNewPayment({ ...newPayment, feeId: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a fee to pay</option>
                  {studentFees.map(fee => (
                    <option key={fee.id} value={fee.id}>
                      {fee.description} (${fee.remainingAmount.toLocaleString()} remaining)
                    </option>
                  ))}
                </select>
              </div>

              {selectedFee && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    Remaining Balance for {selectedFee.description}:{' '}
                    <span className="font-bold">${selectedFee.remainingAmount.toLocaleString()}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  max={selectedFee?.remainingAmount || 0}
                  step="0.01"
                  placeholder={selectedFee ? `Max: $${selectedFee.remainingAmount.toLocaleString()}` : 'Select a fee first'}
                  disabled={!selectedFee}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Optional payment notes"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFee}
                className={`px-4 py-2 text-white rounded-md ${
                  selectedFee 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Add Payment
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AddPaymentModal; 