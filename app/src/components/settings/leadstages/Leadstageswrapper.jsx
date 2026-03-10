// import React, { useCallback, useEffect, useState } from "react";
// // import Addblock from "./AddBlock.jsx";
// import Projectapi from "../../api/Projectapi.jsx";
// import Errorpanel from "../../shared/Errorpanel.jsx";
// import DeleteModal from "../../shared/DeleteModal.jsx";
// // import Updateblocksmodal from "./Updateblocksmodal.jsx";
// import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
// import { toast } from "react-toastify";
// import { Loadingoverlay, Modal, Pagination } from "@nayeshdaggula/tailify";
// import { IconEdit, IconTrash } from "@tabler/icons-react";
// import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
// import Addleadstage from "./Addleadstage.jsx";
// import Editleadstage from "./Editleadstage.jsx";
// import Settingsapi from "../../api/Settingsapi.jsx";

// const Leadstageswrapper = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");

//     const [page, setPage] = useState(1)
//     const [limit, setLimit] = useState(5);
//     const [totalPages, setTotalPages] = useState(0)

//     const permissions = useEmployeeDetails((state) => state.permissions);

//     const [leadStages, setLeadStagesData] = useState([]);
//     const [updateLeadStageModal, setUpdateLeadStageModal] = useState(false);
//     const [singleLeadStageData, setSingleLeadStageData] = useState('')
//     const [leadStageId, setLeadStageId] = useState('')

//     const openUpdateLeadStageModal = (data) => {
//         setSingleLeadStageData(data)
//         setUpdateLeadStageModal(true)
//     }
//     const closeupdateLeadStageModal = () => {
//         setUpdateLeadStageModal(false)
//         setSingleLeadStageData('')
//     }




//     const [leadStageDeleteModal, setLeadStageDeleteModal] = useState(false);
//     const openLeadStageDeleteModal = (id) => {
//         setLeadStageDeleteModal(true);
//         setLeadStageId(id);
//     };
//     const closeLeadStageDeleteModal = () => {
//         setLeadStageDeleteModal(false);
//     };

//     async function getLeadStagesData(newPage, newLimit) {
//         setIsLoading(true);

//         Settingsapi.get("get-lead-stages", {
//             params: {
//                 page: newPage,
//                 limit: newLimit,
//             },
//             headers: {
//                 "Content-Type": "application/json",
//                 // 'Authorization': `Bearer ${access_token}`
//             },
//         })
//             .then((response) => {
//                 const data = response.data;

//                 if (data.status === "error") {
//                     setErrorMessage({
//                         message: data.message,
//                         server_res: data,
//                     });
//                     setLeadStagesData(null);
//                 } else {
//                     setLeadStagesData(data?.data || []);
//                     setTotalPages(data?.totalPages);
//                     setErrorMessage("");
//                 }

//                 setIsLoading(false);
//             })
//             .catch((error) => {
//                 console.error("Error fetching company info:", error);

//                 const finalResponse = {
//                     message: error?.message || "Unknown error",
//                     server_res: error?.response?.data || null,
//                 };

//                 setErrorMessage(finalResponse);
//                 setLeadStagesData(null);
//                 setIsLoading(false);
//             });
//     }

//     useEffect(() => {
//         getLeadStagesData(page, limit);
//     }, []);

//     const refreshLeadStage = () => {
//         getLeadStagesData(page, limit);
//     };

//     const handlePageChange = useCallback((value) => {
//         setPage(value);
//         getLeadStagesData(value, limit);
//         setIsLoading(true);
//     }, []);

//     const handleDeleteLeadStage = async (leadStageId) => {
//         setIsLoading(true);
//         await Settingsapi.post("delete-lead-stage",
//             {
//                 lead_stage_id: leadStageId,
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         )
//             .then((res) => {
//                 let data = res.data;
//                 if (data.status === "error") {
//                     let finalResponse;
//                     finalResponse = {
//                         message: data.message,
//                         server_res: data,
//                     };
//                     setErrorMessage(finalResponse);
//                     setIsLoading(false);
//                     return false;
//                 }
//                 toast.success("Lead Stage deleted successfully", {
//                     position: "top-right",
//                     autoClose: 2000,
//                 });
//                 closeLeadStageDeleteModal();
//                 setLeadStageId("");
//                 refreshLeadStage();
//                 setIsLoading(false);
//                 return false;
//             })
//             .catch((error) => {
//                 console.log("Error:", error);
//                 let finalresponse;
//                 if (error.response !== undefined) {
//                     finalresponse = {
//                         message: error.message,
//                         server_res: error.response.data,
//                     };
//                 } else {
//                     finalresponse = {
//                         message: error.message,
//                         server_res: null,
//                     };
//                 }
//                 setErrorMessage(finalresponse);
//                 setIsLoading(false);
//                 return false;
//             });
//     };

//     const handleOrderChange = async (id, newOrder) => {
//         try {
//             await Settingsapi.post("update-lead-stage", { id, newOrder });
//             toast.success("Order updated successfully");
//             refreshLeadStage(); // refresh list
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to update order");
//         }

//         return (
//             <>
//                 <div className="flex flex-col gap-4 border border-[#ebecef] rounded-md bg-white p-8">
//                     <div className="flex justify-between items-center">
//                         <p className="text-[18px] font-semibold">Blocks</p>
//                     </div>
//                     <hr className="text-[#ebecef]" />
//                     <div className="flex flex-col md:flex-row gap-4">
//                         {permissions?.settings_page?.includes("add_block") && (
//                             <div className="max-sm:basis-[100%] basis-[25%] w-full">
//                                 <Addleadstage refreshLeadStage={refreshLeadStage} />
//                             </div>
//                         )}

//                         <div className="basis-[75%] bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
//                             <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md">
//                                 <table className="w-full table-fixed text-left border-collapse">
//                                     {/* <thead className="border-b-[0.6px] border-b-[#ebecef]">
//                                     <tr className="w-full">
//                                         <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky left-0 z-20 bg-white rounded-md border-r border-[#ebecef]">
//                                             S.No
//                                         </th>
//                                         <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[180px]">
//                                             Lead Stage Name
//                                         </th>
//                                         <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[180px]">
//                                             Order No
//                                         </th>
//                                         <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky right-0 z-20 bg-white rounded-md border-l border-[#ebecef]">
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {isLoading === false ? (
//                                         leadStagesData?.length > 0 ? (
//                                             leadStagesData?.map((ele, index) => (
//                                                 <tr key={index} className="border-b-[0.6px] border-b-[#ebecef] align-top">
//                                                     <td className="px-4 py-3 whitespace-normal break-words w-[120px] sticky left-0 z-10 bg-white border-r border-[#ebecef]">
//                                                         <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
//                                                             {index + 1}
//                                                         </p>
//                                                     </td>
//                                                     <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
//                                                         <p className=" text-[#4b5563] text-[13px] font-normal leading-[18px]">
//                                                             {ele.name}
//                                                         </p>
//                                                     </td>
//                                                     <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
//                                                         <p className=" text-[#4b5563] text-[13px] font-normal leading-[18px]">
//                                                             {ele.order}
//                                                         </p>
//                                                     </td>

//                                                     <td className="px-4 py-3 text-center whitespace-normal break-words w-[120px] sticky right-0 z-20 bg-white border-l border-[#ebecef]">
//                                                         <div className="flex items-center gap-3">
//                                                             {permissions?.settings_page?.includes("edit_block") && (
//                                                                 <div className="cursor-pointer">
//                                                                     <IconEdit size={20} className='' onClick={() => openUpdateLeadStageModal(ele)} />
//                                                                 </div>
//                                                             )}

//                                                             {permissions?.settings_page?.includes("delete_block") && (
//                                                                 <div className="cursor-pointer">
//                                                                     <IconTrash size={20} className='text-[#F44336]' onClick={() => openLeadStageDeleteModal(ele?.id)} />
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan={3} className="text-center py-4">
//                                                     <p className="text-[#4A4D53CC] text-[14px] font-[400]">No data found</p>
//                                                 </td>
//                                             </tr>
//                                         )
//                                     ) : (
//                                         <TableLoadingEffect colspan={3} tr={4} />
//                                     )}
//                                 </tbody> */}

//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-4 py-2">Order</th>
//                                             <th className="px-4 py-2">Stage Name</th>
//                                             <th className="px-4 py-2">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {leadStages.map((stage) => (
//                                             <tr key={stage.id} className="border-b">
//                                                 {/* Editable Order */}
//                                                 <td className="px-4 py-2">
//                                                     <input
//                                                         type="number"
//                                                         value={stage.order}
//                                                         min={1}
//                                                         max={leadStages.length}
//                                                         onChange={(e) => handleOrderChange(stage.id, parseInt(e.target.value))}
//                                                         className="border rounded px-2 py-1 w-16 text-center"
//                                                     />
//                                                 </td>

//                                                 {/* Stage Name */}
//                                                 <td className="px-4 py-2">{stage.name}</td>

//                                                 {/* Actions */}
//                                                 <td className="px-4 py-2 flex gap-2">
//                                                     <button
//                                                         onClick={() => openUpdateLeadStageModal(stage)}
//                                                         className="text-blue-600"
//                                                     >
//                                                         Edit
//                                                     </button>
//                                                     <button
//                                                         onClick={() => openLeadStageDeleteModal(stage.id)}
//                                                         className="text-red-600"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>

//                                 </table>
//                             </div>
//                             {totalPages > 0 &&
//                                 <div className="flex justify-end items-end">
//                                     <Pagination
//                                         totalpages={totalPages}
//                                         value={page}
//                                         onChange={handlePageChange}
//                                         color="#0083bf"
//                                         activePageClass='!bg-[#0083bf] text-white prem'
//                                     />
//                                 </div>
//                             }
//                         </div>
//                     </div>


//                 </div>
//                 {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

//                 <Modal
//                     open={updateLeadStageModal}
//                     onClose={updateLeadStageModal}
//                     size="lg"
//                     withCloseButton={false}
//                     centered
//                     containerClassName='addnewmodal'
//                 >
//                     {
//                         updateLeadStageModal &&
//                         <Editleadstage
//                             closeupdateLeadStageModal={closeupdateLeadStageModal}
//                             refreshLeadStage={refreshLeadStage}
//                             singleLeadStageData={singleLeadStageData}
//                         />
//                     }
//                 </Modal>

//                 <DeleteModal
//                     title='Delete Lead Stage'
//                     message='Are you sure you want to delete this block?'
//                     open={leadStageDeleteModal}
//                     onClose={closeLeadStageDeleteModal}
//                     onConfirm={() => handleDeleteLeadStage(leadStageId)}
//                 />
//             </>
//         );
//     };
// };

// export default Leadstageswrapper;

import React, { useCallback, useEffect, useState } from "react";
import Projectapi from "../../api/Projectapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import DeleteModal from "../../shared/DeleteModal.jsx";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { toast } from "react-toastify";
import { Modal, Pagination } from "@nayeshdaggula/tailify";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
import Addleadstage from "./Addleadstage.jsx";
import Editleadstage from "./Editleadstage.jsx";
import Settingsapi from "../../api/Settingsapi.jsx";

const Leadstageswrapper = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const permissions = useEmployeeDetails((state) => state.permissions);

    const [leadStages, setLeadStagesData] = useState([]);
    const [updateLeadStageModal, setUpdateLeadStageModal] = useState(false);
    const [singleLeadStageData, setSingleLeadStageData] = useState("");
    const [leadStageId, setLeadStageId] = useState("");

    const [leadStageDeleteModal, setLeadStageDeleteModal] = useState(false);

    // 🔹 Modal Handlers
    const openUpdateLeadStageModal = (data) => {
        setSingleLeadStageData(data);
        setUpdateLeadStageModal(true);
    };
    const closeupdateLeadStageModal = () => {
        setUpdateLeadStageModal(false);
        setSingleLeadStageData("");
    };

    const openLeadStageDeleteModal = (id) => {
        setLeadStageDeleteModal(true);
        setLeadStageId(id);
    };
    const closeLeadStageDeleteModal = () => {
        setLeadStageDeleteModal(false);
    };

    // 🔹 Fetch Lead Stages
    async function getLeadStagesData(newPage, newLimit) {
        setIsLoading(true);
        try {
            const response = await Settingsapi.get("get-lead-stages", {
                params: { page: newPage, limit: newLimit },
            });

            const data = response.data;
            if (data.status === "error") {
                setErrorMessage({ message: data.message, server_res: data });
                setLeadStagesData([]);
            } else {
                setLeadStagesData(data?.data || []);
                setTotalPages(data?.totalPages);
                setErrorMessage("");
            }
        } catch (error) {
            console.error("Error fetching lead stages:", error);
            setErrorMessage({
                message: error?.message || "Unknown error",
                server_res: error?.response?.data || null,
            });
            setLeadStagesData([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getLeadStagesData(page, limit);
    }, []);

    const refreshLeadStage = () => {
        getLeadStagesData(page, limit);
    };

    const handlePageChange = useCallback(
        (value) => {
            setPage(value);
            getLeadStagesData(value, limit);
        },
        [limit]
    );

    // 🔹 Delete Stage
    const handleDeleteLeadStage = async (leadStageId) => {
        setIsLoading(true);
        try {
            const res = await Settingsapi.post(`delete-lead-stage/${leadStageId}`);

            if (res.data.status === "error") {
                setErrorMessage({ message: res.data.message, server_res: res.data });
                return;
            }

            toast.success("Lead Stage deleted successfully");
            closeLeadStageDeleteModal();
            setLeadStageId("");
            refreshLeadStage();
        } catch (error) {
            console.error("Delete error:", error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data || null,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Change Order
    const handleOrderChange = async (id, newOrder) => {
        try {
            await Settingsapi.post(`update-lead-stage/${id}`, { newOrder });
            toast.success("Order updated successfully");
            refreshLeadStage();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order");
        }
    };


    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-md bg-white p-8">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Lead Stages</p>
                </div>
                <hr className="text-[#ebecef]" />

                <div className="flex flex-col md:flex-row gap-4">
                    {permissions?.settings_page?.includes("lead_stage_add") && (
                        <div className="max-sm:basis-[100%] basis-[25%] w-full">
                            <Addleadstage refreshLeadStage={refreshLeadStage} />
                        </div>
                    )}

                    <div className="basis-[75%] bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
                        <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 w-1/3">Order</th>
                                        <th className="px-4 py-2 w-1/3">Stage Name</th>
                                        <th className="px-4 py-2 w-1/3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leadStages.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4">
                                                <p className="text-[#4A4D53CC] text-[14px] font-[400]">No data found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        leadStages.map((stage) => (
                                            <tr key={stage.id} className="border-b border-[#ebecef]">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={stage.order}
                                                        min={1}
                                                        max={leadStages.length}
                                                        onChange={(e) =>
                                                            handleOrderChange(stage?.id, parseInt(e.target.value))
                                                        }
                                                        className="border border-[#979aa1] rounded px-2 py-1 w-16 text-center"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">{stage.name}</td>
                                                <td className="px-4 py-2 flex gap-4">
                                                    {permissions?.settings_page?.includes("lead_stage_edit") && (
                                                        <div className="cursor-pointer">
                                                            <IconEdit
                                                                size={20}
                                                                className=""
                                                                onClick={() => openUpdateLeadStageModal(stage)}
                                                            />
                                                        </div>
                                                    )}
                                                    {permissions?.settings_page?.includes("lead_stage_delete") && (
                                                        <div className="cursor-pointer">
                                                            <IconTrash
                                                                size={20}
                                                                className="text-[#F44336]"
                                                                onClick={() => openLeadStageDeleteModal(stage?.id)}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 0 && (
                            <div className="flex justify-end items-end">
                                <Pagination
                                    totalpages={totalPages}
                                    value={page}
                                    onChange={handlePageChange}
                                    color="#0083bf"
                                    activePageClass="!bg-[#0083bf] text-white prem"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {errorMessage && (
                <Errorpanel
                    errorMessages={errorMessage}
                    setErrorMessages={setErrorMessage}
                />
            )}

            <Modal
                open={updateLeadStageModal}
                onClose={closeupdateLeadStageModal}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName="addnewmodal"
            >
                {updateLeadStageModal && (
                    <Editleadstage
                        closeupdateLeadStageModal={closeupdateLeadStageModal}
                        refreshLeadStage={refreshLeadStage}
                        singleLeadStageData={singleLeadStageData}
                    />
                )}
            </Modal>

            <DeleteModal
                title="Delete Lead Stage"
                message="Are you sure you want to delete this stage?"
                open={leadStageDeleteModal}
                onClose={closeLeadStageDeleteModal}
                onConfirm={() => handleDeleteLeadStage(leadStageId)}
            />
        </>
    );
};

export default Leadstageswrapper;
