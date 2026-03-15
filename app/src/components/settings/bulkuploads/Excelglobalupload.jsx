import React, { useState } from 'react';
import Settingsapi from '../../api/Settingsapi';
import { Button, Fileinput, Loadingoverlay } from '@nayeshdaggula/tailify';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { AlertCircle } from 'lucide-react';

const Excelglobalupload = ({ closeUploadGlobalExcel, setReqData }) => {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [globalExcelFile, setGlobalExcelFile] = useState(null);
    const [globalExcelFileError, setGlobalExcelFileError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (
            file &&
            (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel')
        ) {
            setGlobalExcelFile(file);
            setGlobalExcelFileError('');
        } else {
            setGlobalExcelFileError('Please upload a valid Excel file (.xlsx or .xls)');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let hasError = false;
        if (!globalExcelFile) {
            setGlobalExcelFileError('Please select a file to upload.');
            hasError = true;
        }
        if (hasError) return;

        setIsLoadingEffect(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('bulkfile', globalExcelFile);
        formData.append('employee_id', employeeId);

        Settingsapi.post('global-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then((res) => {
                const data = res.data;
                if (data.status === 'error') {
                    setErrorMessage(data.message || 'Upload failed.');
                    setIsLoadingEffect(false);
                    return;
                }
                setIsLoadingEffect(false);
                setReqData(data);
                closeUploadGlobalExcel();
                setGlobalExcelFile(null);
            })
            .catch((error) => {
                const msg =
                    error.response?.data?.message || error.message || 'An error occurred.';
                setErrorMessage(msg);
                setIsLoadingEffect(false);
            });
    };

    return (
        <div className="relative text-sm space-y-4 pt-6 p-4">
            <Loadingoverlay visible={isLoadingEffect} overlayBg="bg-white/60" />
            <div className="w-full flex justify-between items-center">
                <div className="font-semibold text-[15px]">Upload Global Bulk File</div>
                <Button onClick={closeUploadGlobalExcel} size="sm" variant="default" disabled={isLoadingEffect}>
                    Close
                </Button>
            </div>



            {/* File input */}
            <Fileinput
                label="Upload Excel File"
                labelClassName="text-sm font-medium !mb-2 font-sans"
                multiple={false}
                type="file"
                accept=".xlsx, .xls"
                clearable
                onChange={handleFileChange}
                mainContainerClass="!gap-1"
                className="bg-white !p-[8px] !shadow-sm text-sm !text-gray-500"
                error={globalExcelFileError}
            />

            {errorMessage && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-xs">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {isLoadingEffect && (
                <div className="rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-700">
                    Uploading file, please wait...
                </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <button
                    onClick={closeUploadGlobalExcel}
                    disabled={isLoadingEffect}
                    className="px-4 py-2 text-[13px] rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoadingEffect}
                    className="px-4 py-2 text-[13px] text-white bg-[#0083bf] hover:bg-[#026d9f] rounded-md disabled:cursor-not-allowed disabled:bg-[#6aaecf] cursor-pointer"
                >
                    {isLoadingEffect ? 'Uploading...' : 'Upload File'}
                </button>
            </div>
        </div>
    );
};

export default Excelglobalupload;
