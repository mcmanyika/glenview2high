'use client';
import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig file

const SupplierContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierData = {
      name,
      email,
      phone,
      message,
      submittedAt: new Date().toISOString(),
    };

    try {
      await push(ref(database, 'suppliers'), supplierData);
      toast.success('Form submitted successfully!');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting form: ', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className=" p-8 rounded shadow-md text-black w-full max-w-md">
        <div className="mb-4">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder='Company Name'
          />
        </div>
        <div className="mb-4">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder='Your email'
          />
        </div>
        <div className="mb-4">
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder='Your phone number'
          />
        </div>
        <div className="mb-4">
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder='List your product offering'
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-main3 text-white rounded "
        >
          Submit
        </button>
      </form>
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
  );
};

export default SupplierContactForm;
