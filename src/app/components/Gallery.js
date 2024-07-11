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
        className="max-w-7xl mx-auto p-4"
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
