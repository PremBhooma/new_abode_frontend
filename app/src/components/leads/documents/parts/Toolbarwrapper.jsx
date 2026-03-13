import React, { useState } from 'react'
import { Button, Modal } from "@nayeshdaggula/tailify"
import Addfoldermodal from './Addfoldermodal'
import UploadfileModal from './UploadfileModal'
import { useEmployeeDetails } from '../../../zustand/useEmployeeDetails'
import Leaddocumentsapi from '../../../api/Leaddocumentsapi'
import { toast } from 'react-toastify'
import Errorpanel from '../../../shared/Errorpanel'
import DeleteModal from '../../../shared/DeleteModal'
import { FileText, Plus, Upload, RefreshCw, FolderPlus } from 'lucide-react'

function Toolbarwrapper({ refreshFolderDeatils, currentFolderUid, currentFolderId, folderPath, leadId }) {

    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const access_token = useEmployeeDetails((state) => state.access_token);

    const [addFolderModal, setAddFolderModal] = useState(false)
    const openFolderModal = () => {
        setAddFolderModal(true)
    }
    const closeFolderModal = () => {
        setAddFolderModal(false)
    }

    const permissions = useEmployeeDetails((state) => state.permissions)

    const [uploadFile, setUploadFile] = useState(false)
    const openUploadfileModal = () => {
        setUploadFile(true)
    }
    const closeUploadFileModal = () => {
        setUploadFile(false)
    }

    const [errorMessage, setErrorMessage] = useState('')
    const [isLoadingEffect, setIsLoadingEffect] = useState(false)

    const [syncData, setSyncdata] = useState(false);
    const openSyncDataModal = () => {
        setSyncdata(true);
    };

    const closeSyncDataModal = () => {
        setSyncdata(false);
    };


    const handleSyncData = async () => {
        await Leaddocumentsapi.post(
            "/syncfilesystemwithdb",
            {
                leadId: leadId,
                employee_id: employeeId
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
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
                    return false;
                }
                toast.success("Data synced successfully");
                setIsLoadingEffect(false);
                closeSyncDataModal()
                refreshFolderDeatils()
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform hover:scale-105">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                            Document Manager
                        </h2>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                            Manage Lead Files & Folders
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* <button
                        disabled={isLoadingEffect}
                        onClick={openSyncDataModal}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={isLoadingEffect ? "animate-spin" : ""} />
                        Sync
                    </button> */}

                    {permissions?.leads_page?.includes("add_folder_in_document_in_lead") && (
                        <button
                            onClick={openFolderModal}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
                        >
                            <FolderPlus size={14} />
                            Add folder
                        </button>
                    )}

                    {permissions?.leads_page?.includes("upload_file_in_lead") && (
                        <button
                            onClick={openUploadfileModal}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-500 border border-blue-700 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        >
                            <Upload size={14} />
                            Upload File
                        </button>
                    )}
                </div>
            </div>
            {/* add folder modal */}
            <Modal
                open={addFolderModal}
                onClose={closeFolderModal}
                size="sm"
                withCloseButton={false}
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                padding='0px'
            >
                {
                    addFolderModal &&
                    <Addfoldermodal
                        closeFolderModal={closeFolderModal}
                        currentFolderId={currentFolderId}
                        currentFolderUid={currentFolderUid}
                        refreshFolderDeatils={refreshFolderDeatils}
                    />

                }
            </Modal>
            {/* add folder modal */}
            <Modal
                open={uploadFile}
                onClose={closeUploadFileModal}
                size="sm"
                withCloseButton={false}
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
                padding='0px'
            >
                {
                    uploadFile &&
                    <UploadfileModal
                        closeUploadFileModal={closeUploadFileModal}
                        currentFolderId={currentFolderId}
                        folderPath={folderPath}
                        refreshFolderDeatils={refreshFolderDeatils}
                    />
                }
            </Modal>

            <DeleteModal
                title="Sync Files"
                message="Are you sure you want to sync the files?"
                open={syncData}
                onClose={closeSyncDataModal}
                onConfirm={handleSyncData}
                mainBtnText="Yes"
            />

            {errorMessage !== "" && (
                <Errorpanel
                    errorMessages={errorMessage}
                    setErrorMessages={setErrorMessage}
                />
            )}
        </>
    )
}

export default Toolbarwrapper
