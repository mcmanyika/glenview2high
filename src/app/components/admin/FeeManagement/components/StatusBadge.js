import React from 'react';

const StatusBadge = ({ status, paymentStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case paymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case paymentStatus.PARTIAL:
        return 'bg-yellow-100 text-yellow-800';
      case paymentStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge; 