'use client';
import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../../utils/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout2 from '../../src/app/components/Layout2';

export default function AddHeader() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    const handleAddData = async () => {
        if (title.trim() === "" || category.trim() === "" || status.trim() === "") {
            toast.error('All fields are required.');
            return;
        }

        try {
            const titleRef = ref(database, 'title');
            const newDataRef = push(titleRef);

            await set(newDataRef, {
                title: title,
                category: category,
                status: status,
            });

            setTitle("");
            setCategory("");
            setStatus("");
            toast.success("Data added successfully!");
        } catch (error) {
            console.error('Firebase Error:', error);
            toast.error('Failed to add data.');
        }
    };

    return (
        <Layout2>
        <div className='max-w-3xl mx-auto p-4 bg-white rounded shadow-lg'>
            <div className='mb-4'>
                <div className='mb-2'>
                    <label htmlFor='title' className='block mb-1 text-sm'>Title</label>
                    <input 
                        type='text'
                        id='title'
                        placeholder='Enter title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='category' className='block mb-1 text-sm'>Category</label>
                    <input 
                        type='text'
                        id='category'
                        placeholder='Enter category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='status' className='block mb-1 text-sm'>Status</label>
                    <select
                        id='status'
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Non Active">Non Active</option>
                    </select>
                </div>
            </div>
            <button 
                onClick={handleAddData} 
                className='bg-blue-500 text-white p-2 rounded w-full max-w-xs hover:bg-blue-600 transition duration-200'
            >
                Add Data
            </button>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
        </Layout2>
    );
}
