import React, { useEffect, useState } from "react";
import Projectapi from "../../api/Projectapi";
import Settingsapi from "../../api/Settingsapi";
import Errorpanel from "../../shared/Errorpanel";
import { useNavigate } from "react-router-dom";
import Updateprojectmodal from "./Updatebackupschedule";
import { Loadingoverlay, Modal } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import dayjs from "dayjs";
import TableLoadingEffect from "../../shared/Tableloadingeffect";
import { toast } from "react-toastify";
import Updatebackupschedule from "./Updatebackupschedule";
import Backuprestore from "./Backuprestore";

const Backup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [backupData, setBackupData] = useState(null);
    const [backupSchedule, setBackupSchedule] = useState(null);
    const [updateBackupSchedule, setUpdateBackupSchedule] = useState(false);

    const openUpdateBackupSchedule = () => setUpdateBackupSchedule(true);
    const closeUpdateBackupSchedule = () => setUpdateBackupSchedule(false);

    const [backupRestore, setBackupRestore] = useState(false);
    const [backupRestoreValue, setBackupRestoreValue] = useState('');

    const openBackupRestore = (value) => {
        setBackupRestore(true);
        setBackupRestoreValue(value);
    }
    const closeBackupRestore = () => {
        setBackupRestore(false);
        setBackupRestoreValue('');
    }

    const { resetEmployeeAuthdetails, permissions } = useEmployeeDetails();

    async function getBackupRecords() {
        setIsLoading(true);

        Settingsapi.get("get-backup-records", {
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
                    setBackupData(null);
                } else {
                    setBackupData(data?.data || {});
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
                setBackupData(null);
                setIsLoading(false);
            });
    }

    async function getBackupSchedule() {
        setIsLoading(true);

        Settingsapi.get("get-backup-schedule", {
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
                    setBackupSchedule(null);
                } else {
                    setBackupSchedule(data?.data || {});
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
                setBackupSchedule(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getBackupRecords();
        getBackupSchedule()
    }, []);

    const refreshBackup = () => {
        getBackupRecords();
        getBackupSchedule()
    };

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8 min-h-[65vh]">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Backup</p>
                    {/* {permissions?.settings_page?.includes("update_project_info") && (
                        <button onClick={openUpdateBackupSchedule} className="text-[14px] font-semibold text-black bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md px-4 py-2">
                            Update Info
                        </button>
                    )} */}
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-500 font-normal overflow-hidden break-words">Backup Schedule:</p>
                        {backupSchedule && <p className="text-sm font-semibold">{backupSchedule?.schedule}</p>}
                        <button onClick={openUpdateBackupSchedule} className="text-[14px] font-semibold text-black bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md px-4 py-2">
                            Update Schedule
                        </button>
                    </div>

                </div>
                <hr className="text-[#ebecef]" />

                <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md">
                    <table className="w-full table-fixed text-left border-collapse">
                        <thead className="border-b-[0.6px] border-b-[#ebecef]">
                            <tr className="w-full">
                                <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky left-0 z-20 bg-white rounded-md border-r border-[#ebecef]">
                                    Ref Id
                                </th>
                                <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[180px]">
                                    File Name
                                </th>
                                <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[180px]">
                                    Backup Date
                                </th>
                                <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky right-0 z-20 bg-white rounded-md border-l border-[#ebecef]">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading === false ? (
                                backupData?.length > 0 ? (
                                    backupData?.map((ele, index) => (
                                        <tr key={index} className="border-b-[0.6px] border-b-[#ebecef] align-top">
                                            <td className="px-4 py-3 whitespace-normal break-words w-[120px] sticky left-0 z-10 bg-white border-r border-[#ebecef]">
                                                <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                                    {ele.uuid}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                                                <p className=" text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                                    {ele.backup_name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                                                <p className=" text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                                    {dayjs(ele.created_at).format('DD MMM YYYY')}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 whitespace-normal break-words w-[120px] sticky right-0 z-20 bg-white border-l border-[#ebecef]">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => openBackupRestore(ele)} className="text-[14px] font-semibold text-black bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md px-4 py-1">
                                                        Restore Data
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <p className="text-[#4A4D53CC] text-[14px] font-[400]">No data found</p>
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <TableLoadingEffect colspan={4} tr={4} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            <Modal
                open={updateBackupSchedule}
                onClose={updateBackupSchedule}
                size="md"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    updateBackupSchedule &&
                    <Updatebackupschedule
                        closeUpdateBackupSchedule={closeUpdateBackupSchedule}
                        refreshBackup={refreshBackup}
                        backupScheduleData={backupSchedule?.schedule}
                    />
                }
            </Modal>

            <Modal
                open={backupRestore}
                onClose={backupRestore}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    backupRestore &&
                    <Backuprestore
                        closeBackupRestore={closeBackupRestore}
                        backupRestoreValue={backupRestoreValue}
                    />
                }
            </Modal>
        </>
    );
};

export default Backup;
