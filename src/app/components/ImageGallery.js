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
              src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8741.jpg?alt=media&token=310c7322-161c-4524-afc0-7d185b8518e4"
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
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8749.jpg?alt=media&token=ece6a3cc-34f7-4500-998c-c5a02853d9f9"
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
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8782.jpg?alt=media&token=38c23169-2e49-4b24-b3a4-c9b3e519594e"
                alt="Sub Image 4"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8811.jpg?alt=media&token=ec88b01c-0f38-4258-a114-eebbbd055d12"
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
