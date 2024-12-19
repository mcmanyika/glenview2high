import React, { useState } from "react";

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New exam schedule released for Grade 10.", time: "2 hours ago" },
    { id: 2, message: "Staff meeting scheduled for August 31.", time: "1 day ago" },
    { id: 3, message: "Fees deadline extended to September 5.", time: "2 days ago" },
  ]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Notifications</h1>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition-all"
          >
            <p className="text-lg font-semibold">{notification.message}</p>
            <span className="text-sm text-gray-500">{notification.time}</span>
          </div>
        ))}
      </div>

      {/* Clear Notifications */}
      <button
        onClick={() => setNotifications([])}
        className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
      >
        Clear Notifications
      </button>
    </div>
  );
};

export default NotificationsDashboard;
