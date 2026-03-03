import React, { useEffect, useState } from 'react'
import Settingsapi from '../../api/Settingsapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';
import { toast } from 'react-toastify';
import { Button, Card, Group, Loadingoverlay, Select, Text, Textinput } from '@nayeshdaggula/tailify';
import Projectapi from '../../api/Projectapi.jsx';

function Updateamenities({ closeUpdateAmenities, singleAmenitiesData, refreshAmenities }) {

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [amountType, setAmountType] = useState('');
    const [amountTypeError, setAmountTypeError] = useState('')
    const updateAmountType = (e) => {
        setAmountType(e.target.value)
        setAmountTypeError('')
    }

    const [flatType, setFlatType] = useState('')
    const [flatTypeError, setFlatTypeError] = useState('')
    const updateFlatType = (value) => {
        setFlatType(value)
        setFlatTypeError('')
    }

    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [projectIdError, setProjectIdError] = useState('');

    const updateProjectId = (value) => {
        setProjectId(value);
        setProjectIdError('');
    }

    useEffect(() => {
        getProjects();
    }, []);

    const getProjects = async () => {
        try {
            const response = await Projectapi.get('/get-all-projects');
            if (response.data.status === 'success') {
                const projectOptions = response.data.data.map(item => ({
                    value: item.id,
                    label: item.project_name
                }));
                setProjects(projectOptions);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (amountType === '') {
            setIsLoadingEffect(false);
            setAmountTypeError('Enter the amount');
            return false;
        }

        if (flatType === '') {
            setIsLoadingEffect(false);
            setFlatTypeError('Enter the flat type');
            return false;
        }

        Settingsapi.post('update-amenities', {
            amenitiesId: singleAmenitiesData?.id,
            amount: amountType,
            flat_type: flatType,
            project_id: projectId,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    toast.error(data.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success("Amenities Updated Successfully");
                setIsLoadingEffect(false);
                refreshAmenities();
                closeUpdateAmenities();
                return false;
            })
            .catch((error) => {
                setErrorMessage(error);
                setIsLoadingEffect(false);
                return false;
            });
    }

    useEffect(() => {
        if (singleAmenitiesData) {
            setAmountType(singleAmenitiesData?.amount);
            setFlatType(singleAmenitiesData?.flat_type);
            setProjectId(singleAmenitiesData?.project_id || '');
        }
    }, [singleAmenitiesData])

    return (
        <>
            {isLoadingEffect && <Loadingoverlay visible={isLoadingEffect} />}

            <Card withBorder={false} className='!shadow-none' padding='0'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-3 items-center px-2'>
                        <Text color='#2b2b2b' c={"#000000"} className="!font-semibold text-[18px]">Update Information</Text>


                        <Button onClick={closeUpdateAmenities} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
                    <div className='mb-3 grid grid-cols-1 gap-3'>
                        <Select
                            data={projects}
                            placeholder="Select Project"
                            labelClass='!font-semibold !text-[14px]'
                            value={projectId}
                            label="Project"
                            error={projectIdError}
                            onChange={updateProjectId}
                            selectWrapperClass="!shadow-none !bg-white !border-[#ebecef]"
                        />
                        <Select
                            data={[
                                { value: "2 BHK", label: "2 BHK" },
                                { value: "3 BHK", label: "3 BHK" },
                            ]}
                            placeholder="Select flat type"
                            labelClass='!font-semibold !text-[14px]'
                            value={flatType}
                            label="Flat Type"
                            error={flatTypeError}
                            onChange={updateFlatType}
                            selectWrapperClass="!shadow-none !bg-white !border-[#ebecef]"
                        />
                        <Textinput
                            label='Amount'
                            labelClassName='!font-semibold !text-[14px]'
                            placeholder="Enter Amount"
                            w={"100%"}
                            inputClassName='!bg-white !border-[#ebecef]'
                            type='number'
                            value={amountType}
                            onChange={updateAmountType}
                            error={amountTypeError}
                        />
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

export default Updateamenities