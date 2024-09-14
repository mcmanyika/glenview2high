import React, { useState } from 'react';
import Link from 'next/link';

const NewStudents = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleOverlayToggle = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <div className="relative flex items-center justify-center  overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/book.png')" }}
      ></div>
      <div className="absolute inset-0 bg-main3 opacity-50"></div> {/* Dark overlay */}

      <section className="relative text-white p-20 md:p-15 text-center">
        <h1 className="text-xl md:text-3xl font-thin font-sans uppercase">Welcome New Students</h1>
        <p className="mt-4 text-base md:text-lg">
          {/* Use Link component for navigation */}
          <button
            onClick={handleOverlayToggle}
            className="uppercase p-2 bg-main text-white transition duration-300"
          >
            Find out more
          </button>
        </p>
      </section>

      {/* Sliding Overlay */}
      <div
        className={`fixed top-0 right-0 w-full z-50 h-full bg-main3 transition-transform duration-500 ease-in-out ${isOverlayVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-white text-center">
            <h2 className="text-2xl md:text-4xl font-thin">More Information</h2>
            <p className="mt-4 text-base md:text-lg">Here is some more information for new students.</p>
            <Link href="/admissions">
              <button className="inline-block mt-4 px-6 py-2 bg-main text-white rounded-full transition duration-300">
                Go to Admissions
              </button>
            </Link>
            <button
              onClick={handleOverlayToggle}
              className="absolute top-4 right-4 text-white text-xl font-semibold"
            >
              &times; {/* Close icon */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStudents;
