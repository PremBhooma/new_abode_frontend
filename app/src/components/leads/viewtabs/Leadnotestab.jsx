import React, { useState } from 'react';
import { Button, Textarea } from '@nayeshdaggula/tailify';
import { IconSend, IconNotebook, IconHistory } from '@tabler/icons-react';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Errorpanel from '../../shared/Errorpanel';
import Leadapi from '../../api/Leadapi';
import Leadnotelists from './Leadnotelists';

function Leadnotestab() {
    const [noteMessage, setNoteMessage] = useState('');
    const [noteError, setNoteError] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const access_token = useEmployeeDetails((state) => state.access_token);
    const permissions = useEmployeeDetails((state) => state.permissions);
    const params = useParams();

    const leadId = params?.leadId;
    const user_id = employeeInfo?.id || null;
    const employeeId = employeeInfo?.id || null;

    const updateNote = (e) => {
        setNoteMessage(e.target.value);
        if (noteError) setNoteError('');
    };

    const submitNote = async () => {
        if (!noteMessage.trim()) {
            setNoteError('Please enter a note message');
            return;
        }

        setIsLoadingEffect(true);
        try {
            const response = await Leadapi.post(
                'add-lead-note',
                {
                    user_id,
                    note: noteMessage,
                    leadId,
                    employeeId: employeeId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            const { data } = response;
            if (data.status === 'error') {
                setErrorMessage(data.message);
                toast.error(data.message);
            } else {
                toast.success(data.message);
                setNoteMessage('');
                setRefreshKey((prev) => prev + 1);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add note';
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoadingEffect(false);
        }
    };

    return (
        <div className="flex flex-col w-full gap-4 animate-in fade-in duration-500">
            {/* Add Note Section */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                        <IconNotebook size={18} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">Add New Note</h3>
                </div>

                <div className="p-4 flex flex-col gap-3">
                    <div className="relative">
                        <Textarea
                            placeholder="Type your clinical notes or follow-up details here..."
                            value={noteMessage}
                            onChange={updateNote}
                            className={`min-h-[100px] w-full rounded-md border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 text-slate-700 transition-all duration-200 bg-slate-50/30 ${noteError ? 'border-red-300 ring-red-500/10' : ''}`}
                            textareaClassName={`min-h-[100px] !p-0 !text-[12px] !leading-relaxed !rounded-lg !border-0 !bg-transparent focus:!ring-0`}
                        />
                        {noteError && (
                            <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {noteError}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div className="text-[11px] text-slate-400 italic">
                            Character count: {noteMessage.length}
                        </div>
                        <div className="flex gap-3">
                            {permissions?.leads_page?.includes("add_notes_in_lead") && (
                                <Button
                                    onClick={submitNote}
                                    disabled={isLoadingEffect}
                                    className="!h-[30px] !px-5 text-[12px] !bg-[#0083bf] hover:!bg-[#0083bf]/90 !text-white !font-semibold !rounded-lg !shadow-sm hover:!shadow-blue-500/20 !border-0 transition-all duration-200 flex items-center gap-2 active:scale-[0.98] disabled:!opacity-60"
                                >
                                    {isLoadingEffect ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Save Note
                                            <IconSend size={14} />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mt-2">
                            <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
                        </div>
                    )}
                </div>
            </div>

            {/* Notes List Section */}
            <div className="flex flex-col w-full gap-4">
                <div className="flex items-center gap-2 px-1 border-b border-slate-100 pb-3">
                    <IconHistory size={20} className="text-slate-400" />
                    <h4 className="font-bold text-slate-800 text-[15px] tracking-tight">Note History</h4>
                    <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium ml-auto">RECENT FIRST</span>
                </div>

                <div className="flex w-full">
                    <Leadnotelists refreshKey={refreshKey} />
                </div>
            </div>
        </div>
    );
}

export default Leadnotestab;
