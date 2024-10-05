// utils/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed w-full inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={onClose} // Close modal on overlay click
    >
      <div 
        className="bg-white rounded shadow-lg p-4 w-full max-w-lg" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          &times; {/* Close button */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
