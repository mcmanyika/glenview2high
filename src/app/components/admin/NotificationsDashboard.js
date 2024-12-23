import React, { useState, useEffect } from "react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const noticesRef = ref(database, 'notices');
    
    onValue(noticesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object to array and add timestamps
        const noticesArray = Object.entries(data).map(([id, notice]) => ({
          id,
          ...notice,
          timeAgo: getTimeAgo(notice.timestamp) // Convert timestamp to "time ago" format
        }));

        // Sort by timestamp, newest first
        noticesArray.sort((a, b) => b.timestamp - a.timestamp);
        
        setNotifications(noticesArray);
      } else {
        setNotifications([]);
      }
      setLoading(false);
    });
  }, []);

  // Function to calculate time ago
  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  // Function to clear all notifications
  const clearNotifications = async () => {
    try {
      const noticesRef = ref(database, 'notices');
      await remove(noticesRef);
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No notifications available
        </div>
      ) : (
        <>
          {/* Notification List */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition-all"
              >
                <p className="text-lg font-semibold">{notification.message}</p>
                <span className="text-sm text-gray-500">{notification.timeAgo}</span>
              </div>
            ))}
          </div>

          {/* Clear Notifications */}
          <button
            onClick={clearNotifications}
            className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
          >
            Clear Notifications
          </button>
        </>
      )}
    </div>
  );
};

export default NotificationsDashboard;
