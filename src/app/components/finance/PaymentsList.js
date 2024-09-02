import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import PaymentsChart from './PaymentsChart'; // Import the PaymentsChart component

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date'); // Default sort by date
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending order
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10); // Number of entries to show per page

  useEffect(() => {
    const paymentsRef = ref(database, 'payments');

    const unsubscribe = onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allPayments = [];
        // Loop through all student payments
        for (const studentId in data) {
          if (data.hasOwnProperty(studentId)) {
            const studentPayments = data[studentId];
            for (const paymentId in studentPayments) {
              if (studentPayments.hasOwnProperty(paymentId)) {
                const payment = { ...studentPayments[paymentId], studentId }; // Add studentId to payment
                allPayments.push(payment);
              }
            }
          }
        }
        setPayments(allPayments);
      } else {
        setPayments([]); // No payments found
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments. Please try again.');
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Handle search
  const filteredPayments = payments.filter((payment) => {
    const studentIdMatch = payment.studentId && payment.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const paymentMethodMatch = payment.paymentMethod && payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    const purposeMatch = payment.purpose && payment.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    return studentIdMatch || paymentMethodMatch || purposeMatch;
  });

  // Sorting logic
  const sortedPayments = filteredPayments.sort((a, b) => {
    const isAsc = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'amount') {
      return (a.amount - b.amount) * isAsc;
    } else if (sortField === 'date') {
      return (new Date(a.timestamp) - new Date(b.timestamp)) * isAsc;
    }
    return 0; // Default case
  });

  // Pagination logic
  const indexOfLastPayment = currentPage * entriesPerPage;
  const indexOfFirstPayment = indexOfLastPayment - entriesPerPage;
  const currentPayments = sortedPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  
  const totalPages = Math.ceil(sortedPayments.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Payments List</h2>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by Student ID, Method, or Purpose"
        className="border p-2 mb-4 w-full"
      />

      <div className="flex flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/2 p-2">
          <PaymentsChart payments={filteredPayments} /> {/* Pass filtered payments to the chart */}
        </div>
        
        <div className="w-full md:w-1/2 p-2">
          {currentPayments.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            <table className="min-w-full text-sm text-left mt-2 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th
                    className="border border-gray-300 p-2 cursor-pointer"
                    onClick={() => handleSort('studentId')}
                  >
                    Student ID 
                    {sortField === 'studentId' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                    )}
                  </th>
                  <th
                    className="border border-gray-300 p-2 cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Amount 
                    {sortField === 'amount' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                    )}
                  </th>
                  <th
                    className="border border-gray-300 p-2 cursor-pointer"
                    onClick={() => handleSort('paymentMethod')}
                  >
                    Payment Method 
                    {sortField === 'paymentMethod' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                    )}
                  </th>
                  <th
                    className="border border-gray-300 p-2 cursor-pointer"
                    onClick={() => handleSort('purpose')}
                  >
                    Purpose 
                    {sortField === 'purpose' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                    )}
                  </th>
                  <th
                    className="border border-gray-300 p-2 cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date 
                    {sortField === 'date' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{payment.studentId}</td>
                    <td className="border border-gray-300 p-2">{payment.amount}</td>
                    <td className="border border-gray-300 p-2">{payment.paymentMethod}</td>
                    <td className="border border-gray-300 p-2">{payment.purpose}</td>
                    <td className="border border-gray-300 p-2">{new Date(payment.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-end"> {/* Aligns pagination to the right */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentsList;
