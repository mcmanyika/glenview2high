import React from "react";
import Accounts from "../student/Accounts";

const studentData = {
  totalStudents: 450,
  activeStudents: 430,
  graduatedStudents: 20,
  attendanceRate: "92%",
  performance: [
    { grade: "A", percentage: 40 },
    { grade: "B", percentage: 30 },
    { grade: "C", percentage: 20 },
    { grade: "D", percentage: 10 },
  ],
};

const StudentManagementDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Dashboard Header */}
      <header className="text-3xl font-bold text-blue-600 mb-6">
        🎓 Student Management Dashboard
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Students */}
        <div className="p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold">{studentData.totalStudents}</p>
        </div>
        {/* Active Students */}
        <div className="p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Students</h3>
          <p className="text-3xl font-bold">{studentData.activeStudents}</p>
        </div>
        {/* Graduated Students */}
        <div className="p-4 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Graduated Students</h3>
          <p className="text-3xl font-bold">{studentData.graduatedStudents}</p>
        </div>
        {/* Attendance Rate */}
        <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Attendance Rate</h3>
          <p className="text-3xl font-bold">{studentData.attendanceRate}</p>
        </div>
      </div>

      {/* Student Performance Overview */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-4">📈 Student Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {studentData.performance.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg text-center bg-gray-50 hover:shadow-lg transition-all duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Grade {item.grade}</h4>
              <p className="text-2xl font-semibold text-blue-600">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-700 mb-4">⚡ Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300">
            Add New Student
          </button>
          <button onClick={() => window.location.href = '/attendance'} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300">
            View Attendance
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300">
            Manage Grades
          </button>
        </div>
        <Accounts />
      </section>
    </div>
  );
};

export default StudentManagementDashboard;
