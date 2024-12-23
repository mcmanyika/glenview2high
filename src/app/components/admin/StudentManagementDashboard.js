import React from "react";
import Accounts from "../student/Accounts";

const StudentManagementDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-white p-2">
      {/* Quick Actions */}
      <section className="bg-white p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={() => window.location.href = '/admin/admission'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300"
          >
            Add New Student
          </button>
          <button 
            onClick={() => window.location.href = '/attendance'} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300"
          >
            View Attendance
          </button>
        </div>
        <Accounts />
      </section>
    </div>
  );
};

export default StudentManagementDashboard;
