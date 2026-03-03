import React, { use, useEffect, useState } from 'react'
import Errorpanel from '../../components/shared/Errorpanel';
import { toast } from 'react-toastify';
import { Button, Card, Group, Loadingoverlay, Select, Text } from '@nayeshdaggula/tailify';
import Leadapi from '../api/Leadapi'
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';

function MultipleleadassignModal({ closeAssigneLeaModal, refreshLeadsData, selectedLeadIds, setSelectedLeadIds }) {
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

        Leadapi.post('assignmultipleleadstoemployee', {
            leadIds: selectedLeadIds,
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
                toast.success("Leads assigned successfully");
                setIsLoadingEffect(false);
                setSelectedLeadIds([]);
                closeAssigneLeaModal();
                refreshLeadsData();
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
    const fetchAllEmployees = async () => {
        setIsLoadingEffect(true);
        await Leadapi.get('/getallsubordinates', {
            params: {
                employee_id: employeeInfo.id
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
        fetchAllEmployees()
    }, []);

    return (
        <>
            <Card withBorder={false} className='!shadow-none' padding='0'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-3 items-center px-2'>
                        <Text color='#2b2b2b' c={"#000000"} className="!font-semibold text-[18px]">Assign Leads to Employee</Text>

                        <Button onClick={closeAssigneLeaModal} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
                    <div className='mb-3 grid grid-cols-1 gap-3'>
                        <Select
                            data={allEmployees}
                            placeholder="Select employee"
                            searchable
                            value={assignEmployee}
                            error={assignEmployeeError}
                            onChange={updateAssignEmployee}
                            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
                            className="w-full"
                            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                        />
                    </div>
                </Card.Section>
                {isLoadingEffect ? (
                    isLoadingEffect && (
                        <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                            <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                        </div>
                    )
                ) : (
                    <Card.Section className='flex justify-end mt-2 !p-0'>
                        <button onClick={handleSubmit} disabled={isLoadingEffect} className="px-3 text-[14px] bg-[#0083bf] hover:!bg-[#0083bf]/90 text-white py-2 rounded cursor-pointer">Submit</button>
                    </Card.Section>
                )}
            </Card>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </>
    )
}

export default MultipleleadassignModal