import React from 'react';
import Image from 'next/image';

const ImageGallery = () => {
  return (
    <section id='gallery' className="w-full mx-auto p-0">
      <div className="flex flex-col md:flex-row gap-1">
        {/* First Column: Single Image with double height */}
        <div className="flex-1 relative w-full h-[24rem] md:h-[40.2rem] overflow-hidden"> {/* Adjust height for mobile */}
          <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8902.jpg?alt=media&token=7016be1b-92d5-4726-9289-79ee1481ac8f"
              alt="Main Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Second Column: Four Equal Images */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden"> {/* Adjust height for mobile */}
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8927.jpg?alt=media&token=08df172a-dfce-4537-aad9-d3cd6b56bacd"
                alt="Sub Image 1"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8764.jpg?alt=media&token=35feb4aa-6eb3-43ee-938c-ba0526dfc70e"
                alt="Sub Image 2"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_9035.jpg?alt=media&token=c774f761-8b51-49b5-8754-4d5d4e690f2f"
                alt="Sub Image 4"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_9075.jpg?alt=media&token=51be187d-2a33-4f95-8fc3-10fd31f57447"
                alt="Sub Image 3"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
