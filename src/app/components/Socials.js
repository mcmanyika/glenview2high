import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Socials = () => {
  return (
    <div className="bg-blue2 p-6">
        <div className='max-w-40 mx-auto'>
        <h2 className="text-lg  font-thin mb-6 text-center bg-main3 text-white p-2 uppercase">Follow Us</h2></div>
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/DivarisMakahariscollege/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            <FaFacebook className="h-8 w-8" />
          </a>
          {/* <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            <FaInstagram className="h-8 w-8" />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default Socials;
