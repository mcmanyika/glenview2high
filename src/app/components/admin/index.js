import React, { useState } from "react";
import StudentManagementDashboard from "./StudentManagementDashboard";
import FeeManagementDashboard from "./FeeManagementDashboard";
import StaffManagementDashboard from "./StaffManagementDashboard";
import AnalyticsAndReportingDashboard from "./AnalyticsAndReportingDashboard";
import ScheduleManagementDashboard from "./ScheduleManagementDashboard";
import NotificationsDashboard from "./NotificationsDashboard";

const features = [
  {
    title: "Student Management",
    description: "Track student profiles, attendance, and academic progress in real-time.",
    icon: "🎓",
    color: "from-blue-300 to-cyan-400",
    component: <StudentManagementDashboard />,
  },
  
  
  {
    title: "Analytics & Reporting",
    description: "Gain insights into performance, attendance trends, and growth metrics.",
    icon: "📊",
    color: "from-cyan-400 to-cyan-400",
    component: <AnalyticsAndReportingDashboard />,
  },
  {
    title: "Staff Management",
    description: "Manage HR for teaching and non-teaching staff efficiently.",
    icon: "🧑🏿‍🏫", 
    color: "from-cyan-400 to-blue-300",
    component: <StaffManagementDashboard />,
  },
  {
    title: "Fee Management",
    description: "Automate fee collection, reminders, and tracking with ease.",
    icon: "💰",
    color: "from-blue-300 to-cyan-400",
    component: <FeeManagementDashboard />,
  },
  {
    title: "Schedule Management",
    description: "Create and manage timetables for classes, teachers, and events.",
    icon: "📅",
    color: "from-cyan-400 to-cyan-400",
    component: <ScheduleManagementDashboard />,
  },
  {
    title: "Notifications",
    description: "Send real-time updates, alerts, and announcements instantly.",
    icon: "🔔",
    color: "from-cyan-400 to-blue-300",
    component: <NotificationsDashboard />,
  },
];

const AdminDashboard = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  // Find the currently selected feature component
  const activeFeatureComponent =
    features.find((feature) => feature.title === activeFeature)?.component || null;

  return (
    <div className="bg-gray-100 overflow-y-auto min-h-screen">
      {/* Conditional Rendering */}
      {activeFeature ? (
        <div>
          {/* Back Button */}
          <button
            onClick={() => setActiveFeature(null)}
            className="ml-6 mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            ← Back to Dashboard
          </button>

          {/* Render the selected dashboard component */}
          <div className="p-6">{activeFeatureComponent}</div>
        </div>
      ) : (
        <main className="container mx-auto p-6 pt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-r ${feature.color} text-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer`}
                onClick={() => setActiveFeature(feature.title)}
              >
                <div className="p-6 flex flex-col justify-between h-48">
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-90">{feature.description}</p>
                  </div>
                </div>
                {/* Overlay Effect */}
                <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default AdminDashboard;
