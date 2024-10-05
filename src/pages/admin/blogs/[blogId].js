import React, { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { database } from '../../../../utils/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';

import AdminLayout from '../adminLayout';
import withAuth from '../../../../utils/withAuth';

function EditBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('draft');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { blogId } = router.query; // Get blog ID from URL params
    const { data: session } = useSession();

    // Fetch blog data when the component mounts
    useEffect(() => {
        const fetchBlog = async () => {
            if (blogId) {
                try {
                    const blogRef = ref(database, `blogs/${blogId}`);
                    const snapshot = await get(blogRef);

                    if (snapshot.exists()) {
                        const blogData = snapshot.val();
                        setTitle(blogData.title);
                        setContent(blogData.content);
                        setCategory(blogData.category);
                        setStatus(blogData.status);
                    } else {
                        console.log('No blog found with this ID.');
                        setError('Blog not found.');
                    }
                } catch (error) {
                    console.error('Error fetching blog data:', error);
                    setError('Error fetching blog data.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBlog();
    }, [blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const blogRef = ref(database, `blogs/${blogId}`); // Reference to the specific blog entry
        const updatedBlog = {
            title,
            content,
            category,
            status,
            updatedAt: new Date().toISOString(),
        };

        const toastId = toast.loading('Updating blog post...');

        try {
            await update(blogRef, updatedBlog);
            toast.update(toastId, {
                render: 'Blog post updated successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
            router.push('/admin/dashboard'); // Redirect to the blog list after successful update
        } catch (error) {
            toast.update(toastId, {
                render: 'Error updating blog post',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
            console.error('Error updating blog post:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <AdminLayout>
            <div className='flex'>
                <div className='w-4/5'>
                    <div className="p-6 bg-white rounded shadow mt-3">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border px-4 py-2 w-full"
                                    placeholder='Title'
                                    required
                                />
                            </div>
                            <div className="border mb-4">
                                <SunEditor
                                    setContents={content}
                                    onChange={setContent}
                                    setOptions={{
                                        height: 300,
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
                            <div className='flex w-full mb-4'>
                                <div className="flex-1 pt-2">
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="border px-4 py-3 w-full"
                                        placeholder='Category'
                                        required
                                    />
                                </div>
                                <div className="flex-1 pt-2 ml-2">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="border px-4 py-3 w-full"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Blog
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default withAuth(EditBlog);
