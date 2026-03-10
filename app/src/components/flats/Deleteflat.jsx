import React, { useState } from "react";
import Flatapi from "../api/Flatapi.jsx";
import { toast } from "react-toastify";
import { Loadingoverlay } from "@nayeshdaggula/tailify";

function Deleteflat({ refreshGetAllFlats, closeDeleteModal, singleflatid, employeeId }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  console.log("uuid:", singleflatid)

  const handleDelete = () => {
    setIsLoadingEffect(true);

    Flatapi.post("delete-flat", { 
      id: singleflatid,
      employeeId: employeeId,
    },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        toast.success("Flat Deleted Permanently");
        closeDeleteModal();
        refreshGetAllFlats();
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log("Delete Flat error:", error);
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      });
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-lg shadow-lg p-6 !w-[95%] md:!w-[50%] lg:!w-[40%] xl:!w-[33%] 3xl:!w-[20%] relative">
        <button
          className="absolute top-6 right-8 text-red-600 hover:text-red-800 cursor-pointer"
          onClick={closeDeleteModal}
        >
          âœ•
        </button>

        <h2 className="text-lg text-[#2b2b2b] font-semibold mb-4">
          âš ï¸ Delete Flat
        </h2>

        <div className="text-[#2b2b2b] text-[15px] mb-6 space-y-2">
          <p>Please note the following important points:</p>
          <ul className="list-disc list-outside ml-6 space-y-1">
            <li>
              <strong>Payment</strong> records for this flat will be deleted.
            </li>
            <li>
              If <strong>Ageing Record</strong> is available for this flat will be deleted.
            </li>
            <li>
              If <strong>Refund Ageing Record</strong> is available for this flat will be deleted.
            </li>
            <li>
              If <strong>Reward Record</strong> is available for this flat will be deleted.
            </li>
            <li>
              Any customer assigned to this flat will be <strong>unassigned</strong>.
            </li>
          </ul>
          <p className="mt-2">Are you sure you want to proceed?</p>
        </div>


        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-[14px] bg-gray-300 rounded text-black hover:bg-[#898989] cursor-pointer"
            onClick={closeDeleteModal}
          >
            Cancel
          </button>
          {isLoadingEffect ? (
            isLoadingEffect && (
              <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
              </div>
            )
          ) : (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-[14px] text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {errorMessage !== "" && (
        <p className="text-red-600">{errorMessage}</p >
      )}
    </div>
  );
}

export default Deleteflat;
