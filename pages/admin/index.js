import { useEffect, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useGlobalState } from '../../src/app/store';
import { db } from '../../utils/firebaseConfig';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user] = useGlobalState('user');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        excerpt: content.substring(0, 100) + '...',
      });
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  };

  if (!user) return null; // Render nothing if not authenticated

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default Admin;
