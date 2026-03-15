import React, { useCallback, useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import Flatapi from "../../../api/Flatapi";
import Addflatpayment from "./Addflatpayment";
import Editflatpayment from "./Editflatpayment";
import Paymentapi from "../../../api/Paymentapi";
import Datefilter from "../../../shared/Datefilter";
import Viewsinglepayment from "./Viewsinglepayment";
import Errorpanel from "../../../shared/Errorpanel";
import DeleteModal from "../../../shared/DeleteModal";
import TableLoadingEffect from "../../../shared/Tableloadingeffect";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router";
import { Pagination, Select } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../../zustand/useEmployeeDetails";
import { IconDownload, IconEdit, IconEye, IconSearch, IconTrash, IconSettings } from "@tabler/icons-react";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { PrinterIcon } from "lucide-react";


function Allpaymentslist({ flat_id, customerId, project_id }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [totalPages, setTotalPages] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);
    const [page, setPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [limit, setLimit] = useState("10");

    const permissions = useEmployeeDetails((state) => state.permissions);
    const [paymentsData, setPaymentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });

    console.log("flat_id:", flat_id);

    async function GetAllPayments(flat_id, newPage, newLimit, newSearchQuery) {
        const params = {
            flat_id: flat_id,
            page: newPage,
            limit: newLimit,
            searchQuery: newSearchQuery,
        }

        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;

        await Flatapi.get("get-payments-of-flats", {
            params,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                let data = response.data;
                if (data.status === "error") {
                    let finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoading(false);
                    return false;
                }
                setPaymentsData(data?.data || []);
                setTotalPayments(data?.totalPayments);
                setTotalPages(data?.totalPages);
                setIsLoading(false);
                return false;
            })
            .catch((error) => {
                console.log(error);
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
                setIsLoading(false);
                return false;
            });
    }

    const handlePageChange = useCallback((value) => {
        setPage(value);
        setIsLoading(true);
    }, [flat_id, limit, searchQuery]);

    const updateSearchQuery = useCallback(
        (e) => {
            setSearchQuery(e.target.value);
            setPage(1);
        },
        [flat_id, limit]
    );

    const updateLimit = useCallback(
        (data) => {
            setLimit(data);
            setPage(1);
        },
        [flat_id, searchQuery]
    );

    const handleDateFilterChange = (newDateRange) => {
        setDateRange(newDateRange);
        setPage(1);
        setIsLoading(true);
    };

    const handleDownload = async (searchQuery) => {
        setIsLoading(true);
        try {
            const params = {
                searchQuery: searchQuery,
                flat_id: flat_id,
            };

            if (dateRange.startDate) params.startDate = dateRange.startDate;
            if (dateRange.endDate) params.endDate = dateRange.endDate;

            const response = await Flatapi.get("get-flat-payments-for-excel", {
                params,
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: 'blob'
            })

            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Dashboard Stats.xlsx'); // Filename for download
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success({ title: 'Export Successful', message: 'Dashboard stats downloaded successfully.', color: 'green' });
            } else {
                toast.error({ title: 'Export Failed', message: 'No data received for export.', color: 'red' });
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error Downloading Flat payments Data");
            const finalResonse = error.response?.data?.message || "An error occurred during download";
            setErrorMessage(finalResonse);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        if (flat_id) GetAllPayments(flat_id, page, limit, searchQuery);
    }, [flat_id, page, limit, searchQuery, dateRange]);

    const refreshAllPayments = () => {
        if (flat_id) GetAllPayments(flat_id, page, limit, searchQuery)
    }

    const [addFlatPayment, setAddFlatPayment] = useState(false);
    const openAddFlatPayment = () => {
        setAddFlatPayment(true);
    };
    const closeAddFlatPayment = () => {
        setAddFlatPayment(false);
    };

    const [flatPaymentUUID, setFlatPaymentUUID] = useState('');
    const [editFlatPayment, setEditFlatPayment] = useState(false);
    const openEditFlatPayment = (id) => {
        setEditFlatPayment(true);
        setFlatPaymentUUID(id);
    };
    const closeEditFlatPayment = () => {
        setEditFlatPayment(false);
        setFlatPaymentUUID('');
    };

    const [viewFlatPayment, setViewFlatPayment] = useState(false);
    const openViewFlatPayment = (id) => {
        setViewFlatPayment(true);
        setFlatPaymentUUID(id);
    };
    const closeViewFlatPayment = () => {
        setViewFlatPayment(false);
        setFlatPaymentUUID('');
    };

    const [singlePaymentId, setSinglePaymentId] = useState(null);
    const [deletePayment, setDeletePayment] = useState(false)
    const openDeletePayment = (paymentId) => {
        setDeletePayment(true)
        setSinglePaymentId(paymentId)
    }
    const closeDeletePayment = () => {
        setDeletePayment(false)
        setSinglePaymentId(null)
    }

    async function handleDeletePayment() {
        await Paymentapi.post('/deletepayment', {
            payment_id: singlePaymentId,
            employee_id: employeeId
        },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    setIsLoading(false)
                    setErrorMessage({
                        message: data.message,
                        server_res: data
                    })
                }
                setIsLoading(false)
                toast.success("Payment deleted successfully")
                refreshAllPayments();
                closeDeletePayment();
            })
            .catch((error) => {
                console.log('Error:', error);
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
                setIsLoading(false);
                return false;
            })
    }

    const containerRef = useRef(null);
    const [visibleColumns, setVisibleColumns] = useState({
        reference: true,
        transactionId: true,
        flat: true,
        block: true,
        customer: true,
        amount: true,
        date: true,
        paymentType: true,
        paymentTowards: true,
        paymentMethod: true,
        bank: true,
    });
    const [showColumnToggle, setShowColumnToggle] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowColumnToggle(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handlePrint = async (flat_id, newSearchQuery) => {
        const params = {
            searchQuery: newSearchQuery,
            flat_id: flat_id,
        }

        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;

        Flatapi.get("/get-print-payments-of-flats", {
            params,
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${access_token}`,
            },
        }).then((response) => {
            let data = response.data;
            if (data.status === "error") {
                let finalresponse = {
                    message: data.message,
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false;
            }
            const enabledCount = Object.values(visibleColumns).filter(Boolean).length;
            const isLandscape = enabledCount > 5;
            const paymentsData = data?.data || [];
            const printContent = `
                <html>
                    <head>
                        <title>Payments Report</title>
                        <style>
                            @page {
                                size: ${isLandscape ? "landscape" : "portrait"};
                            }
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                            }
                            h2 {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                font-size: 12px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background: #f4f4f4;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Payments Report</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    ${visibleColumns.transactionId ? (`<th>Transaction Id</th>`) : ''}
                                    ${visibleColumns.flat ? (`<th>Flat</th>`) : ''}
                                    ${visibleColumns.block ? (`<th>Block</th>`) : ''}
                                    ${visibleColumns.customer ? (`<th>Customer</th>`) : ''}
                                    ${visibleColumns.amount ? (`<th>Amount</th>`) : ''}
                                    ${visibleColumns.date ? (`<th>Date of Payment</th>`) : ''}
                                    ${visibleColumns.paymentType ? (`<th>Payment Type</th>`) : ''}
                                    ${visibleColumns.paymentTowards ? (`<th>Payment Towards</th>`) : ''}
                                    ${visibleColumns.paymentMethod ? (`<th>Payment Method</th>`) : ''}
                                    ${visibleColumns.bank ? (`<th>Bank</th>`) : ''}
                                </tr>
                            </thead>
                            <tbody>
                                ${paymentsData.map((payment, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    ${visibleColumns.transactionId ? `
                                        <td>${payment?.transaction_id || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.flat ? `
                                        <td>${payment?.flat_number || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.block ? `
                                        <td style="text-overflow: ellipsis; white-space: nowrap;">${payment?.block_name || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.customer ? `
                                        <td>${(payment?.customer_prefixes || "") + " " + (payment?.customer_first_name || "") + " " + (payment?.customer_last_name || "")}</td>
                                    ` : ''}
                                    ${visibleColumns.amount ? `
                                        <td>${payment?.amount || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.date ? `
                                        <td>${payment?.payment_date ? dayjs(payment?.payment_date).format("DD/MM/YYYY") : "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.paymentType ? `
                                        <td>${payment?.payment_type || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.paymentTowards ? `
                                        <td>${payment?.payment_towards || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.paymentMethod ? `
                                        <td>${payment?.payment_method || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.bank ? `
                                        <td>${payment?.bank || "----"}</td>
                                    ` : ''}
                                </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            const printWindow = window.open("", "", isLandscape ? "width=1200,height=800" : "width=800,height=1200");
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
            setIsLoading(false);
            return false;
        }).catch((error) => {
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
            setIsLoading(false);
            return false;
        });
    };

    const handleSinglePrint = (payment) => {
        const printWindow = window.open("", "", "width=800,height=1000");
        printWindow.document.write(`
            <html>
            <head>
                <title>Payment Receipt</title>
                <style>
                @page { size: portrait; }
                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    line-height: 1.6;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .field {
                    margin: 8px 0;
                    display: flex;
                    justify-content: space-between;
                }
                .label {
                    font-weight: bold;
                    color: #444;
                    width: 200px;
                }
                .value {
                    flex: 1;
                    text-align: left;
                }
                .container {
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 20px;
                }
                </style>
            </head>
            <body>
                <h2>Payment Receipt</h2>
                <div class="container">
                    <div class="field"><div class="label">Transaction Id:</div><div class="value">${payment.transaction_id || "---"}</div></div>
                    <div class="field"><div class="label">Amount:</div><div class="value">₹ ${(parseFloat(payment.amount) || 0).toFixed(2)}</div></div>
                    <div class="field"><div class="label">Date of Payment:</div><div class="value">${payment.paymet_date ? dayjs(payment.paymet_date).format("DD/MM/YYYY") : "---"}</div></div>
                    <div class="field"><div class="label">Payment Type:</div><div class="value">${payment.payment_type || "---"}</div></div>
                    <div class="field"><div class="label">Payment Towards:</div><div class="value">${payment.payment_towards || "---"}</div></div>
                    <div class="field"><div class="label">Payment Method:</div><div class="value">${payment.payment_method || "---"}</div></div>
                    <div class="field"><div class="label">Bank:</div><div class="value">${payment.bank || "---"}</div></div>
                </div>
                <h2>Customer Details</h2>
                <div class="container">
                    <div class="field"><div class="label">Name:</div><div class="value">${payment.customer_first_name || "---"} ${payment.customer_last_name || ""}</div></div>
                    <div class="field"><div class="label">Email:</div><div class="value">${payment.customer_email || "---"}</div></div>
                    <div class="field"><div class="label">Phone:</div><div class="value">${payment.customer_mobile_number || "---"}</div></div>
                </div>
                <h2>Flat Details</h2>
                <div class="container">
                    <div class="field"><div class="label">Flat:</div><div class="value">${payment.flat_number || "---"}</div></div>
                    <div class="field"><div class="label">Block:</div><div class="value">${payment.block_name || "---"}</div></div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    console.log("paymentsData:", paymentsData)

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-[18px] text-black font-semibold">All Payments</p>
                    <div className="flex flex-row items-center justify-end gap-2">
                        {permissions?.payments_page?.includes("print_all_payments") && (
                            <button
                                disabled={paymentsData.length > 0 ? false : true}
                                onClick={() => handlePrint(flat_id, searchQuery)}
                                className={`cursor-pointer flex items-center gap-x-1 text-[14px] text-white px-4 py-[7px] rounded bg-[#e0589c] ${paymentsData.length > 0 ? 'hover:bg-pink-600' : 'bg-gray-400 !cursor-not-allowed'}`}
                            >
                                <PrinterIcon size={14} /> Print
                            </button>
                        )}
                        {permissions?.payments_page?.includes("export_payment_to_excel") && (
                            <button
                                onClick={() => handleDownload(searchQuery)}
                                className="cursor-pointer text-[12px] text-white px-4 py-[7px] rounded bg-[#00bc7d] flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            // disabled={isLoading}
                            >
                                <IconDownload size={16} />
                                Export to Excel
                            </button>
                        )}
                        {permissions?.payments_page?.includes("add_payment") && (
                            <button onClick={openAddFlatPayment} className="cursor-pointer text-xs text-white px-4 py-2 rounded bg-[#0083bf]">
                                + Add Payment
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="rounded-sm relative !h-9">
                        <input
                            type="text"
                            placeholder="Search payments..."
                            className="focus:outline-none text-sm pl-6 py-2"
                            onChange={updateSearchQuery}
                            value={searchQuery}
                        />
                        <div className="absolute left-0 top-3 px-1">
                            <IconSearch size={16} color="#ced4da" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                        <Select
                            data={[
                                { value: "10", label: "10" },
                                { value: "20", label: "20" },
                                { value: "30", label: "30" },
                                { value: "40", label: "40" },
                                { value: "50", label: "50" },
                            ]}
                            placeholder="10"
                            value={limit}
                            onChange={updateLimit}
                            selectWrapperClass="focus:ring-0 !focus:border-[#ced4da] focus:outline-none !py-[7px] !h-9 !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
                            className="!m-0 !p-0 !border-0"
                            dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#044093] focus:outline-none"
                        />
                        <Datefilter
                            onFilterChange={handleDateFilterChange}
                            onClearFilter={handleDateFilterChange}
                        />
                        <div ref={containerRef} className="relative">
                            <button
                                onClick={() => setShowColumnToggle(!showColumnToggle)}
                                className="cursor-pointer whitespace-nowrap flex items-center gap-1 px-2 py-2 h-9 text-sm border border-[#ebecef] rounded-sm bg-white hover:bg-gray-50"
                            >
                                <IconSettings size={16} className="mr-1" /> Columns
                            </button>

                            {showColumnToggle && (
                                <div className="absolute h-[calc(100vh-450px)] overflow-y-auto right-0 mt-2 w-48 bg-white border border-[#ebecef] rounded-md shadow z-50">
                                    <div className="p-2">
                                        {Object.keys(visibleColumns).map((colKey) => (
                                            <label key={colKey} className="flex items-center gap-2 py-1 text-sm cursor-pointer capitalize">
                                                <input
                                                    type="checkbox"
                                                    checked={visibleColumns[colKey]}
                                                    onChange={() =>
                                                        setVisibleColumns((prev) => ({
                                                            ...prev,
                                                            [colKey]: !prev[colKey],
                                                        }))
                                                    }
                                                />
                                                {colKey}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-x-auto rounded-md border border-[#ebecef] bg-white">
                <table className="w-full table-fixed text-left border-collapse">
                    <thead className="border-b-[0.6px] border-b-[#ebecef] bg-white">
                        <tr className="w-full">
                            {/* {visibleColumns.reference && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[140px] sticky left-0 z-20 bg-white border-r border-[#ebecef]">
                                    Ref ID
                                </th>
                            )} */}
                            {visibleColumns.transactionId && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[160px]">
                                    Transaction Id
                                </th>
                            )}
                            {visibleColumns.flat && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[120px]">
                                    Flat
                                </th>
                            )}
                            {visibleColumns.block && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[120px]">
                                    Block
                                </th>
                            )}
                            {visibleColumns.customer && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[160px]">
                                    Customer
                                </th>
                            )}
                            {visibleColumns.amount && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[140px]">
                                    Amount
                                </th>
                            )}
                            {visibleColumns.date && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[160px]">
                                    Date of Payment
                                </th>
                            )}
                            {visibleColumns.paymentType && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[160px]">
                                    Payment Type
                                </th>
                            )}
                            {visibleColumns.paymentTowards && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[160px]">
                                    Payment Towards
                                </th>
                            )}
                            {visibleColumns.paymentMethod && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[160px]">
                                    Payment Method
                                </th>
                            )}
                            {visibleColumns.bank && (
                                <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[160px]">
                                    Bank
                                </th>
                            )}
                            {permissions?.payments_page?.some(p =>
                                ["view_payment", "edit_payment", "delete_payment"].includes(p)
                            ) && (
                                    <th scope="col" className="px-4 py-2 text-[#2B2B2B] text-[11px] font-[500] leading-[18px] w-[120px] sticky right-0 z-20 bg-white border-l border-[#ebecef]">
                                        Actions
                                    </th>
                                )}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading === false ? (
                            paymentsData.length > 0 ? (
                                paymentsData.map((payment, index) => (
                                    <tr key={index} className="border-b-[0.6px] border-b-[#ebecef] align-top bg-white">
                                        {/* {visibleColumns.reference && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[140px] sticky left-0 z-10 bg-white border-r border-[#ebecef]">
                                                <NavLink to={`/singlepaymentview/${payment.id}`}>
                                                    <p className="text-[#4b5563] text-[11px] font-normal leading-[18px]">{payment?.id}</p>
                                                </NavLink>
                                            </td>
                                        )} */}
                                        {visibleColumns.transactionId && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[160px]">
                                                {permissions?.payments_page?.includes("view_payment") ? (
                                                    // <NavLink to={`/singlepaymentview/${payment?.id}`}>
                                                    <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                        {payment?.transaction_id}
                                                    </p>
                                                    // </NavLink>
                                                ) : (
                                                    <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                        {payment?.transaction_id}
                                                    </p>
                                                )}
                                            </td>
                                        )}
                                        {visibleColumns.flat && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[120px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    {payment?.flat_number || "----"}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.block && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[120px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    {payment?.block_name || "----"}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.customer && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[160px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px] capitalize">
                                                    {/* <NavLink to={`/customers/${payment?.customerId}`}> */}
                                                    {payment.customer_prefixes || ""} {payment.customer_first_name || "----"} {payment.customer_last_name}
                                                    {/* </NavLink> */}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.amount && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[140px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    ₹ {parseFloat(payment?.amount || 0).toFixed(2)}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.date && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[160px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    {payment?.paymet_date ? dayjs(payment?.paymet_date).format("DD/MM/YYYY") : '---'}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.paymentType && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[160px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    {payment?.payment_type || "---"}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.paymentTowards && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[160px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    {payment?.payment_towards || "---"}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.paymentMethod && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[160px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    {payment?.payment_method}
                                                </p>
                                            </td>
                                        )}
                                        {visibleColumns.bank && (
                                            <td className="px-4 py-2 whitespace-normal break-words w-[160px]">
                                                <p className="text-[#4b5563] text-[11px] not-italic font-normal leading-[18px]">
                                                    {payment?.bank || "----"}
                                                </p>
                                            </td>
                                        )}
                                        <td className="px-4 py-2 text-center whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white border-l border-[#ebecef]">
                                            <div className="flex flex-row items-center gap-1">
                                                {permissions?.payments_page?.includes("view_payment") && (
                                                    <Link
                                                        to={`/singlepaymentview/${payment.id}`}
                                                        className="cursor-pointer"
                                                    >
                                                        <IconEye size={20} color="#4b5563" />
                                                    </Link>
                                                )}

                                                {permissions?.payments_page?.includes("edit_payment") && (
                                                    <Link
                                                        to={`/payments/edit/${payment.id}`}
                                                        className="cursor-pointer"
                                                    >
                                                        <IconEdit size={20} color="#4b5563" />
                                                    </Link>
                                                )}

                                                {permissions?.payments_page?.includes("delete_payment") && (
                                                    <div
                                                        onClick={() => openDeletePayment(payment.payment_id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <IconTrash color="red" size={20} strokeWidth={1.5} />
                                                    </div>
                                                )}
                                                {permissions?.payments_page?.includes("print_single_payment") && (
                                                    <PrinterIcon size={20} strokeWidth={2.5} color="#e0589c" className="cursor-pointer" onClick={() => handleSinglePrint(payment)} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">
                                        <p className="text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]">
                                            No data found
                                        </p>
                                    </td>
                                </tr>
                            )
                        ) : (
                            <TableLoadingEffect colspan={8} tr={5} />
                        )}
                    </tbody>
                </table>
                {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
            </div>
            {paymentsData?.length > 0 && (
                <div className="flex flex-row-reverse p-4">
                    <Pagination
                        totalpages={totalPages}
                        value={page}
                        siblings={1}
                        onChange={handlePageChange}
                        color="#0083bf"
                    />
                </div>
            )}

            <DeleteModal
                title="Delete Payment"
                message="Are you sure you want to delete this payment?"
                open={deletePayment}
                onClose={closeDeletePayment}
                onConfirm={handleDeletePayment}
            />

            <Drawer
                open={viewFlatPayment}
                onClose={closeEditFlatPayment}
                direction='right'
                className='h-screen overflow-y-auto text-left'
                size='50vw'
                zIndex={100}
                lockBackgroundScroll={true}
            >
                {viewFlatPayment && (
                    <Viewsinglepayment
                        flatPaymentUUID={flatPaymentUUID}
                        closeViewFlatPayment={closeViewFlatPayment}
                    />
                )}
            </Drawer>

            <Drawer
                open={addFlatPayment}
                onClose={closeAddFlatPayment}
                direction='right'
                className='h-screen overflow-y-auto text-left'
                size='60vw'
                zIndex={100}
                lockBackgroundScroll={true}
            >
                {addFlatPayment && (
                    <Addflatpayment
                        flat_id={flat_id}
                        closeAddFlatPayment={closeAddFlatPayment}
                        refreshAllPayments={refreshAllPayments}
                        customerId={customerId}
                        project_id={project_id}
                    />
                )}
            </Drawer>

            <Drawer
                open={editFlatPayment}
                onClose={closeEditFlatPayment}
                direction='right'
                className='h-screen overflow-y-auto text-left'
                size='60vw'
                zIndex={100}
                lockBackgroundScroll={true}
            >
                {editFlatPayment && (
                    <Editflatpayment
                        flat_id={flat_id}
                        flatPaymentUUID={flatPaymentUUID}
                        closeEditFlatPayment={closeEditFlatPayment}
                        refreshAllPayments={refreshAllPayments}
                    />
                )}
            </Drawer>
        </>
    );
}

export default Allpaymentslist;
