import React from 'react';

const PaymentHistoryTable = ({ payments, paymentStatus }) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-4">Payment History</h3>
    <div className="max-h-60 overflow-y-auto">
      {payments.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fee Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{payment.date}</td>
                <td className="px-4 py-2 text-sm">${payment.amount.toLocaleString()}</td>
                <td className="px-4 py-2 text-sm">{payment.method}</td>
                <td className="px-4 py-2 text-sm">{payment.feeDescription || '-'}</td>
                <td className="px-4 py-2 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {paymentStatus.PAID}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{payment.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center py-4">No payment history available</p>
      )}
    </div>
  </div>
);

export default PaymentHistoryTable; 