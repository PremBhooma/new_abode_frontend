import React, { useEffect, useState } from 'react'
import Settingsapi from "../../api/Settingsapi";
import Errorpanel from '../../shared/Errorpanel';
import { toast } from 'react-toastify';
import { Button, Card, Group, Loadingoverlay, Select, Text } from '@nayeshdaggula/tailify';

function Updatebackupschedule({ closeUpdateBackupSchedule, refreshBackup, backupScheduleData }) {

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [backupSchedule, setBackupSchedule] = useState('');
    const [backupScheduleError, setBackupScheduleError] = useState('')
    const updateBackupSchedule = (value) => {
        setBackupSchedule(value)
        setBackupScheduleError('')
    }

    const handleSubmit = () => {
        setIsLoadingEffect(true);

        if (backupSchedule === '') {
            setIsLoadingEffect(false);
            setBackupScheduleError('Enter backup schedule');
            return false;
        }

        Settingsapi.post('update-backup-schedule', {
            schedule: backupSchedule,
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
                refreshBackup();
                closeUpdateBackupSchedule();
                return false;
            })
            .catch((error) => {
                setErrorMessage(error);
                setIsLoadingEffect(false);
                return false;
            });
    }

    useEffect(() => {
        if (backupScheduleData) {
            setBackupSchedule(backupScheduleData);
        }
    }, [backupScheduleData])


    return (
        <>

            <Card withBorder={false} className='!shadow-none' padding='0'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-3 items-center px-2'>
                        <Text color='#2b2b2b' c={"#000000"} className="!font-semibold text-[18px]">Backup Schedule</Text>

                        <Button onClick={closeUpdateBackupSchedule} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
                    <div className='mb-3 grid grid-cols-1 gap-3'>
                        <Select
                            data={[
                                // { value: 'twoMinutes', label: '2 Minutes' },
                                // { value: 'fiveMinutes', label: '5 Minutes' },
                                { value: 'Daily', label: 'Daily' },
                                { value: 'Weekly', label: 'Weekly' },
                                { value: 'Monthly', label: 'Monthly' },
                            ]}
                            placeholder="Backup Schedule"
                            searchable
                            value={backupSchedule}
                            error={backupScheduleError}
                            onChange={updateBackupSchedule}
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

export default Updatebackupschedule