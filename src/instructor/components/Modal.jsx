// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
        <button onClick={onClose} className="mb-4 float-right text-gray-500 hover:text-red-600">✖</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
