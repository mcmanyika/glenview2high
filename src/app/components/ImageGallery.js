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
              src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8741.jpg?alt=media&token=73f1cfaf-ea7d-454e-8230-bd301ee4da81"
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
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8749.jpg?alt=media&token=ec571981-61d4-46fc-8b45-e262ca9098da"
                alt="Sub Image 1"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8816.jpg?alt=media&token=fe55c1d3-37b5-46c8-b52e-ea49a15ba4f6"
                alt="Sub Image 2"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8764.jpg?alt=media&token=c0b4942e-b2ea-47cc-b9f3-f9d19f934a1c"
                alt="Sub Image 4"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FDSC_8846.jpg?alt=media&token=ef191311-9b07-482c-b020-1823d362caef"
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
