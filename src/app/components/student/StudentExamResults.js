import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useGlobalState } from '../../store';

const StudentExamResults = () => {
  const [examResults, setExamResults] = useState([]);
  const [admissionId] = useGlobalState('studentId');

  useEffect(() => {
    if (!admissionId) return;

    const resultsRef = ref(database, `admissions/${admissionId}/exams/`);

    // Fetch exam results from admissions
    onValue(resultsRef, (resultsSnapshot) => {
      const resultsData = resultsSnapshot.val();
      if (resultsData) {
        const studentResultsPromises = Object.entries(resultsData).map(
          async ([examId, result]) => {
            // Fetch the score for each exam from examResults
            const scoresRef = ref(database, `examResults/${admissionId}/${examId}`);
            let score = 0;

            await onValue(scoresRef, (scoresSnapshot) => {
              const scoresData = scoresSnapshot.val();
              if (scoresData) {
                score = scoresData.score || 0;
              }
            });

            return {
              examId,
              ...result,
              score,
            };
          }
        );

        Promise.all(studentResultsPromises).then((combinedResults) => {
          setExamResults(combinedResults);
        });
      }
    });
  }, [admissionId]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Your Exam Results</h2>
      <p className="text-sm mb-2">Admission ID: {admissionId}</p>
      {examResults.length === 0 ? (
        <p>No exam results found.</p>
      ) : (
        <table className="min-w-full text-sm border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Exam Name</th>
              <th className="border border-gray-300 px-4 py-2">Score</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {examResults.map((result) => (
              <tr key={result.examId}>
                <td className="border border-gray-300 px-4 py-2">{result.examId}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    result.score >= 50 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {result.score}
                </td>
                <td className="border border-gray-300 px-4 py-2">{result.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentExamResults;
