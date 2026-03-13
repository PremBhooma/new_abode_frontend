import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { FolderOpen, File, FileText, ImageIcon, FileCode, Music, Video, Archive, MoreVertical, Download, Trash2, FileSpreadsheet } from 'lucide-react'
import TableLoadingEffect from '../../../shared/Tableloadingeffect.jsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEmployeeDetails } from '../../../zustand/useEmployeeDetails.jsx';
import { saveAs } from 'file-saver';

function Filemanager({ fileStructure, folderselect, isLoadingEffect, openDeleteFolder, currentFolderId, openDeleteFile }) {
    const permissions = useEmployeeDetails((state) => state.permissions);

    const normalizeFolderId = (folderId) => {
        if (folderId === null || folderId === undefined) return null;
        if (typeof folderId === "string") {
            const trimmed = folderId.trim();
            if (trimmed === "" || trimmed === "null" || trimmed === "undefined") return null;
            return trimmed;
        }
        return folderId;
    };

    const activeFolderId = normalizeFolderId(currentFolderId);

    const filteredFileStructure = useMemo(() => {
        const items = fileStructure || [];
        return items.filter((item) => normalizeFolderId(item?.parent_id) === activeFolderId);
    }, [fileStructure, activeFolderId]);

    const handleDownload = (fileUrl, fileName) => {
        saveAs(fileUrl, fileName);
    };

    const getFileIcon = (type) => {
        const iconSize = 20;
        if (type === "folder") return <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors"><FolderOpen size={iconSize} fill="currentColor" fillOpacity={0.2} /></div>;
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(type)) return <div className="p-2 bg-rose-50 text-rose-500 rounded-lg group-hover:bg-rose-100 transition-colors"><ImageIcon size={iconSize} /></div>;
        if (type === "pdf") return <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100 transition-colors"><FileText size={iconSize} /></div>;
        if (["docx", "doc", "txt"].includes(type)) return <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors"><FileText size={iconSize} /></div>;
        if (["xlsx", "xls", "csv"].includes(type)) return <div className="p-2 bg-green-50 text-green-500 rounded-lg group-hover:bg-green-100 transition-colors"><FileSpreadsheet size={iconSize} /></div>;
        if (["zip", "rar", "7z"].includes(type)) return <div className="p-2 bg-purple-50 text-purple-500 rounded-lg group-hover:bg-purple-100 transition-colors"><Archive size={iconSize} /></div>;
        if (["mp4", "mov", "avi"].includes(type)) return <div className="p-2 bg-orange-50 text-orange-500 rounded-lg group-hover:bg-orange-100 transition-colors"><Video size={iconSize} /></div>;
        if (["mp3", "wav"].includes(type)) return <div className="p-2 bg-pink-50 text-pink-500 rounded-lg group-hover:bg-pink-100 transition-colors"><Music size={iconSize} /></div>;
        if (["html", "js", "css", "json"].includes(type)) return <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-slate-100 transition-colors"><FileCode size={iconSize} /></div>;
        return <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-slate-100 transition-colors"><File size={iconSize} /></div>;
    };

    return (
        <div className="w-full relative rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                        <th className="px-6 py-2">
                            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Name</span>
                        </th>
                        <th className="px-6 py-2">
                            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Last Modified</span>
                        </th>
                        <th className="px-6 py-2">
                            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Type</span>
                        </th>
                        <th className="px-6 py-2">
                            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Uploaded By</span>
                        </th>
                        <th className="px-6 py-2 text-right">
                            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {isLoadingEffect === false ?
                        filteredFileStructure?.length > 0 ? (
                            filteredFileStructure.map((item) => (
                                <tr
                                    key={item?.id}
                                    className="group hover:bg-slate-50/80 transition-all duration-200"
                                >
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(item.file_type)}
                                            {item.file_type === 'folder' ? (
                                                <button
                                                    onClick={() => folderselect(item.id, item.id)}
                                                    className="text-slate-700 text-xs font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    {item.name}
                                                </button>
                                            ) : (
                                                <span className="text-slate-600 text-xs font-medium truncate max-w-[200px]">
                                                    {item.name}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className="text-slate-500 text-xs font-medium">
                                            {dayjs(item.updated_at).format('DD MMM YYYY')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-tight
                                            ${item.file_type === 'folder' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {item.file_type || "----"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold border border-white shadow-sm">
                                                {item.uploadedBy?.charAt(0)}
                                            </div>
                                            <span className="text-slate-600 text-xs font-medium">
                                                {item.uploadedBy}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-200">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-slate-200 bg-white">
                                                {item.file_type !== 'folder' ? (
                                                    <>
                                                        {permissions?.customers_page?.includes("view_file_in_customer") && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleDownload(item.file_url, item.name)}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 outline-none"
                                                            >
                                                                <Download size={15} className="text-blue-500" />
                                                                Download
                                                            </DropdownMenuItem>
                                                        )}
                                                        {permissions?.customers_page?.includes("delete_file_in_customer") && (
                                                            <DropdownMenuItem
                                                                onClick={() => openDeleteFile(item.id)}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-red-600 font-semibold cursor-pointer hover:bg-red-50 outline-none"
                                                            >
                                                                <Trash2 size={15} />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </>
                                                ) : (
                                                    permissions?.customers_page?.includes("delete_folder_in_customer") && (
                                                        <DropdownMenuItem
                                                            onClick={() => openDeleteFolder(item.id)}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 font-semibold cursor-pointer hover:bg-red-50 outline-none"
                                                        >
                                                            <Trash2 size={15} />
                                                            Delete Folder
                                                        </DropdownMenuItem>
                                                    )
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-20">
                                    <div className="flex flex-col items-center justify-center text-center px-4">
                                        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-inner">
                                            <FolderOpen size={40} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-slate-800 font-bold text-lg tracking-tight">No Files Found</h3>
                                        <p className="text-slate-500 text-xs max-w-[280px] mt-1 font-medium italic">
                                            This directory is currently empty. Start by uploading a file or creating a new folder.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <TableLoadingEffect colspan={6} tr={10} />
                        )}
                </tbody>
            </table>
        </div>
    );
}

export default Filemanager;
