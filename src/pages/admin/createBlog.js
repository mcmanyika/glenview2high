import React, { useState, useEffect } from 'react';
import { ref, push, get } from 'firebase/database'; // Import 'get' from Firebase
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'; // Import useSession for session handling
import { database } from '../../../utils/firebaseConfig'; // Adjust the path if needed
import { setUserID } from '../../app/store'; // Adjust the path if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome icons
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Spinner icon
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

import AdminLayout from './adminLayout';
import withAuth from '../../../utils/withAuth';
import BlogList from '../../app/components/admin/blog/BlogList';

function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(''); // New state for category
    const [status, setStatus] = useState('draft'); // New state for status (draft or published)
    const { data: session, status: sessionStatus } = useSession(); // Get session and status from next-auth
    const [userType, setUserType] = useState(null); // State for user type
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const router = useRouter(); // Router for navigation

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            const fetchUserType = async () => {
                try {
                    const userEmail = session.user.email; // Get the user's email from session
                    const userRef = ref(database, 'userTypes'); // Reference to the userTypes node in Firebase
                    const snapshot = await get(userRef); // Get the data from Firebase

                    if (snapshot.exists()) {
                        const users = snapshot.val(); // Get the user data
                        const foundUserID = Object.keys(users).find(id => users[id].email === userEmail); // Find user by email

                        if (foundUserID) {
                            const userData = users[foundUserID];
                            setUserType(userData.userType); // Set user type
                            setUserID(foundUserID); // Store user ID in the state
                        } else {
                            console.log('No user found with this email.');
                            router.push('/admin/user'); // Redirect if no user is found
                        }
                    } else {
                        console.log('No user types found.');
                    }
                } catch (error) {
                    console.error('Error fetching user type:', error); // Log any error
                    setError('Error fetching user type. Please try again later.'); // Set error message
                } finally {
                    setLoading(false); // Stop loading
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
            category, // Add category to the new blog object
            status, // Add status to the new blog object
            author,
            createdAt: new Date().toISOString(),
        };

        const toastId = toast.loading('Creating blog post...');

        push(blogsRef, newBlog)
            .then(() => {
                setTitle('');
                setContent('');
                setCategory(''); // Reset category
                setStatus('draft'); // Reset status to draft
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
        return <p>Loading...</p>; // Show a loading message while fetching user type
    }

    if (error) {
        return <p>{error}</p>; // Display error message
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-4xl text-blue-500 animate-spin"
                />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <AdminLayout>
            <div className='flex'>
                <div className='flex-1'>
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
                            <div className="mb-4">
                                <label className="block mb-2">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="border px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="border px-4 py-2 w-full"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
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
                <div className='flex-1'>
                    <BlogList />
                </div>
            </div>
        </AdminLayout>
    );
}

export default withAuth(CreateBlog);
