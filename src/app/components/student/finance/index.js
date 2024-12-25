'use client'
import React, { useState, useEffect } from "react";
import { database } from '../../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useSession } from 'next-auth/react';

const StudentPayments = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const { data: session } = useSession();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  // First, get the userID from userTypes table
  useEffect(() => {
    if (!session?.user?.email) return;

    const encodedEmail = session.user.email.replace(/[.#$\[\]]/g, '_');
    const userTypesRef = ref(database, 'userTypes');
    
    onValue(userTypesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Find the user entry by email
        Object.entries(data).forEach(([key, user]) => {
          if (user.email === session.user.email) {
            setUserId(user.userID);
          }
        });
      }
    });
  }, [session]);

  // Then fetch payments using the userID
  useEffect(() => {
    if (!userId) return;

    const studentFeesRef = ref(database, 'studentFees');
    
    onValue(studentFeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPayments = [];
        
        // Process all students' data
        Object.entries(data).forEach(([studentId, studentFees]) => {
          if (studentId === userId) { // Only process for matching userID
            Object.entries(studentFees).map(([feeId, fee]) => {
              const paidAmount = fee.totalAmount - (fee.remainingAmount || 0);
              const paymentHistory = fee.payments ? 
                Object.entries(fee.payments).map(([paymentId, payment]) => ({
                  id: paymentId,
                  amount: payment.amount,
                  date: payment.date,
                  method: payment.method || 'Not specified',
                  reference: payment.reference || 'N/A'
                })) : [];

              formattedPayments.push({
                studentId,
                feeId,
                description: fee.description,
                totalAmount: fee.totalAmount,
                paidAmount,
                remainingAmount: fee.remainingAmount || 0,
                dueDate: fee.dueDate,
                datePosted: fee.datePosted,
                status: fee.remainingAmount === 0 ? 'Paid' : 'Pending',
                paymentHistory
              });
            });
          }
        });

        setPaymentsData(formattedPayments);
        setLoading(false);
      } else {
        setPaymentsData([]);
        setLoading(false);
      }
    });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate totals
  const totals = paymentsData.reduce((acc, payment) => ({
    total: acc.total + payment.totalAmount,
    paid: acc.paid + payment.paidAmount,
    remaining: acc.remaining + payment.remainingAmount
  }), { total: 0, paid: 0, remaining: 0 });

  // Get current payments
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = paymentsData.slice(indexOfFirstPayment, indexOfLastPayment);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(paymentsData.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total Fees</p>
          <p className="text-2xl font-bold text-gray-800">
            ${totals.total.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-bold text-gray-800">
            ${totals.paid.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
          <p className="text-sm text-gray-600">Outstanding Balance</p>
          <p className="text-2xl font-bold text-gray-800">
            ${totals.remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Fees List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
          <div className="space-y-6">
            {currentPayments.map((fee) => (
              <div key={`${fee.studentId}-${fee.feeId}`} className="border rounded-lg overflow-hidden">
                {/* Fee Header */}
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{fee.description}</h3>
                    <p className="text-sm text-gray-500">
                      Student: {fee.studentId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Posted: {new Date(fee.datePosted).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">
                      ${fee.totalAmount.toLocaleString()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {fee.status}
                    </span>
                  </div>
                </div>

                {/* Fee Details */}
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="text-green-600 font-medium">
                      ${fee.paidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="text-red-600 font-medium">
                      ${fee.remainingAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(fee.paidAmount / fee.totalAmount) * 100}%` }}
                    ></div>
                  </div>

                  {/* Payment History */}
                  {fee.paymentHistory.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Payment History</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Method</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {fee.paymentHistory.map((payment) => (
                              <tr key={payment.id}>
                                <td className="px-4 py-2 text-sm text-gray-600">
                                  {new Date(payment.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                                  ${payment.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600">
                                  {payment.method}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstPayment + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastPayment, paymentsData.length)}
                    </span>{' '}
                    of <span className="font-medium">{paymentsData.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === number
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;