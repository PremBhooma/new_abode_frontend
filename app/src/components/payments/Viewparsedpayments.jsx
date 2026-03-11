import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Flatapi from '../api/Flatapi';
import Paymentapi from '../api/Paymentapi';
import Deletepaymentrecord from './Deletepaymentrecord.jsx';
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowLeft, IconTrash, IconTrashFilled, IconX } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { Fileinput, Modal, Button } from '@nayeshdaggula/tailify';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomDateFilter from '../shared/CustomDateFilter';
import noImageStaticImage from "@/assets/no_image.png";


function Viewparsedpayments() {
    const navigate = useNavigate();
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);

    const [deleteRowData, setDeleteRowData] = useState(null);
    const [deletePaymentRecord, setDeletePaymentRecord] = useState(false)
    const openDeletePaymentRecord = (rowData) => {
        setDeleteRowData(rowData);
        setDeletePaymentRecord(true)
    }
    const closeDeletePaymentRecord = () => {
        setDeleteRowData(null);
        setDeletePaymentRecord(false)
    }

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const rowRefs = useRef([]);

    const [bulkUpload, setBulkUpload] = useState([{
        amount: '',
        payment_type: '',
        payment_towards: '',
        payment_method: '',
        bank: '',
        payment_date: null,
        transaction_id: '',
        receipt: '',
        comment: '',
        flat_id: '',
        customer_id: '',
        searchType: '',
        searchQuery: '',
        selectedFlat: null,
        results: [],
        loading: false,
        showDropdown: false,
        paymentDetails: null, // New: Detailed payment info
        loadingDetails: false, // New: Loading state for details
        error: {
            flat_id: '',
            customer_id: '',
        }
    }]);

    useEffect(() => {
        rowRefs.current = bulkUpload.map((_, i) => rowRefs.current[i] ?? React.createRef());
    }, [bulkUpload]);

    const getRemainingForCategory = (row, category) => {
        if (!row?.paymentDetails?.paymentSummary) return null;

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

        if (catKey && row.paymentDetails.paymentSummary[catKey]) {
            return row.paymentDetails.paymentSummary[catKey].remaining;
        }
        return null;
    };


    async function getAllParsedPayments() {
        try {
            setIsLoadingEffect(true);

            const response = await Paymentapi.get('get-all-parsed-payments', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (data.status === 'error') {
                setErrorMessage({
                    message: data.message,
                    server_res: data,
                });
                setIsLoadingEffect(false);
                return;
            }

            if (Array.isArray(data?.data) && data.data.length > 0) {
                const formattedBulkUpload = await Promise.all(
                    data.data.map(async (item) => {
                        let selectedFlat = null;
                        let flatId = '';
                        let customerId = '';
                        let searchQuery = '';
                        let paymentDetails = null;

                        if (item.flat && item.block) {
                            const flats = await getFlatsData(item.flat, 'flatNo');
                            const match = flats.find(
                                (f) =>
                                    String(f.flat_no).trim() === String(item.flat).trim() &&
                                    String(f.block_name).trim().toLowerCase() === String(item.block).trim().toLowerCase()
                            );

                            if (match) {
                                selectedFlat = match;
                                flatId = match.id || '';
                                customerId = match.customer?.id || '';
                                searchQuery = match.label;

                                // Fetch details if match found
                                try {
                                    const detailsRes = await Flatapi.get(`/get-flat-payment-details?flat_id=${match.id}`);
                                    if (detailsRes.data?.status === 'success') {
                                        paymentDetails = detailsRes.data.data;
                                    }
                                } catch (err) {
                                    console.error("Error fetching payment details for initial load:", err);
                                }
                            }
                        }

                        return {
                            ...item,
                            payment_date: item?.payment_date ? new Date(item.payment_date) : null,
                            searchType: 'flatNo',
                            searchQuery,
                            selectedFlat,
                            flat_id: flatId,
                            customer_id: customerId,
                            results: [],
                            loading: false,
                            showDropdown: false,
                            paymentDetails,
                            loadingDetails: false,
                            error: {
                                flat_id: '',
                                customer_id: '',
                                payment_date: '',
                            }
                        };
                    })
                );

                setBulkUpload(formattedBulkUpload);
            } else {
                setBulkUpload([{
                    amount: '',
                    payment_type: '',
                    payment_towards: '',
                    payment_method: '',
                    bank: '',
                    payment_date: null,
                    transaction_id: '',
                    receipt: '',
                    comment: '',
                    flat_id: '',
                    customer_id: '',
                    searchType: '',
                    searchQuery: '',
                    results: [],
                    paymentDetails: null,
                    loadingDetails: false,
                    error: {
                        flat_id: '',
                        customer_id: '',
                    }
                }]);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data || null,
            });
        } finally {
            setIsLoadingEffect(false);
        }
    }


    useEffect(() => {
        getAllParsedPayments();
    }, []);

    const refreshAllParsedPayments = () => {
        getAllParsedPayments();
    };

    const updateAmount = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].amount = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.amount = e.target.value ? '' : 'Amount is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentType = (index, value) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].payment_type = value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_type = value ? '' : 'Payment Type is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentTowards = (index, value) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].payment_towards = value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_towards = value ? '' : 'Payment Towards is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentMethod = (index, value) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].payment_method = value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_method = value ? '' : 'Payment Method is required';
            setBulkUpload(newBulk);
        }
    };

    const updateBank = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].bank = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.bank = e.target.value ? '' : 'Bank is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentDate = (index, value) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            const row = newBulk[index];
            newBulk[index].payment_date = value;

            let error = '';
            if (!value) {
                error = 'Payment Date is required';
            } else {
                const date = new Date(value);
                const today = new Date();
                today.setHours(23, 59, 59, 999);

                if (date > today) {
                    error = 'Date cannot be in the future';
                }

                if (row.paymentDetails?.application_date) {
                    const minDate = new Date(row.paymentDetails.application_date);
                    minDate.setHours(0, 0, 0, 0);
                    if (date < minDate) {
                        error = `Date cannot be before booking date (${dayjs(minDate).format('DD MMM YYYY')})`;
                    }
                }
            }

            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_date = error;
            setBulkUpload(newBulk);
        }
    };

    const updateTransactionId = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].transaction_id = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.transaction_id = e.target.value ? '' : 'Transaction is required';
            setBulkUpload(newBulk);
        }
    };

    const updateReceipt = (index, e) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            const file = e.target.files?.[0] || null;
            newBulk[index].receipt = file;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.receipt = file ? '' : 'Receipt is required';
            setBulkUpload(newBulk);
        }
    };

    const updateComment = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].comment = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.comment = e.target.value ? '' : 'Comment is required';
            setBulkUpload(newBulk);
        }
    };

    const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1) || '';

    const handleSearchTypeChange = (index, value) => {
        const updated = [...bulkUpload];
        updated[index].searchType = value;
        updated[index].searchQuery = '';
        updated[index].results = [];
        updated[index].selectedFlat = null;
        updated[index].flat_id = '';
        updated[index].customer_id = '';
        updated[index].showDropdown = false;
        updated[index].paymentDetails = null; // Reset details
        setBulkUpload(updated);
    };

    const searchTimeout = useRef([]);

    // ✅ Update search query for a row
    const updateSearchQueryForRow = (index, query) => {
        const newBulk = [...bulkUpload];
        newBulk[index].searchQuery = query;

        if (!query.trim()) {
            newBulk[index].results = [];
            newBulk[index].showDropdown = false;
            newBulk[index].selectedFlat = null;
            newBulk[index].flat_id = '';
            newBulk[index].customer_id = '';
            newBulk[index].paymentDetails = null;
            setBulkUpload(newBulk);

            if (searchTimeout.current[index]) {
                clearTimeout(searchTimeout.current[index]);
            }
            return;
        }

        newBulk[index].showDropdown = true;
        setBulkUpload(newBulk);

        if (searchTimeout.current[index]) {
            clearTimeout(searchTimeout.current[index]);
        }

        searchTimeout.current[index] = setTimeout(async () => {
            const currentSearchType = newBulk[index].searchType;
            const flats = await getFlatsData(query, currentSearchType);

            const updated = [...bulkUpload];
            updated[index].results = flats;
            updated[index].showDropdown = true;
            setBulkUpload(updated);
        }, 300);
    };


    // ✅ Select a flat for a specific row
    const handleSelectFlatForRow = async (index, flat) => {
        const updated = [...bulkUpload];
        updated[index].flat_id = flat.id || '';
        updated[index].customer_id = flat.customer?.id || '';
        updated[index].selectedFlat = flat;
        updated[index].searchQuery = flat.label;
        updated[index].results = [];
        updated[index].showDropdown = false;
        updated[index].paymentDetails = null; // Clear old details
        updated[index].loadingDetails = true; // Set loading state

        updated[index].error.flat_id = '';
        updated[index].error.customer_id = '';
        setBulkUpload(updated);

        // Fetch detailed payment info
        if (flat?.id) {
            try {
                const res = await Flatapi.get(`/get-flat-payment-details?flat_id=${flat.id}`);
                const finalUpdated = [...updated]; // Use fresh copy or ref if needed in proper context
                // NOTE: In a real closure, 'updated' might be stale if setBulkUpload happened.
                // Ideally we use setBulkUpload with callback, but for array index logic:

                // We need to re-copy bulkUpload from state inside async or just update strictly
                // Since we have 'updated' from before await, let's just modify the same object in the set state callback
                // to be safe, or just call setBulkUpload(prev => ...)

                setBulkUpload(prev => {
                    const newRows = [...prev];
                    if (res.data?.status === 'success') {
                        newRows[index].paymentDetails = res.data.data;
                    }
                    newRows[index].loadingDetails = false;
                    return newRows;
                });

            } catch (err) {
                console.error(err);
                setBulkUpload(prev => {
                    const newRows = [...prev];
                    newRows[index].loadingDetails = false;
                    return newRows;
                });
            }
        } else {
            updated[index].loadingDetails = false;
            setBulkUpload(updated);
        }
    };

    // ✅ Fetch flats from API
    const getFlatsData = async (query, searchType) => {
        try {
            const params = searchType === 'flatNo'
                ? { flat_no: query }
                : { searchQuery: query };

            const response = await Flatapi.get(`search-sold-flats`, {
                params,
                headers: { 'Content-Type': 'application/json' },
            });

            return (response?.data?.data || []).map(flat => ({
                ...flat,
                label: searchType === 'flatNo'
                    ? `${flat.project_name || 'Project'} - ${flat.flat_no} - ${flat.block_name || ''}`
                    : `${flat.customer?.first_name || ''} ${flat.customer?.last_name || ''} - ${flat.flat_no} (${flat.project_name || 'Project'})`,
                value: flat.id,
            }));
        } catch (error) {
            console.error('API error:', error);
            return [];
        }
    };


    const handleSubmit = async (e) => {
        if (e?.preventDefault) e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);
        setIsLoadingEffect(true);

        let hasError = false;
        let firstErrorIndex = null;

        // Validate all rows
        const validatedData = bulkUpload.map((row, index) => {
            const errors = {
                flat_id: !row.flat_id ? 'Flat or Customer is required' : '',
                customer_id: !row.customer_id ? 'Customer or Flat is required' : '',
                amount: !row.amount ? 'Amount is required' : '',
                payment_type: !row.payment_type ? 'Payment Type is required' : '',
                payment_towards: !row.payment_towards ? 'Payment Towards is required' : '',
                payment_method: !row.payment_method ? 'Payment Method is required' : '',
                payment_date: !row.payment_date ? 'Payment Date is required' : '',
                transaction_id: !row.transaction_id ? 'Transaction Id is required' : '',
            };

            const hasRowError =
                errors.flat_id ||
                errors.customer_id ||
                errors.amount ||
                errors.payment_type ||
                errors.payment_towards ||
                errors.payment_method ||
                errors.payment_date ||
                errors.transaction_id;

            if (hasRowError && firstErrorIndex === null) {
                firstErrorIndex = index;
                hasError = true;
            }

            const rem = getRemainingForCategory(row, row.payment_towards);
            const numAmount = Number(String(row.amount || '').replace(/,/g, ''));
            if (!hasRowError && rem !== null && numAmount > rem) {
                errors.amount = `Amount (₹${new Intl.NumberFormat('en-IN').format(numAmount)}) exceeds remaining balance (₹${new Intl.NumberFormat('en-IN').format(rem)}) for ${row.payment_towards}`;
                if (firstErrorIndex === null) {
                    firstErrorIndex = index;
                    hasError = true;
                }
            }

            return {
                ...row,
                error: errors
            };
        });

        setBulkUpload(validatedData);

        // Scroll to first error if exists
        if (hasError && firstErrorIndex !== null) {
            const errorRow = rowRefs.current[firstErrorIndex];
            if (errorRow?.scrollIntoView) {
                errorRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setIsSubmitting(false);
            setIsLoadingEffect(false);
            return;
        }

        try {
            // Build ONE FormData for all rows
            const formData = new FormData();

            validatedData.forEach((row, i) => {
                formData.append(`rows[${i}][amount]`, row?.amount);
                formData.append(`rows[${i}][payment_type]`, row?.payment_type);
                formData.append(`rows[${i}][payment_towards]`, row?.payment_towards);
                formData.append(`rows[${i}][payment_method]`, row?.payment_method);
                formData.append(`rows[${i}][bank]`, row?.bank || '');
                formData.append(`rows[${i}][paymentdate]`, row?.payment_date ? new Date(row?.payment_date).toISOString() : '');
                formData.append(`rows[${i}][transactionid]`, row?.transaction_id);
                formData.append(`rows[${i}][comment]`, row?.comment || '');
                formData.append(`rows[${i}][flat_id]`, row?.flat_id);
                formData.append(`rows[${i}][customer_id]`, row?.customer_id);
                formData.append(`rows[${i}][employee_id]`, employeeInfo?.id);
                // Ensure project_id is passed. Use optional chaining just in case.
                const projectId = row?.selectedFlat?.project_id || row?.paymentDetails?.flat?.project_id;
                if (projectId) {
                    formData.append(`rows[${i}][project_id]`, projectId);
                }

                // If file exists, append it
                if (row?.receipt) {
                    formData.append(`rows[${i}][receipt]`, row.receipt);
                }
            });

            // Send single request
            const res = await Paymentapi.post('/add-bulk-payment', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = res.data;

            if (data.status === "error" && Array.isArray(data.errors)) {
                // Map backend errors to rows
                const updatedRows = validatedData.map((row) => {
                    const backendError = data.errors.find(err => String(err.flat_id) === String(row.flat_id));
                    let txnError = '';
                    let genError = '';
                    if (backendError) {
                        if (backendError.message.toLowerCase().includes('transaction id')) {
                            txnError = backendError.message;
                        } else {
                            genError = backendError.message;
                        }
                    }

                    return {
                        ...row,
                        error: {
                            ...row.error,
                            transaction_id: txnError || row.error.transaction_id,
                            backend: genError
                        }
                    };
                });

                setBulkUpload(updatedRows);

                // Scroll to the first backend error row
                const firstBackendError = data.errors[0];
                if (firstBackendError) {
                    const firstErrorIndex = updatedRows.findIndex(r => String(r.flat_id) === String(firstBackendError.flat_id));
                    if (firstErrorIndex !== -1) {
                        const errorRow = rowRefs.current[firstErrorIndex];
                        if (errorRow?.scrollIntoView) {
                            errorRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                }

                setIsSubmitting(false);
                setIsLoadingEffect(false);
                return;
            }


            // Reset form
            setBulkUpload([{
                amount: '',
                payment_type: '',
                payment_towards: '',
                payment_method: '',
                bank: '',
                payment_date: null,
                transaction_id: '',
                receipt: '',
                comment: '',
                flat_id: '',
                customer_id: '',
                searchType: '',
                searchQuery: '',
                selectedFlat: null,
                results: [],
                loading: false,
                showDropdown: false,
                error: {
                    flat_id: '',
                    customer_id: '',
                    backend: '',
                }
            }]);

            // toast.success("Payment(s) added successfully");
            navigate('/payments');

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data || null,
            });
        } finally {
            setIsLoadingEffect(false);
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 text-[24px] font-semibold">Bulk Payments</h1>
                    <Link to={'/payments'} className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200">
                        <IconArrowLeft className='mt-0.5' size={18} color="#0083bf" />Back
                    </Link>
                </div>
                <hr className='border border-[#ebecef]' />
                {bulkUpload?.map((row, index) => (
                    <div key={index} ref={el => rowRefs.current[index] = el} className="relative flex flex-col gap-2 border border-[#ebecef] rounded-xl bg-white px-8 py-6">
                        {row?.error.backend && (
                            <div className="w-full text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                                {row.error.backend}
                            </div>
                        )}
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                    <div className='flex flex-col gap-1'>
                                        <label className="text-sm font-medium text-gray-600">Amount</label>
                                        <Input
                                            placeholder="Enter Amount"
                                            value={row.amount || ''}
                                            onChange={(e) => updateAmount(index, e)}
                                            className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${row?.error.amount ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {row?.error.amount && <p className="text-xs text-red-600 font-medium">{row?.error.amount}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-600">Payment Type</label>
                                        <Select value={row.payment_type || undefined} onValueChange={(val) => updatePaymentType(index, val)}>
                                            <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!row.payment_type ? 'text-gray-400' : ''} ${row?.error.payment_type ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Payment Type" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-gray-200">
                                                <SelectItem value="Customer Pay">Customer Pay</SelectItem>
                                                {row.paymentDetails?.loan_status === "Approved" && <SelectItem value="Loan Pay">Loan Pay</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                        {row?.error.payment_type && <p className="text-xs text-red-600 font-medium">{row?.error.payment_type}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-600">Payment Towards</label>
                                        <Select value={row.payment_towards || undefined} onValueChange={(val) => updatePaymentTowards(index, val)}>
                                            <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!row.payment_towards ? 'text-gray-400' : ''} ${row?.error.payment_towards ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Payment Towards" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-gray-200">
                                                {["Flat", "GST", "Corpus Fund", "Maintenance Charges", "Manjeera Connection Charge", "Manjeera Meter Connection", "Documentation Fee", "Registration"].map(cat => {
                                                    const rem = getRemainingForCategory(row, cat);
                                                    return (
                                                        <SelectItem key={cat} value={cat}>
                                                            {rem !== null ? `${cat} (Remaining: ₹${new Intl.NumberFormat('en-IN').format(rem)})` : cat}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {row?.error.payment_towards && <p className="text-xs text-red-600 font-medium">{row?.error.payment_towards}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-600">Payment Method</label>
                                        <Select value={row.payment_method || undefined} onValueChange={(val) => updatePaymentMethod(index, val)}>
                                            <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!row.payment_method ? 'text-gray-400' : ''} ${row?.error.payment_method ? 'border-red-500' : 'border-gray-300'}`}>
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
                                        {row?.error.payment_method && <p className="text-xs text-red-600 font-medium">{row?.error.payment_method}</p>}
                                    </div>
                                    {(row?.payment_method === 'DD' || row?.payment_method === 'Bank Deposit' || row?.payment_method === 'Cheque') && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-gray-600">Bank</label>
                                            <Input
                                                placeholder="Enter bank name"
                                                value={row.bank || ''}
                                                onChange={(e) => updateBank(index, e)}
                                                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${row?.error.bank ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                    )}
                                    <div className='flex flex-col gap-1'>
                                        <CustomDateFilter
                                            label="Date of Payment"
                                            selected={row?.payment_date}
                                            onChange={(date) => updatePaymentDate(index, date)}
                                            error={row?.error.payment_date}
                                            maxDateToday={true}
                                            minDate={row.paymentDetails?.application_date ? new Date(row.paymentDetails.application_date) : null}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-600">Transaction Id</label>
                                        <Input
                                            placeholder="Enter transaction id"
                                            value={row.transaction_id || ''}
                                            onChange={(e) => updateTransactionId(index, e)}
                                            className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${row?.error.transaction_id ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {row?.error.transaction_id && <p className="text-xs text-red-600 font-medium">{row?.error.transaction_id}</p>}
                                    </div>
                                    <Fileinput
                                        label="Receipt(optional)"
                                        accept="image/*,application/pdf"
                                        labelClassName="!text-sm !font-medium !text-gray-600 !mb-[10px]"
                                        className="!bg-white !text-gray-500 !text-sm !p-[9px] !focus.border-black !focus.ring-0 !focus.ring-offset-0 !focus.outline-none"
                                        multiple={false}
                                        clearable
                                        value={row?.receipt || null}
                                        onChange={(e) => updateReceipt(index, e)}
                                    />
                                </div>
                                <div className='col-span-2 flex flex-col gap-1'>
                                    <label className="text-sm font-medium text-gray-600">Comments</label>
                                    <Textarea
                                        placeholder="Enter comments"
                                        value={row.comment || ''}
                                        onChange={(e) => updateComment(index, e)}
                                        className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${row?.error.comment ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {row?.error.comment && <p className="text-xs text-red-600 font-medium">{row?.error.comment}</p>}
                                </div>
                            </div>


                            {/* Search and Selection Section */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex flex-col gap-2 relative w-full">

                                    <div className='flex items-center justify-between'>
                                        <h1 className='text-sm font-bold text-gray-700 '>Search by Flat No or Customer</h1>
                                        <div onClick={() => openDeletePaymentRecord(row)}><IconTrash className='text-red-500 hover:text-red-600 cursor-pointer' size={18} /></div>
                                    </div>


                                    <div className="flex gap-6 mb-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="flatNo"
                                                checked={row.searchType === 'flatNo'}
                                                onChange={() => handleSearchTypeChange(index, 'flatNo')}
                                                className="form-radio text-[#0083bf] focus:ring-[#0083bf] !border !border-[#ced4da]"
                                            />
                                            <span className="text-sm font-medium text-gray-600">Search by Flat No</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="customer"
                                                checked={row.searchType === 'customer'}
                                                onChange={() => handleSearchTypeChange(index, 'customer')}
                                                className="form-radio text-[#0083bf] focus:ring-[#0083bf] !border !border-[#ced4da]"
                                            />
                                            <span className="text-sm font-medium text-gray-600">Search by Customer</span>
                                        </label>
                                    </div>

                                    <div className="flex flex-col gap-2 relative w-full">
                                        <div className="text-sm font-medium text-gray-600">
                                            {row.searchType === 'flatNo' ? 'Search for Flat' : 'Search for Customer'}
                                        </div>

                                        <input
                                            type='text'
                                            value={row.searchQuery}
                                            onChange={(e) => updateSearchQueryForRow(index, e.target.value)}
                                            placeholder={row.searchType === 'flatNo' ? 'Search for Flat' : 'Search for Customer'}
                                            className="w-full px-3 py-2 text-sm rounded-md focus:outline-none !border !border-[#ced4da]"
                                        />

                                        {row.showDropdown && (
                                            <div className="absolute top-full left-0 w-full z-10 mt-1">
                                                <div className="bg-white border border-[#ced4da] rounded-md max-h-48 overflow-y-auto">
                                                    {row?.loading ? (
                                                        <div className="p-3 text-sm text-gray-500">Loading...</div>
                                                    ) : row?.results?.length > 0 ? (
                                                        <ul>
                                                            {row?.results.map((item) => (
                                                                <li
                                                                    key={item.value}
                                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] text-black/60"
                                                                    onClick={() => handleSelectFlatForRow(index, item)}
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

                                        {(row?.error.flat_id || row?.error.customer_id) && (
                                            <p className="text-xs text-red-600 font-medium">
                                                {row?.error.flat_id || row?.error.customer_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Selected Flat Info */}
                                {(row?.selectedFlat || row?.paymentDetails) && (
                                    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-500">
                                        {row.loadingDetails ? (
                                            <div className="bg-white border rounded-xl p-8 flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        ) : row.paymentDetails ? (
                                            <>
                                                {/* Financial Summary Cards */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
                                                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Grand Total</div>
                                                        <div className="text-xl font-bold text-blue-900 mt-1">
                                                            ₹{row.paymentDetails.financials?.grand_total?.toLocaleString() || 0}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
                                                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Paid</div>
                                                        <div className="text-xl font-bold text-emerald-900 mt-1">
                                                            ₹{row.paymentDetails.financials?.total_paid?.toLocaleString() || 0}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                                                        <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Balance Due</div>
                                                        <div className="text-xl font-bold text-orange-900 mt-1">
                                                            ₹{row.paymentDetails.financials?.balance?.toLocaleString() || 0}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Customer Profile Card */}
                                                {row.paymentDetails.customer_details && (
                                                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                            <h3 className="font-semibold text-gray-800">Customer Profile</h3>
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                                                Flat {row.paymentDetails.flat_no}
                                                            </span>
                                                        </div>
                                                        <div className="p-4 flex items-center gap-5">
                                                            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
                                                                {row.paymentDetails.customer_details.profile_pic_url ? (
                                                                    <img src={`${process.env.API_URL}${row.paymentDetails.customer_details.profile_pic_url}`} alt="Profile" className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <img src={noImageStaticImage} alt="Profile" className="h-full w-full object-cover" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-lg font-bold text-gray-900">
                                                                    {row.paymentDetails.customer_details.first_name} {row.paymentDetails.customer_details.last_name}
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 mt-1">
                                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                        {row.paymentDetails.customer_details.email}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                                        {row.paymentDetails.customer_details.phone_code} {row.paymentDetails.customer_details.phone_number}
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
                                                        {row.paymentDetails.payment_history?.length > 0 ? (
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
                                                                    {row.paymentDetails.payment_history.map((pay) => (
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
                                                                                ₹{pay.amount?.toLocaleString()}
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
                                        ) : row.selectedFlat && (
                                            <div className="bg-white border border-[#ced4da] rounded-md p-4">
                                                <div className="text-lg font-semibold text-gray-800 mb-2">
                                                    Flat No: {row.selectedFlat?.flat_no}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Loading additional details...
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {row?.error.backend && <p className="text-xs text-red-600 font-medium">{row?.error.backend}</p>}
                    </div>
                ))}
                <div className="sticky bottom-0 border border-[#ced4da] bg-white rounded-xl p-4 z-50 shadow-md flex justify-between items-center">
                    <div className='font-semibold text-sm text-gray-900'>
                        <span className='text-red-500'>Note: </span>Please complete all necessary fields before submitting.
                    </div>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoadingEffect}
                        className="!bg-[#0083bf] hover:!bg-[#0083bf]/90 !text-white !py-2 !px-3 !rounded-sm cursor-pointer"
                        loading={isSubmitting || isLoadingEffect}
                    >
                        Submit
                    </Button>
                </div>
            </div >

            <Modal
                open={deletePaymentRecord}
                close={closeDeletePaymentRecord}
                // padding="px-5"
                withCloseButton={false}
                containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
            >
                {deletePaymentRecord && (
                    <Deletepaymentrecord
                        deleteRowData={deleteRowData}
                        closeDeletePaymentRecord={closeDeletePaymentRecord}
                        refreshAllParsedPayments={refreshAllParsedPayments}
                        setErrorMessage={setErrorMessage}
                    />
                )}
            </Modal>
            <ToastContainer position="top-right" autoClose={1000} />
        </>

    );
}

export default Viewparsedpayments;

