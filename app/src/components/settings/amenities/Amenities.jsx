import React, { useCallback, useEffect, useState } from "react";
import Addamenities from "./Addamenities.jsx";
import Settingsapi from "../../api/Settingsapi.jsx";
import Updateamenities from "./Updateamenities.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import DeleteModal from "../../shared/DeleteModal.jsx";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { toast } from "react-toastify";
import { Loadingoverlay, Modal, Pagination } from "@nayeshdaggula/tailify";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";

const Amenities = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0)

    const permissions = useEmployeeDetails((state) => state.permissions);

    const [amenitiesData, setAmenitiesData] = useState([]);
    const [updateAmenities, setUpdateAmenities] = useState(false);
    const [singleAmenitiesData, setSingleAmenitiesData] = useState('')
    const [amenitiesId, setAmenitiesId] = useState('')

    const openUpdateAmenities = (data) => {
        setSingleAmenitiesData(data)
        setUpdateAmenities(true)
    }
    const closeUpdateAmenities = () => {
        setUpdateAmenities(false)
        setSingleAmenitiesData('')
    }

    const [amenitiesDeleteModal, setAmenitiesDeleteModal] = useState(false);
    const openAmenitiesDeleteModal = (id) => {
        setAmenitiesDeleteModal(true);
        setAmenitiesId(id);
    };
    const closeAmenitiesDeleteModal = () => {
        setAmenitiesDeleteModal(false);
    };

    async function getAmenitiesData(newPage, newLimit) {
        setIsLoading(true);

        Settingsapi.get("get-all-amenities", {
            params: {
                page: newPage,
                limit: newLimit,
            },
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const data = response.data;

                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setAmenitiesData(null);
                } else {
                    setAmenitiesData(data?.data || []);
                    setTotalPages(data?.totalPages);
                    setErrorMessage("");
                }

                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching Amenities:", error);

                const finalResponse = {
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                };

                setErrorMessage(finalResponse);
                setAmenitiesData(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getAmenitiesData(page, limit);
    }, []);

    const refreshAmenities = () => {
        getAmenitiesData(page, limit);
    };

    const handlePageChange = useCallback((value) => {
        setPage(value);
        getAmenitiesData(value, limit);
        setIsLoading(true);
    }, []);

    const handleDeleteAmenity = async (amenitiesId) => {
        setIsLoading(true);
        await Settingsapi.post("delete-amenity",
            {
                amenitiesId: amenitiesId,
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
                toast.success("Amenity deleted successfully", {
                    position: "top-right",
                    autoClose: 2000,
                });
                closeAmenitiesDeleteModal();
                setAmenitiesId("");
                refreshAmenities();
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
                    <p className="text-[18px] font-semibold">Amenities Prices</p>
                </div>
                <hr className="text-[#ebecef]" />
                <div className="grid grid-cols-4 gap-4">
                    {permissions?.settings_page?.includes("add_amenities") && (
                        <div className="col-span-1 w-full">
                            <Addamenities refreshAmenities={refreshAmenities} />
                        </div>
                    )}

                    <div className="col-span-3 bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
                        <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-neutral-200">
                                    <tr className="w-full">
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                                            S.No
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Project Name
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[140px]">
                                            Flat Type
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px]">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {isLoading === false ? (
                                        amenitiesData?.length > 0 ? (
                                            amenitiesData?.map((ele, index) => (
                                                <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                                                    <td className="px-4 py-4 whitespace-normal break-words w-[120px] sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {index + 1}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-normal break-words w-[160px]">
                                                        <p className=" text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {ele.project_name || '-'}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-normal break-words w-[140px]">
                                                        <p className=" text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {ele.flat_type}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-normal break-words w-[120px]">
                                                        <p className=" text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {ele.formatAmount}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 text-center whitespace-normal break-words w-[120px] sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                                        <div className="flex items-center justify-center gap-3">
                                                            {permissions?.settings_page?.includes("edit_amenities") && (
                                                                <div
                                                                    onClick={() => openUpdateAmenities(ele)}
                                                                    className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                                                >
                                                                    <IconEdit size={18} />
                                                                </div>
                                                            )}

                                                            {permissions?.settings_page?.includes("delete_amenities") && (
                                                                <div
                                                                    onClick={() => openAmenitiesDeleteModal(ele?.id)}
                                                                    className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                                                                >
                                                                    <IconTrash size={18} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-8">
                                                    <p className="text-neutral-500 text-sm">No data found</p>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <TableLoadingEffect colspan={4} tr={4} />
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
                open={updateAmenities}
                onClose={updateAmenities}
                size="md"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    updateAmenities &&
                    <Updateamenities
                        closeUpdateAmenities={closeUpdateAmenities}
                        refreshAmenities={refreshAmenities}
                        singleAmenitiesData={singleAmenitiesData}
                    />
                }
            </Modal>

            <DeleteModal
                title='Delete Amenity'
                message='Are you sure you want to delete this Amenity?'
                open={amenitiesDeleteModal}
                onClose={closeAmenitiesDeleteModal}
                onConfirm={() => handleDeleteAmenity(amenitiesId)}
            />
        </>
    );
};

export default Amenities;
