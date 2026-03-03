import React, { useState } from 'react';
import axios from 'axios';
import { Button, Fileinput } from '@nayeshdaggula/tailify';
import Paymentapi from '../api/Paymentapi';

const Uploadpaymentsexcel = ({ closeUploadPaymentExcel, refreshAllPayments, setErrorMessage }) => {
    const [paymentExcelFile, setPaymentExcelFile] = useState(null);
    const [paymentExcelFileError, setPaymentExcelFileError] = useState(null);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel")) {
            setPaymentExcelFile(file);
            setPaymentExcelFileError('');
        } else {
            setPaymentExcelFileError('Please upload a valid Excel file (.xlsx or .xls)');
        }
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

        Paymentapi.post('upload-bulk-payments', formData, {
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
                refreshAllPayments()
                closeUploadPaymentExcel();
                setPaymentExcelFile(null);
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
                <div className='font-semibold'>Upload Payment File</div>
                <Button onClick={closeUploadPaymentExcel} size="sm" variant="default">Close</Button>
            </div>
            <Fileinput
                // key={proofKey}
                // label="Uploaded Excel File"
                labelClassName="text-sm font-medium !mb-2 font-sans"
                multiple={false}
                type="file"
                accept=".xlsx, .xls"
                clearable
                onChange={handleFileChange}
                mainContainerClass='!gap-1'
                className='bg-white !p-[8px] !shadow-sm text-sm !text-gray-500'
                error={paymentExcelFileError}
            />
            <div className='flex justify-end'>
                <Button className='!px-5 !py-2 !text-white !text-xs !bg-[#0083bf] !rounded' onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    );
};

export default Uploadpaymentsexcel;
