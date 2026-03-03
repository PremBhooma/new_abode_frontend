import React, { useEffect, useState } from 'react'
import Settingsapi from "../../api/Settingsapi";
import Leadapi from "../../api/Leadapi";
import Errorpanel from '../../shared/Errorpanel';
import { toast } from 'react-toastify';
import { Button, Card, Group, Loadingoverlay, Select, Text } from '@nayeshdaggula/tailify';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';

function Updateleadstage({ closeUpdateLeadStageModal, refreshLead, leadStageValue, leadId, onUpdateLeadStage }) {

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
            leadId: leadId,
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
                <div className='flex justify-between items-center'>
                    <p className="!font-semibold text-[18px] text-[#2b2b2b]">Update Lead Stage</p>

                    <Button onClick={closeUpdateLeadStageModal} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>
                <Select
                    data={leadStagesData}
                    placeholder="Lead Stage"
                    searchable
                    value={updateLeadStage}
                    error={updateLeadStageError}
                    onChange={updateLead}
                    selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
                    className="w-full"
                    dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                />
                {isLoadingEffect ? (
                    isLoadingEffect && (
                        <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                            <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                        </div>
                    )
                ) : (
                    <div className='flex justify-end !p-0'>
                        <button onClick={handleSubmit} disabled={isLoadingEffect} className="px-3 text-[14px] bg-[#0083bf] hover:!bg-[#0083bf]/90 text-white py-2 rounded cursor-pointer">Submit</button>
                    </div>
                )}
            </div>

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </>
    )
}

export default Updateleadstage