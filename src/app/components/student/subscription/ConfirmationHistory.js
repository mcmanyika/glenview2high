import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';

const ConfirmationHistory = ({ studentId }) => {
  const [confirmations, setConfirmations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmations = async () => {
      if (!studentId) return;

      try {
        const subscriptionRef = ref(database, `students/${studentId}/subscriptions`);
        const snapshot = await get(subscriptionRef);

        if (snapshot.exists()) {
          const subscriptionData = snapshot.val();
          // Convert object of subscriptions to array
          const confirmationsArray = Object.values(subscriptionData);
          setConfirmations(confirmationsArray);
        }
      } catch (error) {
        console.error('Error fetching confirmations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfirmations();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[100px]">
        <FaSpinner className="animate-spin text-2xl text-blue-600" />
      </div>
    );
  }

  if (confirmations.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No subscription history found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Subscription History
        </h3>
        <div className="space-y-4">
          {confirmations.map((confirmation, index) => (
            <div 
              key={index}
              className="border dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Confirmation ID
                  </p>
                  <p className="font-medium dark:text-white">
                    {confirmation.confirmationId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Term Period
                  </p>
                  <p className="font-medium dark:text-white">
                    {confirmation.termPeriod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <p className={`font-medium ${
                    confirmation.status === 'active' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {confirmation.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="font-medium dark:text-white">
                    {confirmation.startDate 
                      ? format(new Date(confirmation.startDate), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    End Date
                  </p>
                  <p className="font-medium dark:text-white">
                    {confirmation.endDate
                      ? format(new Date(confirmation.endDate), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium dark:text-white">
                    {confirmation.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationHistory; 