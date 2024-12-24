import React, { useState, useEffect } from "react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const PaymentsTable = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'datePosted', direction: 'desc' });
  const [expandedType, setExpandedType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const studentFeesRef = ref(database, 'studentFees');
    
    onValue(studentFeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allPayments = [];
        const groupedPayments = {};

        // First collect all payments
        Object.entries(data).forEach(([studentId, studentFees]) => {
          if (studentFees) {
            Object.entries(studentFees).forEach(([feeId, fee]) => {
              const description = fee.description || 'Other';
              const paidAmount = fee.totalAmount - (fee.remainingAmount || 0);
              
              // Initialize group if it doesn't exist
              if (!groupedPayments[description]) {
                groupedPayments[description] = {
                  description,
                  totalAmount: 0,
                  paidAmount: 0,
                  remainingAmount: 0,
                  fees: []
                };
              }

              // Add to group totals
              groupedPayments[description].totalAmount += fee.totalAmount;
              groupedPayments[description].paidAmount += paidAmount;
              groupedPayments[description].remainingAmount += (fee.remainingAmount || 0);

              // Add individual fee to group
              groupedPayments[description].fees.push({
                feeId,
                studentId,
                totalAmount: fee.totalAmount,
                paidAmount,
                remainingAmount: fee.remainingAmount || 0,
                datePosted: fee.datePosted,
                paymentHistory: fee.payments ? Object.entries(fee.payments).map(([paymentId, payment]) => ({
                  paymentId,
                  amount: payment.amount,
                  date: payment.date,
                  method: payment.method || 'Not specified',
                  reference: payment.reference || 'N/A'
                })) : []
              });
            });
          }
        });

        // Convert grouped payments to array and calculate percentages
        const groupedPaymentsArray = Object.values(groupedPayments).map(group => ({
          ...group,
          percentagePaid: ((group.paidAmount / group.totalAmount) * 100).toFixed(1)
        }));

        setPaymentsData(groupedPaymentsArray);
        setLoading(false);
      }
    });
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction = prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc';
      
      const sortedData = [...paymentsData].sort((a, b) => {
        if (typeof a[key] === 'number') {
          return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
        }
        return direction === 'asc' 
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      });

      setPaymentsData(sortedData);
      return { key, direction };
    });
  };

  const toggleExpand = (description) => {
    setExpandedType(expandedType === description ? null : description);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Calculate overall totals
  const totals = paymentsData.reduce((acc, group) => ({
    total: acc.total + group.totalAmount,
    paid: acc.paid + group.paidAmount,
    remaining: acc.remaining + group.remainingAmount
  }), { total: 0, paid: 0, remaining: 0 });

  return (
    <div className="bg-white mt-10 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-6">Fee Type Summary</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Fees</p>
          <p className="text-2xl font-bold text-blue-700">
            ${totals.total.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Total Paid</p>
          <p className="text-2xl font-bold text-green-700">
            ${totals.paid.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 font-medium">Total Remaining</p>
          <p className="text-2xl font-bold text-gray-700">
            ${totals.remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Grouped Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expand
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('description')}
              >
                Fee Type
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                Total Amount
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('paidAmount')}
              >
                Paid Amount
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('remainingAmount')}
              >
                Remaining
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('percentagePaid')}
              >
                % Paid
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentsData.map((group) => {
              // Filter fees based on search term
              const filteredFees = group.fees.filter(fee => 
                fee.studentId.toLowerCase().includes(searchTerm.toLowerCase())
              );

              // Calculate pagination for filtered fees
              const indexOfLastFee = currentPage * itemsPerPage;
              const indexOfFirstFee = indexOfLastFee - itemsPerPage;
              const currentFees = filteredFees.slice(indexOfFirstFee, indexOfLastFee);
              const totalPages = Math.ceil(filteredFees.length / itemsPerPage);

              return (
                <React.Fragment key={group.description}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleExpand(group.description)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expandedType === group.description ? '▼' : '▶'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{group.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${group.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${group.paidAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {group.remainingAmount === 0 ? (
                        <button className="px-2 py-1 bg-green-600 text-white font-medium">Fully Paid</button>
                      ) : (
                        `$${group.remainingAmount.toLocaleString()}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16">{group.percentagePaid}%</div>
                        <div className="flex-1 h-2 ml-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${group.percentagePaid}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expandedType === group.description && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        {/* Search Input */}
                        <div className="mb-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search by Student ID..."
                              value={searchTerm}
                              onChange={handleSearch}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          {filteredFees.length === 0 && searchTerm && (
                            <p className="mt-2 text-sm text-gray-500">
                              No results found for `{searchTerm}`
                            </p>
                          )}
                        </div>

                        {filteredFees.length > 0 ? (
                          <>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student ID</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Paid</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Remaining</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date Posted</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentFees.map((fee) => (
                                  <tr key={`${fee.studentId}-${fee.feeId}`} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 whitespace-nowrap">{fee.studentId}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">${fee.totalAmount.toLocaleString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">${fee.paidAmount.toLocaleString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      {fee.remainingAmount === 0 ? (
                                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                          Fully Paid
                                        </span>
                                      ) : (
                                        `$${fee.remainingAmount.toLocaleString()}`
                                      )}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      {new Date(fee.datePosted).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between items-center w-full">
                                  <div className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">{indexOfFirstFee + 1}</span>
                                    {' '}-{' '}
                                    <span className="font-medium">
                                      {Math.min(indexOfLastFee, filteredFees.length)}
                                    </span>
                                    {' '}of{' '}
                                    <span className="font-medium">{filteredFees.length}</span>
                                    {' '}results
                                  </div>
                                  <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                      <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                          currentPage === 1
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                      >
                                        Previous
                                      </button>
                                      {[...Array(totalPages)].map((_, index) => (
                                        <button
                                          key={index + 1}
                                          onClick={() => handlePageChange(index + 1)}
                                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === index + 1
                                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                              : 'text-gray-500 hover:bg-gray-50'
                                          }`}
                                        >
                                          {index + 1}
                                        </button>
                                      ))}
                                      <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                          currentPage === totalPages
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                      >
                                        Next
                                      </button>
                                    </nav>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : null}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;