import React, { useState } from "react";

const FeeManagementDashboard = () => {
  const [search, setSearch] = useState("");
  const transactions = [
    { id: 1, name: "John Doe", class: "Grade 5", amount: 500, status: "Paid", date: "2024-08-01" },
    { id: 2, name: "Jane Smith", class: "Grade 6", amount: 300, status: "Pending", date: "2024-08-02" },
    { id: 3, name: "Alice Johnson", class: "Grade 7", amount: 450, status: "Paid", date: "2024-08-03" },
    { id: 4, name: "Bob Brown", class: "Grade 8", amount: 400, status: "Overdue", date: "2024-08-04" },
    // Add more sample transactions
  ];

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Fee Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Collected</h3>
          <p className="text-2xl font-bold text-green-600">$1,650</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Pending Fees</h3>
          <p className="text-2xl font-bold text-yellow-600">$300</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Overdue Fees</h3>
          <p className="text-2xl font-bold text-red-600">$400</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Student Name</th>
              <th className="py-2 px-4 text-left">Class</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="py-2 px-4">{transaction.id}</td>
                <td className="py-2 px-4">{transaction.name}</td>
                <td className="py-2 px-4">{transaction.class}</td>
                <td className="py-2 px-4">${transaction.amount}</td>
                <td
                  className={`py-2 px-4 font-semibold ${
                    transaction.status === "Paid"
                      ? "text-green-600"
                      : transaction.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.status}
                </td>
                <td className="py-2 px-4">{transaction.date}</td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagementDashboard;
