import React, { useCallback, useEffect, useRef, useState } from "react";
import Paymentapi from "../api/Paymentapi";
import Errorpanel from "../shared/Errorpanel";
import AssignProject from "../shared/AssignProject";
import TableLoadingEffect from "../shared/Tableloadingeffect";
import { Link, useNavigate } from "react-router-dom";
import { useProjectDetails } from "../zustand/useProjectDetails";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Modal, Pagination } from "@nayeshdaggula/tailify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { IconDownload, IconEye, IconPrinter, IconSearch } from "@tabler/icons-react";
import Flatapi from "../api/Flatapi";
import Projectapi from "../api/Projectapi";
import { Funnel } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Downloadtemplate from "./Downloadtemplate";
import Uploadpaymentexcel from "./Uploadpaymentexcel";
import Skippedrecords from "./Skippedrecords";
import dayjs from "dayjs";

function Allpaymentswrapper() {
    const navigate = useNavigate();
    const permissions = useEmployeeDetails((state) => state.permissions);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [filterKey, setFilterKey] = useState(0);

    const { projectData, hasFetched, fetchProjectData } = useProjectDetails();

    const [projectModel, setProjectModel] = useState(false);
    const openProjectModel = () => {
        setProjectModel(true);
    };
    const closeProjectModel = () => {
        setProjectModel(false);
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    useEffect(() => {
        if (hasFetched) {
            if (!projectData || (typeof projectData === 'object' && Object.keys(projectData).length === 0)) {
                openProjectModel();
            }
        }
    }, [hasFetched, projectData]);

    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [limit, setLimit] = useState("10");

    const [flats, setFlats] = useState([]);
    const [selectedFlats, setSelectedFlats] = useState(null);

    const [blocks, setBlocks] = useState([])
    const [selectedBlock, setSelectedBlock] = useState(null)
    const handleSelectBlock = (value) => {
        setSelectedBlock(value)
    }

    const [flatsSummary, setFlatsSummary] = useState([]);

    // Download Template Modal
    const [downloadTemplate, setDownloadTemplate] = useState(false)
    const openDownloadTemplate = () => {
        setDownloadTemplate(true)
    }
    const closeDownloadTemplate = () => {
        setDownloadTemplate(false)
    }

    // Upload Excel Modal
    const [uploadPaymentExcel, setUploadPaymentExcel] = useState(false)
    const openUploadPaymentExcel = () => {
        setUploadPaymentExcel(true)
    }
    const closeUploadPaymentExcel = () => {
        setUploadPaymentExcel(false)
    }

    // Skipped Records Modal (Bulk Upload Results)
    const [showSkippedModal, setShowSkippedModal] = useState(false);
    const [skippedData, setSkippedData] = useState([]);
    const [skippedCount, setSkippedCount] = useState(0);
    const [insertedCount, setInsertedCount] = useState(0);

    const handleUploadResults = (data) => {
        setSkippedData(data.skipped || []);
        setSkippedCount(data.skippedCount);
        setInsertedCount(data.insertedCount || 0);
        setShowSkippedModal(true);
        // Close the upload modal when results are ready to show
        closeUploadPaymentExcel();
    };

    const handleCloseSkippedModal = () => {
        setShowSkippedModal(false);
        refreshPaymentsData();
    };

    // Fetch flats summary data
    async function GetPaymentsSummaryByFlat(newPage, newLimit, newSearchQuery, flatid, selectedblock) {
        setIsLoading(true);
        const offset = (newPage - 1) * parseInt(newLimit);
        const params = {
            offset: offset,
            limit: newLimit,
            searchQuery: newSearchQuery,
            flat_id: flatid,
            block_id: selectedblock,
            project_id: projectData?.id
        }

        await Paymentapi.get("/get-payments-summary-by-flat", {
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
                setFlatsSummary(data?.data || []);
                setTotalPages(data?.pagination?.totalPages || 0);
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

    // Fetch blocks
    async function fetchBlocks() {
        await Projectapi.get('/get-blocks-label', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === 'error') {
                    console.error(data.message);
                    return false;
                }
                setBlocks(data?.blocks || []);
                return false;
            })
            .catch((error) => {
                console.error(error.message);
                return false;
            });
    }

    // Fetch flats for filter
    async function fetchFlats(selectedblock) {
        const params = {
            project_id: projectData?.id,
            status: 'Sold'
        }
        if (selectedblock) {
            params.block_id = selectedblock
        }

        await Flatapi.get('/get-all-flats', {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === 'error') {
                    console.error(data.message);
                    return false;
                }
                const flatsArr = data?.flats?.map((flat) => ({
                    value: String(flat.id),
                    label: flat.flat_no,
                })) || [];
                setFlats(flatsArr);
                return false;
            })
            .catch((error) => {
                console.error(error.message);
                return false;
            });
    }

    useEffect(() => {
        if (projectData?.id) {
            fetchBlocks();
            fetchFlats(selectedBlock);
        }
    }, [projectData?.id, selectedBlock]);

    const handlePageChange = useCallback((value) => {
        setPage(value);
        GetPaymentsSummaryByFlat(value, limit, searchQuery, selectedFlats, selectedBlock);
    }, [limit, searchQuery, selectedFlats, selectedBlock]);

    const updateSearchQuery = useCallback(
        (e) => {
            setSearchQuery(e.target.value);
            setPage(1);
            GetPaymentsSummaryByFlat(1, limit, e.target.value, selectedFlats, selectedBlock);
        },
        [limit, selectedFlats, selectedBlock]
    );

    const updateLimit = useCallback(
        (data) => {
            let newpage = 1;
            setLimit(data);
            setPage(newpage);
            GetPaymentsSummaryByFlat(newpage, data, searchQuery, selectedFlats, selectedBlock);
        },
        [searchQuery, selectedFlats, selectedBlock]
    );

    const handleFlatsChange = (value) => {
        setSelectedFlats(value);
        setPage(1);
        GetPaymentsSummaryByFlat(1, limit, searchQuery, value, selectedBlock);
    }

    const handleBlockChange = (value) => {
        setSelectedBlock(value);
        setSelectedFlats(null);
        setPage(1);
        GetPaymentsSummaryByFlat(1, limit, searchQuery, null, value);
    }

    useEffect(() => {
        if (projectData?.id) {
            GetPaymentsSummaryByFlat(page, limit, searchQuery, selectedFlats, selectedBlock);
        }
    }, [projectData?.id]);

    const clearFilters = () => {
        setSearchQuery('');
        setLimit('10')
        setPage(1)
        setSelectedFlats(null);
        setSelectedBlock(null)
        setFilterKey(prev => prev + 1);
        GetPaymentsSummaryByFlat(1, '10', '', null, null);
    };

    const isFilterApplied =
        searchQuery !== '' ||
        limit !== '10' ||
        selectedFlats !== null ||
        selectedBlock !== null;

    const handleViewFlatPayments = (flatId) => {
        navigate(`/payments/flat/${flatId}`);
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "₹ 0.00";
        return "₹ " + parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handlePrint = (searchQuery, selectedFlats, selectedBlock) => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>All Payments Summary</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { bg-color: #f4f4f4; font-weight: bold; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .filter-info { margin-bottom: 10px; font-size: 14px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>All Payments Summary</h2>
                    </div>
                    ${searchQuery || selectedFlats || selectedBlock ? `
                        <div class="filter-info">
                            Filters: ${searchQuery ? `Search: ${searchQuery}` : ''} 
                            ${selectedFlats ? `Flat: ${flats.find(f => f.value === selectedFlats)?.label}` : ''}
                            ${selectedBlock ? `Block: ${blocks.find(b => b.value === selectedBlock)?.label}` : ''}
                        </div>
                    ` : ''}
                    <table>
                        <thead>
                            <tr>
                                <th>Flat</th>
                                <th>Booking Date</th>
                                <th>Total Amount</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${flatsSummary.map(flat => `
                                <tr>
                                    <td>${flat.flat_no} ${flat.block_name ? `(${flat.block_name})` : ''}</td>
                                    <td>${flat.booking_date ? dayjs(flat.booking_date).format('DD/MM/YYYY') : '---'}</td>
                                    <td>${formatCurrency(flat.grand_total)}</td>
                                    <td>${formatCurrency(flat.balance)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    // Export to Excel
    const handleDownload = async () => {
        setIsLoading(true);
        try {
            const params = {
                searchQuery: searchQuery,
                flat_id: selectedFlats,
                block_id: selectedBlock,
                project_id: projectData?.id
            };

            const response = await Paymentapi.get("get-payments-for-excel", {
                params,
                responseType: "blob",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `payments_${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsLoading(false);
        } catch (error) {
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
        }
    };

    const refreshPaymentsData = () => {
        GetPaymentsSummaryByFlat(page, limit, searchQuery, selectedFlats, selectedBlock);
    };

    console.log("flatsSummary:", flatsSummary)

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-[22px] font-semibold">
                        All Payments
                    </p>
                    <div className="flex justify-end items-center gap-2">
                        {permissions?.payments_page?.includes("print_all_payments") && (
                            <button
                                disabled={flatsSummary.length > 0 ? false : true}
                                onClick={() => handlePrint(searchQuery, selectedFlats, selectedBlock)}
                                className={`cursor-pointer flex items-center gap-x-1 text-[14px] text-white px-4 py-[7px] rounded bg-[#e0589c] ${flatsSummary.length > 0 ? 'hover:bg-pink-600' : 'bg-gray-400 !cursor-not-allowed'}`}
                            >
                                <IconPrinter size={14} /> Print
                            </button>
                        )}
                        {permissions?.payments_page?.includes("add_payment") && (
                            <Link to={'/payments/addnew'} className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-black">
                                + Add Payment
                            </Link>
                        )}
                        {permissions?.payments_page?.includes("download_payment_excel") && (
                            <button onClick={openDownloadTemplate} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded !bg-[#0083bf]">
                                Download Payment Template
                            </button>
                        )}
                        {permissions?.payments_page?.includes("export_payment_to_excel") && (
                            <button
                                onClick={handleDownload}
                                className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-[#931f42] flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <IconDownload size={16} />
                                Export to Excel
                            </button>
                        )}
                        {permissions?.payments_page?.includes("upload_payment_excel") && (
                            <button onClick={openUploadPaymentExcel} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded bg-emerald-500">
                                Upload Bulk Payment
                            </button>
                        )}
                    </div>
                </div>
                <div className='flex flex-col gap-4 bg-white rounded-md'>
                    <div className='flex justify-between px-4 pt-4 items-center'>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by Flat No"
                                className="focus:outline-none text-[14px] pl-6 py-2 rounded-md"
                                onChange={updateSearchQuery}
                                value={searchQuery}
                            />
                            <div className="absolute left-0 top-3 px-1">
                                <IconSearch size={16} color="#e5e2e2" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isFilterApplied && (
                                <div onClick={clearFilters} className={`flex items-center gap-2 cursor-pointer px-2 !py-[7px] !rounded-md !border !border-[#ebecef] ${isFilterApplied ? '!bg-red-400 !text-white hover:!bg-red-500' : '!bg-white hover:!bg-gray-50'} !font-normal !text-[14px] !text-[#6b7178]`}>
                                    <Funnel className="!w-4 !h-4" /> <p>Clear Filters</p>
                                </div>
                            )}

                            <div className='w-[150px]'>
                                <Select key={filterKey} value={selectedBlock || undefined} onValueChange={handleBlockChange}>
                                    <SelectTrigger className="w-full h-9 bg-white border-[#ebecef] focus:ring-0 focus:ring-offset-0 shadow-none">
                                        <SelectValue placeholder="Blocks" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {blocks?.map((block) => (
                                            <SelectItem key={block.value} value={block.value}>
                                                {block.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='w-[160px]'>
                                <Select key={filterKey} value={selectedFlats || undefined} onValueChange={handleFlatsChange}>
                                    <SelectTrigger className="w-full h-9 bg-white border-[#ebecef] focus:ring-0 focus:ring-offset-0 shadow-none">
                                        <SelectValue placeholder="Flats" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {flats?.map((flat) => (
                                            <SelectItem key={flat.value} value={flat.value}>
                                                {flat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='w-[60px]'>
                                <Select value={limit.toString()} onValueChange={updateLimit}>
                                    <SelectTrigger className="w-full h-9 bg-white border-[#ebecef] focus:ring-0 focus:ring-offset-0 shadow-none">
                                        <SelectValue placeholder="10" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="40">40</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {/* Table Section  */}
                    <div className="px-4 pb-4">
                        <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg z-0">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead className="bg-[#f9fafb]">
                                    <tr className="border-b border-neutral-200">
                                        <th className="px-3 py-3 text-neutral-800 uppercase tracking-widest text-[11px] font-bold leading-tight !w-[220px] border-r border-neutral-200">
                                            Flat Details
                                        </th>
                                        <th className="px-3 py-3 text-neutral-800 uppercase tracking-widest text-[11px] font-bold leading-tight border-r border-neutral-200">
                                            Booking Date
                                        </th>
                                        <th className="px-3 py-3 text-neutral-800 uppercase tracking-widest text-[11px] font-bold leading-tight border-r border-neutral-200">
                                            Grand Total
                                        </th>
                                        <th className="px-3 py-3 text-neutral-800 uppercase tracking-widest text-[11px] font-bold leading-tight border-r border-neutral-200">
                                            Current Balance
                                        </th>
                                        <th className="px-3 py-3 text-neutral-800 uppercase tracking-widest text-[11px] font-bold leading-tight text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {isLoading === false ? (
                                        flatsSummary.length > 0 ? (
                                            flatsSummary.map((flat, index) => (
                                                <tr key={index} className="hover:bg-neutral-50/50 transition-colors duration-150 border-b border-neutral-200 last:border-0">
                                                    <td className="px-3 py-2 border-r border-neutral-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 flex-shrink-0">
                                                                <span className="text-purple-600 font-bold text-[14px]">
                                                                    {flat?.flat_no || "----"}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <p className="text-neutral-900 text-[11px] font-semibold leading-tight truncate" title={flat?.project_name}>
                                                                    {flat?.project_name || "----"}
                                                                </p>
                                                                <p className="text-neutral-500 text-[11px] font-medium leading-[16px] flex items-center gap-1">
                                                                    <span>{flat?.block_name ? `Block: ${flat.block_name}` : "----"}</span>
                                                                    <span className="text-neutral-300">•</span>
                                                                    <span>{flat?.floor_no ? `Floor: ${flat.floor_no}` : "----"}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 border-r border-neutral-200">
                                                        <p className="text-neutral-600 text-[12px] font-medium leading-[18px]">
                                                            {flat?.booking_date ? dayjs(flat.booking_date).format('DD/MM/YYYY') : "----"}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-2 border-r border-neutral-200">
                                                        <p className="text-neutral-600 text-[12px] font-medium leading-[18px]">
                                                            {formatCurrency(flat?.grand_total)}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-2 border-r border-neutral-200">
                                                        <p className={`text-[12px] font-medium leading-[18px] ${flat?.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {formatCurrency(flat?.balance)}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-2 text-center border-r border-neutral-200">
                                                        <div className="flex flex-row items-center justify-center gap-2">
                                                            {permissions?.payments_page?.includes("view_payment") && (
                                                                <button
                                                                    onClick={() => handleViewFlatPayments(flat.flat_id)}
                                                                    className="p-1.5 hover:bg-blue-50 rounded-md transition-all duration-200 text-neutral-400 hover:text-blue-600 border border-transparent hover:border-blue-100"
                                                                    title="View Payments"
                                                                >
                                                                    <IconEye size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-3">
                                                    <p className="text-neutral-500 text-sm">
                                                        No payments found
                                                    </p>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <>
                                            {[...Array(5)].map((_, i) => (
                                                <tr key={i} className="border-b border-neutral-200 last:border-0">
                                                    <td className="px-3 py-4 border-r border-neutral-200">
                                                        <div className="flex items-center gap-3">
                                                            <Skeleton className="w-10 h-10 rounded-xl" />
                                                            <div className="space-y-2">
                                                                <Skeleton className="h-3 w-[120px]" />
                                                                <Skeleton className="h-3 w-[80px]" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-4 border-r border-neutral-200">
                                                        <Skeleton className="h-3 w-[100px]" />
                                                    </td>
                                                    <td className="px-3 py-4 border-r border-neutral-200">
                                                        <Skeleton className="h-3 w-[120px]" />
                                                    </td>
                                                    <td className="px-3 py-4 border-r border-neutral-200">
                                                        <Skeleton className="h-3 w-[120px]" />
                                                    </td>
                                                    <td className="px-3 py-4">
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
                    {flatsSummary?.length > 0 && (
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
                </div>
                {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            </div >

            <Modal
                open={projectModel}
                onClose={closeProjectModel}
                size="lg"
                zIndex={9999}
                withCloseButton={false}
            >
                {projectModel === true && (
                    <AssignProject
                        closeProjectModel={closeProjectModel}
                    />
                )}
            </Modal>

            <Modal
                open={downloadTemplate}
                onClose={closeDownloadTemplate}
                size="lg"
                zIndex={9999}
                withCloseButton={false}
            >
                {downloadTemplate === true && (
                    <Downloadtemplate
                        closeDownloadTemplate={closeDownloadTemplate}
                    />
                )}
            </Modal>

            <Modal
                open={uploadPaymentExcel}
                onClose={closeUploadPaymentExcel}
                size="lg"
                zIndex={9999}
                withCloseButton={false}
            >
                {uploadPaymentExcel === true && (
                    <Uploadpaymentexcel
                        closeUploadPaymentExcel={closeUploadPaymentExcel}
                        refreshPaymentsData={refreshPaymentsData}
                        onUploadResults={handleUploadResults}
                    />
                )}
            </Modal>

            {showSkippedModal && (
                <Skippedrecords
                    insertedCount={insertedCount}
                    skippedCount={skippedCount}
                    skippedData={skippedData}
                    closeModal={handleCloseSkippedModal}
                />
            )}
        </>
    );
}

export default Allpaymentswrapper;
