import React, { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';

function Errorpanel({ errorMessages, setErrorMessages }) {
  const [isVisible, setIsVisible] = useState(errorMessages ? true : false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999]">
      <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6 relative">
        <button
          onClick={() => {
            setIsVisible(false);
            setErrorMessages(null);
          }}
          className="absolute top-3 right-3 text-red-500 cursor-pointer"
        >
          <IconX />
        </button>
        <div className="p-4 md:p-5 text-center">
          <svg className="mx-auto mb-4 text-[#fd0303] w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800">{errorMessages?.type || "Error"}</h3>
          <h4 className="mb-5 text-lg font-sans text-gray-500">{errorMessages.message}</h4>
          {errorMessages.link ?
            <NavLink to={errorMessages.link} className='bg-[#e0589c] block w-full px-3 py-3 text-white font-semibold rounded-lg cursor-pointer'>Update Detials</NavLink>
            :errorMessages.click &&
            <button onClick={()=>{
              setErrorMessages(null);
              errorMessages.click(true);
            }} className='bg-[#e0589c] block w-full px-3 py-3 text-white font-semibold rounded-lg cursor-pointer'>Update Detials</button>
          }
        </div>
      </div>
    </div>
  );
}

export default Errorpanel;
