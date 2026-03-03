import { useState } from "react";
import { IconX } from "@tabler/icons-react";
import { UploadFile } from "@nayeshdaggula/tailify";
import Leadapi from "../api/Leadapi.jsx";

function Uploadleadprofile({ closeUploadFileModal, setIsLoadingEffect, lead_id, refreshLead }) {
  const [file, setFile] = useState(null);

  async function uploadProfilePicture() {
    if (file === null) {
      alert("Select a file to upload");
      return false;
    }
    let formData = new FormData();
    formData.append("file", file[0]);
    formData.append("lead_id", lead_id);

    setIsLoadingEffect(true);
    Leadapi.post("/update-lead-profile-picture", formData, {
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
        closeUploadFileModal();
        refreshLead();
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
      <p className="text-[#000] text-[16px] font-semibold 3xl:text-[22px]">Upload Lead Picture</p>
      <IconX size={20} color="#be185d" className="cursor-pointer absolute top-2 right-0" onClick={closeUploadFileModal} />
      <UploadFile
        label="Upload Lead Picture"
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

export default Uploadleadprofile;
