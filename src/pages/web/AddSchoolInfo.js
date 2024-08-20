'use client';
import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../app/components/Layout2';

export default function AddSchoolInfo() {
    const [schoolName, setSchoolName] = useState("");
    const [tagline, setTagline] = useState("");
    const [address, setAddress] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");

    const handleAddData = async () => {
        if (
            schoolName.trim() === "" || 
            tagline.trim() === "" || 
            address.trim() === "" ||
            mobile.trim() === "" || 
            email.trim() === ""
        ) {
            toast.error('All fields are required.');
            return;
        }

        try {
            const accountRef = ref(database, 'Account');
            const newDataRef = push(accountRef);

            await set(newDataRef, {
                schoolName,
                tagline,
                address,
                mobile,
                email
            });

            setSchoolName("");
            setTagline("");
            setAddress("");
            setMobile("");
            setEmail("");
            toast.success("Data added successfully!");
        } catch (error) {
            console.error('Firebase Error:', error);
            toast.error('Failed to add data.');
        }
    };

    return (
        <Layout>
        <div className='max-w-3xl mx-auto p-4 bg-white rounded shadow-lg'>
            <div className='mb-4'>
                <div className='mb-2'>
                    <label htmlFor='schoolName' className='block mb-1 text-sm'>School Name</label>
                    <input 
                        type='text'
                        id='schoolName'
                        placeholder='Enter school name'
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='tagline' className='block mb-1 text-sm'>Tagline</label>
                    <input 
                        type='text'
                        id='tagline'
                        placeholder='Enter tagline'
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='address' className='block mb-1 text-sm'>Address</label>
                    <input 
                        type='text'
                        id='address'
                        placeholder='Enter address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='mobile' className='block mb-1 text-sm'>Mobile Number</label>
                    <input 
                        type='text'
                        id='mobile'
                        placeholder='Enter mobile number'
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='email' className='block mb-1 text-sm'>Email</label>
                    <input 
                        type='email'
                        id='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full border p-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
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
        </Layout>
    );
}
