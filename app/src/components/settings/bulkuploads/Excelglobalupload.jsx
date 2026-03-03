import React, { useState } from 'react';
import axios from 'axios';
import Settingsapi from '../../api/Settingsapi';
import { useNavigate } from 'react-router-dom';
import { Button, Fileinput, Loadingoverlay } from '@nayeshdaggula/tailify';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';

const Excelglobalupload = ({ closeUploadGlobalExcel, setReqData }) => {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [globalExcelFile, setGlobalExcelFile] = useState(null);
    const [globalExcelFileError, setGlobalExcelFileError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel")) {
            setGlobalExcelFile(file);
            setGlobalExcelFileError('');
        } else {
            setGlobalExcelFileError('Please upload a valid Excel file (.xlsx or .xls)');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoadingEffect(true);

        if (!globalExcelFile) {
            setIsLoadingEffect(false);
            setGlobalExcelFileError('Please select a file to upload.');
            return false;
        }

        let formData = new FormData();
        formData.append('bulkfile', globalExcelFile);
        formData.append('employee_id', employeeId);

        Settingsapi.post('global-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                let data = res.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setIsLoadingEffect(false);
                setReqData(data)
                closeUploadGlobalExcel();
                setGlobalExcelFile(null);
                return false;
            }).catch((error) => {
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            });
    };
    return (
        <div className="text-sm space-y-2 !pt-7 p-4">
            <div className='w-full flex justify-between items-center'>
                <div className='font-semibold'>Upload Global Bulk File</div>
                <Button onClick={closeUploadGlobalExcel} size="sm" variant="default">Close</Button>
            </div>
            <Fileinput
                labelClassName="text-sm font-medium !mb-2 font-sans"
                multiple={false}
                type="file"
                accept=".xlsx, .xls"
                clearable
                onChange={handleFileChange}
                mainContainerClass='!gap-1'
                className='bg-white !p-[8px] !shadow-sm text-sm !text-gray-500'
                error={globalExcelFileError}
            />


            {isLoadingEffect ? (
                isLoadingEffect && (
                    <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                        <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                    </div>
                )
            ) : (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-[14px] text-white bg-[#0083bf] rounded cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            )}

        </div>
    );
};

export default Excelglobalupload;
