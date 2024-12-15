import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useGlobalState } from '../../../store';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId] = useGlobalState('studentId');

  useEffect(() => {
    if (!studentId) return;

    const deadlinesRef = ref(database, `userTypes/${studentId}/deadlines`);
    const unsubscribe = onValue(deadlinesRef, (snapshot) => {
      if (snapshot.exists()) {
        const deadlinesData = snapshot.val();
        // Convert to array and sort by due date
        const deadlinesArray = Object.values(deadlinesData).sort((a, b) => 
          new Date(a.dueDate) - new Date(b.dueDate)
        );
        setDeadlines(deadlinesArray);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching deadlines:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId]);

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
      <div className="p-4 border-b border-gray-100 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Important Deadlines</h3>
      </div>
      <div className="p-4">
        {deadlines.map((deadline) => (
          <div 
            key={deadline.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className={getPriorityColor(deadline.priority)} />
              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                  {deadline.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {deadline.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-400" />
              <span className={`text-sm ${getPriorityColor(deadline.priority)}`}>
                {getTimeRemaining(deadline.dueDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deadlines;