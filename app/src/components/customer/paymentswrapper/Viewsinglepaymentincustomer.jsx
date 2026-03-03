import react, { useEffect, useState } from "react";
import dayjs from "dayjs";

import Paymentapi from "../../api/Paymentapi";
import Errorpanel from "../../shared/Errorpanel";
import photo from '../../../../public/assets/photo.png'
import pdficon from '../../../../public/assets/pdficon.png'
import { Loadingoverlay } from "@nayeshdaggula/tailify";

const getFileInfo = (url) => {
    // Get file name from the URL
    const fileName = url.split('/').pop();

    // Get the file extension
    const extension = fileName.split('.').pop().toLowerCase();

    // Determine the type
    let fileType = '';
    if (extension === 'pdf') {
        fileType = 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
        fileType = 'image';
    } else {
        fileType = 'unknown';
    }

    return { fileName, fileType };
};

function Viewsinglepaymentincustomer({ paymentUuid, closeViewDrawer }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({})


    // Fetch single payment data
    function getSinglePaymentData(payment_uid) {
        setIsLoadingEffect(true);
        Paymentapi.get('getsinglepayment', {
            params: {
                paymentuid: payment_uid,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === 'error') {
                    const finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                if (data !== null) {
                    setPaymentDetails(data?.payment_details || {})
                }
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
                console.log(error)
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

    useEffect(() => {
        if (paymentUuid) {
            getSinglePaymentData(paymentUuid);
        }
    }, [paymentUuid]);

    const [receiptFileType, setReceiptFileType] = useState(null)
    const [receiptFileName, setReceiptFileName] = useState(null)

    useEffect(() => {
        if (paymentDetails) {
            if (paymentDetails?.receipt_url) {
                const { fileName, fileType } = getFileInfo(paymentDetails?.receipt_url);
                setReceiptFileType(fileType)
                setReceiptFileName(fileName)
            }
        }
    }, [paymentDetails])

    return (
        <>
            <div className="flex flex-col gap-3 w-full px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 text-lg font-semibold max-sm:text-xl">Customer Payment Details</h1>
                    <div onClick={closeViewDrawer} className="cursor-pointer py-1 px-2 rounded-sm !bg-red-500 text-white font-semibold">Close</div>
                </div>
                <hr className='border border-gray-200' />
                <div className="relative flex flex-col gap-4">
                    <div className="space-y-6 text-sm">
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Payment Ref Id</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.uuid}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Transaction Id</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.transaction_id || '---'}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Flat Number</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.flat?.flat_no || '---'}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Customer Name</span>
                            <span className="basis-[80%] font-semibold text-gray-900 capitalize">{paymentDetails?.customer?.first_name || '---'} {paymentDetails?.customer?.last_name}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Amount</span>
                            <span className="basis-[80%] font-semibold text-gray-900">₹ {parseInt(paymentDetails?.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Date of Payment</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.payment_date ? dayjs(paymentDetails?.payment_date).format("DD MMM YYYY") : '---'}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Payment Type</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.payment_type || '---'}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Payment Towards</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.payment_towards || '---'}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Payment Method</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.payment_method || '---'}</span>
                        </div>
                        {
                            (paymentDetails?.payment_method === "cash" || paymentDetails?.payment_method === "bank_deposit") &&
                            <div className="flex">
                                <span className="basis-[20%] text-gray-600">Bank</span>
                                <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.bank}</span>
                            </div>
                        }
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Comment</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.comment || '---'}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Receipt</span>
                            {
                                paymentDetails?.receipt_url ?
                                    <div className="basis-[30%] flex items-center gap-2 border border-amber-50 rounded-md p-3 bg-gray-50">
                                        {receiptFileType === 'pdf' ?
                                            <img src={pdficon} className='h-[30px] w-[30px]' />
                                            :
                                            <img src={photo} className='h-[30px] w-[30px]' />
                                        }
                                        <a
                                            href={paymentDetails?.receipt_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 text-sm font-medium"
                                        >
                                            {receiptFileName || "View"}
                                        </a>
                                    </div>
                                    :
                                    <span className="basis-[80%] font-semibold text-gray-900">No Receipt Found</span>
                            }
                        </div>
                    </div>
                    {
                        isLoadingEffect &&
                        <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                            <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                        </div>
                    }
                </div>
            </div>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </>
    );
}

export default Viewsinglepaymentincustomer;