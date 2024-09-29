import React, { useState, useEffect } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Layout from '../../app/components/Layout2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import SunEditor for client-side rendering only
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: session } = useSession();
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (session && session.user) {
      setAuthor(session.user.name); // Use name from session.user
    }
  }, [session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogsRef = ref(database, 'blogs');
    const newBlog = {
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
    };

    const toastId = toast.loading('Creating blog post...');

    push(blogsRef, newBlog)
      .then(() => {
        setTitle('');
        setContent('');
        toast.update(toastId, {
          render: 'Blog post created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        toast.update(toastId, {
          render: 'Error creating blog post',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        console.error('Error creating blog post:', error);
      });
  };

  return (
    <Layout templateText="Create New Blog">
      <div className="p-6 bg-white rounded shadow mt-3">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-4 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Content</label>
            <SunEditor
              setContents={content}
              onChange={setContent}
              setOptions={{
                height: 300, // Set editor height
                buttonList: [
                  ['undo', 'redo', 'bold', 'italic', 'underline'],
                  ['list', 'align', 'fontSize', 'formatBlock'],
                  ['link', 'image', 'video'],
                  ['fullScreen', 'showBlocks', 'codeView'],
                  ['preview', 'print'],
                ],
              }}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Blog
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateBlog;
