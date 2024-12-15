import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { toast } from 'react-toastify';

const AcademicProgressInput = ({ studentId, currentProgress }) => {
  const [performanceTrend, setPerformanceTrend] = useState(
    currentProgress?.performanceTrend || Array(6).fill({ month: '', score: 0 })
  );
  
  const [subjectPerformance, setSubjectPerformance] = useState(
    currentProgress?.subjectPerformance || {
      Mathematics: 0,
      Science: 0,
      English: 0,
      History: 0
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const progressRef = ref(database, `userTypes/${studentId}/academicProgress`);
      await update(progressRef, {
        performanceTrend,
        subjectPerformance
      });
      toast.success('Academic progress updated successfully!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update academic progress');
    }
  };

  const handleTrendChange = (index, field, value) => {
    const newTrend = [...performanceTrend];
    newTrend[index] = {
      ...newTrend[index],
      [field]: field === 'score' ? Number(value) : value
    };
    setPerformanceTrend(newTrend);
  };

  const handleSubjectChange = (subject, value) => {
    setSubjectPerformance(prev => ({
      ...prev,
      [subject]: Number(value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Performance Trend
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performanceTrend.map((item, index) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Month
                </label>
                <input
                  type="text"
                  value={item.month}
                  onChange={(e) => handleTrendChange(index, 'month', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.score}
                  onChange={(e) => handleTrendChange(index, 'score', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Subject Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(subjectPerformance).map(([subject, score]) => (
            <div key={subject}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {subject}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => handleSubjectChange(subject, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-main3 hover:bg-main2 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Update Academic Progress
        </button>
      </div>
    </form>
  );
};

export default AcademicProgressInput;