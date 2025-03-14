import React from "react";
import Accounts from "../student/Accounts";

const StudentManagementDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-white p-2">
      {/* Quick Actions */}
      <Accounts />
    </div>
  );
};

export default StudentManagementDashboard;
