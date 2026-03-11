import React, { useEffect, useState } from 'react';
import Generalapi from '../api/Generalapi';
import dayjs from "dayjs";
import Flatapi from '../api/Flatapi';
import Paymentapi from '../api/Paymentapi';
import photo from "@/assets/photo.png";
import pdficon from "@/assets/pdficon.png";
import Errorpanel from '@/components/shared/Errorpanel.jsx';
import noImageStaticImage from "@/assets/no_image.png";
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { Loadingoverlay, Fileinput } from '@nayeshdaggula/tailify';
import CustomDateFilter from '../shared/CustomDateFilter';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const getFileInfo = (url) => {
    if (!url) return { fileName: '', fileType: '' };
    const fileName = url.split('/').pop();
    const extension = fileName.split('.').pop().toLowerCase();
    const fileType = extension === 'pdf' ? 'pdf' : ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension) ? 'image' : 'unknown';
    return { fileName, fileType };
};



function formatCurrency(amount) {
    if (amount === null || amount === undefined) return "₹ 0.00";
    return "₹ " + parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Editpaymentwrapper() {
    const navigate = useNavigate();
    const { payment_uid } = useParams();
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;

    const [bankList, setBankList] = useState([]);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await Generalapi.get('/get-all-banks-list?limit=1000');
                if (response.data.status === 'success') {
                    setBankList(response.data.data.map(b => b.name));
                }
            } catch (e) {
                console.error("Error fetching banks:", e);
            }
        };
        fetchBanks();
    }, []);

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

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [searchType, setSearchType] = useState('flatNo');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [originalPaymentAmount, setOriginalPaymentAmount] = useState(0);
    const [originalPaymentTowards, setOriginalPaymentTowards] = useState(null);

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

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchQuery('');
        setResults([]);
        setSelectedFlat(null);
        setSelectedFlatError('');
        setSearchError('');
        setShowDropdown(false);
        setPaymentDetails(null);
    };

    const updateSearchQuery = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (debounceTimer) clearTimeout(debounceTimer);

        const timer = setTimeout(() => {
            if (value.trim().length > 0) {
                getFlatsData(value);
                setShowDropdown(true);
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500);
        setDebounceTimer(timer);
    };

    const handleSelectFlat = (flat) => {
        setSearchQuery(flat?.label);
        setSelectedFlat(flat);
        setShowDropdown(false);
        setSelectedFlatError('');
        setPaymentDetails(null);

        // Fetch payment details for the selected flat
        if (flat?.id) {
            setLoadingDetails(true);
            Flatapi.get(`/get-flat-payment-details?flat_id=${flat.id}`)
                .then(res => {
                    if (res.data?.status === 'success') {
                        setPaymentDetails(res.data.data);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoadingDetails(false));
        }
    };

    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            setShowDropdown(false);
        }
    }, [searchQuery]);

    async function getFlatsData(query) {
        try {
            setLoading(true);
            const params = searchType === 'flatNo' ? { flat_no: query } : { searchQuery: query };
            const response = await Flatapi.get(`search-sold-flats`, {
                params,
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response?.data;
            if (data?.status === "error") {
                if (data.message === "No sold flat found with this number." || data.message === "No customer found with this detail.") {
                    setResults([]);
                    setSearchError('');
                } else {
                    setSearchError(data.message || "Failed to fetch data");
                    setResults([]);
                }
                return false;
            }
            setResults(data?.data || []);
            return true;
        } catch (error) {
            console.log(error);
            setSearchError(error.message || "An unexpected error occurred");
            return false;
        } finally {
            setLoading(false);
        }
    }

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
                setAmount(payment.amount ? payment.amount.toLocaleString('en-IN') : '');
                setOriginalPaymentAmount(payment.amount || 0);
                setOriginalPaymentTowards(payment?.payment_towards || null);
                setPaymentType(payment.payment_type || null);
                setPaymentTowards(payment?.payment_towards || null);
                setPaymentMethod(payment.payment_method || null);
                setBank(payment.bank || '');
                setPaymentDate(payment.payment_date ? new Date(payment.payment_date) : new Date());
                setTransactionId(payment.transaction_id || '');
                setReceiptUrl(payment.receipt_url || '');
                setComment(payment.comment || '');

                // Pre-fill flat/customer data
                if (payment.flat && payment.customer) {
                    setSelectedFlat({
                        value: payment.payment_id,
                        label: `${payment.flat.flat_no} - ${payment.customer.first_name} ${payment.customer.last_name}`,
                        flat_no: payment.flat.flat_no,
                        id: payment.flat.id,
                        project_id: payment.flat.project_id,
                        block_name: payment.flat.block_name,
                        facing: payment.flat.facing,
                        floor_no: payment.flat.floor_no,
                        square_feet: payment.flat.square_feet,
                        type: payment.flat.type,
                        bedrooms: payment.flat.bedrooms,
                        bathrooms: payment.flat.bathrooms,
                        balconies: payment.flat.balconies,
                        parking: payment.flat.parking,
                        furnished_status: payment.flat.furnished_status,
                        customer: {
                            id: payment.customer.id,
                            first_name: payment.customer.first_name,
                            last_name: payment.customer.last_name,
                            email: payment.customer.email,
                            phone_code: payment.customer.phone_code,
                            phone_number: payment.customer.phone_number,
                            profile_pic_url: payment.customer.profile_pic_url,
                        },
                    });
                    setSearchQuery(`${payment.flat.flat_no} - ${payment.customer.first_name} ${payment.customer.last_name}`);

                    // Fetch payment details for the flat
                    if (payment.flat?.id) {
                        setLoadingDetails(true);
                        Flatapi.get(`/get-flat-payment-details?flat_id=${payment.flat.id}`)
                            .then(res => {
                                if (res.data?.status === 'success') {
                                    setPaymentDetails(res.data.data);
                                }
                            })
                            .catch(err => console.error(err))
                            .finally(() => setLoadingDetails(false));
                    }
                }
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
        if (payment_uid) {
            getSinglePaymentData(payment_uid);
        }
    }, [payment_uid]);

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

    console.log("project_id:", selectedFlat)

    const handleSubmit = async () => {
        setIsLoadingEffect(true);

        // Collect all validation errors at once
        let hasErrors = false;

        if (!selectedFlat) {
            setSelectedFlatError('Please select a flat/customer');
            hasErrors = true;
        }
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
        formdata.append('amount', amount.replace(/,/g, ''));
        formdata.append('payment_type', paymentType);
        formdata.append('payment_towards', paymentTowards);
        formdata.append('payment_method', paymentMethod);
        formdata.append('bank', bank);
        formdata.append('paymentdate', formatDateOnly(paymentDate));
        formdata.append('transactionid', transactionId);
        formdata.append('receipt', receipt || '');
        formdata.append('comment', comment);
        formdata.append('customerFlatId', selectedFlat?.value || '');
        formdata.append('flat_id', selectedFlat?.id || '');
        formdata.append('customer_id', selectedFlat?.customer?.id || '');
        formdata.append('receipt_updated', receiptUpdated.toString());
        formdata.append('payment_uid', payment_uid);
        formdata.append("employee_id", employeeId);
        formdata.append("project_id", selectedFlat?.project_id);

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
            navigate('/payments');
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

    const infoItems = selectedFlat?.customer
        ? [
            { label: 'Name', value: `${capitalize(selectedFlat.customer.first_name) || ''} ${capitalize(selectedFlat.customer.last_name) || ''}` },
            { label: 'Email', value: selectedFlat.customer.email || '-' },
            { label: 'Phone Number', value: `+${selectedFlat.customer.phone_code || ''} ${selectedFlat.customer.phone_number || ''}` },
        ]
        : [];


    console.log("paymentDetails-EdIT", paymentDetails)

    return (
        <div className="w-full">
            <div className="border-b border-gray-200 pb-4 mb-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 text-lg font-semibold max-sm:text-xl">Edit Payment</h1>
                    <Link
                        to="/payments"
                        className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
                    >
                        <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
                        Back
                    </Link>
                </div>
            </div>
            <div className="relative flex flex-col gap-8 border border-[#ebecef] rounded-xl bg-white px-8 py-4 min-h-[65vh]">
                <div className="w-full flex flex-col gap-6">
                    {/* Search and Selection Section (Info) - NOW FIRST */}
                    <div className="w-full flex flex-col gap-4 transition-all duration-500 ease-in-out">
                        <div className="flex flex-col gap-2 w-full">
                            <h1 className="text-sm font-bold text-gray-700">Search by Flat No or Customer</h1>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        disabled
                                        type="radio"
                                        value="flatNo"
                                        checked={searchType === 'flatNo'}
                                        onChange={handleSearchTypeChange}
                                        className="form-radio text-[#0083bf] focus:ring-[#0083bf] cursor-not-allowed opacity-60"
                                    />
                                    <span className="text-sm font-medium text-gray-600 opacity-60">Search by Flat No</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        disabled
                                        type="radio"
                                        value="customer"
                                        checked={searchType === 'customer'}
                                        onChange={handleSearchTypeChange}
                                        className="form-radio text-[#0083bf] focus:ring-[#0083bf] cursor-not-allowed opacity-60"
                                    />
                                    <span className="text-sm font-medium text-gray-600 opacity-60">Search by Customer</span>
                                </label>
                            </div>
                            <div className={`flex flex-col gap-2 relative w-full ${!selectedFlat ? 'max-w-2xl mx-auto' : 'w-full'}`}>
                                <div className="text-sm font-medium text-gray-600">
                                    {searchType === 'flatNo' ? 'Search for Flat' : 'Search for Customer'}
                                </div>
                                <input
                                    readOnly
                                    placeholder={searchType === 'flatNo' ? 'Enter Flat No' : 'Enter Customer Name/Email'}
                                    value={searchQuery}
                                    onChange={updateSearchQuery}
                                    className="w-full border border-[#ced4da] px-3 py-2 rounded-md outline-none placeholder:text-[14px] placeholder:text-black/50 text-[14px] text-black/60 cursor-not-allowed bg-gray-100"
                                />
                                {showDropdown && (
                                    <div className="absolute top-full left-0 w-full z-10 mt-1">
                                        <div className="bg-white border border-[#ced4da] rounded-md max-h-48 overflow-y-auto">
                                            {loading ? (
                                                <div className="p-3 text-sm text-gray-500">Loading...</div>
                                            ) : results.length > 0 ? (
                                                <ul>
                                                    {results.map((item) => (
                                                        <li
                                                            key={item.value}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] text-black/60"
                                                            onClick={() => handleSelectFlat(item)}
                                                        >
                                                            {item.label}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-3 text-sm text-gray-500">No Result</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {selectedFlatError && (
                                    <p className="text-xs text-red-600 font-medium">{selectedFlatError}</p>
                                )}
                                {searchError && (
                                    <div className="absolute top-12 left-0 w-full z-0 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                                        {searchError}
                                    </div>
                                )}
                            </div>
                        </div>
                        {(selectedFlat || paymentDetails) && (
                            <div className="flex flex-col gap-4 w-full animate-in fade-in duration-500">
                                {loadingDetails ? (
                                    <div className="bg-white border rounded-xl p-8 flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : paymentDetails ? (
                                    <>
                                        {/* Financial Summary Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
                                                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Grand Total</div>
                                                <div className="text-xl font-bold text-blue-900 mt-1">
                                                    {formatCurrency(paymentDetails.financials?.grand_total || 0)}
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
                                                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Paid</div>
                                                <div className="text-xl font-bold text-emerald-900 mt-1">
                                                    {formatCurrency(paymentDetails.financials?.total_paid || 0)}
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                                                <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Balance Due</div>
                                                <div className="text-xl font-bold text-orange-900 mt-1">
                                                    {formatCurrency(paymentDetails.financials?.balance || 0)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Profile Card */}
                                        {paymentDetails.customer_details && (
                                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-800">Customer Profile</h3>
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                                        Flat {paymentDetails.flat_no}
                                                    </span>
                                                </div>
                                                <div className="p-4 flex items-center gap-5">
                                                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
                                                        {paymentDetails.customer_details.profile_pic_url ? (
                                                            <img src={`${process.env.API_URL}${paymentDetails.customer_details.profile_pic_url}`} alt="Profile" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold text-gray-400">
                                                                {paymentDetails.customer_details.first_name?.[0]}{paymentDetails.customer_details.last_name?.[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-gray-900">
                                                            {paymentDetails.customer_details.first_name} {paymentDetails.customer_details.last_name}
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 mt-1">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                {paymentDetails.customer_details.email}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                                {paymentDetails.customer_details.phone_code} {paymentDetails.customer_details.phone_number}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment History Table */}
                                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                <h3 className="font-semibold text-gray-800">Payment History</h3>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {paymentDetails.payment_history?.length > 0 ? (
                                                    <table className="w-full text-sm text-left table-fixed">
                                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                                            <tr>
                                                                <th className="px-4 py-2 w-[20%]">Date</th>
                                                                <th className="px-4 py-2 w-[20%]">Type</th>
                                                                <th className="px-4 py-2 w-[20%]">Txn ID</th>
                                                                <th className="px-4 py-2 w-[20%] text-right">Amount</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="divide-y divide-gray-100">
                                                            {paymentDetails.payment_history.map((pay) => (
                                                                <tr key={pay.id} className="hover:bg-gray-50">
                                                                    <td className="w-[20%] px-4 py-2 font-medium text-gray-900">
                                                                        {dayjs(pay.payment_date).format('DD MMM YYYY')}
                                                                    </td>

                                                                    <td className="w-[20%] px-4 py-2 text-gray-600">
                                                                        {pay.payment_type}
                                                                    </td>

                                                                    <td className="w-[20%] px-4 py-2 text-gray-500 font-mono text-xs break-all">
                                                                        {pay.trasnaction_id || '-'}
                                                                    </td>

                                                                    <td className="w-[20%] px-4 py-2 text-right font-semibold text-gray-900">
                                                                        {formatCurrency(pay.amount)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                ) : (
                                                    <div className="p-6 text-center text-gray-500 text-sm">
                                                        No previous payments found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : selectedFlat && (
                                    <div className="bg-white border border-[#ced4da] rounded-md p-4">
                                        <div className="text-lg font-semibold text-gray-800 mb-2">
                                            Flat No: {selectedFlat?.flat_no}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Loading additional details...
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Payment Form Fields - NOW SECOND */}
                    {selectedFlat && (
                        <div className="w-full animate-in slide-in-from-left duration-500">
                            <div className='grid grid-cols-2 gap-2'>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Amount</label>
                                    <Input
                                        placeholder="Enter Amount"
                                        value={amount}
                                        onChange={updateAmount}
                                        className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${amountError ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {amountError && <p className="text-xs text-red-500">{amountError}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Payment Type</label>
                                    <Select value={paymentType || undefined} onValueChange={updatePaymentType}>
                                        <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!paymentType ? 'text-gray-400' : ''} ${paymentTypeError ? 'border-red-500' : 'border-gray-300'}`}>
                                            <SelectValue placeholder="Select Payment Type" />
                                        </SelectTrigger>
                                        <SelectContent className="border border-gray-200">
                                            <SelectItem value="Customer Pay">Customer Pay</SelectItem>
                                            {paymentDetails?.loan_status === "Approved" && <SelectItem value="Loan Pay">Loan Pay</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                    {paymentTypeError && <p className="text-xs text-red-500">{paymentTypeError}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Payment Towards</label>
                                    <Select value={paymentTowards || undefined} onValueChange={updatePaymentTowards}>
                                        <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!paymentTowards ? 'text-gray-400' : ''} ${paymentTowardsError ? 'border-red-500' : 'border-gray-300'}`}>
                                            <SelectValue placeholder="Select Payment Towards" />
                                        </SelectTrigger>
                                        <SelectContent className="border border-gray-200">
                                            {["Flat", "GST", "Corpus Fund", "Maintenance Charges", "Manjeera Connection Charge", "Manjeera Meter Connection", "Documentation Fee", "Registration"].map(cat => {
                                                const rem = getRemainingForCategory(cat);
                                                return (
                                                    <SelectItem key={cat} value={cat}>
                                                        {rem !== null ? `${cat} (Remaining: ₹${new Intl.NumberFormat('en-IN').format(rem)})` : cat}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {paymentTowardsError && <p className="text-xs text-red-500">{paymentTowardsError}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Payment Method</label>
                                    <Select value={paymentMethod || undefined} onValueChange={updatePaymentMethod}>
                                        <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!paymentMethod ? 'text-gray-400' : ''} ${paymentMethodError ? 'border-red-500' : 'border-gray-300'}`}>
                                            <SelectValue placeholder="Select Payment Method" />
                                        </SelectTrigger>
                                        <SelectContent className="border border-gray-200">
                                            <SelectItem value="DD">DD</SelectItem>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                            <SelectItem value="Bank Deposit">Bank Deposit</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="Online Transfer (IMPS, NFT)">Online Transfer (IMPS, NFT)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {paymentMethodError && <p className="text-xs text-red-500">{paymentMethodError}</p>}
                                </div>
                                {(paymentMethod === 'DD' || paymentMethod === 'Bank Deposit') && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-600">Bank</label>
                                        <Select value={bank || undefined} onValueChange={updateBank}>
                                            <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!bank ? 'text-gray-400' : ''} ${bankError ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Bank" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px] border border-gray-200">
                                                {bankList.map((bankName) => (
                                                    <SelectItem key={bankName} value={bankName}>{bankName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {bankError && <p className="text-xs text-red-500">{bankError}</p>}
                                    </div>
                                )}
                                <CustomDateFilter
                                    label="Date of Payment"
                                    selected={paymentDate}
                                    onChange={updatePaymentDate}
                                    error={paymentDateError}
                                    maxDateToday={true}
                                    minDate={paymentDetails?.application_date ? new Date(paymentDetails.application_date) : null}
                                />
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Transaction Id</label>
                                    <Input
                                        placeholder="Enter transaction id"
                                        value={transactionId}
                                        onChange={updateTransactionId}
                                        className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${transactionIdError ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {transactionIdError && <p className="text-xs text-red-500">{transactionIdError}</p>}
                                </div>
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
                                        labelClassName="!text-sm !font-medium !text-gray-600 !mb-[10px]"
                                        className="!bg-white !text-gray-500 !text-sm !p-[9px] !focus.border-black !focus.ring-0 !focus.ring-offset-0 !focus.outline-none"
                                        multiple={false}
                                        clearable
                                        value={receipt}
                                        error={receiptError}
                                        onChange={updateFeaturedImage}
                                    />
                                )}
                                <div className='col-span-2 flex flex-col gap-1'>
                                    <label className="text-sm font-medium text-gray-600">Comments</label>
                                    <Textarea
                                        placeholder="Enter comments"
                                        value={comment}
                                        onChange={updateComment}
                                        className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${commentError ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {commentError && <p className="text-xs text-red-500">{commentError}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoadingEffect}
                        className="cursor-pointer ml-[10px] text-xs text-white flex justify-center items-center px-4 py-[7px] rounded bg-[#0083bf] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Update Payment
                    </button>
                </div>
                {isLoadingEffect && (
                    <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
                        <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                    </div>
                )}
            </div>
            {errorMessage && (
                <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Editpaymentwrapper;