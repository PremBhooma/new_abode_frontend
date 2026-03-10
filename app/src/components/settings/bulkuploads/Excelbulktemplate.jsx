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
            projectsData[0]?.project_name || '', '101', { formula: 'FloorNoList!A1' },
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
        //   A=Project, B=Flat No, C=Block, D=Customer, E=Customer Email,
        //   F=Booking Date, G=Saleable Area, H=Rate Per Sqft, I=Discount Rate,
        //   J=Base Cost (formula: G*H - G*I)
        //   K=Floor Rise Per Sqft (VLOOKUP → col B of ProjectRates)
        //   L=Total Floor Rise (formula: K*G)
        //   M=East Facing Per Sqft (VLOOKUP → col C)
        //   N=Total East Facing (formula: M*G)
        //   O=Corner Per Sqft (VLOOKUP → col D)
        //   P=Total Corner (formula: O*G)
        //   Q=Amenities
        //   R=Total Cost of Unit (formula: J+L+N+P+Q)
        //   S=GST (formula: R * VLOOKUP(gst%) / 100)
        //   T=Cost With Tax (formula: R+S)
        //   U=Registration (formula: R*VLOOKUP(reg%)/100 + VLOOKUP(reg_base))
        //   V=Maintenance (formula: G * VLOOKUP(maint_rate) * VLOOKUP(maint_months))
        //   W=Documentation Fee (VLOOKUP → col K)
        //   X=Corpus Fund (formula: G * VLOOKUP(corpus))
        //   Y=Manjeera Connection (VLOOKUP → col L)
        //   Z=Manjeera Meter (VLOOKUP → col M)
        //   AA=Grand Total (formula: R+S+U+V+W+X+Y+Z)
        // ══════════════════════════════════════════════════════════════
        const assignFlatSheet = workbook.addWorksheet('Assign Flat Template');
        assignFlatSheet.addRow([
            'Project', 'Flat No', 'Block', 'Customer', 'Customer Email',
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
        ]);
        assignFlatSheet.getRow(1).font = { bold: true };
        assignFlatSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
        assignFlatSheet.columns.forEach(col => (col.width = 28));
        assignFlatSheet.getColumn(6).numFmt = '@'; // Booking Date as text

        // Sample row (project charges auto-fill via formulas in data rows below)
        assignFlatSheet.addRow([
            projectsData[0]?.project_name || '',
            '101', blocksData[0]?.name || '',
            'Customer Name', 'customer@email.com',
            dayjs(new Date()).format('DD-MM-YYYY'),
            1200, // G: Saleable Area
            4500, // H: Rate Per Sq.ft
            0,    // I: Discount
            null, null, null, null, null, null, null, // J–P (formulas below for row 2)
            0,    // Q: Amenities
            null, null, null, null, null, null, null, null, null, null, // R–AA
        ]);

        for (let i = 2; i <= 5000; i++) {
            const cond = `AND($A${i}<>"",$G${i}<>"")`;
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
            assignFlatSheet.getCell(`F${i}`).numFmt = '@';

            // J: Base Cost = G*H - G*I
            assignFlatSheet.getCell(`J${i}`).value = { formula: `IF(${cond},G${i}*H${i}-(G${i}*I${i}),"")` };

            // K: Floor Rise Per Sqft (VLOOKUP col B → project_six_floor_onwards_price)
            assignFlatSheet.getCell(`K${i}`).value = { formula: `IF(A${i}<>"",${vlookup(2)},"")` };

            // L: Total Floor Rise = K * G
            assignFlatSheet.getCell(`L${i}`).value = { formula: `IF(${cond},K${i}*G${i},"")` };

            // M: East Facing Per Sqft (VLOOKUP col C → project_east_price)
            assignFlatSheet.getCell(`M${i}`).value = { formula: `IF(A${i}<>"",${vlookup(3)},"")` };

            // N: Total East Facing = M * G
            assignFlatSheet.getCell(`N${i}`).value = { formula: `IF(${cond},M${i}*G${i},"")` };

            // O: Corner Per Sqft (VLOOKUP col D → project_corner_price)
            assignFlatSheet.getCell(`O${i}`).value = { formula: `IF(A${i}<>"",${vlookup(4)},"")` };

            // P: Total Corner = O * G
            assignFlatSheet.getCell(`P${i}`).value = { formula: `IF(${cond},O${i}*G${i},"")` };

            // R: Total Cost = J + L + N + P + Q
            assignFlatSheet.getCell(`R${i}`).value = { formula: `IF(${cond},J${i}+L${i}+N${i}+P${i}+Q${i},"")` };

            // S: GST = R * gst_percentage / 100
            assignFlatSheet.getCell(`S${i}`).value = { formula: `IF(${cond},R${i}*${vlookup(5)}/100,"")` };

            // T: Cost With Tax = R + S
            assignFlatSheet.getCell(`T${i}`).value = { formula: `IF(${cond},R${i}+S${i},"")` };

            // U: Registration = R * reg% / 100 + reg_base
            assignFlatSheet.getCell(`U${i}`).value = { formula: `IF(${cond},(R${i}*${vlookup(6)}/100)+${vlookup(7)},"")` };

            // V: Maintenance = G * maint_rate * maint_months
            assignFlatSheet.getCell(`V${i}`).value = { formula: `IF(${cond},G${i}*${vlookup(8)}*${vlookup(9)},"")` };

            // W: Documentation Fee (VLOOKUP col K)
            assignFlatSheet.getCell(`W${i}`).value = { formula: `IF(A${i}<>"",${vlookup(11)},"")` };

            // X: Corpus Fund = G * corpus_fund_per_sqft
            assignFlatSheet.getCell(`X${i}`).value = { formula: `IF(${cond},G${i}*${vlookup(10)},"")` };

            // Y: Manjeera Connection (VLOOKUP col L)
            assignFlatSheet.getCell(`Y${i}`).value = { formula: `IF(A${i}<>"",${vlookup(12)},"")` };

            // Z: Manjeera Meter (VLOOKUP col M)
            assignFlatSheet.getCell(`Z${i}`).value = { formula: `IF(A${i}<>"",${vlookup(13)},"")` };

            // AA: Grand Total = R + S + U + V + W + X + Y + Z
            assignFlatSheet.getCell(`AA${i}`).value = { formula: `IF(${cond},R${i}+S${i}+U${i}+V${i}+W${i}+X${i}+Y${i}+Z${i},"")` };
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
        const paymentTowards = ['Flat', 'GST', 'Corpus fund', 'Registration', 'TDS', 'Maintenance'];
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
                <li><b>Assign Flat Template</b> — Select a Project and pricing (Floor Rise, East Facing, Corner, GST, Registration, etc.) <b>auto-fills</b> based on that project's rates</li>
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
