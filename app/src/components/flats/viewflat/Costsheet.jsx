import React, { useState, useRef, useEffect } from 'react'
import { UploadCloud, FileText, CheckCircle, X, Download, Eye, Loader2 } from 'lucide-react'
import { toast } from "react-toastify";
import Customerapi from '../../api/Customerapi';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';

const Costsheet = ({ customerFlatDetails, flatDetails, fetchFlat }) => {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;

    const [isHovering, setIsHovering] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadControl, setShowUploadControl] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Sync upload control visibility with the actual data:
        // if a cost_sheet_url exists, hide the uploader and show the preview instead
        setShowUploadControl(!customerFlatDetails?.cost_sheet_url);
    }, [customerFlatDetails?.cost_sheet_url]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsHovering(true);
    };

    const handleDragLeave = () => {
        setIsHovering(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsHovering(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
        } else {
            toast.error("Only PDF files are allowed.");
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            toast.error("Only PDF files are allowed.");
            e.target.value = null;
        }
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append("flat_id", flatDetails?.id);
        formData.append("id", flatDetails?.id);
        formData.append("customer_flat_id", customerFlatDetails?.id);
        formData.append("employee_id", employeeId);
        formData.append("uploadfile", file);

        try {
            const res = await Customerapi.post("upload-cost-sheet", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = res.data;
            if (data.status === "error") {
                toast.error(data.message || "Failed to upload Cost Sheet.");
            } else {
                toast.success("Cost Sheet uploaded successfully!");
                setFile(null);
                setShowUploadControl(false);
                if (fetchFlat) fetchFlat(flatDetails?.id); // Refresh parent data
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Failed to upload Cost Sheet. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 mt-2 p-5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Cost Sheet</h2>
                        <p className="text-xs text-gray-500">Manage the official cost sheet for this flat.</p>
                    </div>
                </div>
                {customerFlatDetails?.cost_sheet_url && !showUploadControl && (
                    <button
                        onClick={() => setShowUploadControl(true)}
                        className="text-sm px-4 py-1.5 font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                        Update File
                    </button>
                )}
            </div>

            {/* View Existing Cost Sheet Frame */}
            {customerFlatDetails?.cost_sheet_url && !showUploadControl && (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2.5 rounded-md">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {customerFlatDetails.cost_sheet_path.split('/').pop()}
                            </p>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                                <CheckCircle className="w-3 h-3" /> Uploaded & Verified
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a
                            href={customerFlatDetails.cost_sheet_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                        >
                            <Eye className="w-4 h-4" /> View
                        </a>
                        <a
                            href={customerFlatDetails.cost_sheet_url}
                            download
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" /> Download
                        </a>
                    </div>
                </div>
            )}

            {/* Upload Area */}
            {showUploadControl && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all bg-gray-50/50 
                            ${isHovering ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-gray-300 hover:border-gray-400'}
                            ${file ? 'border-green-500 bg-green-50/30' : ''}
                        `}
                    >
                        <input
                            type="file"
                            accept="application/pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            disabled={isUploading}
                        />

                        {!file ? (
                            <>
                                <div className="p-3 bg-white shadow-sm rounded-full mb-3 pointer-events-none">
                                    <UploadCloud className={`w-8 h-8 ${isHovering ? 'text-blue-500' : 'text-gray-400'}`} />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 text-center pointer-events-none">
                                    Click or drag file to this area to upload
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 pointer-events-none">
                                    Must be a PDF file.
                                </p>
                            </>
                        ) : (
                            <div className="flex flex-col items-center pointer-events-none w-full">
                                <div className="p-3 bg-white shadow-sm rounded-full mb-3 border border-green-100">
                                    <FileText className="w-8 h-8 text-green-500" />
                                </div>
                                <p className="text-sm font-semibold text-gray-800 text-center px-4 line-clamp-1 break-all">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}

                        {file && !isUploading && (
                            <button
                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                className="absolute top-3 right-3 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors z-20 pointer-events-auto"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Action buttons when file is ready or trying to cancel update */}
                    <div className="flex justify-end gap-3 mt-4">
                        {customerFlatDetails?.cost_sheet_url && (
                            <button
                                onClick={() => { setShowUploadControl(false); clearFile(); }}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-sm
                                ${!file || isUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}
                            `}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                                </>
                            ) : (
                                "Upload Cost Sheet"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Costsheet
