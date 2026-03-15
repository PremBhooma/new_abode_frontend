import React, { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Button } from '@nayeshdaggula/tailify';
import Projectapi from '../../api/Projectapi.jsx';
import GroupOwnerapi from '../../api/Groupownerapi.jsx';
import Generalapi from '../../api/Generalapi.jsx';
import dayjs from 'dayjs';

function ExcelGlobalTemplate({ closeDownloadTemplate }) {
    const [blocksData, setBlocksData] = useState([]);
    const [groupOwnerData, setGroupOwnerData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        // Projects — uses data.data + project_name (same as individual templates)
        Projectapi.get('get-all-projects')
            .then(res => setProjectsData(res.data?.data || []))
            .catch(err => console.error('Error fetching projects:', err));

        // All blocks
        Projectapi.get('get-blocks-names')
            .then(res => setBlocksData(res.data?.blocks || []))
            .catch(err => console.error('Error fetching blocks:', err));

        // Group owners
        GroupOwnerapi.get('get-group-owners-names')
            .then(res => setGroupOwnerData(res.data?.data || []))
            .catch(err => console.error('Error fetching group owners:', err));

        // Banks
        Generalapi.get('/get-all-banks-list?limit=1000')
            .then(res => { if (res.data?.status === 'success') setBankList(res.data?.data || []); })
            .catch(err => console.error('Error fetching banks:', err));
    }, []);

    const downloadGlobalTemplate = async () => {
        setIsDownloading(true);
        const workbook = new ExcelJS.Workbook();

        const pLen = projectsData.length || 1;
        const bLen = blocksData.length || 1;

        // ─── Hidden: ProjectList ───────────────────────────────────────
        const projectListSheet = workbook.addWorksheet('ProjectList');
        projectsData.forEach((p, idx) => (projectListSheet.getCell(`A${idx + 1}`).value = p.project_name));
        projectListSheet.state = 'veryHidden';

        // ─── Hidden: ProjectRates (for VLOOKUP in Assign Flat) ────────
        // Cols: A=project_name, B=floor_rise, C=east_price, D=corner_price,
        //       E=gst%, F=reg%, G=reg_base, H=maint_rate/sqft, I=maint_months,
        //       J=corpus_fund/sqft, K=doc_fee, L=manjeera_conn, M=manjeera_meter
        const projectRatesSheet = workbook.addWorksheet('ProjectRates');
        projectsData.forEach((p, idx) => {
            const r = idx + 1;
            projectRatesSheet.getCell(`A${r}`).value = p.project_name;
            projectRatesSheet.getCell(`B${r}`).value = parseFloat(p.project_six_floor_onwards_price) || 0;
            projectRatesSheet.getCell(`C${r}`).value = parseFloat(p.project_east_price) || 0;
            projectRatesSheet.getCell(`D${r}`).value = parseFloat(p.project_corner_price) || 0;
            projectRatesSheet.getCell(`E${r}`).value = parseFloat(p.gst_percentage) || 5;
            projectRatesSheet.getCell(`F${r}`).value = parseFloat(p.registration_percentage) || 7.6;
            projectRatesSheet.getCell(`G${r}`).value = parseFloat(p.registration_base_charge) || 1050;
            projectRatesSheet.getCell(`H${r}`).value = parseFloat(p.maintenance_rate_per_sqft) || 3;
            projectRatesSheet.getCell(`I${r}`).value = parseFloat(p.maintenance_duration_months) || 24;
            projectRatesSheet.getCell(`J${r}`).value = parseFloat(p.corpus_fund) || 50;
            projectRatesSheet.getCell(`K${r}`).value = parseFloat(p.documentation_fee) || 0;
            projectRatesSheet.getCell(`L${r}`).value = parseFloat(p.manjeera_connection_charges) || 0;
            projectRatesSheet.getCell(`M${r}`).value = parseFloat(p.manjeera_meter_charges) || 0;
        });
        projectRatesSheet.state = 'veryHidden';

        // ─── Hidden: BlockList ─────────────────────────────────────────
        const blockSheet = workbook.addWorksheet('BlockList');
        blocksData.forEach((b, idx) => (blockSheet.getCell(`A${idx + 1}`).value = b.name));
        blockSheet.state = 'veryHidden';

        // ─── Hidden: GroupOwnerList ────────────────────────────────────
        const groupOwnerSheet = workbook.addWorksheet('GroupOwnerList');
        groupOwnerData.forEach((g, idx) => (groupOwnerSheet.getCell(`A${idx + 1}`).value = g.name));
        groupOwnerSheet.state = 'veryHidden';

        // ─── Hidden: FloorNoList (1–100) ───────────────────────────────
        const floorNoSheet = workbook.addWorksheet('FloorNoList');
        for (let i = 1; i <= 100; i++) floorNoSheet.getCell(`A${i}`).value = i;
        floorNoSheet.state = 'veryHidden';

        // ─── Hidden: BankList ──────────────────────────────────────────
        const bankSheet = workbook.addWorksheet('BankList');
        bankList.forEach((b, idx) => (bankSheet.getCell(`A${idx + 1}`).value = b.name));
        bankSheet.state = 'veryHidden';

        // ══════════════════════════════════════════════════════════════
        // SHEET 1: Flat Template  (matches Excelflattemplate.jsx)
        // Cols: A=Project, B=Flat No, C=Floor No, D=Block, E=Area,
        //       F=Flat Type, G=Facing, H=East View, I=West View,
        //       J=North View, K=South View, L=Corner, M=Flat Reward
        // ══════════════════════════════════════════════════════════════
        const flatSheet = workbook.addWorksheet('Flat Template');
        flatSheet.addRow([
            'Project', 'Flat No', 'Floor No', 'Block', 'Area(Sq.ft.)',
            'Flat Type', 'Facing',
            'East Facing View', 'West Facing View', 'North Facing View', 'South Facing View',
            'Corner', 'Flat Reward',
        ]);
        flatSheet.getRow(1).font = { bold: true };
        flatSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
        flatSheet.columns.forEach(col => (col.width = 25));

        const flatTypes = ['2 BHK', '3 BHK'];
        const facingOptions = ['North', 'South', 'East', 'West', 'NorthEast', 'NorthWest', 'SouthEast', 'SouthWest'];
        const yesNoOptions = ['Yes', 'No'];

        // Sample row
        flatSheet.addRow([
            projectsData[0]?.project_name || '', '101', '1',
            blocksData[0]?.name || '', '1200', flatTypes[0], 'East',
            'Park View', 'City View', 'Garden View', 'Road View', 'Yes', 'Yes',
        ]);

        for (let i = 2; i <= 5000; i++) {
            flatSheet.getCell(`A${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`ProjectList!$A$1:$A$${pLen}`],
                showErrorMessage: true, errorTitle: 'Invalid Project', error: 'Please select a valid Project.',
            };
            flatSheet.getCell(`C${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`FloorNoList!$A$1:$A$100`],
                showErrorMessage: true, errorTitle: 'Invalid Floor No', error: 'Please select a valid Floor No (1-100).',
            };
            flatSheet.getCell(`D${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`BlockList!$A$1:$A$${bLen}`],
                showErrorMessage: true, errorTitle: 'Invalid Block', error: 'Please select a valid Block.',
            };
            flatSheet.getCell(`F${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${flatTypes.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Flat Type', error: 'Please select a valid Flat Type.',
            };
            flatSheet.getCell(`G${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${facingOptions.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Facing', error: 'Please select a valid Facing.',
            };
            flatSheet.getCell(`L${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${yesNoOptions.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Corner', error: 'Please select Yes or No.',
            };
            flatSheet.getCell(`M${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${yesNoOptions.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Flat Reward', error: 'Please select Yes or No.',
            };
        }

        // ══════════════════════════════════════════════════════════════
        // SHEET 2: Customer Template  (matches Excelcustomertemplate.jsx)
        // Cols: A=Project, B=Prefixes, C=First Name, D=Last Name, E=Email,
        //       F=Alt Email, G=Phone, H=Gender, I=DOB, J=Father Name,
        //       K=Spouse Prefixes, L=Spouse Name, M=Marital Status,
        //       N=No.Children, O=Wedding Ann, P=Spouse DOB,
        //       Q=PAN, R=Aadhar, S=Country of Citizenship, T=Country of Residence,
        //       U=Mother Tongue,
        //       V=Corr Country, W=Corr State, X=Corr City, Y=Corr Address, Z=Corr Pincode,
        //       AA=Perm Country, AB=Perm State, AC=Perm City, AD=Perm Address, AE=Perm Pincode,
        //       AF=Designation, AG=Organization, AH=Org Address, AI=Work Exp, AJ=Annual Income
        // ══════════════════════════════════════════════════════════════
        const customerSheet = workbook.addWorksheet('Customer Template');
        customerSheet.addRow([
            'Project', 'Prefixes', 'First Name', 'Last Name', 'Email Address',
            'Alternate Email Address', 'Phone Number', 'Gender', 'Date of Birth',
            'Father Name', 'Spouse Prefixes', 'Spouse Name', 'Marital Status',
            'Number of Children', 'Wedding Aniversary', 'Spouse DOB',
            'Pan Card No', 'Aadhar Card No', 'Country of Citizenship',
            'Country of Residence', 'Mother Tongue',
            'Address of Correspondence, Country', 'Address of Correspondence, State',
            'Address of Correspondence, City', 'Address of Correspondence, Address',
            'Address of Correspondence, Pincode',
            'Permanent Address, Country', 'Permanent Address, State',
            'Permanent Address, City', 'Permanent Address, Address',
            'Permanent Address, Pincode',
            'Current Designation', 'Current Organization', 'Organization Address',
            'Work Experience', 'Annual Income',
        ]);
        customerSheet.getRow(1).font = { bold: true };
        customerSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
        customerSheet.columns.forEach(col => (col.width = 25));

        const prefixes = ['Mr', 'Mrs', 'Miss', 'Mx'];
        const gender = ['Male', 'Female'];
        const maritalStatus = ['Single', 'Married'];

        // Sample row
        customerSheet.addRow([
            projectsData[0]?.project_name || '',
            'Mr', 'ABC', 'XYZ', 'abc@gmail.com', 'xyz@gmail.com', '9876543210',
            'Male', '19-10-1997', 'Father Name', 'Mrs', 'Spouse Name', 'Married',
            1, '19-10-2024', '20-10-1998', 'XXXXX1234X', '123412341234',
            'India', 'India', 'Telugu',
            'India', 'Telangana', 'Hyderabad', 'Address', '500032',
            'India', 'Telangana', 'Hyderabad', 'Address', '500032',
            'Software Engineer', 'Abode Groups', 'Address', 3, 600000,
        ]);

        for (let i = 2; i <= 5000; i++) {
            customerSheet.getCell(`A${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`ProjectList!$A$1:$A$${pLen}`],
                showErrorMessage: true, errorTitle: 'Invalid Project', error: 'Please select a valid Project.',
            };
            customerSheet.getCell(`B${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${prefixes.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Prefix', error: 'Please select Mr, Mrs, Miss, or Mx.',
            };
            customerSheet.getCell(`H${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${gender.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Gender', error: 'Please select Male or Female.',
            };
            customerSheet.getCell(`K${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${prefixes.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Spouse Prefix', error: 'Please select Mr, Mrs, Miss, or Mx.',
            };
            customerSheet.getCell(`M${i}`).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`"${maritalStatus.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Marital Status', error: 'Please select Single or Married.',
            };
        }

        // ══════════════════════════════════════════════════════════════
        // SHEET 3: Assign Flat Template  (project-based dynamic pricing)
        // Cols:
        //   A=Project, B=Flat No, C=Block, D=Customer Phone,
        //   E=Booking Date, F=Saleable Area, G=Rate Per Sqft, H=Discount Rate,
        //   I=Base Cost (formula: F*G - F*H)
        //   J=Floor Rise Per Sqft (VLOOKUP → col B of ProjectRates)
        //   K=Total Floor Rise (formula: J*F)
        //   L=East Facing Per Sqft (VLOOKUP → col C)
        //   M=Total East Facing (formula: L*F)
        //   N=Corner Per Sqft (VLOOKUP → col D)
        //   O=Total Corner (formula: N*F)
        //   P=Amenities
        //   Q=Total Cost of Unit (formula: I+K+M+O+P)
        //   R=GST (formula: Q * VLOOKUP(gst%) / 100)
        //   S=Cost With Tax (formula: Q+R)
        //   T=Registration (formula: Q*VLOOKUP(reg%)/100 + VLOOKUP(reg_base))
        //   U=Maintenance (formula: F * VLOOKUP(maint_rate) * VLOOKUP(maint_months))
        //   V=Documentation Fee (VLOOKUP → col K)
        //   W=Corpus Fund (formula: F * VLOOKUP(corpus))
        //   X=Manjeera Connection (VLOOKUP → col L)
        //   Y=Manjeera Meter (VLOOKUP → col M)
        //   Z=Grand Total (formula: Q+R+T+U+V+W+X+Y)
        // ══════════════════════════════════════════════════════════════
        const assignFlatSheet = workbook.addWorksheet('Assign Flat Template');
        assignFlatSheet.addRow([
            'Project', 'Flat No', 'Block', 'Customer Phone',
            'Booking Date',
            'Saleable Area (sq.ft.)',
            'Rate Per Sq.ft (₹)',
            'Discount Rate Per Sq.ft (₹)',
            'Base Cost of the Unit (₹)',
            'Floor Rise Charge Per Sq.ft (₹)',
            'Total Charge of Floor Rise (₹)',
            'East Facing Charge Per Sq.ft (₹)',
            'Total Charge of East Facing (₹)',
            'Corner Charge Per Sq.ft (₹)',
            'Total Charge of Corner (₹)',
            'Amenities (₹)',
            'Total Cost of Unit (₹)',
            'GST (₹)',
            'Cost of Unit with Tax (₹)',
            'Registration (₹)',
            'Maintenance (₹)',
            'Documentation Fee (₹)',
            'Corpus Fund (₹)',
            'Manjeera Connection (₹)',
            'Manjeera Meter (₹)',
            'Grand Total (₹)',
            'Validation Status',
        ]);
        assignFlatSheet.getRow(1).font = { bold: true };
        assignFlatSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
        assignFlatSheet.columns.forEach(col => (col.width = 28));
        assignFlatSheet.getColumn(5).numFmt = '@'; // Booking Date as text

        // Row 2 sample with formulas (using row index 2)
        const sampleRow = assignFlatSheet.addRow([
            projectsData[0]?.project_name || '',
            '101', blocksData[0]?.name || '',
            '9876543210',
            dayjs(new Date()).format('DD-MM-YYYY'),
            null, // F: Formula
            4500, // G: Rate Per Sq.ft
            0,    // H: Discount
            null, null, null, null, null, null, null, // I–O
            0,    // P: Amenities
            null, null, null, null, null, null, null, null, null, null, // Q–Z
        ]);

        for (let i = 2; i <= 5000; i++) {
            const inputCond = `AND($A${i}<>"",$B${i}<>"",$C${i}<>"")`;
            const cond = `AND($A${i}<>"",$F${i}<>"")`;
            const vlookup = (col) => `IFERROR(VLOOKUP(A${i},ProjectRates!$A:$M,${col},FALSE),0)`;

            // Project dropdown
            assignFlatSheet.getCell(`A${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`ProjectList!$A$1:$A$${pLen}`],
                showErrorMessage: true, errorTitle: 'Invalid Project', error: 'Please select a valid Project.',
            };
            // Block dropdown
            assignFlatSheet.getCell(`C${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`BlockList!$A$1:$A$${bLen}`],
                showErrorMessage: true, errorTitle: 'Invalid Block', error: 'Please select a valid Block.',
            };
            // Booking Date as text
            assignFlatSheet.getCell(`E${i}`).numFmt = '@';

            const floorNoLookup = `SUMIFS('Flat Template'!$C:$C, 'Flat Template'!$A:$A, $A${i}, 'Flat Template'!$B:$B, $B${i}, 'Flat Template'!$D:$D, $C${i})`;
            const areaLookup = `SUMIFS('Flat Template'!$E:$E, 'Flat Template'!$A:$A, $A${i}, 'Flat Template'!$B:$B, $B${i}, 'Flat Template'!$D:$D, $C${i})`;
            const phoneValid = `COUNTIFS('Customer Template'!$G:$G, $D${i}, 'Customer Template'!$A:$A, $A${i})`;

            // F: Saleable Area = Lookup from Flat Template
            assignFlatSheet.getCell(`F${i}`).value = { formula: `IF(${inputCond}, ${areaLookup}, "")` };

            // I: Base Cost = F*G - F*H
            assignFlatSheet.getCell(`I${i}`).value = { formula: `IF(${cond}, F${i}*G${i}-(F${i}*H${i}), "")` };

            // J: Floor Rise Per Sqft = BaseRate * MAX(0, FloorNo - 5)
            const baseFloorRise = vlookup(2);
            assignFlatSheet.getCell(`J${i}`).value = { formula: `IF(AND(${cond}, ${floorNoLookup}>=6), ${baseFloorRise} * (${floorNoLookup} - 5), 0)` };

            // K: Total Floor Rise = J * F
            assignFlatSheet.getCell(`K${i}`).value = { formula: `IF(${cond},J${i}*F${i},"")` };

            // L: East Facing Per Sqft (Check if Facing='East' in Flat Template)
            const isEastFormula = `COUNTIFS('Flat Template'!$G:$G, "East", 'Flat Template'!$A:$A, $A${i}, 'Flat Template'!$B:$B, $B${i}, 'Flat Template'!$D:$D, $C${i})`;
            const baseEastRate = vlookup(3);
            assignFlatSheet.getCell(`L${i}`).value = { formula: `IF(AND(${cond}, ${isEastFormula}>0), ${baseEastRate}, 0)` };

            // M: Total East Facing = L * F
            assignFlatSheet.getCell(`M${i}`).value = { formula: `IF(${cond},L${i}*F${i},"")` };

            // N: Corner Per Sqft (Check if Corner='Yes' in Flat Template)
            const isCornerFormula = `COUNTIFS('Flat Template'!$L:$L, "Yes", 'Flat Template'!$A:$A, $A${i}, 'Flat Template'!$B:$B, $B${i}, 'Flat Template'!$D:$D, $C${i})`;
            const baseCornerRate = vlookup(4);
            assignFlatSheet.getCell(`N${i}`).value = { formula: `IF(AND(${cond}, ${isCornerFormula}>0), ${baseCornerRate}, 0)` };

            // O: Total Corner = N * F
            assignFlatSheet.getCell(`O${i}`).value = { formula: `IF(${cond},N${i}*F${i},"")` };

            // Q: Total Cost = I + K + M + O + P
            assignFlatSheet.getCell(`Q${i}`).value = { formula: `IF(${cond},I${i}+K${i}+M${i}+O${i}+P${i},"")` };

            // R: GST = Q * gst_percentage / 100
            assignFlatSheet.getCell(`R${i}`).value = { formula: `IF(${cond},Q${i}*${vlookup(5)}/100,"")` };

            // S: Cost With Tax = Q + R
            assignFlatSheet.getCell(`S${i}`).value = { formula: `IF(${cond},Q${i}+R${i},"")` };

            // T: Registration = Q * reg% / 100 + reg_base
            assignFlatSheet.getCell(`T${i}`).value = { formula: `IF(${cond},(Q${i}*${vlookup(6)}/100)+${vlookup(7)},"")` };

            // U: Maintenance = F * maint_rate * maint_months
            assignFlatSheet.getCell(`U${i}`).value = { formula: `IF(${cond},F${i}*${vlookup(8)}*${vlookup(9)},"")` };

            // V: Documentation Fee (VLOOKUP col K)
            assignFlatSheet.getCell(`V${i}`).value = { formula: `IF(A${i}<>"",${vlookup(11)},"")` };

            // W: Corpus Fund = F * corpus_fund_per_sqft
            assignFlatSheet.getCell(`W${i}`).value = { formula: `IF(${cond},F${i}*${vlookup(10)},"")` };

            // X: Manjeera Connection (VLOOKUP col L)
            assignFlatSheet.getCell(`X${i}`).value = { formula: `IF(A${i}<>"",${vlookup(12)},"")` };

            // Y: Manjeera Meter (VLOOKUP col M)
            assignFlatSheet.getCell(`Y${i}`).value = { formula: `IF(A${i}<>"",${vlookup(13)},"")` };

            // Z: Grand Total = Q + R + T + U + V + W + X + Y
            assignFlatSheet.getCell(`Z${i}`).value = { formula: `IF(${cond},Q${i}+R${i}+T${i}+U${i}+V${i}+W${i}+X${i}+Y${i},"")` };

            // AA: Validation Status
            const flatValid = `${areaLookup}>0`;
            const custValid = `${phoneValid}>0`;
            assignFlatSheet.getCell(`AA${i}`).value = { 
                formula: `IF(A${i}="","",IF(AND(${flatValid},${custValid}),"✓ Valid",IF(NOT(${flatValid}),"✗ Flat Not Found",IF(NOT(${custValid}),"✗ Customer Not Found",""))))` 
            };
        }

        // ══════════════════════════════════════════════════════════════
        // SHEET 4: Payment Template  (matches ExcelPaymentTemplate.jsx)
        // Cols: A=Amount, B=Payment Type, C=Payment Towards, D=Payment Method,
        //       E=Bank, F=Date of Payment, G=Transaction Id, H=Flat, I=Block, J=Project, K=Comment
        // ══════════════════════════════════════════════════════════════
        const paymentSheet = workbook.addWorksheet('Payment Template');
        paymentSheet.addRow([
            'Amount', 'Payment Type', 'Payment Towards', 'Payment Method',
            'Bank', 'Date of Payment', 'Transaction Id', 'Flat', 'Block', 'Project', 'Comment',
        ]);
        paymentSheet.getRow(1).font = { bold: true };
        paymentSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4D6' } };
        paymentSheet.columns.forEach(col => (col.width = 25));
        paymentSheet.getColumn(6).numFmt = '@'; // Date as text

        const paymentTypes = ['Customer Pay', 'Loan Pay'];
        const paymentTowards = ['Flat', 'GST', 'Corpus Fund', 'Maintenance Charges', 'Manjeera Connection Charge', 'Manjeera Meter Connection', 'Documentation Fee', 'Registration'];
        const paymentMethods = ['DD', 'UPI', 'Bank Deposit', 'Cheque', 'Online Transfer (IMPS, NFT)'];

        // Sample row
        paymentSheet.addRow([
            '10000', paymentTypes[0], paymentTowards[0], paymentMethods[0],
            bankList[0]?.name || '',
            dayjs(new Date()).format('DD-MM-YYYY'),
            'ABCDEFGH123456', '101', blocksData[0]?.name || '',
            projectsData[0]?.project_name || '',
        ]);

        for (let i = 2; i <= 5000; i++) {
            paymentSheet.getCell(`F${i}`).numFmt = '@';
            paymentSheet.getCell(`B${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`"${paymentTypes.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Payment Type', error: 'Please select a valid payment type.',
            };
            paymentSheet.getCell(`C${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`"${paymentTowards.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Payment Towards', error: 'Please select a valid payment towards.',
            };
            paymentSheet.getCell(`D${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`"${paymentMethods.join(',')}"`],
                showErrorMessage: true, errorTitle: 'Invalid Payment Method', error: 'Please select a valid payment method.',
            };
            if (bankList.length > 0) {
                paymentSheet.getCell(`E${i}`).dataValidation = {
                    type: 'list', allowBlank: true, formulae: [`BankList!$A$1:$A$${bankList.length}`],
                    showErrorMessage: true, errorTitle: 'Invalid Bank', error: 'Please select a valid Bank.',
                };
            }
            paymentSheet.getCell(`I${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`BlockList!$A$1:$A$${bLen}`],
                showErrorMessage: true, errorTitle: 'Invalid Block', error: 'Please select a valid Block.',
            };
            paymentSheet.getCell(`J${i}`).dataValidation = {
                type: 'list', allowBlank: false, formulae: [`ProjectList!$A$1:$A$${pLen}`],
                showErrorMessage: true, errorTitle: 'Invalid Project', error: 'Please select a valid Project.',
            };
        }

        // ─── Export ────────────────────────────────────────────────────
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, 'Global_Template.xlsx');
        setIsDownloading(false);
        closeDownloadTemplate();
    };

    return (
        <div className="text-sm space-y-4 p-4">
            <div className="w-full flex justify-between items-center">
                <div className="font-semibold text-[15px]">Download Global Template</div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="default">Close</Button>
            </div>

            <p className="text-gray-500 text-xs leading-relaxed">
                This template contains four sheets:
                <b className="text-neutral-700"> Flat Template</b>,
                <b className="text-neutral-700"> Customer Template</b>,
                <b className="text-neutral-700"> Assign Flat Template</b>, and
                <b className="text-neutral-700"> Payment Template</b>.
                Fill in each sheet and upload the file to process all records at once.
            </p>

            <ul className="text-xs text-neutral-500 list-disc list-inside space-y-1">
                <li><b>Flat Template</b> — Project, Flat No, Floor No, Block, Area, Type, Facing, Views, Corner, Reward</li>
                <li><b>Customer Template</b> — Project, personal details, address &amp; work info</li>
                <li><b>Assign Flat Template</b> — Select a Project and pricing <b>auto-fills</b> based on that project's rates. It also <b>validates</b> against the Flat and Customer sheets.</li>
                <li><b>Payment Template</b> — Amount, Type, Method, Bank, Date, Flat, Block, Project</li>
            </ul>

            <div className="flex justify-end pt-1">
                <button
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2 text-white text-sm bg-[#0083bf] hover:bg-[#026d9f] disabled:bg-gray-400 rounded-md shadow cursor-pointer"
                    onClick={downloadGlobalTemplate}
                >
                    {isDownloading ? 'Preparing...' : 'Download Global Template'}
                </button>
            </div>
        </div>
    );
}

export default ExcelGlobalTemplate;
