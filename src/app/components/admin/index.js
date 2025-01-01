import React, { useState } from "react";
import StudentManagementDashboard from "./StudentManagementDashboard";
import FeeManagementDashboard from "./FeeManagementDashboard";
import StaffManagementDashboard from "./StaffManagementDashboard";
import AnalyticsAndReportingDashboard from "./AnalyticsAndReportingDashboard";
import ScheduleManagementDashboard from "./ScheduleManagementDashboard";
import NotificationsDashboard from "./NotificationsDashboard";
import { motion, AnimatePresence } from "framer-motion";
import GenderDonutChart from "../student/stats/GenderDonutChart";
import PaymentsChart from "../student/stats/Payments";
import FeesManagement from "./FeesManagement";

const features = [
  {
    title: "Student Management",
    icon: "🎓",
  },
  // {
  //   title: "Analytics & Reporting",
  //   icon: "📊",
  // },
  {
    title: "Staff Management",
    icon: "🧑🏿‍🏫",
  },
  {
    title: "Fee Management",
    icon: "💰",
  },
  {
    title: "Schedule Management",
    icon: "📅",
  },
  {
    title: "Notifications",
    icon: "🔔",
  },
];

const AdminDashboard = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map feature titles to their respective dashboard components
  const featureComponents = {
    "Student Management": (
      <div className="flex items-center">
        <StudentManagementDashboard />
      </div>
    ),
    "Analytics & Reporting": (
      <div className="flex items-center w-full">
        <AnalyticsAndReportingDashboard />
      </div>
    ),
    "Staff Management": (
      <div className="flex items-center">
        <StaffManagementDashboard />
      </div>
    ),
    "Fee Management": (
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <FeesManagement />
        </div>
        <div className="w-full">
          <FeeManagementDashboard />
        </div>
      </div>
    ),
    "Schedule Management": (
      <div className="flex items-center">
        <ScheduleManagementDashboard />
      </div>
    ),
    "Notifications": (
      <div className="flex items-center">
        <NotificationsDashboard />
      </div>
    ),
  };

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setActiveFeature(null), 300);
  };

  return (
    <div className="bg-gray-100 overflow-hidden min-h-screen relative">
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative text-slate-900 text-center shadow-sm rounded-md bg-white overflow-hidden hover:scale-105 transform transition-all duration-300 cursor-pointer"
              onClick={() => handleFeatureClick(feature.title)}
            >
              <div className="p-6 flex flex-col justify-between">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <div>
                  <h3 className="text-md font-thin">{feature.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row mt-10 justify-center items-center gap-6">
          <div className="w-full lg:w-1/2">
            <PaymentsChart />
          </div>
          <div className="w-full lg:w-1/2">
            <GenderDonutChart />
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeModal}
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 w-full lg:w-[50%] h-full bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {features.find(f => f.title === activeFeature)?.icon}
                  </span>
                  <h2 className="text-xl font-semibold dark:text-white">
                    {activeFeature}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="w-full h-full p-6">
                {activeFeature && featureComponents[activeFeature]}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
