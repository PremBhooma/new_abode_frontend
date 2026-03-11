import React, { useEffect, useState } from 'react'
import Settingsapi from "../../api/Settingsapi";
import Leadapi from "../../api/Leadapi";
import Errorpanel from '../../shared/Errorpanel';
import { toast } from 'react-toastify';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';

function Updateleadstage({ closeUpdateLeadStageModal, refreshLead, leadStageValue, currentLeadId, onUpdateLeadStage }) {

    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [updateLeadStage, setUpdateLeadStage] = useState('');
    const [updateLeadStageError, setUpdateLeadStageError] = useState('')
    const updateLead = (value) => {
        setUpdateLeadStage(value)
        setUpdateLeadStageError('')
    }

    const [leadStagesData, setLeadStagesData] = useState([])
    async function getLeadStatesOrderWise() {
        setIsLoadingEffect(true);
        await Leadapi.get("get-lead-stages-order-wise", {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    const finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setLeadStagesData(data?.data || []);
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
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
                setIsLoadingEffect(false);
                return false;
            });
    }

    const handleSubmit = () => {
        setIsLoadingEffect(true);

        if (updateLeadStage === '') {
            setIsLoadingEffect(false);
            setUpdateLeadStageError('Select lead stage');
            return false;
        }

        Leadapi.post('edit-lead-stage', {
            leadId: currentLeadId,
            leadStageId: updateLeadStage,
            employeeId: employeeId,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    toast.error(data.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(data?.message);
                setIsLoadingEffect(false);
                refreshLead();
                closeUpdateLeadStageModal();
                if (onUpdateLeadStage) {
                    onUpdateLeadStage();
                }
                return false;
            })
            .catch((error) => {
                setErrorMessage(error);
                setIsLoadingEffect(false);
                return false;
            });
    }

    useEffect(() => {
        getLeadStatesOrderWise()
        if (leadStageValue) {
            setUpdateLeadStage(leadStageValue)
        }
    }, [leadStageValue])


    return (
        <>
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center mb-4'>
                    <p className="!font-semibold text-[18px] text-[#2b2b2b]">Update Lead Stage</p>

                    <Button onClick={closeUpdateLeadStageModal} size="sm" variant="outline" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500 bg-white group'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>
                
                <div className="flex flex-col gap-1 w-full relative z-[99999]">
                    <Select value={updateLeadStage || ""} onValueChange={updateLead}>
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 shadow-none bg-white">
                            <SelectValue placeholder="Select lead stage" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 bg-white z-[99999]">
                            <SelectGroup>
                                {leadStagesData?.map((item) => (
                                    <SelectItem key={item.value || item.id} value={item.value || item.id}>
                                        {item.label || item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {updateLeadStageError && <span className="text-red-500 text-sm mt-1">{updateLeadStageError}</span>}
                </div>

                {isLoadingEffect ? (
                    <div className="mt-4 flex flex-col items-end gap-2">
                        <Skeleton className="h-10 w-24 rounded-md" />
                    </div>
                ) : (
                    <div className='flex justify-end !p-0 mt-4 relative z-[9999] pointer-events-auto'>
                        <Button onClick={handleSubmit} disabled={isLoadingEffect} className="px-5 bg-[#0083bf] hover:bg-[#0083bf]/90 text-white rounded cursor-pointer relative z-[9999] pointer-events-auto">Submit</Button>
                    </div>
                )}
            </div>

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </>
    )
}

export default Updateleadstage