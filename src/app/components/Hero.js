'use client'
import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Ensure you have heroicons installed

const Hero = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleMenuClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2FScreen%20Shot%202024-07-03%20at%208.20.55%20AM.png?alt=media&token=b60de27d-f07d-41d2-a036-918ee8a64674')"
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-15"></div>
      <div className="absolute top-4 right-4 z-20">
        <MenuIcon className="h-8 w-8 text-white cursor-pointer" onClick={handleMenuClick} />
      </div>
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 z-60 text-white"
            onClick={handleMenuClick}
          >
            <XIcon className="h-8 w-8" />
          </button>
        </div>
      )}
      <section className="relative text-white p-10 md:p-20 text-center md:text-left">
        <h1 className="text-4xl md:text-4xl font-thin font-sans">Glenview 2 High - </h1>
        <p className="mt-4 text-sm md:text-xl md:text-thin">Empowering students to reach their full potential.</p>
      </section>
    </div>
  );
};

export default Hero;
