// ScoreInputModal.js
import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const ScoreInputModal = ({ student, examId, onClose }) => {
  const [score, setScore] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultRef = ref(database, `examResults/${student.id}_${examId}`);
    await set(resultRef, { score: Number(score) });
    onClose();
  };

  return (
    <div className="modal">
      <h2>Enter Score for {student.firstName} {student.lastName}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Enter score"
          required
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default ScoreInputModal;
