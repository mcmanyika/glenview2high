'use client';
import React, { useState } from 'react';
import Layout from '../app/components/Layout2';
import SupplierContactForm from '../app/components/SupplierContactForm';

const SupplierInvitation = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
  };

  return (
    <Layout templateText="Supplier Opportunities">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: "url('/images/fountain.png')" }} // Replace with your background image path
        ></div>
        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
        <section className="relative text-white p-20 md:p-15 text-center text-xl font-thin">
          <h1 className="text-3xl md:text-3xl font-thin font-sans uppercase">Join Our Supplier List</h1>
          <p className="mt-4">
            Are you interested in becoming a supplier for our school?
          </p>
          <p className="mt-4">
            Contact us today to explore partnership opportunities.
          </p>
          <button
            className="mt-6 uppercase p-3 bg-blue-400 text-white hover:bg-blue-500 transition duration-300"
            onClick={handleButtonClick}
          >
            Contact Us
          </button>
        </section>

        {/* Full-page overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 transition-transform duration-500 ease-in-out transform ${
            isOverlayVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="relative w-full h-full flex items-center justify-center p-8 bg-blue-300 text-white">
            <button
              className="absolute top-4 right-4 text-white bg-blue-500 p-2 rounded"
              onClick={handleCloseOverlay}
            >
              Close
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-thin font-sans uppercase">Contact Us</h2>
              <p className="mt-4 text-xl font-thin pb-10">
                Thank you for your interest in becoming a supplier. Please register below
              </p>
              <SupplierContactForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupplierInvitation;
