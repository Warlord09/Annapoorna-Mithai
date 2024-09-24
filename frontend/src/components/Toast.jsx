import React, { useEffect, useState } from 'react';
import { UilCheck, UilMultiply } from '@iconscout/react-unicons';

const Toast = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 4000); // Changed to 4000ms (4 seconds)
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <div
      className={`fixed top-6 right-8 bg-white rounded-md shadow-lg border-l-8 border-green-400 overflow-hidden transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-[150%]'
      }`}
    >
      <div className="px-6 py-4 pr-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UilCheck className="w-8 h-8 text-white bg-green-400 rounded-full p-1" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Success</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-900"
      >
        <UilMultiply className="w-5 h-5" />
      </button>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div
          className="h-full bg-green-400 transition-all ease-linear"
          style={{
            width: isVisible ? '100%' : '0%',
            transitionDuration: '4000ms', // Changed to 4000ms (4 seconds)
          }}
        ></div>
      </div>
    </div>
  );
};

export default Toast;