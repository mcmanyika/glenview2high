'use client';
import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SmartBlankLayout from '../../app/components/SmartBlankLayout';

export default function AddHeader() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("dashboard"); // Default value for category dropdown
    const [status] = useState("Active"); // Default status set to 'Active', and no need for setStatus
    const [link, setLink] = useState("");
    const [icon, setIcon] = useState(""); // New state for icon

    const handleAddData = async () => {
        if (title.trim() === "" || category.trim() === "" || icon.trim() === "") {
            toast.error('All fields are required.');
            return;
        }

        try {
            const titleRef = ref(database, 'title'); // Reference to 'title' collection in Firebase
            const newDataRef = push(titleRef); // Generate a new push key under 'title'

            await set(newDataRef, { // Set data under the new push key
                title: title,
                category: category,
                status: status, // Status is always 'Active'
                link: link,
                icon: icon, // Add the icon field
            });

            // Clear input fields after successful data addition
            setTitle("");
            setCategory("dashboard"); // Reset category to default value
            setLink("");
            setIcon(""); // Clear the icon field

            toast.success("Data added successfully!");
        } catch (error) {
            console.error('Firebase Error:', error);
            toast.error('Failed to add data.');
        }
    };

    return (
        <SmartBlankLayout>
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
                        <select
                            id='category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                        >
                            <option value="web">Web</option>
                            <option value="dashboard">Dashboard</option>
                        </select>
                    </div>
                    {/* Hidden field for status */}
                    <input 
                        type="hidden"
                        value={status} // Default status is "Active"
                    />
                    <div className='mb-2'>
                        <label htmlFor='link' className='block mb-1 text-sm'>Link</label>
                        <input 
                            type='text'
                            id='link'
                            placeholder='Enter link'
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='icon' className='block mb-1 text-sm'>Icon</label> {/* New Icon field */}
                        <input 
                            type='text'
                            id='icon'
                            placeholder='Enter icon name or URL'
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)} // Update icon state
                            className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                        />
                    </div>
                </div>
                <button 
                    onClick={handleAddData} 
                    className='bg-main text-white p-2 rounded w-full max-w-xs hover:bg-blue-600 transition duration-200'
                >
                    Add Data
                </button>
                
            </div>
        </SmartBlankLayout>
    );
}
