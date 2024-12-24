import React from 'react';
import PaymentHistoryTable from './PaymentHistoryTable';
import { database } from '../../../../../../utils/firebaseConfig';
import { ref, get, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

const StudentPaymentModal = ({ 
  student, 
  onClose, 
  onAddPayment, 
  onPaymentClick,
  paymentStatus 
}) => {
  const [studentFees, setStudentFees] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const feesSnapshot = await get(ref(database, `studentFees/${student.id}`));
        if (feesSnapshot.exists()) {
          const feesData = feesSnapshot.val();
          const feesArray = Object.entries(feesData).map(([id, fee]) => ({
            id,
            ...fee
          }));
          setStudentFees(feesArray);
        }
      } catch (error) {
        console.error('Error fetching fees:', error);
      }
    };

    fetchFees();
  }, [student.id]);

  useEffect(() => {
    if (student) {
      const studentFeesRef = ref(database, `studentFees/${student.id}`);
      const unsubscribe = onValue(studentFeesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const feesArray = Object.entries(data).map(([feeId, fee]) => {
            const payments = fee.payments || {};
            const paymentsList = Object.entries(payments).map(([paymentId, payment]) => ({
              id: paymentId,
              ...payment,
              feeDescription: fee.description,
              date: new Date(payment.date).toLocaleDateString()
            }));
            return paymentsList;
          });
          const allPayments = feesArray.flat();
          setPaymentHistory(allPayments.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else {
          setPaymentHistory([]);
        }
      });

      return () => unsubscribe();
    }
  }, [student]);

  // Calculate summary using studentFees data
  const paymentSummary = studentFees.reduce((summary, fee) => ({
    total: summary.total + (fee.totalAmount || 0),
    paid: summary.paid + (fee.totalAmount - (fee.remainingAmount || 0)),
    remaining: summary.remaining + (fee.remainingAmount || 0)
  }), {
    total: 0,
    paid: 0,
    remaining: 0
  });

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

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Fees</p>
              <p className="text-2xl font-bold text-blue-700">
                ${paymentSummary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-green-700">
                ${paymentSummary.paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Remaining Balance</p>
              <p className="text-2xl font-bold text-gray-700">
                ${paymentSummary.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
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
            payments={paymentHistory}
            paymentStatus={paymentStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentModal; 