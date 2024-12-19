import React, { useState } from "react";

const StaffManagementDashboard = () => {
  const [search, setSearch] = useState("");
  const staffList = [
    { id: 1, name: "John Doe", role: "Math Teacher", email: "john.doe@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Science Teacher", email: "jane.smith@example.com", status: "Inactive" },
    { id: 3, name: "Alice Johnson", role: "Admin Staff", email: "alice.j@example.com", status: "Active" },
    { id: 4, name: "Bob Brown", role: "IT Support", email: "bob.b@example.com", status: "Active" },
    { id: 5, name: "Mary Adams", role: "Principal", email: "mary.a@example.com", status: "Active" },
  ];

  // Filter staff members based on the search input
  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Staff Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded-lg text-center shadow-sm">
          <h3 className="text-lg font-semibold">Total Staff</h3>
          <p className="text-2xl font-bold text-green-600">{staffList.length}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg text-center shadow-sm">
          <h3 className="text-lg font-semibold">Active Staff</h3>
          <p className="text-2xl font-bold text-blue-600">
            {staffList.filter((staff) => staff.status === "Active").length}
          </p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg text-center shadow-sm">
          <h3 className="text-lg font-semibold">Inactive Staff</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {staffList.filter((staff) => staff.status === "Inactive").length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search staff by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{staff.id}</td>
                <td className="py-2 px-4">{staff.name}</td>
                <td className="py-2 px-4">{staff.role}</td>
                <td className="py-2 px-4">{staff.email}</td>
                <td
                  className={`py-2 px-4 font-semibold ${
                    staff.status === "Active" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {staff.status}
                </td>
              </tr>
            ))}
            {filteredStaff.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagementDashboard;
