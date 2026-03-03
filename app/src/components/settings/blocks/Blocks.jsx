import React, { useCallback, useEffect, useState } from "react";
import Addblock from "./AddBlock.jsx";
import Projectapi from "../../api/Projectapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import DeleteModal from "../../shared/DeleteModal.jsx";
import Updateblocksmodal from "./Updateblocksmodal.jsx";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { toast } from "react-toastify";
import { Loadingoverlay, Modal, Pagination } from "@nayeshdaggula/tailify";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";

const Blocks = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0)

    const permissions = useEmployeeDetails((state) => state.permissions);

    const [blocksData, setBlocksData] = useState([]);
    const [updateBlocksModal, setUpdateBlocksModal] = useState(false);
    const [singleBlockData, setSingleBlockData] = useState('')
    const [blockId, setBlockId] = useState('')

    const openUpdateBlocksModal = (data) => {
        setSingleBlockData(data)
        setUpdateBlocksModal(true)
    }
    const closeUpdateBlocksModal = () => {
        setUpdateBlocksModal(false)
        setSingleBlockData('')
    }

    const [blockDeleteModal, setBlockDeleteModal] = useState(false);
    const openBlockDeleteModal = (id) => {
        setBlockDeleteModal(true);
        setBlockId(id);
    };
    const closeBlockDeleteModal = () => {
        setBlockDeleteModal(false);
    };

    async function getBlocksData(newPage, newLimit) {
        setIsLoading(true);

        Projectapi.get("get-block", {
            params: {
                page: newPage,
                limit: newLimit,
            },
            headers: {
                "Content-Type": "application/json",
                // 'Authorization': `Bearer ${access_token}`
            },
        })
            .then((response) => {
                const data = response.data;

                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setBlocksData(null);
                } else {
                    setBlocksData(data?.data || []);
                    setTotalPages(data?.totalPages);
                    setErrorMessage("");
                }

                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching company info:", error);

                const finalResponse = {
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                };

                setErrorMessage(finalResponse);
                setBlocksData(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getBlocksData(page, limit);
    }, []);

    const refreshBlocks = () => {
        getBlocksData(page, limit);
    };

    const handlePageChange = useCallback((value) => {
        setPage(value);
        getBlocksData(value, limit);
        setIsLoading(true);
    }, []);

    const handleDeleteBlock = async (blockId) => {
        setIsLoading(true);
        await Projectapi.post("delete-block",
            {
                block_id: blockId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => {
                let data = res.data;
                if (data.status === "error") {
                    let finalResponse;
                    finalResponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalResponse);
                    setIsLoading(false);
                    return false;
                }
                toast.success("Block deleted successfully", {
                    position: "top-right",
                    autoClose: 2000,
                });
                closeBlockDeleteModal();
                setBlockId("");
                refreshBlocks();
                setIsLoading(false);
                return false;
            })
            .catch((error) => {
                console.log("Error:", error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        message: error.message,
                        server_res: error.response.data,
                    };
                } else {
                    finalresponse = {
                        message: error.message,
                        server_res: null,
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false;
            });
    };

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-md bg-white p-8">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Blocks</p>
                </div>
                <hr className="text-[#ebecef]" />
                <div className="flex flex-col md:flex-row gap-4">
                    {permissions?.settings_page?.includes("add_block") && (
                        <div className="max-sm:basis-[100%] basis-[25%] w-full">
                            <Addblock refreshBlocks={refreshBlocks} />
                        </div>
                    )}

                    <div className="basis-[75%] bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
                        <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-neutral-200">
                                    <tr className="w-full">
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                                            S.No
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[180px]">
                                            Block Name
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {isLoading === false ? (
                                        blocksData?.length > 0 ? (
                                            blocksData?.map((ele, index) => (
                                                <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                                                    <td className="px-4 py-4 whitespace-normal break-words w-[120px] sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {index + 1}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-normal break-words w-[180px]">
                                                        <p className=" text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {ele.block_name}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 text-center whitespace-normal break-words w-[120px] sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                                        <div className="flex items-center justify-center gap-3">
                                                            {permissions?.settings_page?.includes("edit_block") && (
                                                                <div
                                                                    onClick={() => openUpdateBlocksModal(ele)}
                                                                    className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                                                >
                                                                    <IconEdit size={18} />
                                                                </div>
                                                            )}

                                                            {/* {permissions?.settings_page?.includes("delete_block") && (
                                                                <div className="cursor-pointer">
                                                                    <IconTrash size={20} className='text-[#F44336]' onClick={() => openBlockDeleteModal(ele?.id)} />
                                                                </div>
                                                            )} */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center py-8">
                                                    <p className="text-neutral-500 text-sm">No data found</p>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <TableLoadingEffect colspan={3} tr={4} />
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 0 &&
                            <div className="flex justify-end items-end">
                                <Pagination
                                    totalpages={totalPages}
                                    value={page}
                                    onChange={handlePageChange}
                                    color="#0083bf"
                                    activePageClass='!bg-[#0083bf] text-white prem'
                                />
                            </div>
                        }
                    </div>
                </div>


            </div>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            <Modal
                open={updateBlocksModal}
                onClose={updateBlocksModal}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    updateBlocksModal &&
                    <Updateblocksmodal
                        closeUpdateBlocksModal={closeUpdateBlocksModal}
                        refreshBlocks={refreshBlocks}
                        singleBlockData={singleBlockData}
                    />
                }
            </Modal>

            <DeleteModal
                title='Delete Block'
                message='Are you sure you want to delete this block?'
                open={blockDeleteModal}
                onClose={closeBlockDeleteModal}
                onConfirm={() => handleDeleteBlock(blockId)}
            />
        </>
    );
};

export default Blocks;
