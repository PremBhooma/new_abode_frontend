'use client'
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loadingoverlay, Textinput } from '@nayeshdaggula/tailify';
import Groupownerapi from '../../api/Groupownerapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';

function Addgroupowner({ refreshGroupOwner }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [groupOwnerName, setGroupOwnerName] = useState('')
    const [groupOwnerNameError, setGroupOwnerNameError] = useState('')
    const updateGroupOwnerName = (e) => {
        setGroupOwnerName(e.target.value)
        setGroupOwnerNameError('')
    }

    const [isDefault, setIsDefault] = useState(false);
    const handleDefault = () => {
        setIsDefault((prev) => !prev);
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        if (groupOwnerName === "") {
            setIsLoading(false)
            setGroupOwnerNameError("Please enter a group/owner name")
            return false
        }

        await Groupownerapi.post('add-group-owner', {
            group_owner: groupOwnerName,
            isDefault: isDefault,
        }, {
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${access_token}`,
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
                setGroupOwnerName('')
                setIsDefault(false);
                toast.success("Group/Owner created successfully", {
                    position: "top-right",
                    autoClose: 2000,
                })
                refreshGroupOwner()
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
                    <Textinput
                        label='Add Group/Owner Name'
                        labelClassName='!font-medium !text-[16px]'
                        placeholder="Enter Group/Owner Name"
                        inputClassName='!bg-white !border-[#ebecef]'
                        value={groupOwnerName}
                        onChange={updateGroupOwnerName}
                        error={groupOwnerNameError}
                    />
                    <div className="text-sm font-medium text-[#4b5563]">
                        Note: If enabled, employees will have permission to add or update the group/owner in flats. If disabled, employees will not have permission to make any changes
                    </div>
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
            </div>

            <div className="py-2">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="cursor-pointer flex justify-center w-full items-center gap-2 px-4 py-2.5 rounded-md hover:bg-[#0083bf] hover:text-white text-[#0083bf] border-[0.8px] border-[#0083bf]"
                >
                    <p className="text-sm font-medium">Submit</p>
                </button>
            </div>
            {
                isLoading &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                    <Loadingoverlay visible={true} overlayBg='' />
                </div>
            }
            {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

        </div>
    );
}

export default Addgroupowner;
