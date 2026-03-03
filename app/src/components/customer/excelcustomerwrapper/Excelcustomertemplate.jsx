import React from 'react'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Button } from '@nayeshdaggula/tailify';

function Excelcustomertemplate({ closeDownloadTemplate }) {

    const downloadCustomerTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Customer Upload Template");

        const headers = [
            "Prefixes", // NEW
            "First Name",
            "Last Name",
            "Email Address",
            "Alternate Email Address",
            "Phone Number",
            "Gender", // NEW
            "Date of Birth",
            "Father Name",
            "Spouse Prefixes", // NEW
            "Spouse Name",
            "Marital Status",
            "Number of Children",
            "Wedding Aniversary",
            "Spouse DOB",
            "Pan Card No",
            "Aadhar Card No",
            "Country of Citizenship",
            "Country of Residence",
            "Mother Tongue",
            // "Name of Power of Attorney (POA) Holder",
            // "If POA Holder is Indian, specify status",
            // "Number of years residing at correspondence address",
            // "Number of years residing at city",
            // "Have you ever owned a Abode home / property?",
            // "If Yes, Project Name",
            "Address of Correspondence, Country",
            "Address of Correspondence, State",
            "Address of Correspondence, City",
            "Address of Correspondence, Address",
            "Address of Correspondence, Pincode",
            "Permanent Address, Country",
            "Permanent Address, State",
            "Permanent Address, City",
            "Permanent Address, Address",
            "Permanent Address, Pincode",
            "Current Designation",
            "Current Organization",
            "Organization Address",
            "Work Experience",
            "Annual Income",
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => {
            col.width = 25;
        });

        // Dropdown values
        const prefixes = ["Mr", "Mrs", "Miss", "Mx"];
        const gender = ["Male", "Female"];
        const maritalStatus = ["Single", "Married"];
        const ifPOAHolderIsIndian = ["Resident", "NRI"];
        const haveYouEverOwnedAbode = ["Yes", "No"];

        // Example row
        worksheet.addRow([
            "Mr",
            "ABC",
            "XYZ",
            "abcd@gmail.com",
            "wxyz@gmail.com",
            1234567890,
            "Male",
            "19-10-1997",
            "ABC",
            "Mrs",
            "XYZ",
            "Married",
            1,
            "19-10-2024",
            "20-10-1998",
            "XXXXX3456X",
            123456781234,
            "India",
            "India",
            "Telugu",
            // "XYZ",
            // "Resident",
            // 5,
            // 5,
            // "Yes",
            // "Abode Developers",
            "India",
            "Telangana",
            "Hyderabad",
            "Madhapur",
            500032,
            "India",
            "Telangana",
            "Hyderabad",
            "Madhapur",
            500032,
            "Software Engineer",
            "Abode Groups",
            "Abode Groups, Madhapur, Hyderabad",
            3,
            600000
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {
            // Prefixes → column A
            worksheet.getCell(`A${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${prefixes.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Prefix",
                error: "Please select Mr, Mrs, Miss, or Mx",
            };

            // Gender → column G
            worksheet.getCell(`G${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${gender.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Gender",
                error: "Please select Male or Female",
            };

            // Spouse Prefixes → column J
            worksheet.getCell(`J${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${prefixes.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Spouse Prefix",
                error: "Please select Mr, Mrs, Miss, or Mx",
            };

            // Marital Status → column L
            worksheet.getCell(`L${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${maritalStatus.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Marital Status",
                error: "Please select Single or Married",
            };

            // POA Holder Status → column V
            // worksheet.getCell(`V${i}`).dataValidation = {
            //     type: "list",
            //     allowBlank: true,
            //     formulae: [`"${ifPOAHolderIsIndian.join(",")}"`],
            //     showErrorMessage: true,
            //     errorStyle: "error",
            //     errorTitle: "Invalid POA Holder Status",
            //     error: "Please select Resident or NRI",
            // };

            // Owned Abode Property → column Y
            // worksheet.getCell(`Y${i}`).dataValidation = {
            //     type: "list",
            //     allowBlank: true,
            //     formulae: [`"${haveYouEverOwnedAbode.join(",")}"`],
            //     showErrorMessage: true,
            //     errorStyle: "error",
            //     errorTitle: "Invalid Owned Property Option",
            //     error: "Please select Yes or No",
            // };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "customer_upload_template.xlsx");
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
                    <li><span className="font-semibold text-gray-700">Prefixes:</span> Select from dropdown → Mr, Mrs, Miss, Mx.</li>
                    <li><span className="font-semibold text-gray-700">Gender:</span> Select from dropdown → Male, Female.</li>
                    <li><span className="font-semibold text-gray-700">Spouse Prefixes:</span> Select from dropdown → Mr, Mrs, Miss, Mx.</li>
                    <li><span className="font-semibold text-gray-700">Marital Status:</span> Select from dropdown → Single, Married.</li>
                    {/* <li><span className="font-semibold text-gray-700">If POA Holder is Indian, specify status:</span> Select from dropdown → Resident, NRI.</li> */}
                    {/* <li><span className="font-semibold text-gray-700">Have you ever owned a Abode home / property?:</span> Select from dropdown → Yes, No.</li> */}
                    <li><span className="font-semibold text-gray-700">Date Fields:</span> (Date of Birth, Wedding Anniversary, Spouse DOB) Enter in <code>DD-MM-YYYY</code> format.</li>
                </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <button
                    className="w-full flex justify-center items-center gap-2 px-5 py-2.5 text-white text-sm font-medium bg-[#0083bf] hover:bg-[#006e9e] rounded-md shadow-sm transition-all duration-200 cursor-pointer"
                    onClick={downloadCustomerTemplate}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Customer Template
                </button>
            </div>
        </div>
    );
}

export default Excelcustomertemplate;
