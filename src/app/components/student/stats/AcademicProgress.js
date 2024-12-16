import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useGlobalState } from '../../../store';

const AcademicProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId] = useGlobalState('studentId');
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [detailedData, setDetailedData] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!studentId) return;

      try {
        const reportsRef = ref(database, `reports/${studentId}`);
        const snapshot = await get(reportsRef);

        if (snapshot.exists()) {
          const reports = snapshot.val();
          
          const subjectPerformance = {};
          const detailedPerformance = {};
          
          const sortedReports = Object.values(reports).sort((a, b) => a.timestamp - b.timestamp);
          
          sortedReports.forEach(report => {
            report.subjects.forEach(subject => {
              if (!subjectPerformance[subject.name]) {
                subjectPerformance[subject.name] = [];
                detailedPerformance[subject.name] = [];
              }
              subjectPerformance[subject.name].push(parseFloat(subject.percentage || 0));
              detailedPerformance[subject.name].push({
                score: parseFloat(subject.percentage || 0),
                date: report.timestamp,
                comments: subject.comments || '',
                grade: subject.grade || '',
                possibleMark: subject.possibleMark || '',
                obtainedMark: subject.obtainedMark || '',
                classAverage: subject.classAverage || '',
                effortGrade: subject.effortGrade || '',
                remarks: subject.remarks || '',
              });
            });
          });

          const averageSubjectPerformance = Object.entries(subjectPerformance).reduce((acc, [subject, scores]) => {
            const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            acc[subject] = Math.round(average);
            return acc;
          }, {});

          setProgressData({
            subjectPerformance: averageSubjectPerformance,
            detailedPerformance
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

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setDetailedData(progressData.detailedPerformance[subject]);
    setShowModal(true);
  };

  if (loading) {
    return <div className="animate-pulse">Loading progress...</div>;
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="p-4 space-y-4">
          {progressData?.subjectPerformance && 
            Object.entries(progressData.subjectPerformance)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, progress]) => (
                <SubjectProgress 
                  key={subject}
                  subject={subject}
                  progress={progress}
                  onClick={() => handleSubjectClick(subject)}
                />
              ))
          }
        </div>
      </div>

      {/* Detailed Performance Modal */}
      {showModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                {selectedSubject} Performance Details
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Possible Mark</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Obtained Mark</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class Average</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Effort Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {detailedData && detailedData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {selectedSubject}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {data.possibleMark}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {data.obtainedMark}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <span className={`${
                          data.score >= 90 ? 'text-green-500' :
                          data.score >= 75 ? 'text-blue-500' :
                          data.score >= 60 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {data.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {data.grade}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {data.classAverage}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {data.effortGrade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Comments Section - without date */}
            <div className="mt-4">
              {detailedData && detailedData.map((data, index) => (
                data.comments && (
                  <div key={index} className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Comments: </span>
                      {data.comments}
                    </p>
                  </div>
                )
              ))}
            </div>

            {/* Remarks Section - without date */}
            <div className="mt-4">
              {detailedData && detailedData.map((data, index) => (
                data.remarks && (
                  <div key={index} className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Teacher Remarks: </span>
                      <br />
                      <p className="pt-2">
                        {data.remarks}
                      </p>
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SubjectProgress = ({ subject, progress, onClick }) => {
  const category = getPerformanceCategory(progress);
  
  return (
    <div className="space-y-2 cursor-pointer hover:opacity-80" onClick={onClick}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {subject}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {progress}%
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${category.color} text-white`}>
            {category.label}
          </span>
        </div>
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

const getPerformanceCategory = (progress) => {
  if (progress >= 90) return { label: 'Excellent', color: 'bg-green-500' };
  if (progress >= 75) return { label: 'Good', color: 'bg-blue-500' };
  if (progress >= 60) return { label: 'Average', color: 'bg-yellow-500' };
  return { label: 'Needs Improvement', color: 'bg-red-500' };
};

export default AcademicProgress;