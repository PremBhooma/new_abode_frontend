import React, { useEffect, useState } from 'react'
import Projectapi from '../../api/Projectapi.jsx';
import Settingsapi from '../../api/Settingsapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';
import { toast } from 'react-toastify';
import { Button, Card, Group, Loadingoverlay, Text, Textinput } from '@nayeshdaggula/tailify';

function Editleadstage({ closeupdateLeadStageModal, singleLeadStageData, refreshLeadStage }) {

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [LeadStageName, setLeadStageName] = useState('');
    const [LeadStageNameError, setLeadStageNameError] = useState('')
    const updateLeadStageName = (e) => {
        setLeadStageName(e.target.value)
        setLeadStageNameError('')
    }
    const single_lead_id = singleLeadStageData?.id;

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (LeadStageName === '') {
            setIsLoadingEffect(false);
            setLeadStageNameError('Enter the block name');
            return false;
        }

        Settingsapi.post(`update-lead-stage/${single_lead_id}`, {
            name: LeadStageName,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    toast.error(data.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success("Lead Stage Updated Successfully");
                setIsLoadingEffect(false);
                refreshLeadStage();
                closeupdateLeadStageModal();
                return false;
            })
            .catch((error) => {
                setErrorMessage(error);
                setIsLoadingEffect(false);
                return false;
            });
    }

    useEffect(() => {
        if (singleLeadStageData) {
            setLeadStageName(singleLeadStageData?.name);
        }
    }, [singleLeadStageData])

    return (
        <>
            {isLoadingEffect && <Loadingoverlay visible={isLoadingEffect} />}

            <Card withBorder={false} className='!shadow-none' padding='0'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-3 items-center px-2'>
                        <Text color='#2b2b2b' c={"#000000"} className="!font-semibold text-[18px]">Update Information</Text>


                        <Button onClick={closeupdateLeadStageModal} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
                    <div className='mb-3 grid grid-cols-1 gap-3'>
                        <Textinput
                            placeholder='Enter Lead Stage Name'
                            labelClassName='!font-semibold'
                            label="Lead Stage Name"
                            w={"100%"}
                            value={LeadStageName}
                            error={LeadStageNameError}
                            onChange={updateLeadStageName}
                        />
                    </div>
                </Card.Section>
                <Card.Section className='flex justify-end mt-2 !p-0'>
                    <button onClick={handleSubmit} disabled={isLoadingEffect} className="px-3 text-[14px] bg-[#0083bf] hover:!bg-[#0083bf]/90 text-white py-2 rounded cursor-pointer">Submit</button>
                </Card.Section>
            </Card>
            {errorMessage &&
                <Errorpanel
                    errorMessages={errorMessage}
                    setErrorMessages={setErrorMessage}
                />}
        </>
    )
}

export default Editleadstage