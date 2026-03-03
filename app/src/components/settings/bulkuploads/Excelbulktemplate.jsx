import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "@nayeshdaggula/tailify";
import Projectapi from "../../api/Projectapi.jsx";
import GroupOwnerapi from "../../api/Groupownerapi.jsx";
import dayjs from "dayjs";

function ExcelGlobalTemplate({ closeDownloadTemplate }) {
    const [blocksData, setBlocksData] = useState([]);
    const [groupOwnerData, setGroupOwnerData] = useState([]);

    async function getBlocksData() {
        try {
            const response = await Projectapi.get("get-blocks-names");
            setBlocksData(response.data?.blocks || []);
        } catch (err) {
            console.error("Error fetching blocks:", err);
        }
    }

    async function getGroupOwnerData() {
        try {
            const response = await GroupOwnerapi.get("get-group-owners-names");
            setGroupOwnerData(response.data?.data || []);
        } catch (err) {
            console.error("Error fetching group owners:", err);
        }
    }

    useEffect(() => {
        getBlocksData();
        getGroupOwnerData();
    }, []);

    const downloadGlobalTemplate = async () => {
        const workbook = new ExcelJS.Workbook();

        /**
         * =========================
         * 1️⃣ Flat Upload Template
         * =========================
         */
        const flatSheet = workbook.addWorksheet("Flat Template");

        const flatHeaders = [
            "Flat No",
            "Floor No",
            "Block",
            "Group/Owner",
            "Mortgage",
            "Area(Sq.ft.)",
            "UDL",
            "Deed No",
            "Flat Type",
            "Bedrooms",
            "Bathrooms",
            "Balconies",
            "Parking Area(Sq.ft.)",
            "Facing",
            "East Facing View",
            "West Facing View",
            "North Facing View",
            "South Facing View",
            "Corner",
            // "Floor Rise",
            "Furnishing Status",
            "Google Map Link",
            "Description",
        ];

        flatSheet.addRow(flatHeaders);
        flatSheet.getRow(1).font = { bold: true };
        flatSheet.columns.forEach((col) => (col.width = 25));

        // Example dropdown options
        const flatTypes = ["Studio", "1 BHK", "2 BHK", "3 BHK", "Penthouse", "Duplex"];
        const yesNoOptions = ["Yes", "No"];
        const facingOptions = ["North", "South", "East", "West"];
        const furnishingOptions = ["Furnished", "SemiFurnished", "Unfurnished"];

        // Hidden Block sheet
        const blockSheet = workbook.addWorksheet("BlockList");
        blocksData.forEach((b, idx) => (blockSheet.getCell(`A${idx + 1}`).value = b.name));
        blockSheet.state = "veryHidden";

        // Hidden GroupOwner sheet
        const groupOwnerSheet = workbook.addWorksheet("GroupOwnerList");
        groupOwnerData.forEach((g, idx) => (groupOwnerSheet.getCell(`A${idx + 1}`).value = g.name));
        groupOwnerSheet.state = "veryHidden";

        const floorNoSheet = workbook.addWorksheet('FloorNoList');
        for (let i = 1; i <= 100; i++) {
            floorNoSheet.getCell(`A${i}`).value = i;
        }
        floorNoSheet.state = 'veryHidden';


        // Sample row
        flatSheet.addRow([
            "101",
            { formula: "FloorNoList!A1" },
            blocksData[0]?.name || "",
            groupOwnerData[0]?.name || "",
            "Yes",
            "1200",
            "UDL001",
            "Deed001",
            flatTypes[0],
            "2",
            "2",
            "1",
            "100",
            facingOptions[0],
            "Park View",
            "City View",
            "Garden View",
            "Road View",
            "Yes",
            // "Yes",
            furnishingOptions[0],
            "Map Link",
            "Sample description",
        ]);

        const flatRowCount = 5000;
        for (let i = 2; i <= flatRowCount; i++) {

            flatSheet.getCell(`B${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`FloorNoList!$A$1:$A$100`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Floor No',
                error: 'Please select a valid Floor No (1-100).',
            };

            flatSheet.getCell(`C${i}`).dataValidation = {
                type: "list",
                formulae: [`BlockList!$A$1:$A$${blocksData.length}`],
            };
            flatSheet.getCell(`D${i}`).dataValidation = {
                type: "list",
                formulae: [`GroupOwnerList!$A$1:$A$${groupOwnerData.length}`],
            };
            flatSheet.getCell(`E${i}`).dataValidation = {
                type: "list",
                formulae: [`"${yesNoOptions.join(",")}"`],
            };
            flatSheet.getCell(`I${i}`).dataValidation = {
                type: "list",
                formulae: [`"${flatTypes.join(",")}"`],
            };
            flatSheet.getCell(`N${i}`).dataValidation = {
                type: "list",
                formulae: [`"${facingOptions.join(",")}"`],
            };
            flatSheet.getCell(`S${i}`).dataValidation = {
                type: "list",
                formulae: [`"${yesNoOptions.join(",")}"`],
            };
            // flatSheet.getCell(`T${i}`).dataValidation = {
            //     type: "list",
            //     formulae: [`"${yesNoOptions.join(",")}"`],
            // };
            flatSheet.getCell(`T${i}`).dataValidation = {
                type: "list",
                formulae: [`"${furnishingOptions.join(",")}"`],
            };
        }

        /**
         * =========================
         * 2️⃣ Customer Upload Template
         * =========================
         */
        const customerSheet = workbook.addWorksheet("Customer Template");

        const customerHeaders = [
            "Prefixes",
            "First Name",
            "Last Name",
            "Email Address",
            "Alternate Email Address",
            "Phone Number",
            "Gender",
            "Date of Birth",
            "Father Name",
            "Spouse Prefixes",
            "Spouse Name",
            "Marital Status",
            "Number of Children",
            "Wedding Anniversary",
            "Spouse DOB",
            "Pan Card No",
            "Aadhar Card No",
            "Country of Citizenship",
            "Country of Residence",
            "Mother Tongue",
            "Name of POA Holder",
            "If POA Holder is Indian, specify status",
            "Years at correspondence address",
            "Years at city",
            "Owned Abode property?",
            "If Yes, Project Name",
            "Correspondence Country",
            "Correspondence State",
            "Correspondence City",
            "Correspondence Address",
            "Correspondence Pincode",
            "Permanent Country",
            "Permanent State",
            "Permanent City",
            "Permanent Address",
            "Permanent Pincode",
            "Designation",
            "Organization",
            "Organization Address",
            "Work Experience",
            "Annual Income",
        ];

        customerSheet.addRow(customerHeaders);
        customerSheet.getRow(1).font = { bold: true };
        customerSheet.columns.forEach((col) => (col.width = 25));

        const prefixes = ["Mr", "Mrs", "Miss", "Mx"];
        const gender = ["Male", "Female"];
        const maritalStatus = ["Single", "Married"];
        const poaStatus = ["Resident", "NRI"];
        const ownedAbode = ["Yes", "No"];

        // Sample row
        customerSheet.addRow([
            "Mr",
            "ABC",
            "XYZ",
            "abc@gmail.com",
            "xyz@gmail.com",
            "9876543210",
            "Male",
            "19-10-1997",
            "Father Name",
            "Mrs",
            "Spouse Name",
            "Married",
            1,
            "19-10-2024",
            "20-10-1998",
            "XXXXX1234X",
            "123412341234",
            "India",
            "India",
            "Telugu",
            "POA Name",
            "Resident",
            5,
            5,
            "Yes",
            "Project Name",
            "India",
            "Telangana",
            "Hyderabad",
            "Address",
            "500032",
            "India",
            "Telangana",
            "Hyderabad",
            "Address",
            "500032",
            "Software Engineer",
            "Abode Groups",
            "Address",
            3,
            600000,
        ]);

        const custRowCount = 5000;
        for (let i = 2; i <= custRowCount; i++) {
            customerSheet.getCell(`A${i}`).dataValidation = {
                type: "list",
                formulae: [`"${prefixes.join(",")}"`],
            };
            customerSheet.getCell(`G${i}`).dataValidation = {
                type: "list",
                formulae: [`"${gender.join(",")}"`],
            };
            customerSheet.getCell(`J${i}`).dataValidation = {
                type: "list",
                formulae: [`"${prefixes.join(",")}"`],
            };
            customerSheet.getCell(`L${i}`).dataValidation = {
                type: "list",
                formulae: [`"${maritalStatus.join(",")}"`],
            };
            customerSheet.getCell(`V${i}`).dataValidation = {
                type: "list",
                formulae: [`"${poaStatus.join(",")}"`],
            };
            customerSheet.getCell(`Y${i}`).dataValidation = {
                type: "list",
                formulae: [`"${ownedAbode.join(",")}"`],
            };
        }

        /**
     * =========================
     * 3️⃣ Assign Flat Template
     * =========================
     */
        const assignFlatSheet = workbook.addWorksheet("Assign Flat Template");

        const assignFlatHeaders = [
            "Flat No",
            "Block",
            "Customer",
            "Customer Email",
            "Application Date",
            "Saleable Area (sq.ft.) (₹)", // F
            "Rate Per Sq.ft (₹)",        // G
            "Discount Rate Per Sq.ft (₹)", // H
            "Base Cost of the Unit (₹)", // I
            "Floor Rise Charge Per Sq.ft (₹)", // J
            "Total Charge of Floor Rise (₹)",  // K
            "East Facing Charge Per Sq.ft (₹)", // L
            "Total Charge of East Facing (₹)",  // M
            "Corner Charge Per Sq.ft (₹)",      // N
            "Total Charge of Corner (₹)",       // O
            "Amenities (₹)",   // P
            "Total Cost of Unit (₹)", // Q
            "GST (5%) (₹)", // R
            "Cost of Unit with Tax (₹)", // S
            "Registration @ 7.6% + 1050/- (₹)", // T
            "Maintenance @3/- per sqft for 2 Yrs (₹)", // U
            "Documentation Fee (₹)", // V
            "Corpus Fund (₹)", // W
            "Grand Total (₹)",
        ];

        assignFlatSheet.addRow(assignFlatHeaders);
        assignFlatSheet.getRow(1).font = { bold: true };
        assignFlatSheet.columns.forEach((col) => (col.width = 28));

        // Sample Row
        assignFlatSheet.addRow([
            "100",
            blocksData[0]?.name || "",
            "xxxx",
            "xxxx@gmail.com",
            dayjs(new Date()).format("DD-MM-YYYY"),
            1200,   // Saleable Area
            4500,   // Rate Per Sq.ft
            200,    // Discount Rate
            null,   // Formula will fill Base Cost
            50,     // Floor Rise Per Sq.ft
            null,   // Formula for Total Floor Rise
            100,    // East Facing Per Sq.ft
            null,   // Formula for Total East Facing
            75,     // Corner Per Sq.ft
            null,   // Formula for Total Corner
            200000, // Amenities
            null,   // Formula for Total Cost
            null,   // Formula for GST
            null,   // Formula for Cost With Tax
            null,   // Formula for Registration
            null,   // Formula for Maintenance
            20000,  // Documentation Fee
            null,   // Formula for Corpus Fund
            null,
        ]);

        const assignRowCount = 5000;
        for (let i = 2; i <= assignRowCount; i++) {
            // Apply dropdown for Block
            assignFlatSheet.getCell(`B${i}`).dataValidation = {
                type: "list",
                formulae: [`BlockList!$A$1:$A$${blocksData.length}`],
            };

            // Condition: only apply formulas if Block (B) and Saleable Area (F) are given
            const cond = `AND($B${i}<>"",$F${i}<>"")`;

            // 1. Base Cost = (F * G) - (F * H)
            assignFlatSheet.getCell(`I${i}`).value = {
                formula: `IF(${cond},F${i}*G${i}-(F${i}*H${i}),"")`,
            };

            // 2. Total Floor Rise = J * F
            assignFlatSheet.getCell(`K${i}`).value = {
                formula: `IF(${cond},J${i}*F${i},"")`,
            };

            // 3. Total East Facing = L * F
            assignFlatSheet.getCell(`M${i}`).value = {
                formula: `IF(${cond},L${i}*F${i},"")`,
            };

            // 4. Total Corner = N * F
            assignFlatSheet.getCell(`O${i}`).value = {
                formula: `IF(${cond},N${i}*F${i},"")`,
            };

            // 5. Total Cost = I + K + M + O + P
            assignFlatSheet.getCell(`Q${i}`).value = {
                formula: `IF(${cond},I${i}+K${i}+M${i}+O${i}+P${i},"")`,
            };

            // 6. GST = Q * 0.05
            assignFlatSheet.getCell(`R${i}`).value = {
                formula: `IF(${cond},Q${i}*0.05,"")`,
            };

            // 7. Cost With Tax = Q + R
            assignFlatSheet.getCell(`S${i}`).value = {
                formula: `IF(${cond},Q${i}+R${i},"")`,
            };

            // 8. Registration = (Q * 0.076) + 1050
            assignFlatSheet.getCell(`T${i}`).value = {
                formula: `IF(${cond},(Q${i}*0.076)+1050,"")`,
            };

            // 9. Maintenance = F * 3 * 24
            assignFlatSheet.getCell(`U${i}`).value = {
                formula: `IF(${cond},F${i}*3*24,"")`,
            };

            // 10. Corpus Fund = F * 50
            assignFlatSheet.getCell(`W${i}`).value = {
                formula: `IF(${cond},F${i}*50,"")`,
            };

            // 11. Grand Total = Q + R + T + U + V + W
            assignFlatSheet.getCell(`X${i}`).value = {
                formula: `IF(${cond},Q${i}+R${i}+T${i}+U${i}+V${i}+W${i},"")`,
            };
        }


        /**
         * =========================
         * 3️⃣ Payment Upload Template
         * =========================
         */
        const paymentSheet = workbook.addWorksheet("Payment Template");

        const paymentHeaders = [
            "Amount",
            "Payment Type",
            "Payment Towards",
            "Payment Method",
            "Bank",
            "Date of Payment",
            "Transaction Id",
            "Flat No",
            "Block",
            "Comment",
        ];

        paymentSheet.addRow(paymentHeaders);
        paymentSheet.getRow(1).font = { bold: true };
        paymentSheet.columns.forEach((col) => (col.width = 25));

        const paymentTypes = ["Customer Pay", "Loan Pay"];
        const paymentTowards = ["Flat", "GST", "Corpus fund", "Registration", "TDS", "Maintenance"];
        const paymentMethods = [
            "DD",
            "UPI",
            "Bank Deposit",
            "Cheque",
            "Online Transfer (IMPS, NFT)",
        ];

        // Sample row
        paymentSheet.addRow([
            "10000",
            paymentTypes[0],
            paymentTowards[0],
            paymentMethods[0],
            "SBI",
            dayjs(new Date()).format("DD-MM-YYYY"),
            "ABCDEFGH123456",
            "101",
            blocksData[0]?.name || "",
        ]);

        const payRowCount = 5000;
        for (let i = 2; i <= payRowCount; i++) {
            paymentSheet.getCell(`B${i}`).dataValidation = {
                type: "list",
                formulae: [`"${paymentTypes.join(",")}"`],
            };
            paymentSheet.getCell(`C${i}`).dataValidation = {
                type: "list",
                formulae: [`"${paymentTowards.join(",")}"`],
            };
            paymentSheet.getCell(`D${i}`).dataValidation = {
                type: "list",
                formulae: [`"${paymentMethods.join(",")}"`],
            };
            paymentSheet.getCell(`I${i}`).dataValidation = {
                type: "list",
                formulae: [`BlockList!$A$1:$A$${blocksData.length}`],
            };
        }

        /**
         * =========================
         * Export file
         * =========================
         */
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Global_Template.xlsx");
        closeDownloadTemplate();
    };

    return (
        <div className="text-sm space-y-2 p-4">
            <div className="w-full flex justify-between items-center">
                <div className="font-semibold">Guidelines:</div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="default">
                    Close
                </Button>
            </div>
            <p className="text-gray-600">
                This template contains three tabs: <b>Flat</b>, <b>Customer</b>, <b>Assigning Flat</b>, and <b>Payment</b>.
            </p>
            <button
                className="mt-3 ml-auto flex px-5 py-2 text-white text-xs bg-[#0083bf] rounded shadow cursor-pointer"
                onClick={downloadGlobalTemplate}
            >
                Download Global Template
            </button>
        </div>
    );
}

export default ExcelGlobalTemplate;
