import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Flatapi from "../api/Flatapi";
import Errorpanel from "../shared/Errorpanel";
import { Link, NavLink, useParams } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { IconArrowLeft, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { PrinterIcon } from "lucide-react";
import DeleteModal from "../shared/DeleteModal";
import Paymentapi from "../api/Paymentapi";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";

function Flatpaymentswrapper() {
    const params = useParams();
    const flat_id = params.flat_id;
    const permissions = useEmployeeDetails((state) => state.permissions);
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [flatDetails, setFlatDetails] = useState(null);
    const [payments, setPayments] = useState([]);
    const [financials, setFinancials] = useState({
        grand_total: 0,
        total_paid: 0,
        balance: 0
    });

    // Fetch flat payment details
    async function getFlatPaymentDetails() {
        setIsLoading(true);
        await Flatapi.get("/get-flat-payment-details", {
            params: {
                flat_id: flat_id
            },
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
                const result = data?.data;
                setFlatDetails({
                    flat_no: result?.flat_no,
                    project_name: result?.project_name,
                    customer: result?.customer_details,
                    application_date: result?.application_date
                });
                setFinancials(result?.financials || { grand_total: 0, total_paid: 0, balance: 0 });
                setPayments(result?.payment_history || []);
                setIsLoading(false);
                return false;
            })
            .catch((error) => {
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

    useEffect(() => {
        if (flat_id) {
            getFlatPaymentDetails();
        }
    }, [flat_id]);

    const [deletePayment, setDeletePayment] = useState(false);
    const [singlePaymentId, setSinglePaymentId] = useState(null);

    const openDeletePayment = (paymentId) => {
        setDeletePayment(true);
        setSinglePaymentId(paymentId);
    };

    const closeDeletePayment = () => {
        setDeletePayment(false);
        setSinglePaymentId(null);
    };

    async function handleDeletePayment() {
        await Paymentapi.post('/deletepayment', {
            payment_id: singlePaymentId,
            employee_id: employeeInfo?.id,
        },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((res) => {
                let data = res.data;
                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data
                    });
                    return;
                }
                toast.success("Payment deleted successfully");
                getFlatPaymentDetails();
                closeDeletePayment();
            })
            .catch((error) => {
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        message: error.message,
                        server_res: error.response.data
                    };
                } else {
                    finalresponse = {
                        message: error.message,
                        server_res: null
                    };
                }
                setErrorMessage(finalresponse);
                return false;
            });
    }

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "₹ 0.00";
        return "₹ " + parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
                    <div class="field"><div class="label">Transaction Id:</div><div class="value">${payment.trasnaction_id || "---"}</div></div>
                    <div class="field"><div class="label">Amount:</div><div class="value">${formatCurrency(payment.amount)}</div></div>
                    <div class="field"><div class="label">Date of Payment:</div><div class="value">${payment.payment_date ? dayjs(payment.payment_date).format("DD/MM/YYYY") : "---"}</div></div>
                    <div class="field"><div class="label">Payment Type:</div><div class="value">${payment.payment_type || "---"}</div></div>
                    <div class="field"><div class="label">Payment Method:</div><div class="value">${payment.payment_method || "---"}</div></div>
                </div>
                <h2>Flat Details</h2>
                <div class="container">
                    <div class="field"><div class="label">Flat:</div><div class="value">${flatDetails?.flat_no || "---"}</div></div>
                    <div class="field"><div class="label">Customer:</div><div class="value">${flatDetails?.customer ? `${flatDetails.customer.prefixes || ''} ${flatDetails.customer.first_name || ''} ${flatDetails.customer.last_name || ''}` : "---"}</div></div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="text-[22px] font-semibold">Flat Payments -</p>
                        {isLoading ? (
                            <Skeleton className="h-7 w-20" />
                        ) : (
                            <p className="text-[22px] font-semibold">{flatDetails?.flat_no || "---"}</p>
                        )}
                        {!isLoading && flatDetails?.project_name && (
                            <p className="text-[22px] font-semibold ml-1">- {flatDetails.project_name}</p>
                        )}
                    </div>
                    <Link to={'/payments'} className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200 hover:bg-[#0083bf] hover:text-white" >
                        <IconArrowLeft className='mt-0.5' size={18} />Back
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isLoading ? (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    <Skeleton className="h-7 w-32" />
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                                <p className="text-neutral-500 text-sm mb-1">Grand Total</p>
                                <p className="text-xl font-semibold text-neutral-800">{formatCurrency(financials.grand_total)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                                <p className="text-neutral-500 text-sm mb-1">Total Paid</p>
                                <p className="text-xl font-semibold text-green-600">{formatCurrency(financials.total_paid)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                                <p className="text-neutral-500 text-sm mb-1">Balance Due</p>
                                <p className={`text-xl font-semibold ${financials.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatCurrency(financials.balance)}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Customer Info */}
                {isLoading ? (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                ) : (
                    flatDetails?.customer && (
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                            <p className="text-neutral-500 text-sm mb-2">Customer</p>
                            <p className="text-lg font-medium text-neutral-800">
                                {flatDetails.customer.prefixes || ''} {flatDetails.customer.first_name || ''} {flatDetails.customer.last_name || ''}
                            </p>
                        </div>
                    )
                )}

                {/* Payments Table */}
                <div className='flex flex-col gap-4 bg-white rounded-md'>
                    <div className='px-4 pt-4'>
                        <p className="text-lg font-semibold text-neutral-700">Payment History</p>
                    </div>
                    <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg z-0">
                        <table className="w-full table-fixed text-left border-collapse">
                            <thead className="bg-[#f9fafb]">
                                <tr className="border-b border-neutral-200">
                                    <th className="px-3 py-2 text-neutral-800 uppercase tracking-widest text-[12px] font-bold leading-tight border-r border-neutral-200">
                                        Transaction Id
                                    </th>
                                    <th className="px-3 py-2 text-neutral-800 uppercase tracking-widest text-[12px] font-bold leading-tight border-r border-neutral-200">
                                        Amount
                                    </th>
                                    <th className="px-3 py-2 text-neutral-800 uppercase tracking-widest text-[12px] font-bold leading-tight border-r border-neutral-200">
                                        Date
                                    </th>
                                    <th className="px-3 py-2 text-neutral-800 uppercase tracking-widest text-[12px] font-bold leading-tight border-r border-neutral-200">
                                        Payment Type
                                    </th>
                                    <th className="px-3 py-2 text-neutral-800 uppercase tracking-widest text-[12px] font-bold leading-tight border-r border-neutral-200">
                                        Payment Towards
                                    </th>
                                    <th className="px-3 py-2 text-neutral-800 uppercase tracking-widest text-[12px] font-bold leading-tight border-r border-neutral-200">
                                        Payment Method
                                    </th>
                                    <th className="px-3 py-2 text-neutral-800 uppercase tracking-widest text-[12px] font-bold leading-tight text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {isLoading === false ? (
                                    payments.length > 0 ? (
                                        payments.map((payment, index) => (
                                            <tr key={index} className="hover:bg-neutral-50/50 transition-colors duration-150 border-b border-neutral-200 last:border-0">
                                                <td className="px-3 py-2 whitespace-normal break-words w-[180px] border-r border-neutral-200">
                                                    <NavLink to={`/singlepaymentview/${payment.id}`}>
                                                        <p className="text-neutral-600 text-[11px] font-medium leading-[18px] hover:text-[#0083bf]">
                                                            {payment?.trasnaction_id || "----"}
                                                        </p>
                                                    </NavLink>
                                                </td>
                                                <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                                                    <p className="text-neutral-600 text-[12px] font-medium leading-[18px]">
                                                        {formatCurrency(payment?.amount)}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                                                    <p className="text-neutral-600 text-[12px] font-medium leading-[18px]">
                                                        {payment?.payment_date ? dayjs(payment.payment_date).format("DD/MM/YYYY") : "----"}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                                                    <p className="text-neutral-600 text-[12px] font-medium leading-[18px]">
                                                        {payment?.payment_type || "----"}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                                                    <p className="text-neutral-600 text-[12px] font-medium leading-[18px]">
                                                        {payment?.payment_towards || "----"}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                                                    <p className="text-neutral-600 text-[12px] font-medium leading-[18px]">
                                                        {payment?.payment_method || "----"}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-2 text-center whitespace-normal break-words w-[120px] border-r border-neutral-200">
                                                    <div className="flex flex-row items-center justify-center gap-2">
                                                        {permissions?.payments_page?.includes("view_payment") && (
                                                            <Link
                                                                to={`/singlepaymentview/${payment.id}`}
                                                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                                                            >
                                                                <IconEye size={18} />
                                                            </Link>
                                                        )}

                                                        {permissions?.payments_page?.includes("edit_payment") && (
                                                            <Link
                                                                to={`/payments/edit/${payment.id}`}
                                                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                                                            >
                                                                <IconEdit size={18} />
                                                            </Link>
                                                        )}

                                                        {permissions?.payments_page?.includes("delete_payment") && (
                                                            <div
                                                                onClick={() => openDeletePayment(payment.id)}
                                                                className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                                                            >
                                                                <IconTrash size={18} />
                                                            </div>
                                                        )}

                                                        {permissions?.payments_page?.includes("print_single_payment") && (
                                                            <PrinterIcon size={18} strokeWidth={2.5} color="#e0589c" className="cursor-pointer" onClick={() => handleSinglePrint(payment)} />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8">
                                                <p className="text-neutral-500 text-[11px]">
                                                    No payments found for this flat
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <>
                                        {[...Array(5)].map((_, i) => (
                                            <tr key={i} className="border-b border-neutral-200 last:border-0">
                                                <td className="px-3 py-2 border-r border-neutral-200">
                                                    <Skeleton className="h-3 w-[140px]" />
                                                </td>
                                                <td className="px-3 py-2 border-r border-neutral-200">
                                                    <Skeleton className="h-3 w-[100px]" />
                                                </td>
                                                <td className="px-3 py-2 border-r border-neutral-200">
                                                    <Skeleton className="h-3 w-[100px]" />
                                                </td>
                                                <td className="px-3 py-2 border-r border-neutral-200">
                                                    <Skeleton className="h-3 w-[100px]" />
                                                </td>
                                                <td className="px-3 py-2 border-r border-neutral-200">
                                                    <Skeleton className="h-3 w-[100px]" />
                                                </td>
                                                <td className="px-3 py-2 border-r border-neutral-200">
                                                    <Skeleton className="h-3 w-[100px]" />
                                                </td>
                                                <td className="px-3 py-2 text-center border-r border-neutral-200">
                                                    <div className="flex justify-center">
                                                        <Skeleton className="w-8 h-8 rounded-md" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
            </div>

            <DeleteModal
                title="Delete Payment"
                message="Are you sure you want to delete this payment?"
                open={deletePayment}
                onClose={closeDeletePayment}
                onConfirm={handleDeletePayment}
            />
        </>
    );
}

export default Flatpaymentswrapper;
