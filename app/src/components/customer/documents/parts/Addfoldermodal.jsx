import React, { useState } from "react";
import Errorpanel from "../../../shared/Errorpanel.jsx";
import {
  Button,
  Card,
  Loadingoverlay,
  Text,
  Textinput,
} from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../../zustand/useEmployeeDetails.jsx";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import Customerdocumentsapi from "../../../api/Customerdocumentsapi.jsx";

function Addfoldermodal({
  closeFolderModal,
  currentFolderId,
  currentFolderUuid,
  refreshFolderDeatils,
}) {
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const userInfo = useEmployeeDetails((state) => state.employeeInfo);
  let user_id = userInfo?.id;
  const access_token = useEmployeeDetails((state) => state.access_token);

  const params = useParams();
  const customer_uid = params.customer_uuid;

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState("");
  const updateFolderName = (e) => {
    setFolderName(e.currentTarget.value);
    setFolderNameError("");
  };

  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = () => {
    setIsLoadingEffect(true);

    if (folderName === "") {
      setIsLoadingEffect(false);
      setFolderNameError("Enter folder name");
      return false;
    }

    Customerdocumentsapi.post(
      "createfolder",
      {
        folderName,
        file_type: "folder",
        user_id,
        currentFolderId,
        currentFolderUuid,
        customer_uid,
        employee_id: employeeId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
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
        setIsLoadingEffect(false);
        refreshFolderDeatils(currentFolderId);
        closeFolderModal();
        toast.success("Folder added successfully");
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
    <Card withBorder className="!p-[0px]">
      <Card.Section withBorder>
        <Text size="md" fw={600}>
          Add New Folder
        </Text>
      </Card.Section>
      <Card.Section withBorder>
        <Textinput
          label="Folder Name"
          placeholder="Folder Name"
          value={folderName}
          error={folderNameError}
          onChange={updateFolderName}
        />
      </Card.Section>
      <Card.Section withBorder>
        <div className="flex flex-row justify-between items-center">
          <Button
            variant="default"
            size="xs"
            className="!px-4 !py-2"
            onClick={closeFolderModal}
          >
            Close
          </Button>
          <Button
            color="#0083bf"
            size="xs"
            className="!px-4 !py-2"
            onClick={handleSubmit}
          >
            Add New
          </Button>
        </div>
      </Card.Section>
      {isLoadingEffect && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
          <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
        </div>
      )}
      {errorMessage !== "" && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
    </Card>
  );
}

export default Addfoldermodal;
