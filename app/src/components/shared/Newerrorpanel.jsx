import React, { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

function Newerrorpanel({ errorMessages, setErrorMessages }) {
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
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <IconX />
        </button>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <p className="font-bold text-red-600 text-lg mb-1">Error</p>
            <p className="text-gray-800">{errorMessages.message}</p>
          </div>

          {errorMessages.server_res && (
            <div className="w-full text-left">
              <p className="font-semibold text-red-500 mb-1">Server Response:</p>
              <pre className="bg-gray-100 text-gray-800 p-3 rounded-md text-sm overflow-auto">
                {JSON.stringify(errorMessages.server_res, null, 2)}
              </pre>
            </div>
          )}

          {errorMessages.url && (
            <Link to={errorMessages.url}>
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm text-gray-900 shadow-sm">
                <svg width={16} height={12} viewBox="0 0 16 12" fill="none">
                  <path
                    d="M0.505024 5.50503C0.231657 5.77839 0.231657 6.22161 0.505024 6.49497L4.9598 10.9497C5.23316 11.2231 5.67638 11.2231 5.94975 10.9497C6.22311 10.6764 6.22311 10.2332 5.94975 9.9598L1.98995 6L5.94975 2.0402C6.22311 1.76684 6.22311 1.32362 5.94975 1.05025C5.67638 0.776886 5.23316 0.776886 4.9598 1.05025L0.505024 5.50503ZM16 5.3L0.999999 5.3V6.7L16 6.7V5.3Z"
                    fill="#101010"
                  />
                </svg>
                <span>Back</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Newerrorpanel;
