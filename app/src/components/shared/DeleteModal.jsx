// import { Loadingoverlay } from "@nayeshdaggula/tailify";
// import React from "react";

// const DeleteModal = ({ open, title = "Delete Item", message = "Are you sure?", onConfirm, onCancel, onClose, mainBtnText = "Delete", isDisabled = false, isLoadingEffect }) => {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-black/50 backdrop-blur-[2px]">
//       <div className="bg-[#141414] rounded-lg shadow-lg p-6 w-96 relative">
//         <button
//           className="absolute top-3 right-4 text-[#898989] hover:text-[#ffff] cursor-pointer"
//           onClick={onClose}
//         >
//           ✕
//         </button>
//         <h2 className="text-lg text-[#ffff] font-normal mb-4">{title}</h2>
//         <p className="text-[#898989] text-sm mb-6">{message}</p>
//         <div className="flex justify-end gap-3">
//           <button
//             className="px-3 py-1 bg-gray-300 rounded text-[black] text-sm hover:bg-[#898989] cursor-pointer"
//             onClick={onCancel || onClose}
//           >
//             Cancel
//           </button>
//           {!isDisabled &&
//             <button
//               className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 cursor-pointer"
//               onClick={onConfirm}
//             >
//               {mainBtnText}
//             </button>
//           }
//         </div>
//         {isLoadingEffect &&
//           <Loadingoverlay visible={isLoadingEffect} overlayBg={"#2b2b2bcc"} />
//         }
//       </div>
//     </div>
//   );
// };

// export default DeleteModal;

import { createPortal } from "react-dom";
import { Loadingoverlay } from "@nayeshdaggula/tailify";
import React from "react";

const DeleteModal = ({
  open,
  title = "Delete Item",
  message = "Are you sure?",
  onConfirm,
  onCancel,
  onClose,
  mainBtnText = "Delete",
  isDisabled = false,
  isLoadingEffect
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-lg shadow-lg p-6 !w-[95%] md:!w-[50%] lg:!w-[40%] xl:!w-[33%] 3xl:!w-[20%] relative">
        <button
          className="absolute top-6 right-8 text-red-600 hover:text-red-800 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg text-[#2b2b2b] font-semibold mb-2">{title}</h2>
        <p className="text-[#2b2b2b] text-[15px] mb-8">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 bg-gray-300 rounded text-black text-sm hover:bg-[#898989] cursor-pointer"
            onClick={onCancel || onClose}
          >
            Cancel
          </button>
          {!isDisabled && (
            <button
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 cursor-pointer"
              onClick={onConfirm}
            >
              {mainBtnText}
            </button>
          )}
        </div>
        {isLoadingEffect && (
          <Loadingoverlay visible={isLoadingEffect} overlayBg={"#2b2b2bcc"} />
        )}
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
