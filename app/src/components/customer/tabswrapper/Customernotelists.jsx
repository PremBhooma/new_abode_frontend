import React, { useEffect, useState } from 'react';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconClock, IconMessage2, IconDotsVertical } from '@tabler/icons-react';
import Errorpanel from '../../shared/Errorpanel';
import Customerapi from '../../api/Customerapi';

function Customernotelists({ refreshKey }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const access_token = useEmployeeDetails((state) => state.access_token);
    const params = useParams();
    const customerId = params?.customerId;

    const user_id = employeeInfo?.id || null;

    const [notesData, setNotesData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!customerId) return;

        async function getCustomerNotes() {
            setIsLoading(true);
            try {
                const response = await Customerapi.get('get-customer-notes', {
                    params: {
                        customerId,
                        user_id,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                const { data } = response;
                if (data.status === 'error') {
                    setErrorMessage(data.message);
                    toast.error(data.message);
                } else {
                    setNotesData(data.customer?.notes || []);
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || 'Failed to fetch notes';
                setErrorMessage(errorMsg);
                toast.error(errorMsg);
            } finally {
                setIsLoading(false);
            }
        }

        getCustomerNotes();
    }, [refreshKey, customerId, user_id, access_token]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (isLoading && notesData.length === 0) {
        return (
            <div className="w-full py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Loading history...</p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4 overflow-visible h-fit pb-10">
            {errorMessage && (
                <div className="mb-4">
                    <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
                </div>
            )}

            {notesData.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 w-full">
                    {notesData.map((note, index) => (
                        <div
                            key={note.id || index}
                            className="group relative flex flex-col w-full bg-white border border-slate-100 rounded-md p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 animate-in slide-in-from-bottom-2 duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm">
                                            <img
                                                src={note.user?.profile_pic_url}
                                                alt={note.user?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(note.user?.name || 'User')}&background=0083bf&color=fff`;
                                                }}
                                            />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                                    </div>
                                    <div className='text-left'>
                                        <h5 className="text-[14px] font-bold text-slate-800 leading-tight">
                                            {note.user?.name || 'System User'}
                                        </h5>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <IconClock size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                                                {formatTime(note.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <IconDotsVertical size={18} />
                                </button>
                            </div>

                            <div className="pl-[52px] pr-2">
                                <div className="bg-slate-50/50  rounded-xl p-3.5 border border-slate-50 relative group-hover:bg-blue-50/30 group-hover:border-blue-50 transition-colors duration-300">
                                    <IconMessage2 size={16} className="absolute -left-2 top-3 text-slate-200 group-hover:text-blue-100 transition-colors" />
                                    <p className="text-slate-700 text-left text-[14px] font-medium leading-relaxed whitespace-pre-wrap">
                                        {note.note_message}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 pl-[52px] flex items-center justify-end">
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                                    Customer Record • #{note.id?.toString().slice(-6).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                        <IconMessage2 size={32} className="text-slate-300" />
                    </div>
                    <h4 className="text-slate-800 font-bold text-[16px] mb-1">No notes recorded yet</h4>
                    <p className="text-slate-500 text-sm max-w-[280px]">
                        Start documenting customer-specific discussions and important details by adding your first note above.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Customernotelists;
