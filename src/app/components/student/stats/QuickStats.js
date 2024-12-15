import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { FaUserGraduate, FaClipboardCheck, FaClock, FaChartLine } from 'react-icons/fa';
import { useGlobalState } from '../../../store';

const QuickStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId] = useGlobalState('studentId');

  useEffect(() => {
    if (!studentId) return;

    const statsRef = ref(database, `userTypes/${studentId}/dashboardStats`);
    const unsubscribe = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.val());
      } else {
        setStats({
          attendance: { value: '0%', trend: '0%', status: 'neutral' },
          grade: { value: '0', trend: '0', status: 'neutral' },
          pending: { value: '0', trend: '0', status: 'neutral' },
          upcoming: { value: '0', trend: '0', status: 'neutral' }
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId]);

  if (loading) {
    return <div className="animate-pulse">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<FaUserGraduate />}
        title="Attendance Rate"
        value={stats?.attendance?.value || '0%'}
        trend={stats?.attendance?.trend || '0%'}
        status={stats?.attendance?.status || 'neutral'}
      />
      <StatCard
        icon={<FaChartLine />}
        title="Average Grade"
        value={stats?.grade?.value || '0'}
        trend={stats?.grade?.trend || '0'}
        status={stats?.grade?.status || 'neutral'}
      />
      <StatCard
        icon={<FaClipboardCheck />}
        title="Pending Assignments"
        value={stats?.pending?.value || '0'}
        trend={stats?.pending?.trend || '0'}
        status={stats?.pending?.status || 'neutral'}
      />
      <StatCard
        icon={<FaClock />}
        title="Upcoming Tests"
        value={stats?.upcoming?.value || '0'}
        trend={stats?.upcoming?.trend || '0'}
        status={stats?.upcoming?.status || 'neutral'}
      />
    </div>
  );
};

const StatCard = ({ icon, title, value, trend, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'neutral':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-gray-100 dark:border-slate-800">
      <div className="flex items-center space-x-2">
        <span className="text-main3 dark:text-main2">{icon}</span>
        <h4 className="text-sm text-gray-500 dark:text-gray-400">{title}</h4>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
        <span className={`text-sm ${getStatusColor(status)}`}>{trend}</span>
      </div>
    </div>
  );
};

export default QuickStats;