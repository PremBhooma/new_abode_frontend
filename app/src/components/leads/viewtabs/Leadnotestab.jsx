import { Button, Textarea } from '@nayeshdaggula/tailify';
import { IconSend } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Errorpanel from '../../shared/Errorpanel';
import Customerapi from '../../api/Customerapi';
import Customernotelists from './Leadnotelists';
import Leadapi from '../../api/Leadapi';
import Leadnotelists from './Leadnotelists';

function Leadnotestab() {
    const [noteMessage, setNoteMessage] = useState('');
    const [noteError, setNoteError] = useState('');

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshKey, setRefreshKey] = useState(0); // Trigger for refreshing notes

    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const access_token = useEmployeeDetails((state) => state.access_token);
    const user_id = employeeInfo?.id || null;
    const permissions = useEmployeeDetails((state) => state.permissions);
    const params = useParams();
    const lead_uuid = params?.lead_uuid;
    const employeeId = employeeInfo?.id || null;

    const updateNote = (e) => {
        setNoteMessage(e.target.value);
        setNoteError(''); // Clear error on input change
    };

    const submitNote = async () => {
        setIsLoadingEffect(true);

        if (noteMessage.trim() === '') {
            setNoteError('Note is required');
            setIsLoadingEffect(false);
            return false;
        }

        try {
            const response = await Leadapi.post(
                'add-lead-note', // Changed from add-flat-note
                {
                    user_id,
                    note: noteMessage,
                    lead_uuid, // Changed from flat_uuid
                    employeeId: employeeId
                },
                {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            const data = response.data;
            if (data.status === 'error') {
                setErrorMessage(data.message);
                toast.error(data.message);
                setIsLoadingEffect(false);
                return false;
            }
            toast.success(data.message);
            setNoteMessage('');
            setIsLoadingEffect(false);
            setRefreshKey((prev) => prev + 1); // Trigger refresh in Customernotelists
            return false;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add note';
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
            setIsLoadingEffect(false);
            return false;
        }
    };

    return (
        <div className="flex flex-col w-full gap-4">
            <div className={`flex flex-row w-full h-[40px] items-stretch bg-white rounded-sm border border-gray-200  transition-shadow duration-200 ${noteError ? 'border-0' : ''}`}>
                <div className="flex-1">
                    <Textarea
                        placeholder="Type your note here..."
                        inputClassName="w-full !h-[40px] px-4 !py-0 text-sm border-0 rounded-l-lg focus:outline-none focus:ring-0 placeholder-gray-500 resize-none"
                        variant="light"
                        value={noteMessage}
                        onChange={updateNote}
                        textareaClassName={`!h-[40px] w-full !rounded-none !rounded-tr-0 !rounded-br-0 !rounded-l-sm !bg-transparent focus:!ring-0 ${noteError ? 'border-red-300 bg-red-50' : 'border-transparent'} test rounded-l-lg`}
                    />
                    {noteError && (
                        <p className="text-red-500 text-xs mb-4 ">{noteError}</p>
                    )}
                    {errorMessage && (
                        <div className="mt-1">
                            <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
                        </div>
                    )}
                </div>

                <div className="flex items-stretch border-l border-gray-200 w-[20%]">
                    {permissions?.leads_page?.includes("add_notes_in_lead") ? (
                        <Button
                            radius="none"
                            variant="default"
                            className="!h-[40px] !w-full !bg-gradient-to-r !from-[#0083bf] !to-[#006ba3] hover:!from-[#006ba3] hover:!to-[#005a8a] !border-0  !rounded-none !rounded-tr-sm !rounded-br-sm !text-sm !font-medium !text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={submitNote}
                            disabled={isLoadingEffect}
                        >
                            {isLoadingEffect ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Add Note
                                    <IconSend size={16} color="#fff" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            radius="none"
                            variant="default"
                            className="!h-[40px] !w-full !bg-gradient-to-r !from-[#0083bf] !to-[#006ba3] hover:!from-[#006ba3] hover:!to-[#005a8a] !border-0  !rounded-none !rounded-tr-sm !rounded-br-sm !text-sm !font-medium !text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={true}
                        >
                            Add Note
                            <IconSend size={16} color="#fff" />
                        </Button>
                    )}
                </div>
            </div>


            <p className='font-semibold border-b-[0.8px] py-2'>All Notes</p>
            <div className="flex w-full">
                <Leadnotelists refreshKey={refreshKey} />
            </div>
        </div>
    );
}

export default Leadnotestab;