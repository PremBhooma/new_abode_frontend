'use client'
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loadingoverlay, Select, Textinput } from '@nayeshdaggula/tailify';
import Settingsapi from '../../api/Settingsapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';

function Addleadstage({ refreshLeadStage }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [leadStageName, setLeadStageName] = useState('')
    const [leadStageNameError, setLeadStageNameError] = useState('')
    const updateLeadStageName = (e) => {
        setLeadStageName(e.target.value)
        setLeadStageNameError('')
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        if (leadStageName === "") {
            setIsLoading(false)
            setLeadStageNameError("Please enter a lead stage")
            return false
        }

        await Settingsapi.post('/add-lead-stage', {
            name: leadStageName,
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
                setLeadStageName('')
                toast.success("Block created successfully", {
                    position: "top-right",
                    autoClose: 2000,
                })
                refreshLeadStage()
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
                        label='Add Lead Stage'
                        labelClassName='!font-medium !text-[16px]'
                        placeholder="Enter Lead Stage"
                        inputClassName='!bg-white !border-[#ebecef]'
                        value={leadStageName}
                        onChange={updateLeadStageName}
                        error={leadStageNameError}
                    />

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

export default Addleadstage;
