import React, { useCallback, useEffect, useState, useRef } from "react";
import { Funnel, PrinterIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import { Button, Pagination, Select } from "@nayeshdaggula/tailify";
import { IconCirclePlus, IconDownload, IconEdit, IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Flatapi from "../../api/Flatapi";
import Paymentapi from "../../api/Paymentapi";
import Datefilter from "../../shared/Datefilter";
import Errorpanel from "../../shared/Errorpanel";
import DeleteModal from "../../shared/DeleteModal";
import Editpaymentincustomer from "./Editpaymentincustomer";
import TableLoadingEffect from "../../shared/Tableloadingeffect";
import Viewsinglepaymentincustomer from "./Viewsinglepaymentincustomer";
import Addpaymentincustomer from "../paymentswrapper/Addpaymentincustomer";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { Link, NavLink } from "react-router";

function Paymentswrapper({ customerUuid }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const access_token = useEmployeeDetails((state) => state.access_token)
    const [totalPages, setTotalPages] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);
    const [page, setPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [limit, setLimit] = useState("10");

    const permissions = useEmployeeDetails((state) => state.permissions);
    const [singlePaymentId, setSinglePaymentId] = useState(null);
    const [paymentsData, setPaymentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });

    const [selectedFlat, setSelectedFlat] = useState(null)
    const updateSelectedFlats = (value) => {
        setSelectedFlat(value)
    }

    async function GetAllPayments(newPage, newLimit, newSearchQuery, flat) {
        const params = {
            page: newPage,
            limit: newLimit,
            searchQuery: newSearchQuery,
            customerUuid: customerUuid,
            flat_id: flat
        }

        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;

        await Paymentapi.get("/get-all-payments-by-customer", {
            params,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
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
                setPaymentsData(data?.allpayments || []);
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
                };
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false;
            });
    }

    const handlePageChange = useCallback((value) => {
        setPage(value);
        GetAllPayments(value, limit, searchQuery, selectedFlat);
        setIsLoading(true);
    }, [limit, searchQuery, selectedFlat]);

    const updateSearchQuery = useCallback((e) => {
        setSearchQuery(e.target.value);
        setPage(1)
        GetAllPayments(1, limit, e.target.value, selectedFlat);
    }, [page, limit, selectedFlat]);

    const updateLimit = useCallback(
        (data) => {
            let newpage = 1;
            setLimit(data);
            setPage(newpage);
            GetAllPayments(newpage, data, searchQuery, selectedFlat);
        },
        [page, searchQuery, selectedFlat]
    );

    useEffect(() => {
        setIsLoading(true);
        GetAllPayments(page, limit, searchQuery, selectedFlat);
    }, [dateRange, selectedFlat]);

    const refreshAllPayments = () => {
        GetAllPayments(page, limit, searchQuery, selectedFlat)
    }

    const [deletePayment, setDeletePayment] = useState(false)
    const openDeletePayment = (paymentid) => {
        setDeletePayment(true)
        setSinglePaymentId(paymentid)
    }

    const closeDeletePayment = () => {
        setDeletePayment(false)
    }

    const [addnewmodal, setAddnewmodal] = useState(false);

    const openAddnewmodal = () => {
        setAddnewmodal(true)
    };

    const closeAddnewmodal = () => setAddnewmodal(false);

    const [EditDrawer, setEditDrawer] = useState(false);
    const [paymentUuid, setPaymentUuid] = useState(null);
    const openEditDrawer = (uuid) => {
        setEditDrawer(true);
        setPaymentUuid(uuid);
    };

    const closeEditDrawer = () => {
        setEditDrawer(false);
    }

    const [viewDrawer, setViewDrawer] = useState(false);
    const [singlePaymentUuid, setSinglePaymentUuid] = useState(null);
    const openViewDrawer = (uuid) => {
        setViewDrawer(true);
        setSinglePaymentUuid(uuid);
    };

    const closeViewDrawer = () => {
        setViewDrawer(false);
    }

    const handleDownload = async (newSearchQuery, flat) => {
        setIsLoading(true);
        if (paymentsData.length === 0) {
            setIsLoading(false)
            setErrorMessage({
                message: "No Payments are available to downlaod",
                type: "No Payments",
            })
            return false;
        }
        try {
            const params = {
                searchQuery: newSearchQuery,
                exportAll: 'true',
                customerUuid: customerUuid,
                flat_id: flat
            };

            if (dateRange.startDate) params.startDate = dateRange.startDate;
            if (dateRange.endDate) params.endDate = dateRange.endDate;
            const response = await Paymentapi.get("/getcustomerpaymentsforexcel", {
                params,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
                responseType: 'blob'
            });
            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Customer payment history.xlsx'); // Filename for download
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success('Export Successful');
            } else {
                toast.error('Export Failed');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error downloading customers:', error);
            const finalResponse = error.response?.data?.message || 'An error occurred during download';
            setErrorMessage(finalResponse);
            setIsLoading(false);
        }
    };

    async function handleDeletePayment() {
        await Paymentapi.post('/deletepayment', {
            payment_id: singlePaymentId,
            employee_id: employeeId
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
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
                toast.success("payment deleted successfully")
                closeDeletePayment()
                GetAllPayments(page, limit, searchQuery, selectedFlat);
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

    const handleDateFilterChange = (newDateRange) => {
        setDateRange(newDateRange);
        setPage(1);
        setIsLoading(true);
        GetAllPayments(1, limit, searchQuery, selectedFlat);
    };

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
    const containerRef = useRef(null);

    const [customerFlats, setCustomerFlats] = useState([])
    async function fetchFlats(customeruid) {
        await Flatapi.get("/getcustomerflats", {
            params: {
                customer_uid: customeruid,
            },
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                let data = res.data;
                if (data.status === "error") {
                    let finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    return false;
                }
                setCustomerFlats(data?.customerflats || []);
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
                return false;
            })
    }

    useEffect(() => {
        if (customerUuid) {
            fetchFlats(customerUuid)
        }
    }, [customerUuid])

    const clearFilters = () => {
        setSearchQuery('');
        setLimit('10')
        setPage(1)
        setDateRange({ startDate: null, endDate: null });
        setSelectedFlat(null);
        GetAllPayments(1, limit, '', null);
    };

    const handlePrint = async (newSearchQuery, flatid) => {
        const params = {
            searchQuery: newSearchQuery,
            customerUuid: customerUuid,
            flat_id: flatid
        }

        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;

        Paymentapi.get("/getallprintpaymentsbycustomer", {
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
            const paymentsData = data?.allpayments || [];
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
                    <div class="field"><div class="label">Amount:</div><div class="value">₹ ${(parseInt(payment.amount) || 0).toFixed(2)}</div></div>
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowColumnToggle(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-lg font-semibold">
                            All Payments
                        </p>
                        <div className="flex items-center gap-2">
                            {permissions?.payments_page?.includes("print_all_payments") && (
                                <button
                                    disabled={paymentsData.length > 0 ? false : true}
                                    onClick={() => handlePrint(searchQuery, selectedFlat)}
                                    className={`cursor-pointer flex items-center gap-x-1 text-[14px] text-white px-4 py-[7px] rounded bg-[#e0589c] ${paymentsData.length > 0 ? 'hover:bg-pink-600' : 'bg-gray-400 !cursor-not-allowed'}`}
                                >
                                    <PrinterIcon size={14} /> Print
                                </button>
                            )}
                            {permissions?.payments_page?.includes("export_payment_to_excel") && (
                                <button
                                    onClick={() => handleDownload(searchQuery, selectedFlat)}
                                    className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-[#00bc7d] flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    <IconDownload size={16} />
                                    Export to Excel
                                </button>
                            )}
                            {permissions?.payments_page?.includes("add_payment") && (
                                <Button
                                    onClick={openAddnewmodal}
                                    className="!px-6 !py-[9px] bg-[#0083bf] rounded-sm !border-none focus:outline-none focus:ring-0 focus:ring-offset-0 inline-flex justify-center items-center gap-1 cursor-pointer"
                                    style={{ backgroundColor: '#0083bf' }}>
                                    <IconCirclePlus size={16} color='#fff' />
                                    <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-white">Add Payment</p>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="border border-[#ebecef] rounded-sm relative !h-9">
                            <input
                                type="text"
                                placeholder="Search payments..."
                                className="focus:outline-none text-sm pl-6 py-2 !text-[#4c5565]"
                                onChange={updateSearchQuery}
                                value={searchQuery}
                            />
                            <div className="absolute left-0 top-3 px-1">
                                <IconSearch size={16} color="#ced4da" />
                            </div>
                        </div>
                        <div className="flex flex-row justify-end gap-2">
                            {(searchQuery !== '' || limit !== '10' || dateRange.startDate !== null || dateRange.endDate !== null || selectedFlat !== null) && (
                                <div onClick={clearFilters} className={`flex items-center gap-2 cursor-pointer px-2 !py-[7px] !h-9 !rounded-sm !border !border-[#ebecef] !bg-red-400 !text-white hover:!bg-red-500 !font-normal !text-[14px]`}>
                                    <Funnel className="!w-4 !h-4" /> <p>Clear Filters</p>
                                </div>
                            )}
                            <div className="relative">
                                <Select
                                    placeholder="Search flats"
                                    data={customerFlats}
                                    searchable
                                    withAsterisk
                                    selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-1.5 !h-9 !bg-white !rounded-sm !shadow-none !border !border-[#ebecef] !w-[150px]"
                                    dropDownClass="w-full md:!w-[200px] lg:!w-[200px] xl:!w-[200px] mx-auto border-[#2B2B2B99]/60 overflow-y-hidden"
                                    className="!m-0 !p-0 !border-0"
                                    value={selectedFlat}
                                    onChange={updateSelectedFlats}
                                />
                            </div>
                            <div className=" ">
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
                                    selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[7.5px] !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
                                    className="!m-0 !p-0 !border-0"
                                    dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#044093] focus:outline-none"
                                />
                            </div>

                            <Datefilter
                                onFilterChange={handleDateFilterChange}
                                onClearFilter={handleDateFilterChange}
                            />
                            <div ref={containerRef} className="relative">
                                <button
                                    onClick={() => setShowColumnToggle(!showColumnToggle)}
                                    className="cursor-pointer flex items-center gap-1 px-2 py-2 h-9 text-sm border border-[#ebecef] rounded-sm bg-white hover:bg-gray-50"
                                >
                                    ⚙️ Columns
                                </button>

                                {showColumnToggle && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#ebecef] rounded-md shadow z-50">
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

                {/* Table Section  */}
                <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg z-0">
                    <table className="w-full table-fixed text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-neutral-200">
                            <tr className="w-full">
                                {/* {visibleColumns.reference && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[140px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                                        Ref ID
                                    </th>
                                )} */}
                                {visibleColumns.transactionId && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                        Transaction Id
                                    </th>
                                )}
                                {visibleColumns.flat && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px]">
                                        Flat
                                    </th>
                                )}
                                {visibleColumns.block && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px]">
                                        Block
                                    </th>
                                )}
                                {visibleColumns.customer && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                        Customer
                                    </th>
                                )}
                                {visibleColumns.amount && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[140px]">
                                        Amount
                                    </th>
                                )}
                                {visibleColumns.date && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                        Date of Payment
                                    </th>
                                )}
                                {visibleColumns.paymentType && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                        Payment Type
                                    </th>
                                )}
                                {visibleColumns.paymentTowards && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                        Payment Towards
                                    </th>
                                )}
                                {visibleColumns.paymentMethod && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                        Payment Method
                                    </th>
                                )}
                                {visibleColumns.bank && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                        Bank
                                    </th>
                                )}
                                <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {isLoading === false ? (
                                paymentsData.length > 0 ? (
                                    paymentsData.map((payment, index) => (
                                        <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                                            {/* {visibleColumns.reference && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[140px] sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                                    <NavLink to={`/singlepaymentview/${payment.uuid}`}>
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">{payment?.uuid}</p>
                                                    </NavLink>
                                                </td>
                                            )} */}
                                            {visibleColumns.transactionId && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                    <NavLink to={`/singlepaymentview/${payment.uuid}`}>
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                                            {payment?.transaction_id}
                                                        </p>
                                                    </NavLink>
                                                </td>
                                            )}
                                            {visibleColumns.flat && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[120px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        <NavLink to={`/flats/view-flat/${payment?.flat_uuid}`} className="hover:text-[#0083bf]">
                                                            {payment?.flat_number || "----"}
                                                        </NavLink>
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.block && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[120px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {payment?.block_name || "----"}
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.customer && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {(payment?.customer_prefixes || "") + " " + (payment?.customer_first_name || "") + " " + (payment?.customer_last_name || "")}
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.amount && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[140px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {payment?.amount || "----"}
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.date && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {payment?.payment_date ? dayjs(payment?.payment_date).format("DD/MM/YYYY") : "----"}
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.paymentType && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {payment?.payment_type || "----"}
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.paymentTowards && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {payment?.payment_towards || "----"}
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.paymentMethod && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {payment?.payment_method || "----"}
                                                    </p>
                                                </td>
                                            )}
                                            {visibleColumns.bank && (
                                                <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                    <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                        {payment?.bank || "----"}
                                                    </p>
                                                </td>
                                            )}
                                            <td className="px-4 py-4 text-center whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                                <div className="flex flex-row items-center justify-center gap-2">
                                                    {permissions?.payments_page?.includes("view_single_payment") && (
                                                        <Link
                                                            to={`/singlepaymentview/${payment?.uuid}`}
                                                            className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                                                        >
                                                            <IconEye size={18} />
                                                        </Link>
                                                    )}
                                                    {permissions?.payments_page?.includes("edit_payment") && (
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditDrawer(payment?.uuid);
                                                            }}
                                                            className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                                        >
                                                            <IconEdit size={18} />
                                                        </div>
                                                    )}
                                                    {permissions?.payments_page?.includes("delete_payment") && (
                                                        <div
                                                            onClick={() => openDeletePayment(payment?.id)}
                                                            className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                                                        >
                                                            <IconTrash size={18} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={13} className="text-center py-8">
                                            <p className="text-neutral-500 text-sm">
                                                No payments found
                                            </p>
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={13}>
                                        <TableLoadingEffect />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
                </div>

                {paymentsData.length > 0 && (
                    <div className="flex flex-row-reverse">
                        <Pagination
                            totalpages={totalPages}
                            value={page}
                            siblings={1}
                            onChange={handlePageChange}
                            color="#0083bf"
                        />
                    </div>
                )}
            </div>


            <DeleteModal
                title="Delete Payment"
                message="Are you sure you want to delete this payment?"
                open={deletePayment}
                onClose={closeDeletePayment}
                onConfirm={handleDeletePayment}
            />


            <Drawer
                open={addnewmodal}
                onClose={closeAddnewmodal}
                direction='right'
                className='h-screen overflow-y-auto text-left'
                size='80vw'
                zIndex={100}
                lockBackgroundScroll={true}
            >
                {addnewmodal && (
                    <Addpaymentincustomer
                        closeAddnewmodal={closeAddnewmodal}
                        customerUuid={customerUuid}
                        refreshAllPayments={refreshAllPayments}
                    />
                )}
            </Drawer>

            <Drawer
                open={EditDrawer}
                onClose={closeEditDrawer}
                direction='right'
                className='h-screen overflow-y-auto text-left'
                size='80vw'
                zIndex={100}
                lockBackgroundScroll={true}
            >
                {EditDrawer && (
                    <Editpaymentincustomer
                        closeEditDrawer={closeEditDrawer}
                        paymentUuid={paymentUuid}
                        customerUuid={customerUuid}
                        refreshAllPayments={refreshAllPayments}
                    />
                )}
            </Drawer>

            <Drawer
                open={viewDrawer}
                onClose={closeViewDrawer}
                direction='right'
                className='h-screen overflow-y-auto text-left'
                size='60vw'
                zIndex={100}
                lockBackgroundScroll={true}
            >
                {viewDrawer && (
                    <Viewsinglepaymentincustomer
                        closeViewDrawer={closeViewDrawer}
                        paymentUuid={singlePaymentUuid}
                        customerUuid={customerUuid}
                    />
                )}
            </Drawer>
        </>
    );
}

export default Paymentswrapper;