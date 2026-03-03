import { useState } from 'react';
import Paymentapi from '../api/Paymentapi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@nayeshdaggula/tailify';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { IconUpload, IconFile, IconX, IconFileSpreadsheet } from '@tabler/icons-react';

const Uploadpaymentsexcel = ({ closeUploadPaymentExcel, setErrorMessage, refreshPaymentsData }) => {

    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [paymentExcelFile, setPaymentExcelFile] = useState(null);
    const [paymentExcelFileError, setPaymentExcelFileError] = useState(null);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel")) {
            setPaymentExcelFile(file);
            setPaymentExcelFileError('');
        } else {
            setPaymentExcelFileError('Please upload a valid Excel file (.xlsx or .xls)');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
                setPaymentExcelFile(file);
                setPaymentExcelFileError('');
            } else {
                setPaymentExcelFileError('Please upload a valid Excel file (.xlsx or .xls)');
            }
        }
    };

    const clearFile = () => {
        setPaymentExcelFile(null);
        setPaymentExcelFileError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoadingEffect(true);

        if (!paymentExcelFile) {
            setIsLoadingEffect(false);
            setPaymentExcelFileError('Please select a file to upload.');
            return false;
        }

        let formData = new FormData();
        formData.append('bulkpayments', paymentExcelFile);
        formData.append('employee_Id', employeeId);


        Paymentapi.post('upload-parsed-payments', formData, {
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
                    if (setErrorMessage) setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setIsLoadingEffect(false);
                closeUploadPaymentExcel();
                setPaymentExcelFile(null);
                if (refreshPaymentsData) refreshPaymentsData();
                if (data?.status === 'success') {
                    navigate('/payments/view-bulk-payments')
                }
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
                if (setErrorMessage) setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            });
    };

    return (
        <div className="flex flex-col gap-5 p-2">
            {/* Header */}
            <div className='flex justify-between items-center border-b border-gray-100 pb-3'>
                <div className='flex items-center gap-2'>
                    <div className="h-8 w-1 bg-[#0083bf] rounded-full"></div>
                    <h2 className='text-lg font-semibold text-gray-800'>Upload Bulk Payments</h2>
                </div>
                <Button onClick={closeUploadPaymentExcel} size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                    ✕
                </Button>
            </div>

            {/* Guidelines */}
            <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-gray-600 mb-2 font-medium">Before uploading:</p>
                <ul className="list-disc ml-4 space-y-1 text-sm text-gray-600">
                    <li>Make sure you've downloaded and filled out the <span className="font-semibold text-gray-700">Payment Template</span></li>
                    <li>Ensure all required fields are completed correctly</li>
                    <li>Only <span className="font-semibold text-gray-700">.xlsx</span> or <span className="font-semibold text-gray-700">.xls</span> files are accepted</li>
                </ul>
            </div>

            {/* File Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${dragActive
                    ? 'border-[#0083bf] bg-blue-50'
                    : paymentExcelFile
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {paymentExcelFile ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-green-200">
                            <IconFileSpreadsheet size={24} className="text-green-600" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{paymentExcelFile.name}</p>
                                <p className="text-xs text-gray-500">{(paymentExcelFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button
                                onClick={clearFile}
                                className="ml-2 p-1 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <IconX size={16} className="text-red-500" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <IconUpload size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Drag and drop</span> your Excel file here, or
                        </p>
                        <label className="inline-block cursor-pointer">
                            <span className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                Browse Files
                            </span>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Supported: .xlsx, .xls</p>
                    </>
                )}
            </div>

            {/* Error Message */}
            {paymentExcelFileError && (
                <p className="text-red-500 text-sm text-center">{paymentExcelFileError}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={closeUploadPaymentExcel}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition-all duration-200 ${paymentExcelFile
                        ? 'bg-[#0083bf] hover:bg-[#006e9e] cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    onClick={handleSubmit}
                    disabled={!paymentExcelFile || isLoadingEffect}
                >
                    {isLoadingEffect ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <IconUpload size={18} />
                            Upload & Process
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Uploadpaymentsexcel;
