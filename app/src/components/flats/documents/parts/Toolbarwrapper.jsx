import { IconFolderPlus, IconUpload } from '@tabler/icons-react'
import React, { useState } from 'react'
import { Button, Modal } from "@nayeshdaggula/tailify"
import Addfoldermodal from './Addfoldermodal'
import UploadfileModal from './UploadfileModal'
import { useEmployeeDetails } from '../../../zustand/useEmployeeDetails'
import Flatdocumentsapi from '../../../api/Flatdocumentsapi'
import { toast } from 'react-toastify'
import Errorpanel from '../../../shared/Errorpanel'
import DeleteModal from '../../../shared/DeleteModal'
function Toolbarwrapper({ refreshFolderDeatils, currentFolderUid, currentFolderId, folderPath, flat_uid }) {

    const permissions = useEmployeeDetails(state => state.permissions)
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
        await Flatdocumentsapi.post(
            "/flatssyncfilesystemwithdb",
            {
                flat_uid: flat_uid,
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
                closeSyncDataModal();
                refreshFolderDeatils();
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
            <div className="flex max-sm:flex-col max-sm:gap-2 flex-row items-center justify-between test">
                <p className='font-semibold '>File Manager</p>
                <div className='flex felex-row gap-3'>
                    <Button disabled={isLoadingEffect} onClick={openSyncDataModal} variant="default" size='xs' className='!px-4 !py-2'>
                        Sync
                    </Button>
                    {permissions?.flats_page?.includes("add_folder_in_document_in_flat") && (
                        <Button onClick={openFolderModal} variant="default" size='xs' className='!px-4 !py-2'>
                            Add folder
                        </Button>
                    )}

                    {permissions?.flats_page?.includes("updload_file_in_flat") && (
                        <Button onClick={openUploadfileModal} size='xs' color='#0083bf' className='!px-4 !py-2'>
                            Upload File
                        </Button>
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