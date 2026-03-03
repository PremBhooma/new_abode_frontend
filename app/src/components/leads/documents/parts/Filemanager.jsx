import React from 'react';
import file_icon from '../../../../../public/assets/file_icon.png';
import pdf_logo from '../../../../../public/assets/fileicons/pdf.png';
import image_icon from '../../../../../public/assets/image_icon.png';
import docx from '../../../../../public/assets/fileicons/doc.png';
import file from '../../../../../public/assets/fileicons/file.png';
import gif from '../../../../../public/assets/fileicons/gif.png';
import html from '../../../../../public/assets/fileicons/html.png';
import mp3 from '../../../../../public/assets/fileicons/mp3.png';
import mp4 from '../../../../../public/assets/fileicons/mp4.png';
import rar from '../../../../../public/assets/fileicons/rar.png';
import svg from '../../../../../public/assets/fileicons/svg.png';
import txt from '../../../../../public/assets/fileicons/txt.png';
import xls from '../../../../../public/assets/fileicons/xls.png';
import zip from '../../../../../public/assets/fileicons/zip.png';
import dayjs from 'dayjs';
import { IconDotsVertical, IconDownload, IconEye, IconTrash } from '@tabler/icons-react';
import TableLoadingEffect from '../../../shared/Tableloadingeffect.jsx';
import { Button, Menu } from '@nayeshdaggula/tailify';
import { useEmployeeDetails } from '../../../zustand/useEmployeeDetails.jsx';
import { saveAs } from 'file-saver';
function Filemanager({ fileStructure, folderselect, isLoadingEffect, openDeleteFolder, currentFolderId, openDeleteFile }) {
    const permissions = useEmployeeDetails((state) => state.permissions);

    const handleDownload = (fileUrl, fileName) => {
        saveAs(fileUrl, fileName);
    };
    return (
        <div className="w-full relative rounded-xl border border-[#ebecef] bg-white">
            <table className="w-full text-left border-collapse">
                <thead className="truncate border-b-[0.6px] border-b-[#757575]/30">
                    <tr>
                        <th scope="col" className="px-4 py-[18px]">
                            <p className="text-[#4b5563] text-[14px] not-italic font-[500] leading-[18px]">
                                Name
                            </p>
                        </th>
                        <th scope="col" className="px-4 py-3">
                            <p className="text-[#4b5563] text-[14px] not-italic font-[500] leading-[18px]">
                                Last Modified
                            </p>
                        </th>
                        <th scope="col" className="px-4 py-3">
                            <p className="text-[#4b5563] text-[14px] not-italic font-[500] leading-[18px]">
                                Type
                            </p>
                        </th>
                        <th scope="col" className="px-4 py-3">
                            <p className="text-[#4b5563] text-[14px] not-italic font-[500] leading-[18px]">
                                Uploaded By
                            </p>
                        </th>
                        <th scope="col" className="px-4 py-3">
                            <p className="text-[#4b5563] text-[14px] not-italic font-[500] leading-[18px]">
                                Actions
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoadingEffect === false ?
                        fileStructure?.length > 0 ? (
                            fileStructure.map((item) => {
                                let icon;
                                if (item.file_type === "folder") {
                                    icon = file_icon;
                                } else if (item.file_type === "docx") {
                                    icon = docx;
                                } else if (item.file_type === "gif") {
                                    icon = gif;
                                } else if (item.file_type === "html") {
                                    icon = html;
                                } else if (item.file_type === "mp3") {
                                    icon = mp3;
                                } else if (item.file_type === "mp4") {
                                    icon = mp4;
                                } else if (item.file_type === "pdf") {
                                    icon = pdf_logo;
                                } else if (item.file_type === "rar") {
                                    icon = rar;
                                } else if (item.file_type === "svg") {
                                    icon = svg;
                                } else if (item.file_type === "txt") {
                                    icon = txt;
                                } else if (item.file_type === "xlsx") {
                                    icon = xls;
                                } else if (item.file_type === "webp" || item.file_type === "jpg" || item.file_type === "jpeg" || item.file_type === "png" || item.file_type === "gif") {
                                    icon = image_icon;
                                } else if (item.file_type === "zip") {
                                    icon = zip;
                                } else {
                                    icon = file
                                }

                                return (
                                    <tr
                                        key={item?.id}
                                        className="truncate border-b-[0.6px] border-b-[#ebecef]"
                                    >
                                        <td className="truncate px-4 py-3 whitespace-nowrap">
                                            <p className="text-[#4b5563] text-[13px] not-italic font-normal leading-[18px]">
                                                <div className='flex flex-row gap-2 items-center'>
                                                    <img src={icon} alt={item.name} className='h-[20px] w-[20px]' />
                                                    {
                                                        item.file_type === 'folder' ?
                                                            <p className='text-[#4b5563] text-[13px] not-italic font-normal leading-[18px] cursor-pointer' onClick={() => folderselect(item.uuid, item.id)}>
                                                                {item.name}
                                                            </p>
                                                            :
                                                            <p className='text-[#4b5563] text-[13px] not-italic font-normal leading-[18px] truncate whitespace-nowrap w-[100px]'>
                                                                {item.name}
                                                            </p>
                                                    }
                                                </div>
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 truncate">
                                            <p className="text-[#4b5563] text-[13px] not-italic font-normal leading-[18px]">
                                                {dayjs(item.updatedAt).format('DD MMM YYYY')}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 truncate">
                                            <p className="text-[#4b5563] text-[13px] not-italic font-normal leading-[18px]">
                                                {item.file_type || "----"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 truncate">
                                            <p className="text-[#4b5563] text-[13px] not-italic font-normal leading-[18px]">
                                                {item.uploadedBy}
                                            </p>
                                        </td>
                                        <td className="text-center">
                                            <Menu
                                                shadow='md'
                                                width={150}
                                                zIndex={9999999}
                                            >
                                                <Menu.Target>
                                                    <Button variant="transparent" color="#2E5655" size="xs" ><IconDotsVertical size={15} /></Button>
                                                </Menu.Target>
                                                <Menu.Dropdown
                                                    className='!left-[-30px]'
                                                >
                                                    {
                                                        item.file_type !== 'folder' ? (
                                                            <>
                                                                {permissions?.leads_page?.includes("view_file_in_lead") ? (
                                                                    <Menu.Item
                                                                        leftSection={<IconDownload size={15} />}
                                                                        onClick={() => handleDownload(item.file_url, item.name)}
                                                                    >
                                                                        <p className='text-[12px] font-semibold'>Download</p>
                                                                    </Menu.Item>
                                                                ) : (
                                                                    <Menu.Item >
                                                                        <p className='text-[12px] font-semibold'>No Access</p>
                                                                    </Menu.Item>
                                                                )}

                                                                {permissions?.leads_page?.includes("delete_file_in_lead") ? (
                                                                    <Menu.Item
                                                                        color="red"
                                                                        onClick={() => openDeleteFile(item.id)}
                                                                        leftSection={<IconTrash size={15} />}
                                                                    >
                                                                        <p className='text-[12px] font-semibold'>Delete</p>
                                                                    </Menu.Item>
                                                                ) : (
                                                                    <Menu.Item >
                                                                        <p className='text-[12px] font-semibold'>No Access</p>
                                                                    </Menu.Item>
                                                                )}
                                                            </>
                                                        )
                                                            : (
                                                                <>
                                                                    {permissions?.leads_page?.includes("delete_folder_in_lead") ? (
                                                                        <Menu.Item
                                                                            color="red"
                                                                            onClick={() => openDeleteFolder(item.id)}
                                                                            leftSection={<IconTrash size={15} />}
                                                                        >
                                                                            Delete
                                                                        </Menu.Item>
                                                                    ) : (
                                                                        <Menu.Item >
                                                                            <p className='text-[12px] font-semibold'>No Access</p>
                                                                        </Menu.Item>
                                                                    )}
                                                                </>

                                                            )
                                                    }
                                                </Menu.Dropdown>
                                            </Menu>
                                        </td>
                                    </tr>
                                )
                            }))
                            :
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    <p className="text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]">
                                        No data found
                                    </p>
                                </td>
                            </tr>
                        :
                        <TableLoadingEffect colspan={6} tr={10} />
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Filemanager;