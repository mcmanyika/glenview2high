import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { toast } from 'react-toastify';

const StatsInputForm = ({ studentId, currentStats }) => {
  const [stats, setStats] = useState({
    attendance: {
      value: currentStats?.attendance?.value || '0%',
      trend: currentStats?.attendance?.trend || '0%',
      status: currentStats?.attendance?.status || 'neutral'
    },
    grade: {
      value: currentStats?.grade?.value || '0',
      trend: currentStats?.grade?.trend || '0',
      status: currentStats?.grade?.status || 'neutral'
    },
    pending: {
      value: currentStats?.pending?.value || '0',
      trend: currentStats?.pending?.trend || '0',
      status: currentStats?.pending?.status || 'neutral'
    },
    upcoming: {
      value: currentStats?.upcoming?.value || '0',
      trend: currentStats?.upcoming?.trend || '0',
      status: currentStats?.upcoming?.status || 'neutral'
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const statsRef = ref(database, `userTypes/${studentId}/dashboardStats`);
      await update(statsRef, stats);
      toast.success('Stats updated successfully!');
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Failed to update stats');
    }
  };

  const handleStatChange = (category, field, value) => {
    setStats(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(stats).map(([category, values]) => (
          <div key={category} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 capitalize text-gray-800 dark:text-white">
              {category} Stats
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Value
                </label>
                <input
                  type="text"
                  value={values.value}
                  onChange={(e) => handleStatChange(category, 'value', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-main3 focus:ring-main3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trend
                </label>
                <input
                  type="text"
                  value={values.trend}
                  onChange={(e) => handleStatChange(category, 'trend', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-main3 focus:ring-main3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={values.status}
                  onChange={(e) => handleStatChange(category, 'status', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-main3 focus:ring-main3"
                >
                  <option value="neutral">Neutral</option>
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-main3 hover:bg-main2 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Update Stats
        </button>
      </div>
    </form>
  );
};

export default StatsInputForm;