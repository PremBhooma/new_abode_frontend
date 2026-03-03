import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@nayeshdaggula/tailify";
import Errorpanel from "../../shared/Errorpanel";
import Excelbulktemplate from "./ExcelBulktemplate";
import Excelglobalupload from "./Excelglobalupload";

const BulkUploads = () => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");
    const [reqData, setReqData] = useState({});
    const [openSection, setOpenSection] = useState(null);

    const [downloadTemplate, setDownloadTemplate] = useState(false);
    const [uploadGlobalExcel, setUploadGlobalExcel] = useState(false);

    const openDownloadTemplate = () => setDownloadTemplate(true);
    const closeDownloadTemplate = () => setDownloadTemplate(false);

    const openUploadGlobalExcel = () => setUploadGlobalExcel(true);
    const closeUploadGlobalExcel = () => setUploadGlobalExcel(false);

    const renderSection = (title, section) => {
        if (!section) return null;

        return (
            <div className="border rounded-md p-4 shadow-sm mb-6 bg-white">
                <div className="flex flex-col gap-2 cursor-pointer" onClick={() => setOpenSection(openSection === title ? null : title)}>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <div className="flex gap-4 text-sm">
                        <span className="text-green-600">Inserted: {section.inserted}</span>
                        <span className="text-red-600">Skipped: {section.skipped}</span>
                    </div>
                </div>

                {/* {openSection === title && ( */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">
                        Skipped Rows ({section.skipped})
                    </h3>
                    <ul className="mt-2 space-y-2">
                        {section.skippedRows?.map((item, idx) => (
                            <li
                                key={idx}
                                className="p-3 border rounded-md bg-gray-50 text-sm"
                            >
                                <p className="text-red-600 font-medium">
                                    Reason: {item.reason}
                                </p>
                                <pre className="mt-1 text-gray-700 text-xs overflow-auto">
                                    {JSON.stringify(item.row, null, 2)}
                                </pre>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* )} */}
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8 min-h-auto">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Global Upload</p>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openDownloadTemplate}
                            className="text-[14px] font-semibold text-white bg-[#0083bf] hover:bg-[#026d9f] cursor-pointer rounded-md px-4 py-2"
                        >
                            Download Global Template
                        </button>
                        <button
                            onClick={openUploadGlobalExcel}
                            className="text-[14px] font-semibold text-white bg-emerald-500 hover:bg-emerald-600 cursor-pointer rounded-md px-4 py-2"
                        >
                            Upload Global File
                        </button>
                    </div>

                </div>

                {reqData?.status && (
                    <div className="w-[70%] mx-auto p-6">
                        <h1 className="text-2xl font-bold mb-6">
                            Upload Result – Status:{" "}
                            <span
                                className={
                                    reqData.status === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {reqData.status}
                            </span>
                        </h1>

                        {renderSection("Flats", reqData.flats)}
                        {renderSection("Customers", reqData.customers)}
                        {renderSection("Assign Flat To Customer", reqData.assignFlatToCustomer)}
                        {renderSection("Payments", reqData.payments)}
                    </div>
                )}
            </div>
            {!reqData?.status && <p className="px-8 text-sm font-normal mt-2 text-gray-400">Note: After the upload of file, result will be shown here.</p>}


            {errorMessage && (
                <Errorpanel
                    errorMessages={errorMessage}
                    setErrorMessages={setErrorMessage}
                />
            )}

            <Modal
                open={downloadTemplate}
                onClose={downloadTemplate}
                size="md"
                withCloseButton={false}
                centered
                containerClassName="addnewmodal"
            >
                {downloadTemplate && (
                    <Excelbulktemplate closeDownloadTemplate={closeDownloadTemplate} />
                )}
            </Modal>

            <Modal
                open={uploadGlobalExcel}
                onClose={uploadGlobalExcel}
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

