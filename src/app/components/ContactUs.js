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
  const [submitted, setSubmitted] = useState(false);

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
    <div className=" bg-blue-50 p-10">
      <div className='container mx-auto flex flex-col md:flex-row'>
      <div className="p-8 text-black flex-1">
        <h2 className="text-2xl mb-4">Contact Info</h2>
        <div className="w-full text-lg font-thin font-sans pb-5">
        We are dedicated to providing quality education and fostering a supportive learning environment for our students.
        </div>
        <p className="mb-4 flex items-start">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 mt-1" />
          <span>
            <strong>Address:</strong><br />
            GlenView 2 High School,<br />
            9480 1st Drive, Glenview 3,<br />
            Harare, Zimbabwe
          </span>
        </p>
        <p className="mb-4 flex items-start">
          <FontAwesomeIcon icon={faPhone} className="mr-2 mt-1" />
          <span>
            <strong>Phone:</strong><br />
            +263 123 456 789
          </span>
        </p>
        <p className="mb-4 flex items-start">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 mt-1" />
          <span>
            <strong>Email:</strong><br />
            info@glenview2high.co.zw
          </span>
        </p>
      </div>

      <div className="flex-1">
        <form onSubmit={handleSubmit} className="p-8 text-black w-full">
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
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      </div>
      </div>
    </div>
  );
};

export default ContactUs;
