import React, { useEffect, useState } from 'react';
import Generalapi from '../../../api/Generalapi';
import Flatapi from '../../../api/Flatapi';
import Paymentapi from '../../../api/Paymentapi';
import photo from "@/assets/photo.png";
import Errorpanel from '@/components/shared/Errorpanel.jsx';
import pdficon from "@/assets/pdficon.png";
import { IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Textinput, Loadingoverlay, Select, Textarea, Fileinput } from '@nayeshdaggula/tailify';
import { useEmployeeDetails } from '../../../zustand/useEmployeeDetails';
import CustomDateFilter from '../../../shared/CustomDateFilter';

const getFileInfo = (url) => {
    if (!url) return { fileName: '', fileType: '' };
    const fileName = url.split('/').pop();
    const extension = fileName.split('.').pop().toLowerCase();
    const fileType = extension === 'pdf' ? 'pdf' : ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension) ? 'image' : 'unknown';
    return { fileName, fileType };
};

function Editflatpayment({ flat_id, flatPaymentUUID, closeEditFlatPayment, refreshAllPayments }) {

    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [bankList, setBankList] = useState([]);
    const [loanStatus, setLoanStatus] = useState("");
    const [minDate, setMinDate] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [originalPaymentAmount, setOriginalPaymentAmount] = useState(0);
    const [originalPaymentTowards, setOriginalPaymentTowards] = useState(null);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await Generalapi.get('/get-all-banks-list?limit=1000');
                if (response.data.status === 'success') {
                    setBankList(response.data.data.map(b => ({ value: b.name, label: b.name })));
                }
            } catch (e) {
                console.error("Error fetching banks:", e);
            }
        };
        fetchBanks();

        const fetchPaymentDetails = async () => {
            if (flat_id) {
                try {
                    const res = await Flatapi.get(`/get-flat-payment-details?flat_id=${flat_id}`);
                    if (res.data?.status === 'success') {
                        setPaymentDetails(res.data.data);
                        setLoanStatus(res.data.data.loan_status);
                        if (res.data.data.application_date) {
                            setMinDate(new Date(res.data.data.application_date));
                        }
                    }
                } catch (error) {
                    console.error("Error fetching payment details:", error);
                }
            }
        };
        fetchPaymentDetails();
    }, [flat_id]);

    const getRemainingForCategory = (category) => {
        if (!paymentDetails?.paymentSummary) return null;

        const ptLower = (category || '').toLowerCase();
        let catKey = null;

        if (['flat', 'flat cost', 'base price', 'flat cost (base price)'].includes(ptLower)) catKey = 'flat';
        else if (['gst'].includes(ptLower)) catKey = 'gst';
        else if (['corpus fund'].includes(ptLower)) catKey = 'corpusFund';
        else if (['maintenance charges', 'maintenance'].includes(ptLower)) catKey = 'maintenanceCharges';
        else if (['documentation fee', 'documentation'].includes(ptLower)) catKey = 'documentationFee';
        else if (['manjeera connection charge', 'manjeera connection'].includes(ptLower)) catKey = 'manjeeraConnectionCharge';
        else if (['manjeera meter connection', 'manjeera meter charge'].includes(ptLower)) catKey = 'manjeeraMeterCharge';
        else if (['registration'].includes(ptLower)) catKey = 'registration';

        if (catKey && paymentDetails.paymentSummary[catKey]) {
            let rem = paymentDetails.paymentSummary[catKey].remaining;
            if (category === originalPaymentTowards) {
                rem += originalPaymentAmount;
            }
            return rem;
        }
        return null;
    };

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const updateAmount = (e) => {
        const value = e.target.value;
        const cleanValue = value.replace(/,/g, ''); // Remove existing commas

        // Allow only numbers and a single decimal point
        if (!/^\d*\.?\d*$/.test(cleanValue)) return;

        setAmountError('');

        if (cleanValue === '') {
            setAmount('');
            return;
        }

        const parts = cleanValue.split('.');
        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

        // Format integer part using Indian locale
        const formattedInteger = integerPart ? parseInt(integerPart).toLocaleString('en-IN') : '';

        setAmount(formattedInteger + decimalPart);
    };

    const [paymentType, setPaymentType] = useState(null);
    const [paymentTypeError, setPaymentTypeError] = useState('');
    const updatePaymentType = (value) => {
        setPaymentType(value);
        setPaymentTypeError('');
    };

    const [paymentTowards, setPaymentTowards] = useState(null);
    const [paymentTowardsError, setPaymentTowardsError] = useState('');
    const updatePaymentTowards = (value) => {
        setPaymentTowards(value);
        setPaymentTowardsError('');
    };

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentMethodError, setPaymentMethodError] = useState('');
    const updatePaymentMethod = (value) => {
        setPaymentMethod(value);
        setPaymentMethodError('');
        setBank('');
    };

    const [bank, setBank] = useState('');
    const [bankError, setBankError] = useState('');
    const updateBank = (value) => {
        setBank(value);
        setBankError('');
    };

    const [paymentDate, setPaymentDate] = useState("");
    const [paymentDateError, setPaymentDateError] = useState('');
    const updatePaymentDate = (value) => {
        setPaymentDate(value);
        setPaymentDateError('');
    };

    const [transactionId, setTransactionId] = useState('');
    const [transactionIdError, setTransactionIdError] = useState('');
    const updateTransactionId = (e) => {
        setTransactionId(e.currentTarget.value);
        setTransactionIdError('');
    };

    const [receipt, setReceipt] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [receiptError, setReceiptError] = useState('');
    const [receiptUpdated, setReceiptUpdated] = useState(false);
    const updateFeaturedImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setReceipt(file);
            setReceiptUrl(URL.createObjectURL(file));
            setReceiptError('');
            setReceiptUpdated(true);
        }
    };
    const removeReceipt = () => {
        setReceipt(null);
        setReceiptUrl('');
        setReceiptUpdated(true);
    };

    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const updateComment = (e) => {
        setComment(e.currentTarget.value);
        setCommentError('');
    };

    async function getSinglePaymentData(payment_uid) {
        setIsLoadingEffect(true);
        try {
            const response = await Paymentapi.get('getsinglepayment', {
                params: { paymentuid: payment_uid },
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            if (data.status === 'error') {
                setErrorMessage({ message: data.message, server_res: data });
                setIsLoadingEffect(false);
                return false;
            }

            if (data.payment_details) {
                const payment = data.payment_details;
                setAmount(payment?.amount ? payment?.amount.toLocaleString('en-IN') : '');
                setOriginalPaymentAmount(payment?.amount || 0);
                setOriginalPaymentTowards(payment?.payment_towards || null);
                setPaymentType(payment?.payment_type || null);
                setPaymentTowards(payment?.payment_towards || null);
                setPaymentMethod(payment?.payment_method || null);
                setBank(payment?.bank || '');
                setPaymentDate(payment?.payment_date ? new Date(payment?.payment_date) : new Date());
                setTransactionId(payment?.transaction_id || '');
                setReceiptUrl(payment?.receipt_url || '');
                setComment(payment?.comment || '');
            }
            setIsLoadingEffect(false);
            return true;
        } catch (error) {
            console.log('Fetch payment error:', error);
            setErrorMessage({ message: error.message, server_res: error.response?.data || null });
            setIsLoadingEffect(false);
            return false;
        }
    }

    useEffect(() => {
        if (flatPaymentUUID) {
            getSinglePaymentData(flatPaymentUUID);
        }
    }, [flatPaymentUUID]);

    const [receiptFileType, setReceiptFileType] = useState('');
    const [receiptFileName, setReceiptFileName] = useState('');

    useEffect(() => {
        if (receiptUrl) {
            const { fileName, fileType } = getFileInfo(receiptUrl);
            setReceiptFileType(fileType);
            setReceiptFileName(fileName);
        } else {
            setReceiptFileType('');
            setReceiptFileName('');
        }
    }, [receiptUrl]);

    const handleSubmit = async () => {
        setIsLoadingEffect(true);

        // Collect all validation errors at once
        let hasErrors = false;

        if (amount === '') {
            setAmountError('Amount is required');
            hasErrors = true;
        }
        if (!paymentType) {
            setPaymentTypeError('Select payment type');
            hasErrors = true;
        }
        if (!paymentTowards) {
            setPaymentTowardsError('Select payment towards');
            hasErrors = true;
        }
        if (!paymentMethod) {
            setPaymentMethodError('Select payment method');
            hasErrors = true;
        }
        if ((paymentMethod === 'DD' || paymentMethod === 'Bank Deposit') && !bank) {
            setBankError('Enter the bank name');
            hasErrors = true;
        }
        if (!paymentDate) {
            setPaymentDateError('Select payment date');
            hasErrors = true;
        }
        if (!transactionId) {
            setTransactionIdError('Enter transaction id');
            hasErrors = true;
        }

        if (hasErrors) {
            setIsLoadingEffect(false);
            return false;
        }

        const rem = getRemainingForCategory(paymentTowards);
        const numAmount = Number(amount.replace(/,/g, ''));
        if (rem !== null && numAmount > rem) {
            setAmountError(`Amount (₹${new Intl.NumberFormat('en-IN').format(numAmount)}) exceeds remaining balance (₹${new Intl.NumberFormat('en-IN').format(rem)}) for ${paymentTowards}`);
            setIsLoadingEffect(false);
            return false;
        }

        const formatDateOnly = (date) => {
            if (!date) return null;
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const formdata = new FormData();
        formdata.append('payment_uid', flatPaymentUUID);
        formdata.append('amount', amount.replace(/,/g, ''));
        formdata.append('payment_type', paymentType);
        formdata.append('payment_towards', paymentTowards);
        formdata.append('payment_method', paymentMethod);
        formdata.append('bank', bank);
        formdata.append('paymentdate', formatDateOnly(paymentDate));
        formdata.append('transactionid', transactionId);
        formdata.append('receipt', receipt || '');
        formdata.append('comment', comment);
        formdata.append('flat_id', flat_id);
        formdata.append('customer_id', null);
        formdata.append('receipt_updated', receiptUpdated.toString());
        formdata.append('employee_id', employeeId);

        try {
            const res = await Paymentapi.post('/updatepayment', formdata, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = res.data;
            if (data.status === 'error') {
                if (data?.message?.toLowerCase().includes("transaction id")) {
                    setTransactionIdError(data.message);
                } else {
                    setErrorMessage({ message: data.message, server_res: data });
                }
                setIsLoadingEffect(false);
                return false;
            }
            setIsLoadingEffect(false);
            toast.success('Payment updated successfully');
            refreshAllPayments();
            closeEditFlatPayment();
        } catch (error) {
            console.log('Error:', error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data || null,
            });
            setIsLoadingEffect(false);
            return false;
        }
    };


    return (
        <div className="flex flex-col gap-4 w-full px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-800 text-lg font-semibold max-sm:text-xl"> </h1>
                <div onClick={closeEditFlatPayment} className="cursor-pointer py-1 px-2 rounded-sm !bg-red-500 text-white font-semibold">
                    Close
                </div>
            </div>
            <hr className='border border-gray-200' />
            <div className="relative flex flex-col gap-4">
                <div className='w-full grid grid-cols-2 gap-4'>
                    <Textinput
                        placeholder="Enter Amount"
                        label="Amount"
                        error={amountError}
                        value={amount}
                        onChange={updateAmount}
                        labelClassName="text-sm font-medium text-gray-600 mb-1"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                    />
                    <Select
                        label="Payment Type"
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        placeholder="Select Payment Type"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        className="w-full"
                        dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                        selectWrapperClass="!shadow-none"
                        error={paymentTypeError}
                        value={paymentType}
                        onChange={updatePaymentType}
                        data={[
                            { value: 'Customer Pay', label: 'Customer Pay' },
                            ...(loanStatus === "Approved" ? [{ value: 'Loan Pay', label: 'Loan Pay' }] : []),
                        ]}
                    />
                    <Select
                        label="Payment Towards"
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        placeholder="Select Payment Towards"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        className="w-full"
                        dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                        selectWrapperClass="!shadow-none"
                        error={paymentTowardsError}
                        value={paymentTowards}
                        onChange={updatePaymentTowards}
                        data={["Flat", "GST", "Corpus Fund", "Maintenance Charges", "Manjeera Connection Charge", "Manjeera Meter Connection", "Documentation Fee", "Registration"].map(cat => {
                            const rem = getRemainingForCategory(cat);
                            return {
                                value: cat,
                                label: rem !== null ? `${cat} (Remaining: ₹${new Intl.NumberFormat('en-IN').format(rem)})` : cat
                            };
                        })}
                    />
                    <Select
                        label="Payment Method"
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        placeholder="Select Payment Method"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        className="w-full"
                        dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                        selectWrapperClass="!shadow-none"
                        error={paymentMethodError}
                        value={paymentMethod}
                        onChange={updatePaymentMethod}
                        data={[
                            { value: 'DD', label: 'DD' },
                            { value: 'UPI', label: 'UPI' },
                            { value: 'Bank Deposit', label: 'Bank Deposit' },
                            { value: 'Cheque', label: 'Cheque' },
                            { value: 'Online Transfer (IMPS, NFT)', label: 'Online Transfer (IMPS, NFT)' },
                        ]}
                    />
                    {(paymentMethod === 'DD' || paymentMethod === 'Bank Deposit') && (
                        <Select
                            placeholder="Select Bank"
                            label="Bank"
                            error={bankError}
                            value={bank}
                            onChange={updateBank}
                            labelClass="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                            className="w-full"
                            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                            selectWrapperClass="!shadow-none"
                            data={bankList}
                        />
                    )}
                    <CustomDateFilter
                        label="Date of Payment"
                        selected={paymentDate}
                        onChange={updatePaymentDate}
                        error={paymentDateError}
                        maxDateToday={true}
                        minDate={minDate}
                    />
                    <Textinput
                        placeholder="Enter transaction id"
                        label="Transaction Id"
                        error={transactionIdError}
                        value={transactionId}
                        onChange={updateTransactionId}
                        labelClassName="text-sm font-medium text-gray-600 mb-1"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                    />
                    {receiptUrl ? (
                        <div className="relative">
                            <p className="text-sm font-semibold text-gray-600 mb-1">Receipt</p>
                            <div className="relative flex items-center gap-2 justify-center border border-amber-50 rounded-md p-3 bg-gray-50">
                                <img
                                    src={receiptFileType === 'pdf' ? pdficon : photo}
                                    className={receiptFileType === 'pdf' ? 'h-[50px] w-[50px]' : 'h-[40px] w-[40px]'}
                                    alt="Receipt"
                                />
                                <a
                                    href={receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-sm font-medium truncate max-w-[200px]"
                                >
                                    {receiptFileName || 'View Receipt'}
                                </a>
                                <div className="absolute right-2 top-2" onClick={removeReceipt}>
                                    <IconX size={18} color="red" className="cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Fileinput
                            label="Receipt (optional)"
                            accept="image/*,application/pdf"
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            multiple={false}
                            clearable
                            value={receipt}
                            error={receiptError}
                            onChange={updateFeaturedImage}
                        />
                    )}

                </div>
                <Textarea
                    placeholder="Enter comments"
                    label="Comments"
                    error={commentError}
                    value={comment}
                    onChange={updateComment}
                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
            </div>
            {isLoadingEffect ?
                isLoadingEffect && (
                    <div className='absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded'>
                        <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                    </div>
                )
                :
                <div className="flex justify-end mt-auto">
                    <Link
                        onClick={handleSubmit}
                        disabled={isLoadingEffect}
                        className="cursor-pointer ml-[10px] text-xs text-left text-white flex justify-center items-center relative px-4 py-[7px] rounded bg-[#0083bf]"
                    >
                        Update Flat Payment
                    </Link>
                </div>
            }

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Editflatpayment;