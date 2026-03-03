import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import React, { useEffect, useState } from 'react'
import { Button } from '@nayeshdaggula/tailify';
import Projectapi from "../../api/Projectapi.jsx";
import GroupOwnerapi from "../../api/Groupownerapi.jsx";

function Excelflattemplate({ closeDownloadTemplate }) {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [blocksData, setBlocksData] = useState([]);
    const [groupOwnerData, setGroupOwnerData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);

    async function getBlocksData() {
        setIsLoading(true);

        Projectapi.get("get-blocks-names", {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                    setBlocksData(null);
                } else {
                    setBlocksData(data?.blocks || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                });
                setBlocksData(null);
                setIsLoading(false);
            });
    }

    async function getGroupOwnerData() {
        setIsLoading(true);

        GroupOwnerapi.get("get-group-owners-names", {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                    setGroupOwnerData(null);
                } else {
                    setGroupOwnerData(data?.data || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                });
                setGroupOwnerData(null);
                setIsLoading(false);
            });
    }

    async function getProjectsData() {
        setIsLoading(true);

        Projectapi.get("get-all-projects", {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                    setProjectsData([]);
                } else {
                    setProjectsData(data?.data || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                });
                setProjectsData([]);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getBlocksData();
        getGroupOwnerData();
        getProjectsData();
    }, []);

    console.log("Blocks Data", blocksData)

    const downloadFlatTemplate = async () => {

        if (!blocksData || blocksData.length === 0) {
            setErrorMessage("No Blocks available. Please add blocks before downloading.");
            return;
        }

        setErrorMessage("");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Flat Upload Template");

        const headers = [
            "Project",
            "Flat No",
            "Floor No",
            "Block",
            // "Group/Owner",
            "Mortgage",
            "Area(Sq.ft.)",
            // "UDL",
            // "Deed No",
            "Flat Type",
            // "Bedrooms",
            // "Bathrooms",
            // "Balconies",
            // "Parking Area(Sq.ft.)",
            "Facing",
            "East Facing View",
            "West Facing View",
            "North Facing View",
            "South Facing View",
            "Corner",
            // "Floor Rise",
            // "Furnishing Status",
            // "Google Map Link",
            // "Description",
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => { col.width = 25 });

        // Dropdown options
        const flatTypes = [
            { value: "2 BHK", label: "2 BHK" },
            { value: "3 BHK", label: "3 BHK" },
        ];


        const mortgageOptions = [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ];

        const facingOptions = [
            { value: "North", label: "North" },
            { value: "South", label: "South" },
            { value: "East", label: "East" },
            { value: "West", label: "West" },
            { value: "NorthEast", label: "NorthEast" },
            { value: "NorthWest", label: "NorthWest" },
            { value: "SouthEast", label: "SouthEast" },
            { value: "SouthWest", label: "SouthWest" },
        ];

        const yesNoOptions = [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ];

        const furnishingOptions = [
            { value: "Furnished", label: "Furnished" },
            { value: "SemiFurnished", label: "SemiFurnished" },
            { value: "Unfurnished", label: "Unfurnished" },
        ];

        // Hidden Project sheet
        const projectSheet = workbook.addWorksheet('ProjectList');
        projectsData.forEach((ele, index) => {
            projectSheet.getCell(`A${index + 1}`).value = ele.project_name;
        });
        projectSheet.state = 'veryHidden';

        // Hidden Block sheet
        const blockSheet = workbook.addWorksheet('BlockList');
        blocksData.forEach((ele, index) => {
            blockSheet.getCell(`A${index + 1}`).value = ele.name;
        });
        blockSheet.state = 'veryHidden';

        // Hidden Group Owner sheet
        const groupOwnerSheet = workbook.addWorksheet('GroupOwnerList');
        groupOwnerData.forEach((ele, index) => {
            groupOwnerSheet.getCell(`A${index + 1}`).value = ele.name;
        });
        groupOwnerSheet.state = 'veryHidden';

        // Hidden Floor No sheet (1–100)
        const floorNoSheet = workbook.addWorksheet('FloorNoList');
        for (let i = 1; i <= 100; i++) {
            floorNoSheet.getCell(`A${i}`).value = i;
        }
        floorNoSheet.state = 'veryHidden';

        // Sample row
        worksheet.addRow([
            projectsData[0]?.project_name || "", // Project
            "101",                        // Flat No (dummy)
            { formula: "FloorNoList!A1" },                          // Floor No (dummy)
            blocksData[0]?.name || "",    // Block
            // groupOwnerData[0]?.name || "",// Group/Owner
            mortgageOptions[0].label,     // Mortgage (Yes)
            "1200",                       // Area
            // "UDL001",                     // UDL
            // "Deed001",                    // Deed No
            flatTypes[0].label,           // Flat Type
            // "2",                          // Bedrooms
            // "2",                          // Bathrooms
            // "1",                          // Balconies
            // "100",                        // Parking Area
            facingOptions[0].label,       // Facing
            "Park View",                  // East Facing View
            "City View",                  // West Facing View
            "Garden View",                // North Facing View
            "Road View",                  // South Facing View
            yesNoOptions[0].label,        // Corner
            // yesNoOptions[0].label,        // Floor Rise
            // furnishingOptions[0].label,   // Furnishing
            // "Map Link",
            // "Sample flat description",    // Description
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {

            // ✅ Project (Column A)
            worksheet.getCell(`A${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`ProjectList!$A$1:$A$${projectsData.length || 1}`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Project',
                error: 'Please select a valid Project from the dropdown list.',
            };

            // ✅ Floor No (Column C)
            worksheet.getCell(`C${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`FloorNoList!$A$1:$A$100`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Floor No',
                error: 'Please select a valid Floor No (1-100).',
            };

            // ✅ Block (Column D)
            worksheet.getCell(`D${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`BlockList!$A$1:$A$${blocksData.length}`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Block',
                error: 'Please select a valid Block from the dropdown list.',
            };

            // ✅ Mortgage (Column E)
            worksheet.getCell(`E${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${mortgageOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Mortgage Option",
                error: "Please select Yes or No.",
            };

            // ✅ Flat Type (Column G)
            worksheet.getCell(`G${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${flatTypes.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Flat Type",
                error: "Please select a valid flat type.",
            };

            // ✅ Facing (Column H)
            worksheet.getCell(`H${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${facingOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Facing Option",
                error: "Please select a valid facing option.",
            };

            // ✅ Corner (Column M)
            worksheet.getCell(`M${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${yesNoOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Corner Option",
                error: "Please select Yes or No.",
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "flat_Upload_Template.xlsx");
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
                    <li><span className="font-semibold text-gray-700">Project:</span> Select from the dropdown menu.</li>
                    <li><span className="font-semibold text-gray-700">Block:</span> Select from the dropdown menu.</li>
                    <li><span className="font-semibold text-gray-700">Floor No:</span> Select a value between <strong>1–100</strong>.</li>
                    <li><span className="font-semibold text-gray-700">Flat Type:</span> e.g., Studio, 1 BHK, 2 BHK.</li>
                    <li><span className="font-semibold text-gray-700">Facing:</span> e.g., East, West, North, South.</li>
                    <li><span className="font-semibold text-gray-700">Mortgage:</span> Select Yes or No.</li>
                    <li><span className="font-semibold text-gray-700">Corner:</span> Select Yes or No.</li>
                </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <button
                    className="w-full flex justify-center items-center gap-2 px-5 py-2.5 text-white text-sm font-medium bg-[#0083bf] hover:bg-[#006e9e] rounded-md shadow-sm transition-all duration-200 cursor-pointer"
                    onClick={downloadFlatTemplate}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Excel Template
                </button>
                {errorMessage && (
                    <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md border border-red-100 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Excelflattemplate;
