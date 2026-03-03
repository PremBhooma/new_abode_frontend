import React, { useCallback, useEffect, useState } from "react";
import Toolbarwrapper from "./parts/Toolbarwrapper";
import Errorpanel from "../../shared/Errorpanel";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import SearchAndPath from "./parts/SearchAndPath";
import Filemanager from "./parts/Filemanager";
import { useParams } from "react-router";
import DeleteModal from "../../shared/DeleteModal";
import { toast } from "react-toastify";
import Leaddocumentsapi from "../../api/Leaddocumentsapi";

function Leadsdocumentswrapper() {
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const access_token = useEmployeeDetails((state) => state.access_token);
  const params = useParams();
  const lead_uuid = params.lead_uuid;

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileStructure, setFileStructure] = useState([]);
  const [folderPath, SetFolderPath] = useState("filemanager");
  const [currentFolderUuid, setCurrentFolderUuid] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentFolderParentId, setCurrentFolderParentId] = useState(null);
  const folderselect = (uuid, folder_id) => {
    setCurrentFolderUuid(uuid);
    if (folder_id) {
      setIsLoadingEffect(true);
      fetchfoldersdetails(folder_id);
    }
    setCurrentFolderId(folder_id);
  };

  const folderBack = useCallback(
    (cparentid) => {
      setIsLoadingEffect(true);
      if (cparentid === null) {
        setCurrentFolderId(null);
        fetchfoldersdetails(null);
      } else {
        fetchfoldersdetails(cparentid);
        setCurrentFolderId(cparentid);
      }
    },
    [currentFolderParentId]
  );

  const mainFolder = useCallback(() => {
    setIsLoadingEffect(true);
    setCurrentFolderId(null);
    fetchfoldersdetails(null);
  }, []);

  async function fetchfoldersdetails(currentFolderId) {
    await Leaddocumentsapi.get("/getdocumentsdata", {
      params: {
        currentFolderId: currentFolderId,
        currentFolderParentId: currentFolderParentId,
        lead_uuid: lead_uuid,
      },
      headers: {
        "Content-Type": "application/json",
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
        setIsLoadingEffect(false);
        let documentsdata = data.documentsdata;
        if (documentsdata.length > 0) {
          setFileStructure(documentsdata);
        } else {
          setFileStructure([]);
        }
        setCurrentFolderParentId(data.parentfolder_id);
        SetFolderPath(data.file_path ? data.file_path : "filemanager");
      })
      .catch((error) => {
        console.log("Error:", error);
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
  }

  const [folderId, setFolderId] = useState(null);
  const [deleteFolder, setDeleteFolder] = useState(false);
  const openDeleteFolder = (folderid) => {
    setFolderId(folderid);
    setDeleteFolder(true);
  };

  const closeDeleteFolderModal = () => {
    setDeleteFolder(false);
  };

  const handleDeleteFolder = async () => {
    await Leaddocumentsapi.post(
      "/deletefolder",
      {
        lead_uuid: lead_uuid,
        folder_id: folderId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          closeDeleteFolderModal();
          return false;
        }
        refreshFolderDetails(currentFolderId);
        closeDeleteFolderModal();
        setIsLoadingEffect(false);
        toast.success("Folder deleted successfully");
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
        closeDeleteFolderModal();
        return false;
      });
  };

  const [fileId, setFileId] = useState(null);
  const [deleteFile, setDeleteFile] = useState(false);
  const openDeleteFile = (fileid) => {
    setFileId(fileid);
    setDeleteFile(true);
  };

  const closeDeleteFile = () => {
    setDeleteFile(false);
  };

  const handleDeleteFile = async () => {
    await Leaddocumentsapi.post(
      "/deletefile",
      {
        lead_uuid: lead_uuid,
        file_id: fileId,
        employee_id: employeeId
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          closeDeleteFile();
          setIsLoadingEffect(false);
          return false;
        }
        refreshFolderDetails(currentFolderId);
        closeDeleteFile();
        setIsLoadingEffect(false);
        toast.success("File deleted successfully");
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
        closeDeleteFile();
        return false;
      });
  };

  const refreshFolderDetails = useCallback((currentfolderid) => {
    setIsLoadingEffect(true);
    fetchfoldersdetails(currentfolderid);
  }, []);

  useEffect(() => {
    setIsLoadingEffect(true);
    fetchfoldersdetails();
  }, []);

  return (
    <>
      <Toolbarwrapper
        refreshFolderDeatils={refreshFolderDetails}
        currentFolderUuid={currentFolderUuid}
        currentFolderId={currentFolderId}
        folderPath={folderPath}
        lead_uuid={lead_uuid}
      />
      <SearchAndPath
        folderPath={folderPath}
        folderBack={folderBack}
        mainFolder={mainFolder}
        currentFolderParentId={currentFolderParentId}
      />
      <div className="flex flex-row">
        <div className="basis-[100%]">
          <Filemanager
            fileStructure={fileStructure}
            folderselect={folderselect}
            isLoadingEffect={isLoadingEffect}
            openDeleteFile={openDeleteFile}
            openDeleteFolder={openDeleteFolder}
            refreshFolderDetails={refreshFolderDetails}
            currentFolderId={currentFolderId}
          />
        </div>
      </div>

      <DeleteModal
        title="Delete Folder"
        message="Are you sure you want to delete this Folder? This action will also remove all the files and folders under this folder."
        open={deleteFolder}
        onClose={closeDeleteFolderModal}
        onConfirm={handleDeleteFolder}
      />

      <DeleteModal
        title="Delete File"
        message="Are you sure you want to delete this File?"
        open={deleteFile}
        onClose={closeDeleteFile}
        onConfirm={handleDeleteFile}
      />

      {errorMessage !== "" && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
    </>
  );
}

export default Leadsdocumentswrapper;
