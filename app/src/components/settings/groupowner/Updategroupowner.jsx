import React, { useEffect, useState } from 'react'
import Groupownerapi from '../../api/Groupownerapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';
import { toast } from 'react-toastify';
import { Button, Card, Group, Loadingoverlay, Text, Textinput } from '@nayeshdaggula/tailify';

function Updategroupowner({ closeUpdateGroupOwnerModal, refreshGroupOwner, singleGroupOwnerData }) {

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [groupOwnerName, setGroupOwnerName] = useState('');
    const [groupOwnerNameError, setGroupOwnerNameError] = useState('')
    const updateGroupOwnerName = (e) => {
        setGroupOwnerName(e.target.value)
        setGroupOwnerNameError('')
    }

    const [isDefault, setIsDefault] = useState(false);
    const handleDefault = () => {
        setIsDefault((prev) => !prev);
    };

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (groupOwnerName === '') {
            setIsLoadingEffect(false);
            setGroupOwnerNameError('Enter the group/owner name');
            return false;
        }

        Groupownerapi.post('update-group-owner', {
            group_owner: groupOwnerName,
            isDefault: isDefault,
            uuid: singleGroupOwnerData?.uuid,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === "error") {
                    let finalResponse;
                    finalResponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    setErrorMessage(finalResponse)
                    setIsLoadingEffect(false)
                    return false
                }
                toast.success("Group/Owner updated successfully", {
                    position: "top-right",
                    autoClose: 2000,
                })
                setIsLoadingEffect(false);
                refreshGroupOwner();
                closeUpdateGroupOwnerModal();
                return false;
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false
            });
    }

    useEffect(() => {
        if (singleGroupOwnerData) {
            setGroupOwnerName(singleGroupOwnerData?.name);
            setIsDefault(singleGroupOwnerData?.isDefault === true ? true : false);
        }
    }, [singleGroupOwnerData])

    return (
        <>
            {isLoadingEffect && <Loadingoverlay visible={isLoadingEffect} />}

            <Card withBorder={false} className='!shadow-none' padding='0'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-3 items-center px-2'>
                        <Text color='#2b2b2b' c={"#000000"} className="!font-semibold text-[18px]">Update Information</Text>


                        <Button onClick={closeUpdateGroupOwnerModal} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
                    <div className='mb-3 grid grid-cols-1 gap-3'>
                        <Textinput
                            placeholder='Enter Group/Owner Name'
                            labelClassName='!font-semibold'
                            label="Group/Owner Name"
                            w={"100%"}
                            value={groupOwnerName}
                            error={groupOwnerNameError}
                            onChange={updateGroupOwnerName}
                        />
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Default:</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isDefault}
                                    onChange={handleDefault}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#0083bf] peer-focus:ring-2 peer-focus:ring-white transition-all"></div>
                                <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full border border-gray-300 peer-checked:translate-x-5 transform transition-all"></div>
                            </label>
                        </div>
                    </div>

                </Card.Section>
                <Card.Section className='flex justify-end mt-2 !p-0'>
                    <button onClick={handleSubmit} disabled={isLoadingEffect} className="px-3 text-[14px] bg-[#0083bf] hover:!bg-[#0083bf]/90 text-white py-2 rounded cursor-pointer">Submit</button>
                </Card.Section>
            </Card>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </>
    )
}

export default Updategroupowner