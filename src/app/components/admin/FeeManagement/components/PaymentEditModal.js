import React from 'react';
import { motion } from 'framer-motion';

const PaymentEditModal = ({ 
  isOpen, 
  onClose, 
  payment, 
  onUpdate, 
  onChange, 
  paymentStatus 
}) => {
  if (!isOpen || !payment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(payment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[70]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Payment</h2>
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Payment Details */}
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold">${payment.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{payment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-semibold">{payment.method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{paymentStatus.PAID}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={payment.notes || ''}
                onChange={(e) => onChange({ ...payment, notes: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add any additional notes about this payment..."
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
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Update Payment
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PaymentEditModal; 