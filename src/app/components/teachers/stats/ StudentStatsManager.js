import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import StatsInputForm from './StatsInputForm';
import AcademicProgressInput from './AcademicProgressInput';

const StudentStatsManager = ({ studentId }) => {
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentRef = ref(database, `userTypes/${studentId}`);
        const snapshot = await get(studentRef);
        if (snapshot.exists()) {
          setCurrentData(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
              ${activeTab === 'stats'
                ? 'border-main3 text-main3'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            General Stats
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
              ${activeTab === 'academic'
                ? 'border-main3 text-main3'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Academic Progress
          </button>
        </nav>
      </div>

      <div className="p-4">
        {activeTab === 'stats' ? (
          <StatsInputForm
            studentId={studentId}
            currentStats={currentData?.dashboardStats}
          />
        ) : (
          <AcademicProgressInput
            studentId={studentId}
            currentProgress={currentData?.academicProgress}
          />
        )}
      </div>
    </div>
  );
};

export default StudentStatsManager;