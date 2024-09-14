// components/ContactUs.js

import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    };

    try {
      await push(ref(database, 'contacts'), contactData);
      toast.success('Thank you for contacting us, we will soon be reaching out to you');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting form: ', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="bg-main2 p-10">
      <div className="md:container mx-auto flex flex-col md:flex-row text-gray-500 font-thin">
        <div className="md:p-8 flex-1 flex flex-col">
          <div className="w-full">
            <h2 className="text-2xl  mb-10">Contact Info</h2>
            <div className='md:pl-40'>
              <div className="w-full mb-4 flex">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-4 mt-1" />
                <span>
                  <strong>Address:</strong><br />
                  Corner Lavenham Drive & Northolt Road, <br />
                  Bluffhill, Harare, Zimbabwe
                </span>
              </div>
              <div className="w-full mb-4 flex">
                <FontAwesomeIcon icon={faPhone} className="mr-4 mt-1" />
                <span>
                  <strong>WhatsApp Call:</strong><br />
                  <a href="https://wa.me/263773391486" target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    +263773391486
                  </a>
                </span>
              </div>
              <div className="w-full mb-4 flex">
                <FontAwesomeIcon icon={faEnvelope} className="mr-4 mt-1" />
                <span>
                  <strong>Email:</strong><br />
                  divarismakaharis@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="md:p-8 ttext-gray-500 font-thin w-full">
            <h2 className="text-2xl mb-4">Contact Us</h2>
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
              className="w-full p-2 bg-main text-white rounded"
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
      </div>
    </div>
  );
};

export default ContactUs;
