import react, { useEffect, useState } from "react";
import { Link, NavLink, useParams } from 'react-router-dom';
import Paymentapi from "../api/Paymentapi";
import dayjs from "dayjs";
import pdficon from "@/assets/pdficon.png";
import photo from "@/assets/photo.png";
import { IconArrowLeft } from "@tabler/icons-react";
import Errorpanel from "../shared/Errorpanel";
import { Loadingoverlay } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Skeleton } from "../ui/skeleton";
import { ChevronRight, CircleDollarSign, LayoutDashboard, ArrowLeft } from "lucide-react";

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

function Singlepaymentwrapper() {
    const params = useParams();
    const payment_uid = params.payment_uid;
    const permissions = useEmployeeDetails((state) => state.permissions);

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
        if (payment_uid) {
            getSinglePaymentData(payment_uid);
        }
    }, [payment_uid]);

    const [receiptFileType, setReceiptFileType] = useState(null)
    const [receiptFileName, setReceiptFileName] = useState(null)

    useEffect(() => {
        if (paymentDetails?.receipturl) {
            const { fileName, fileType } = getFileInfo(paymentDetails?.receipt_url);
            setReceiptFileType(fileType)
            setReceiptFileName(fileName)
        }
    }, [paymentDetails])

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="bg-white rounded-md shadow-sm border border-slate-100 p-4">
                    {/* Row 1: Breadcrumb */}
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.1em] uppercase mb-2">
                        <div className="flex items-center gap-2">
                            <Link to="/dashboard" className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                <LayoutDashboard size={12} />
                                Dashboard
                            </Link>
                            <ChevronRight size={12} className="text-slate-300" />
                            <Link to="/payments" className="text-slate-400 hover:text-blue-600 transition-colors">
                                Payments
                            </Link>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className="text-blue-600">Payment Details</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to={'/payments'} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0083bf] bg-[#0083bf]/5 border border-[#0083bf]/20 rounded-lg shadow-sm hover:bg-[#0083bf]/10 hover:border-[#0083bf]/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                                <ArrowLeft size={14} />
                                Back
                            </Link>
                        </div>
                    </div>

                    {/* Row 2: Title & Module Identifier */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm transition-transform hover:scale-105 duration-300">
                                <CircleDollarSign size={22} fill="currentColor" fillOpacity={0.15} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                                        Payment Details
                                    </h1>
                                    {/* {!isLoadingEffect && (
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                                            {paymentDetails?.id || "---"}
                                        </span>
                                    )} */}
                                </div>
                                <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                                    {isLoadingEffect ? <Skeleton className="h-3 w-32" /> : `Transaction ID: ${paymentDetails?.transaction_id || "---"}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative w-full p-6 bg-white rounded-md shadow-sm border border-slate-100">
                    {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment </h3> */}
                    <div className="space-y-6 text-sm">
                        {/* <div className="flex">
                            <span className="basis-[20%] text-gray-600">Payment Ref Id</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.id}</span>
                        </div> */}
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Transaction Id</span>
                            <span className="basis-[80%] font-semibold text-gray-900">{paymentDetails?.transaction_id || '---'}</span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Flat Number</span>
                            <span className="basis-[80%] font-semibold text-gray-900">
                                {permissions?.flats_page?.includes("view_flat") ? (
                                    <NavLink to={`/flats/view-flat/${paymentDetails?.flat?.id}`}>
                                        {paymentDetails?.flat?.flat_no || '---'}
                                    </NavLink>
                                ) : (
                                    paymentDetails?.flat?.flat_no || '---'
                                )}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="basis-[20%] text-gray-600">Customer Name</span>
                            <span className="basis-[80%] font-semibold text-gray-900 capitalize">
                                {permissions?.customers_page?.includes("view_single_customer") ? (
                                    <NavLink to={`/customers/${paymentDetails?.customer?.id}`}>
                                        {paymentDetails?.customer?.prefixes || ''} {paymentDetails?.customer?.first_name || '---'} {paymentDetails?.customer?.last_name}
                                    </NavLink>
                                ) : (
                                    `${paymentDetails?.customer?.prefixes || ''} ${paymentDetails?.customer?.first_name || '---'} ${paymentDetails?.customer?.last_name || ''}`
                                )}
                            </span>
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
                                    <div className="basis-[20%] flex items-center gap-2 justify-center border border-amber-50 rounded-md p-3 bg-gray-50">
                                        {receiptFileType === 'pdf' ?
                                            <img src={pdficon} className='h-[50px] w-[50px]' />
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
            {errorMessage && (
                <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
            )}
        </>
    );
}

export default Singlepaymentwrapper;
