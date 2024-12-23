import React from 'react';
import PaymentHistoryTable from './PaymentHistoryTable';

const StudentPaymentModal = ({ 
  student, 
  payments, 
  onClose, 
  onAddPayment, 
  onPaymentClick,
  paymentStatus 
}) => {
  const paymentSummary = {
    total: payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
    paid: payments.filter(p => p.status === paymentStatus.PAID)
      .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
    pending: payments.filter(p => p.status === paymentStatus.PENDING)
      .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
    partial: payments.filter(p => p.status === paymentStatus.PARTIAL)
      .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Payment History - {student.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-end mb-6">
            <button
              onClick={onAddPayment}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Payment
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-blue-700">${paymentSummary.total.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Paid Amount</p>
              <p className="text-2xl font-bold text-green-700">${paymentSummary.paid.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Partial Amount</p>
              <p className="text-2xl font-bold text-yellow-700">${paymentSummary.partial.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Pending Amount</p>
              <p className="text-2xl font-bold text-red-700">${paymentSummary.pending.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-semibold">{student.userID}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-semibold">{student.class}</p>
              </div>
            </div>
          </div>

          <PaymentHistoryTable
            payments={payments}
            paymentStatus={paymentStatus}
            handlePaymentClick={onPaymentClick}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentModal; 