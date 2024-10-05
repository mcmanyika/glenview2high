import React, { useState, useEffect } from 'react';
import { ref, push, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { database } from '../../../utils/firebaseConfig';
import { setUserID } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';

import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';

function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(''); // State for category
    const [status, setStatus] = useState('draft');
    const { data: session, status: sessionStatus } = useSession();
    const [userType, setUserType] = useState(null);
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Predefined categories for the dropdown
    const categories = [
        'School News',
        'Events',
        'Student Life',
        'Parent Resources',
        'Teacher Insights',
        'Educational Trends',
        'Extracurricular Activities',
        'Health & Wellness',
        'Alumni Updates',
        'Technology in Education',
    ];

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            const fetchUserType = async () => {
                try {
                    const userEmail = session.user.email;
                    const userRef = ref(database, 'userTypes');
                    const snapshot = await get(userRef);

                    if (snapshot.exists()) {
                        const users = snapshot.val();
                        const foundUserID = Object.keys(users).find(id => users[id].email === userEmail);

                        if (foundUserID) {
                            const userData = users[foundUserID];
                            setUserType(userData.userType);
                            setUserID(foundUserID);
                        } else {
                            router.push('/admin/user');
                        }
                    }
                } catch (error) {
                    setError('Error fetching user type. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };

            fetchUserType();
        }
    }, [sessionStatus, session, router]);

    useEffect(() => {
        if (session && session.user) {
            setAuthor(session.user.name);
        }
    }, [session]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const blogsRef = ref(database, 'blogs');
        const newBlog = {
            title,
            content,
            category, // Add category to the blog
            status,
            author,
            createdAt: new Date().toISOString(),
        };

        const toastId = toast.loading('Creating blog post...');

        push(blogsRef, newBlog)
            .then(() => {
                setTitle('');
                setContent('');
                setCategory(''); // Reset category
                setStatus('draft');
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
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
                            <div className="border">
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
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="border px-4 py-3 w-full"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
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
                                Create Blog
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default withAuth(CreateBlog);
