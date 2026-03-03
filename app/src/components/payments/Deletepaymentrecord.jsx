import { useState } from 'react';
import Paymentapi from '../api/Paymentapi';
import { IconX } from '@tabler/icons-react';
import { Button, Loadingoverlay } from '@nayeshdaggula/tailify';

const Deletepaymentrecord = ({ deleteRowData, closeDeletePaymentRecord, refreshAllParsedPayments }) => {
    const [paymentError, setPaymentError] = useState(null);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoadingEffect(true);

        if (!deleteRowData?.uuid) {
            setIsLoadingEffect(false);
            setPaymentError('Payment record not found. Try refreshing the page.');
            return false;
        }

        Paymentapi.post('delete-parsed-payment-record', { uuid: deleteRowData?.uuid })
            .then((res) => {
                let data = res.data;
                if (data.status === 'error') {
                    let finalresponse = {
                        'message': data.message,
                        'server_res': data
                    }
                    setPaymentError(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setIsLoadingEffect(false);
                refreshAllParsedPayments();
                closeDeletePaymentRecord();

                return true;
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
                setPaymentError(finalresponse);
                setIsLoadingEffect(false);
                return false;
            });
    };

    return (
        <div className="text-sm space-y-2">
            <div className='w-full flex justify-between items-center'>
                <p className='text-[16px] font-semibold'>Delete Payment Record - {deleteRowData?.transaction_id}</p>
                <div onClick={closeDeletePaymentRecord}><IconX className='text-red-500 cursor-pointer' /></div>
            </div>
            <p className="text-sm text-center">
                Are you absolutely certain you want to permanently delete this payment record?
                This action cannot be undone and the associated details will be lost.
            </p>
            {paymentError !== null && <p className="text-sm text-red-400 text-center">{paymentError}</p>}
            {isLoadingEffect ? (
                isLoadingEffect && (
                    <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                        <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                    </div>
                )
            ) : (
                <div className='flex justify-end'>
                    <Button onClick={handleSubmit} className='!px-5 !py-2 !text-white !text-xs !bg-red-400 hover:!bg-red-500 !rounded'>Delete</Button>
                </div>
            )}
        </div>
    );
};

export default Deletepaymentrecord;
