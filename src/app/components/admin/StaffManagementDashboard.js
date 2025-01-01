import React, { useState, useEffect } from "react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { motion, AnimatePresence } from "framer-motion";

const StaffManagementDashboard = () => {
  const [search, setSearch] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const staffRoles = [
    "Staff Member",
    "Teacher",
    "Headmaster",
    "Senior Master",
    "Deputy Headmaster",
    "Department Head",
    "Administrator",
    "Counselor",
    "Librarian",
    "IT Support",
    "Accounts Staff"
  ];

  useEffect(() => {
    const staffRef = ref(database, 'userTypes');
    onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter users where userType is 'staff' and transform into array
        const staffArray = Object.entries(data)
          .filter(([_, user]) => user.userType === 'staff')
          .map(([id, user]) => ({
            id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            role: user.role || 'Staff Member',
            email: user.email,
            status: user.status || 'Active',
            phone: user.phone,
          }));
        setStaffList(staffArray);
      } else {
        setStaffList([]);
      }
      setLoading(false);
    });
  }, []);

  // Filter staff members based on the search input
  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase()) ||
    staff.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStaffClick = (staff) => {
    // Split the name into firstName and lastName if they don't exist
    if (!staff.firstName || !staff.lastName) {
      const [firstName = '', lastName = ''] = staff.name.split(' ');
      setEditForm({
        ...staff,
        firstName: staff.firstName || firstName,
        lastName: staff.lastName || lastName
      });
    } else {
      setEditForm(staff);
    }
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const staffRef = ref(database, `userTypes/${selectedStaff.id}`);
      await update(staffRef, {
        ...editForm,
        updatedAt: new Date().toISOString()
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating staff member:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full  p-6 bg-white shadow-md rounded-lg">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-200 rounded-lg text-center shadow-sm">
          <h3 className="text-lg font-semibold">Total Staff</h3>
          <p className="text-2xl font-bold text-white">{staffList.length}</p>
        </div>
        <div className="p-4 bg-blue-300 rounded-lg text-center shadow-sm">
          <h3 className="text-lg font-semibold">Active Staff</h3>
          <p className="text-2xl font-bold text-white">
            {staffList.filter((staff) => staff.status === "Active").length}
          </p>
        </div>
        <div className="p-4 bg-blue-200 rounded-lg text-center shadow-sm">
          <h3 className="text-lg font-semibold">Inactive Staff</h3>
          <p className="text-2xl font-bold text-white">
            {staffList.filter((staff) => staff.status === "Inactive").length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search staff by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm border-gray-200 rounded-lg">
          <thead className="bg-blue-300 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr 
                key={staff.id} 
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handleStaffClick(staff)}
              >
                <td className="py-2 px-4 capitalize">{staff.name}</td>
                <td className="py-2 px-4">{staff.role}</td>
                <td className="py-2 px-4">{staff.phone}</td>
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

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold dark:text-white">Edit Staff Member</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 dark:text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={editForm.role || 'Staff Member'}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {staffRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editForm.status || 'Active'}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffManagementDashboard;
