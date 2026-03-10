import { useState } from 'react';
import { Modal } from '@nayeshdaggula/tailify';
import { Upload, Download, RotateCcw } from 'lucide-react';
import Excelbulktemplate from './ExcelBulktemplate';
import Excelglobalupload from './Excelglobalupload';
import Skippedrecords from './Skippedrecords';

const BulkUploads = () => {
    const [reqData, setReqData] = useState(null);
    const [downloadTemplate, setDownloadTemplate] = useState(false);
    const [uploadGlobalExcel, setUploadGlobalExcel] = useState(false);

    const openDownloadTemplate = () => setDownloadTemplate(true);
    const closeDownloadTemplate = () => setDownloadTemplate(false);

    const openUploadGlobalExcel = () => setUploadGlobalExcel(true);
    const closeUploadGlobalExcel = () => setUploadGlobalExcel(false);

    // Build sections object for Skippedrecords
    const buildSections = (data) => {
        if (!data) return {};
        const map = {};
        if (data.flats) map['Flats'] = data.flats;
        if (data.customers) map['Customers'] = data.customers;
        if (data.assignFlatToCustomer) map['Assign Flat To Customer'] = data.assignFlatToCustomer;
        if (data.payments) map['Payments'] = data.payments;
        return map;
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Header card */}
                <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[18px] font-semibold text-neutral-800">Global Upload</p>
                            <p className="text-sm text-neutral-400 mt-0.5">
                                Upload flats, customers, assignments &amp; payments in one file
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={openDownloadTemplate}
                                className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#0083bf] hover:bg-[#026d9f] cursor-pointer rounded-lg px-4 py-2.5"
                            >
                                <Download size={15} />
                                Download Template
                            </button>
                            <button
                                onClick={openUploadGlobalExcel}
                                className="flex items-center gap-2 text-[13px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 cursor-pointer rounded-lg px-4 py-2.5"
                            >
                                <Upload size={15} />
                                Upload File
                            </button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { step: '1', label: 'Select Project', desc: 'Choose the project for template download & upload' },
                            { step: '2', label: 'Download Template', desc: 'Get the Excel file with pre-filled dropdowns' },
                            { step: '3', label: 'Fill Data', desc: 'Enter flats, customers, assignments & payments' },
                            { step: '4', label: 'Upload File', desc: 'Upload the filled file to process all data' },
                        ].map(({ step, label, desc }) => (
                            <div key={step} className="flex flex-col gap-1.5 bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                                <span className="w-6 h-6 rounded-full bg-[#0083bf] text-white text-xs font-bold flex items-center justify-center">
                                    {step}
                                </span>
                                <p className="text-sm font-semibold text-neutral-700">{label}</p>
                                <p className="text-xs text-neutral-400">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {reqData ? (
                    <div className="border border-[#ebecef] rounded-xl bg-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[16px] font-semibold text-neutral-800">Upload Result</p>
                            <button
                                onClick={() => setReqData(null)}
                                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 border border-neutral-200 rounded-md px-3 py-1.5 cursor-pointer"
                            >
                                <RotateCcw size={13} />
                                Clear
                            </button>
                        </div>
                        <Skippedrecords
                            sections={buildSections(reqData)}
                            status={reqData.status}
                        />
                    </div>
                ) : (
                    <p className="text-sm font-normal text-gray-400 px-1">
                        Note: After the upload of file, result will be shown here.
                    </p>
                )}
            </div>

            {/* Download Template Modal */}
            <Modal
                open={downloadTemplate}
                onClose={closeDownloadTemplate}
                size="md"
                withCloseButton={false}
                centered
                containerClassName="addnewmodal"
            >
                {downloadTemplate && (
                    <Excelbulktemplate closeDownloadTemplate={closeDownloadTemplate} />
                )}
            </Modal>

            {/* Upload Modal */}
            <Modal
                open={uploadGlobalExcel}
                onClose={closeUploadGlobalExcel}
                size="md"
                withCloseButton={false}
                centered
                containerClassName="addnewmodal"
            >
                {uploadGlobalExcel && (
                    <Excelglobalupload
                        closeUploadGlobalExcel={closeUploadGlobalExcel}
                        setReqData={setReqData}
                    />
                )}
            </Modal>
        </>
    );
};

export default BulkUploads;
