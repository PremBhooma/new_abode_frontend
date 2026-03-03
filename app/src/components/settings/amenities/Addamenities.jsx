'use client'
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Settingsapi from '../../api/Settingsapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';
import Projectapi from '../../api/Projectapi.jsx';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Loadingoverlay } from '@nayeshdaggula/tailify'; // Keeping for loading state consistency if needed, or remove if replacing

function Addamenities({ refreshAmenities }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [amountType, setAmountType] = useState('')
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

    const handleSubmit = async () => {
        setIsLoading(true)
        if (amountType === "") {
            setIsLoading(false)
            setAmountTypeError("Please enter an amount")
            return false
        }

        if (flatType === "") {
            setIsLoading(false)
            setFlatTypeError("Please enter a flat type")
            return false
        }

        // Project is optional, but if you want to force selection:
        // if (projectId === "") {
        //     setIsLoading(false)
        //     setProjectIdError("Please select a project")
        //     return false
        // }

        await Settingsapi.post('/add-amenities', {
            amount: amountType,
            flat_type: flatType,
            project_id: projectId
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    let finalResponse;
                    finalResponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    setErrorMessage(finalResponse)
                    setIsLoading(false)
                    return false
                }
                setAmountType('')
                setFlatType('')
                setProjectId('')
                toast.success("Amenities created successfully", {
                    position: "top-right",
                    autoClose: 2000,
                })
                refreshAmenities()
                setIsLoading(false)
                return false
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
                setIsLoading(false);
                return false
            })
    }

    return (
        <div className="px-3 rounded-md bg-transparent border border-[#ebecef] relative">
            <div className="py-2">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className={projectIdError ? "text-red-500" : ""}>Project</Label>
                        <Select value={projectId} onValueChange={updateProjectId}>
                            <SelectTrigger className={projectIdError ? "border-red-500" : "border-gray-300"}>
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-300">
                                {projects.map((project) => (
                                    <SelectItem key={project.value} value={project.value}>
                                        {project.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {projectIdError && <span className="text-xs text-red-500">{projectIdError}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className={flatTypeError ? "text-red-500" : ""}>Flat Type</Label>
                        <Select value={flatType} onValueChange={updateFlatType}>
                            <SelectTrigger className={flatTypeError ? "border-red-500" : "border-gray-300"}>
                                <SelectValue placeholder="Select flat type" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-300">
                                <SelectItem value="2 BHK">2 BHK</SelectItem>
                                <SelectItem value="3 BHK">3 BHK</SelectItem>
                            </SelectContent>
                        </Select>
                        {flatTypeError && <span className="text-xs text-red-500">{flatTypeError}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className={amountTypeError ? "text-red-500" : ""}>Amount</Label>
                        <Input
                            type="number"
                            placeholder="Enter Amount"
                            value={amountType}
                            onChange={updateAmountType}
                            className={amountTypeError ? "border-red-500" : "border-gray-300"}
                        />
                        {amountTypeError && <span className="text-xs text-red-500">{amountTypeError}</span>}
                    </div>
                </div>
            </div>

            <div className="py-2">
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-[#0083bf] hover:bg-[#0083bf]/90 text-white"
                >
                    Submit
                </Button>
            </div>
            {
                isLoading &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50 rounded-md'>
                    <Loadingoverlay visible={true} overlayBg='' />
                </div>
            }
            {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

        </div>
    );
}

export default Addamenities;
