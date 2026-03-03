import { IconDownload } from '@tabler/icons-react';
import { X } from 'lucide-react'
import React from 'react'
function Downloadtemplate({ closeDownloadTemplate, flatDetails, type }) {
    const handleDownload = (url) => {
        window.open(url, "_blank");
        closeDownloadTemplate();
    };
    return (
        <>
            <div className="flex items-center justify-between py-3 border-b border-gray-400 bg-white px-5 mb-3">
                <p className="font-semibold text-lg text-[#0083bf]">Download</p>
                <X className="x-11 cursor-pointer text-[#0083bf] hover:text-[#00628f]/50" onClick={closeDownloadTemplate} />
            </div>
            <div className="w-full justify-center items-center gap-2 flex py-3 px-5 mt-3">
                {
                    type === "saledeed" ?
                        <>
                            {
                                (flatDetails?.pdf_sale_deed_template_url || flatDetails?.word_sale_deed_template_url) ?
                                    <>
                                        {
                                            flatDetails?.pdf_sale_deed_template_url &&
                                            <button
                                                onClick={() =>
                                                    handleDownload(flatDetails?.pdf_sale_deed_template_url)
                                                }
                                                className="flex flex-row items-center gap-2 cursor-pointer bg-[#0083bf] hover:bg-[#00628f] transition rounded-sm text-[12px] px-5 py-2 text-white font-medium shadow-md"
                                            >
                                                <IconDownload size={16} stroke={1.5} color='white' />
                                                PDF
                                            </button>

                                        }
                                        {
                                            flatDetails?.word_sale_deed_template_url &&
                                            <button
                                                onClick={() =>
                                                    handleDownload(flatDetails?.word_sale_deed_template_url)
                                                }
                                                className="flex flex-row items-center gap-2 cursor-pointer bg-[#0083bf] hover:bg-[#00628f] transition rounded-sm text-[12px] px-5 py-2 text-white font-medium shadow-md"
                                            >
                                                <IconDownload size={16} stroke={1.5} color='white' />
                                                Excel
                                            </button>
                                        }
                                    </>
                                    :
                                    <>
                                        <p className='text-red-700'>No Template Available</p>
                                    </>
                            }
                        </>
                        :
                        <>
                            {
                                (flatDetails?.pdf_agreement_template_url || flatDetails?.word_agreement_template_url) ?
                                    <>
                                        {
                                            flatDetails?.pdf_agreement_template_url &&
                                            <button
                                                onClick={() =>
                                                    handleDownload(flatDetails?.pdf_agreement_template_url)
                                                }
                                                className="flex flex-row items-center gap-2 cursor-pointer bg-[#0083bf] hover:bg-[#00628f] transition rounded-sm text-[12px] px-5 py-2 text-white font-medium shadow-md"
                                            >
                                                <IconDownload size={16} stroke={1.5} color='white' />
                                                PDF
                                            </button>
                                        }
                                        {
                                            flatDetails?.word_agreement_template_url &&
                                            <button
                                                onClick={() =>
                                                    handleDownload(flatDetails?.word_agreement_template_url)
                                                }
                                                className="flex flex-row items-center gap-2 cursor-pointer bg-[#0083bf] hover:bg-[#00628f] transition rounded-sm text-[12px] px-5 py-2 text-white font-medium shadow-md"
                                            >
                                                <IconDownload size={16} stroke={1.5} color='white' />
                                                Excel
                                            </button>
                                        }
                                    </>
                                    :
                                    <>
                                        <p className='text-red-700'>No Template Available</p>
                                    </>
                            }
                        </>
                }
            </div>
        </>
    )
}

export default Downloadtemplate

