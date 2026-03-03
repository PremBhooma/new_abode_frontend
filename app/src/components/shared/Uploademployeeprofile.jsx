import { UploadFile } from "@nayeshdaggula/tailify";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import Customerapi from "../api/Customerapi.jsx";
import Employeeapi from "../api/Employeeapi.jsx";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails.jsx";

function Uploademployeeprofile({ closeUploadFileModal, setIsLoadingEffect, employee_id, refreshUserDetails }) {

  const [file, setFile] = useState(null);

  const currentEmployeeInfo = useEmployeeDetails.getState().employeeInfo;
  console.log("currentEmployeeInfo:", currentEmployeeInfo)

  async function uploadProfilePicture() {
    if (file === null) {
      alert("Select a file to upload");
      return false;
    }

    let formData = new FormData();
    formData.append("file", file[0]);
    formData.append("employee_id", employee_id);

    setIsLoadingEffect(true);
    Employeeapi.post("/update-employee-profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            status: "error",
            message: data.message,
          };
        }

        const currentEmployeeInfo = useEmployeeDetails.getState().employeeInfo;

        if (String(currentEmployeeInfo.id) === String(employee_id)) {
          const updatedEmployeeInfo = {
            ...currentEmployeeInfo,
            profile_pic_url: data.profile_pic_url,
          };

          useEmployeeDetails.getState().updateEmployeeAuthDetails(
            updatedEmployeeInfo,
            useEmployeeDetails.getState().access_token,
            useEmployeeDetails.getState().permissions
          );
        }

        closeUploadFileModal();
        refreshUserDetails();
        setIsLoadingEffect(false);
        return true;
      })
      .catch((err) => {
        console.log(err);
        let finalresponse = {
          status: "error",
          message: "Something went wrong. Please try again later.",
        };
        setIsLoadingEffect(false);
        return false;
      });
  }

  return (
    <div className="flex flex-col gap-3 px-5 py-5 3xl:px-10 3xl:py-10 relative">
      <p className="text-[#000] text-[16px] font-semibold 3xl:text-[22px]">Upload Profile Picture</p>
      <IconX size={20} color="#be185d" className="cursor-pointer absolute top-2 right-0" onClick={closeUploadFileModal} />
      <UploadFile
        label="Upload Profile Picture"
        onFileChange={(file) => {
          setFile(file);
        }}
        accept="image/*"
        containerClass="py-2 border-dashed"
      />
      <button className="bg-[#0083bf] text-white text-[14px] 3xl:text-[20px] font-semibold py-2 rounded-md cursor-pointer" onClick={uploadProfilePicture}>
        Upload
      </button>
    </div>
  );
}

export default Uploademployeeprofile;
