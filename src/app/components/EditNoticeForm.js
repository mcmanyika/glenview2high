import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { toast } from 'react-toastify';

const EditNoticeForm = ({ notice, onClose }) => {
  const [title, setTitle] = useState(notice.title);
  const [details, setDetails] = useState(notice.details);
  const [date, setDate] = useState(notice.date);
  const [audience, setAudience] = useState(notice.audience || 'all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedNotice = {
      title,
      details,
      date,
      audience,
      // Preserve other fields
      postedBy: notice.postedBy,
    };

    try {
      const noticeRef = ref(database, `notices/${notice.id}`);
      await update(noticeRef, updatedNotice);
      toast.success('Notice updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating notice:', error);
      toast.error('Failed to update notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold dark:text-white">Edit Notice</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Details
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-vertical transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Audience
        </label>
        <select
          id="audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors"
          required
        >
          <option value="all">All</option>
          <option value="students">Students</option>
          <option value="teachers">Teachers</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Notice'}
        </button>
      </div>
    </form>
  );
};

export default EditNoticeForm; 