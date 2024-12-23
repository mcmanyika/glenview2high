import React from "react";

const AnalyticsAndReportingDashboard = () => {
  const reports = [
    { title: "Student Attendance", value: "96%", color: "bg-blue-500" },
    { title: "Average Grades", value: "B+", color: "bg-green-500" },
    { title: "Staff Performance", value: "88%", color: "bg-yellow-500" },
    { title: "Fee Collection Rate", value: "92%", color: "bg-indigo-500" },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Analytics & Reporting</h1>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {reports.map((report, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-white shadow-md ${report.color}`}
          >
            <h3 className="text-lg font-semibold">{report.title}</h3>
            <p className="text-3xl font-bold mt-2">{report.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="w-full bg-gray-100 p-6 rounded-lg text-center shadow-md">
        <h3 className="text-xl font-semibold mb-4">Performance Chart</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          [Chart Placeholder]
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAndReportingDashboard;
