import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the path as necessary
import { toast } from 'react-toastify';

const ResultsModal = ({ student, examId, onClose }) => {
  const [score, setScore] = useState('');
  const [comment, setComment] = useState(''); // State for the comment
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreSubmit = async () => {
    if (score === '') {
      toast.error("Please enter a score.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resultRef = ref(database, `examResults/${student.id}_${examId}`);

      // Update the exam results with score and comment
      await update(resultRef, {
        score: parseFloat(score),
        comment: comment, // Add the comment to the database
      });

      toast.success("Score and comment submitted successfully!");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error("Failed to submit score.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Enter Score for {student.firstName} {student.lastName}</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Score</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="0"
            max="100"
            step="0.01" // Allow decimal scores
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3" // Allow multiple lines of text
            placeholder="Add a comment (optional)"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleScoreSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
