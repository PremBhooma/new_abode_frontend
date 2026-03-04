import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import React, { useEffect, useState } from 'react'
import { Button } from '@nayeshdaggula/tailify';

import Projectapi from "../api/Projectapi.jsx";
import Generalapi from '../api/Generalapi.jsx';
import dayjs from 'dayjs';

function ExcelPaymentTemplate({ closeDownloadTemplate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [blocksData, setBlocksData] = useState([]);

    const [projectsData, setProjectsData] = useState([]);
    const [bankList, setBankList] = useState([]);

    async function getBanksData() {
        try {
            const response = await Generalapi.get('/get-all-banks-list?limit=1000');
            const data = response.data;
            if (data.status === 'success') {
                setBankList(data.data || []);
            } else {
                setBankList([]);
            }
        } catch (error) {
            console.error("Error fetching banks:", error);
            setBankList([]);
        }
    }

    async function getProjectsData() {
        try {
            const response = await Projectapi.get("get-all-projects", {
                headers: { "Content-Type": "application/json" }
            });
            const data = response.data;
            if (data.status === "error") {
                console.error("Error fetching projects:", data.message);
                setProjectsData([]);
            } else {
                setProjectsData(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            setProjectsData([]);
        }
    }

    async function getBlocksData() {
        setIsLoading(true);

        Projectapi.get("get-blocks-names", {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const data = response.data;

                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setBlocksData(null);
                } else {
                    setBlocksData(data?.blocks || []);
                    setErrorMessage("");
                }

                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching company info:", error);

                const finalResponse = {
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                };

                setErrorMessage(finalResponse);
                setBlocksData(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getBlocksData();
        getProjectsData();
        getBanksData();
    }, []);


    const downloadPaymentTemplate = async () => {

        if (!blocksData || blocksData.length === 0) {
            setErrorMessage("No Blocks available. Please add blocks before downloading.");
            return;
        }

        setErrorMessage("");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Payment Upload Template');

        const headers = [
            'Amount',
            'Payment Type',
            'Payment Towards',
            'Payment Method',
            'Bank',
            'Date of Payment',
            'Transaction Id',
            'Flat',
            'Block',
            'Project',
            'Comment'
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => {
            col.width = 25;
        });

        // Format the "Date of Payment" column (F) as Text to prevent Excel
        // from auto-converting dates to serial numbers (which causes locale issues)
        worksheet.getColumn(6).numFmt = '@';

        const paymentTypes = ['Customer Pay', 'Loan Pay'];
        const paymentTowards = ['Flat', 'GST', 'Corpus fund', 'Registration', 'TDS', 'Maintenance'];
        const paymentMethods = ['DD', 'UPI', 'Bank Deposit', 'Cheque', 'Online Transfer (IMPS, NFT)'];

        const blockSheet = workbook.addWorksheet('BlockList');
        blocksData.forEach((block, index) => {
            blockSheet.getCell(`A${index + 1}`).value = block.name;
        });
        blockSheet.state = 'veryHidden'; // hides sheet in Excel

        const projectSheet = workbook.addWorksheet('ProjectList');
        projectsData.forEach((project, index) => {
            projectSheet.getCell(`A${index + 1}`).value = project.project_name;
        });
        projectSheet.state = 'veryHidden';

        const bankSheet = workbook.addWorksheet('BankList');
        bankList.forEach((bank, index) => {
            bankSheet.getCell(`A${index + 1}`).value = bank.name;
        });
        bankSheet.state = 'veryHidden';

        worksheet.addRow([
            "10000",
            paymentTypes[0] || "",
            paymentTowards[0] || "",
            paymentMethods[0] || "",
            bankList[0]?.name || "",
            dayjs(new Date()).format('DD-MM-YYYY'),
            "ABCDEFGH123456",
            "101",
            blocksData[0]?.name || "",
            projectsData[0]?.project_name || "",
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {
            // Ensure Date column cells are Text format
            worksheet.getCell(`F${i}`).numFmt = '@';

            worksheet.getCell(`B${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`"${paymentTypes.join(',')}"`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Payment Type',
                error: 'Please select a valid payment type from the dropdown list.',
            };

            worksheet.getCell(`C${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`"${paymentTowards.join(',')}"`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Payment Towards',
                error: 'Please select a valid payment towards from the dropdown list.',
            };

            worksheet.getCell(`D${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`"${paymentMethods.join(',')}"`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Payment Method',
                error: 'Please select a valid payment method from the dropdown list.',

            };

            // ✅ Reference hidden BankList sheet
            if (bankList.length > 0) {
                worksheet.getCell(`E${i}`).dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`BankList!$A$1:$A$${bankList.length}`],
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'Invalid Bank',
                    error: 'Please select a valid Bank from the dropdown list.',
                };
            }

            // ✅ Reference hidden BlockList sheet
            worksheet.getCell(`I${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`BlockList!$A$1:$A$${blocksData.length}`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Block',
                error: 'Please select a valid Block from the dropdown list.',
            };

            // ✅ Reference hidden ProjectList sheet
            if (projectsData.length > 0) {
                worksheet.getCell(`J${i}`).dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`ProjectList!$A$1:$A$${projectsData.length}`],
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'Invalid Project',
                    error: 'Please select a valid Project from the dropdown list.',
                };
            }
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(fileBlob, 'Payment_Upload_Template.xlsx');
        closeDownloadTemplate();
    };



    return (
        <div className="flex flex-col gap-5 p-2">
            <div className='flex justify-between items-center border-b border-gray-100 pb-3'>
                <div className='flex items-center gap-2'>
                    <div className="h-8 w-1 bg-[#0083bf] rounded-full"></div>
                    <h2 className='text-lg font-semibold text-gray-800'>Template Guidelines</h2>
                </div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                    ✕
                </Button>
            </div>

            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-600 mb-3 font-medium">Please follow these rules to ensure successful upload:</p>
                <ul className="list-disc ml-4 space-y-2 text-sm text-gray-600">
                    <li><span className="font-semibold text-gray-700">Required Fields:</span> Amount, Type, Towards, Method, Date, Txn Id, Flat, Project are mandatory.</li>
                    <li><span className="font-semibold text-gray-700">Customer Check:</span> The specified <span className="font-medium">Flat</span> must have an <span className="font-medium">Active Customer</span> assigned to it.</li>
                    <li><span className="font-semibold text-gray-700">Date of Payment:</span> Must be between the <span className="font-medium">Booking Date</span> and <span className="font-medium">Today</span>. Use <code>DD-MM-YYYY</code> format (e.g., <code>01-03-2026</code>). <span className="text-red-500 font-medium">Do not use slashes (/).</span></li>
                    <li><span className="font-semibold text-gray-700">Bank Requirement:</span> Required ONLY for <code>DD</code>, <code>Bank Deposit</code>, or <code>Cheque</code>.</li>
                    <li><span className="font-semibold text-gray-700">Dropdowns:</span> Use provided lists for Type, Towards, Method, Bank, Block, and Project.</li>
                </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <button
                    className="w-full flex justify-center items-center gap-2 px-5 py-2.5 text-white text-sm font-medium bg-[#0083bf] hover:bg-[#006e9e] rounded-md shadow-sm transition-all duration-200 cursor-pointer"
                    onClick={downloadPaymentTemplate}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Payment Template
                </button>
            </div>

            {errorMessage && <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>}
        </div>
    );
}

export default ExcelPaymentTemplate