import React from 'react'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Button } from '@nayeshdaggula/tailify';
import Employeeapi from '../../api/Employeeapi';
import { useState, useEffect } from 'react';

function Excelleadstemplate({ closeDownloadTemplate }) {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [employeeData, setEmployeeData] = useState([]);

    async function getEmployees() {
        setIsLoading(true);

        Employeeapi.get("/get-all-employees-list", {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                const data = response?.data;
                if (data?.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                    setEmployeeData([]);
                } else {
                    setEmployeeData(data?.employees || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                });
                setEmployeeData([]);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getEmployees();
    }, []);

    console.log("Employees Data", employeeData);

    const downloadLeadTemplate = async () => {

        if (!employeeData || employeeData.length === 0) {
            setErrorMessage("No employees available. Please add employees before downloading.");
            return;
        }

        setErrorMessage("");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Lead Upload Template");

        const headers = [
            "Prefixes",
            "Full Name",
            "Email Address",
            "Phone Number",
            "Assign to Employee",
            "Source of lead",
            "Lead Status",
            "Min Budget",
            "Max Budget",
            "Bedroom",
            "Purpose",
            "Funding",
            "Lead Age",
            "Country",
            "State",
            "City",
            "Address",
            "Pincode",
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => {
            col.width = 25;
        });

        // Dropdown options
        const prefixes = ["Mr", "Mrs", "Miss", "Mx"];
        const sourceOfLead = ["Instagram", "Facebook", "Referral", "Friend", "Walk-In", "Others"];
        const leadStatusOptions = ["Hot", "Cold"];
        const bedroomOptions = ["2 BHK", "3 BHK"];
        const purposeOptions = ["Enduse", "Investment"];
        const fundingOptions = ["Selfloan", "Bankloan"];

        // Hidden Employee sheet
        const employeeSheet = workbook.addWorksheet('EmployeeList');
        employeeData.forEach((ele, index) => {
            employeeSheet.getCell(`A${index + 1}`).value = ele.label;
        });
        employeeSheet.state = 'veryHidden';

        // Sample row
        worksheet.addRow([
            prefixes[0],                    // Prefixes
            "John Doe",                     // Full Name
            "john.doe@example.com",         // Email Address
            "9876543210",                   // Phone Number
            employeeData[0]?.label || "",   // Employee
            sourceOfLead[0],                // Source of lead
            leadStatusOptions[0],           // Lead Status
            5000000,                        // Min Budget
            10000000,                       // Max Budget
            bedroomOptions[1],              // Bedroom
            purposeOptions[0],              // Purpose
            fundingOptions[0],              // Funding
            30,                             // Lead Age
            "India",                        // Country
            "Telangana",                    // State
            "Hyderabad",                    // City
            "Madhapur, Hi-Tech City",       // Address
            "500081",                       // Pincode
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {
            // ✅ Prefixes (Column A)
            worksheet.getCell(`A${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${prefixes.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Prefix",
                error: "Please select Mr, Mrs, Miss, or Mx.",
            };

            // ✅ Assign to Employee (Column E)
            worksheet.getCell(`E${i}`).dataValidation = {
                type: "list",
                allowBlank: false,
                formulae: [`EmployeeList!$A$1:$A$${employeeData.length}`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Employee",
                error: "Please select a valid employee from the dropdown list.",
            };

            // ✅ Source of lead (Column F)
            worksheet.getCell(`F${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${sourceOfLead.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Source of lead",
                error: "Please select a valid source of lead.",
            };

            // ✅ Lead Status (Column G)
            worksheet.getCell(`G${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${leadStatusOptions.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Lead Status",
                error: "Please select Hot or Cold.",
            };

            // ✅ Bedroom (Column J)
            worksheet.getCell(`J${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${bedroomOptions.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Bedroom Option",
                error: "Please select 2 BHK or 3 BHK.",
            };

            // ✅ Purpose (Column K)
            worksheet.getCell(`K${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${purposeOptions.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Purpose",
                error: "Please select Enduse or Investment.",
            };

            // ✅ Funding (Column L)
            worksheet.getCell(`L${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${fundingOptions.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Funding",
                error: "Please select Selfloan or Bankloan.",
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "lead_upload_template.xlsx");
        closeDownloadTemplate();
    };

    return (
        <div className="text-sm space-y-2 p-4">
            <div className='w-full flex justify-between items-center'>
                <div className='font-semibold'>Guidelines:</div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="default">Close</Button>
            </div>
            <ul className="list-decimal ml-5 space-y-1">
                <li><strong>Prefixes:</strong> Select from dropdown (Mr, Mrs, Miss, Mx).</li>
                <li><strong>Full Name:</strong> Required field - Enter complete name.</li>
                <li><strong>Email Address:</strong> Required field - Must be valid email format.</li>
                <li><strong>Phone Number:</strong> Required field - Must be exactly 10 digits.</li>
                <li><strong>Assign to Employee:</strong> Select from dropdown - Required field.</li>
                <li><strong>Source of lead:</strong> Select from dropdown (Instagram, Facebook, etc.).</li>
                <li><strong>Lead Status:</strong> Select from dropdown (Hot, Cold).</li>
                <li><strong>Budget Range:</strong> Enter numeric values for Min and Max Budget.</li>
                <li><strong>Bedroom:</strong> Select from dropdown (2 BHK, 3 BHK).</li>
                <li><strong>Purpose:</strong> Select from dropdown (Enduse, Investment).</li>
                <li><strong>Funding:</strong> Select from dropdown (Selfloan, Bankloan).</li>
                <li><strong>Lead Age:</strong> Enter lead age in number of days.</li>
                <li><strong>Country/State/City:</strong> Must match existing records in database.</li>
                <li><strong>Pincode:</strong> Optional - Enter valid postal code.</li>
            </ul>

            <button
                className="mt-3 ml-auto items-end justify-end flex px-5 py-2 text-white text-xs bg-[#0083bf] rounded shadow cursor-pointer"
                onClick={downloadLeadTemplate}
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Download Lead Template"}
            </button>

            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage.message || errorMessage}</p>}
        </div>
    );
}

export default Excelleadstemplate;