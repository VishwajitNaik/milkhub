import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-40 top-0 left-0 right-0 bottom-0 bg-white/10 backdrop-blur-md">
      <div className="p-6 bg-blue-200 rounded-lg shadow-lg w-auto">
        <button className=" text-gray-600 bg-red-500 hover:bg-red-800 font-bold rounded" onClick={onClose}>✖️</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
