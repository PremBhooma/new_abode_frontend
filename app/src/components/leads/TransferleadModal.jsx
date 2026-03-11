import React, { use, useEffect, useState } from 'react'
import Errorpanel from '../../components/shared/Errorpanel';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Generalapi from '../api/Generalapi';
import Leadapi from '../api/Leadapi'
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';

function TransferleadModal({ closeTransferLead, currentLeadId, refreshLeadDetails, leadData }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo)
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [assignEmployee, setAssignEmployee] = useState(null);
    const [assignEmployeeError, setAssignEmployeeError] = useState('')
    const updateAssignEmployee = (value) => {
        setAssignEmployee(value)
        setAssignEmployeeError('')
    }

    const handleSubmit = () => {
        setIsLoadingEffect(true);

        if (assignEmployee === null) {
            setIsLoadingEffect(false);
            setAssignEmployeeError('Select one employee');
            return false;
        }

        Leadapi.post('transferleadtoemployee', {
            leadId: currentLeadId,
            assignEmployee: assignEmployee,
            employee_id: employeeInfo.id,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === "error") {
                    const finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success("Lead transferred successfully");
                setIsLoadingEffect(false);
                closeTransferLead();
                refreshLeadDetails();
                return false;
            })
            .catch((error) => {
                console.log("error:", error);
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
    };

    const [allEmployees, setAllEmployees] = useState([])
    const fetchAllEmployees = async (assgnid) => {
        setIsLoadingEffect(true);
        await Leadapi.get('/getallsubordinates', {
            params: {
                employee_id: employeeInfo.id || null,
                project_id: leadData?.project_id || null,
            }
        })
            .then((res) => {
                const data = res.data;
                if (data.status === "error") {
                    const finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                setAllEmployees(data?.subordinates || [])
                setIsLoadingEffect(false);
            })
            .catch((error) => {
                console.log("error:", error);
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

    useEffect(() => {
        fetchAllEmployees(leadData?.lead_assignee?.assignee_id)
    }, [leadData?.lead_assignee?.assignee_id]);

    return (
        <>
            <div className='flex flex-col gap-4 w-full'>
                <div className='flex justify-between items-center mb-4'>
                    <p className="!font-semibold text-[18px] text-[#2b2b2b]">Transfer Lead to Employee</p>

                    <Button onClick={closeTransferLead} size="sm" variant="outline" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500 bg-white group'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>

                <div className="flex flex-col gap-1 w-full relative z-[99999]">
                    <Select value={assignEmployee || ""} onValueChange={updateAssignEmployee}>
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 shadow-none bg-white">
                            <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 bg-white z-[99999]">
                            <SelectGroup>
                                {allEmployees?.map((item) => (
                                    <SelectItem key={item.value || item.id} value={item.value || item.id}>
                                        {item.label || item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {assignEmployeeError && <span className="text-red-500 text-sm mt-1">{assignEmployeeError}</span>}
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

export default TransferleadModal
