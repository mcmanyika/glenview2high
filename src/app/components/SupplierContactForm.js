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
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form: ', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="p-4 text-center text-white">
        <h2 className="text-2xl">Thank you for contacting us!</h2>
        <p>We will get back to you soon.</p>
        <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-blue-300 p-8 rounded shadow-md text-black w-full max-w-md">
        <h2 className="text-2xl mb-4">Supplier Contact Form</h2>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </div>
  );
};

export default SupplierContactForm;
