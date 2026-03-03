import { IconFile, IconPaperclip } from "@tabler/icons-react";
import React, { useState } from "react";
import { useEmployeeDetails } from "../../../zustand/useEmployeeDetails";
import { useParams } from "react-router";
import {
  Button,
  Card,
  Fileinput,
  Loadingoverlay,
  Text,
} from "@nayeshdaggula/tailify";
import Errorpanel from "../../../shared/Errorpanel";
import Customerdocumentsapi from "../../../api/Customerdocumentsapi";

function UploadfileModal({
  closeUploadFileModal,
  currentFolderId,
  folderPath,
  refreshFolderDeatils,
}) {
  // const domainInfo = useDomainfo(state => state.domainInfo);

  // let max_single_file_size = domainInfo.max_single_file_size;
  // let max_single_file_size_type = domainInfo.max_single_file_size_type;

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const userInfo = useEmployeeDetails((state) => state.employeeInfo);
  const user_id = userInfo?.id;
  const access_token = useEmployeeDetails((state) => state.access_token);
  const params = useParams();
  const customer_uid = params.customer_uuid;

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const updateFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileError("");
    }
  };

  const handleSubmit = () => {
    setIsLoadingEffect(true);
    if (file === null) {
      setIsLoadingEffect(false);
      setFileError("upload file....");
      return false;
    }

    // const unitConversion = {
    //     KB: 1024,
    //     MB: 1024 * 1024,
    //     GB: 1024 * 1024 * 1024,
    // };

    // if (file.size > max_single_file_size * unitConversion[max_single_file_size_type]) {
    //     setFileError(`File size should be less than ${max_single_file_size} ${max_single_file_size_type}`);
    //     setIsLoadingEffect(false);
    //     return false;
    // }

    let filetype = file.type;

    const formData = new FormData();
    formData.append("uploadfile", file);
    formData.append("folderPath", folderPath);
    formData.append("customer_uid", customer_uid);
    formData.append("currentFolderId", currentFolderId);
    formData.append("file_type", filetype);
    formData.append("user_id", user_id);
    formData.append("employee_id", employeeId);

    Customerdocumentsapi.post("uploadfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        closeUploadFileModal();
        refreshFolderDeatils(currentFolderId);
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log(error);
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
    <>
      <Card withBorder className="!p-0">
        <Card.Section withBorder>
          <Text size="md" fw={600}>
            Upload File
          </Text>
        </Card.Section>
        <Card.Section withBorder>
          <Fileinput
            label="Attachments"
            placeholder="Click here to select a file"
            // accept="image/png,image/jpeg,application/pdf, application/msword"
            error={fileError}
            value={file}
            onChange={updateFile}
          />
        </Card.Section>
        <Card.Section withBorder>
          <div className="flex flex-row justify-between items-center">
            <Button
              variant="default"
              size="xs"
              className="!px-4 !py-2"
              onClick={closeUploadFileModal}
            >
              Close
            </Button>
            <Button
              color="#0083bf"
              size="xs"
              className="!px-4 !py-2"
              onClick={handleSubmit}
            >
              Upload
            </Button>
          </div>
        </Card.Section>
        {isLoadingEffect && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
            <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
          </div>
        )}
      </Card>
      {errorMessage !== "" && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
    </>
  );
}

export default UploadfileModal;
