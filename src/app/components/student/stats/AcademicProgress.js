import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useGlobalState } from '../../../store';

const AcademicProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId] = useGlobalState('studentId');

  useEffect(() => {
    const fetchReports = async () => {
      if (!studentId) return;

      try {
        const reportsRef = ref(database, `reports/${studentId}`);
        const snapshot = await get(reportsRef);

        if (snapshot.exists()) {
          const reports = snapshot.val();
          
          // Process reports data
          const subjectPerformance = {};
          
          // Sort reports by timestamp
          const sortedReports = Object.values(reports).sort((a, b) => a.timestamp - b.timestamp);
          
          // Process each report
          sortedReports.forEach(report => {
            // Update subject performance
            report.subjects.forEach(subject => {
              if (!subjectPerformance[subject.name]) {
                subjectPerformance[subject.name] = [];
              }
              subjectPerformance[subject.name].push(parseFloat(subject.percentage || 0));
            });
          });

          // Calculate average performance for each subject
          const averageSubjectPerformance = Object.entries(subjectPerformance).reduce((acc, [subject, scores]) => {
            const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            acc[subject] = Math.round(average);
            return acc;
          }, {});

          setProgressData({
            subjectPerformance: averageSubjectPerformance
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, [studentId]);

  if (loading) {
    return <div className="animate-pulse">Loading progress...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
      
      <div className="p-4 space-y-4">
        {progressData?.subjectPerformance && 
          Object.entries(progressData.subjectPerformance)
            .sort(([, a], [, b]) => b - a) // Sort by performance (highest first)
            .map(([subject, progress]) => (
              <SubjectProgress 
                key={subject}
                subject={subject}
                progress={progress}
              />
            ))
        }
      </div>
    </div>
  );
};

const SubjectProgress = ({ subject, progress }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-main3 dark:bg-main2 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AcademicProgress;