import React, { useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';

// List of images for the gallery
const images = [
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fprefects2.jpeg?alt=media&token=20a488a0-faad-402d-9640-5ddea7f08e40',
    alt: 'Image 2',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fagro.jpeg?alt=media&token=e969cb91-82ca-4380-81dc-631a9835411b',
    alt: 'Image 3',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fbuilding.jpeg?alt=media&token=98f47f53-c61b-4d40-a4ab-3eeddd07d39a',
    alt: 'Image 4',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstaff%2FstaffTeam.jpeg?alt=media&token=8d810f99-400f-4e23-ba3e-c8ba0b54300c',
    alt: 'Image 4',
  },

  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstaff%2Fteachers.jpeg?alt=media&token=d3703446-9fae-4fa0-b074-514419291de9',
    alt: 'Image 4',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2Fstudents5.jpeg?alt=media&token=2d12da7d-0ba0-4362-887e-515927b369ef',
    alt: 'Image 4',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstudents%2FAlevelStudents.jpeg?alt=media&token=e1b49d87-2675-4e83-81e9-72681b27d48b',
    alt: 'Image 4',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fdrummies.jpeg?alt=media&token=452d07f1-d6b9-48cc-a5be-fa69396f6583',
    alt: 'Image 4',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/glenview2-b3d45.appspot.com/o/general%2Fweb%2Fstaff%2Fstaff6.jpeg?alt=media&token=d1f882d2-5520-45c6-a657-7013ee761651',
    alt: 'Image 4',
  },
  // Add more images as needed
];

// Set the app element for accessibility
Modal.setAppElement('#__next');

const Gallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const openModal = (image) => {
    setCurrentImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image.src}
              alt={image.alt}
              layout="responsive"
              width={300}
              height={200}
              className="rounded cursor-pointer"
              onClick={() => openModal(image)}
            />
          </div>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="max-w-7xl mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {currentImage && (
          <div className="relative">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              layout="responsive"
              width={600}
              height={400}
              className="rounded cover"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Gallery;
