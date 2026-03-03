import React, { useEffect, useState } from 'react';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Errorpanel from '../../shared/Errorpanel';
import Customerapi from '../../api/Customerapi';

function Customernotelists({ refreshKey }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const access_token = useEmployeeDetails((state) => state.access_token);
    const user_id = employeeInfo?.id || null;

    const params = useParams();
    const customer_uuid = params?.customer_uuid;

    const [customerDetails, setCustomerDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    async function getCustomerNotes() {
        setIsLoadingEffect(true);
        try {
            const response = await Customerapi.get('get-customer-notes', {
                params: {
                    customer_uuid: customer_uuid,
                    user_id,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const data = response.data;
            if (data.status === 'error') {
                setErrorMessage(data.message);
                toast.error(data.message);
                setIsLoadingEffect(false);
                return false;
            }
            setCustomerDetails(data.customer);
            setIsLoadingEffect(false);
            return false;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to fetch notes';
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
            setIsLoadingEffect(false);
            return false;
        }
    }

    useEffect(() => {
        getCustomerNotes();
    }, [refreshKey]);

    return (
        <div className="flex w-full overflow-y-auto h-fit max-h-[45vh]">
            {errorMessage && (
                <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
            )}
            {isLoadingEffect ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : customerDetails?.notes?.length > 0 ? (
                <div className="space-y-2 flex flex-col w-full">
                    {customerDetails.notes.map((note) => (
                        <div
                            key={note.id}
                            className="flex w-full items-start justify-between p-2 border border-[#91cce9] rounded-[4px] bg-[#f6faff] gap-3"
                        >
                            {/* Note Message Section - Left Side */}
                            <div className="flex-1 flex-col text-left">
                                <p className='text-[13px] text-[#014262] font-medium'>Note:</p>
                                <p className="text-[#014262] text-[14px] font-normal capitalize">
                                    {note.note_message}
                                </p>
                            </div>

                            {/* User Details Section - Right Side */}
                            <div className="flex flex-row items-center gap-1 mt-auto">
                                <div className="text-right">
                                    <p className="text-[#014262] text-[12px] font-medium">
                                        {note.user.name}
                                    </p>
                                    <p className="text-[10px] text-[#2c6f8c]">
                                        {new Date(note.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <img
                                    crossOrigin="anonymous"
                                    src={note.user.profile_pic_url || './assets/user_avatar.jpg'}
                                    alt={`${note.user.name}'s profile`}
                                    className="w-10 h-10 rounded-full object-cover"
                                // onError={(e) => {
                                //     e.target.src = '/assets/user_avatar.jpg';
                                // }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex mx-auto text-gray-500 text-center">No notes found.</div>
            )}
        </div>
    );
}

export default Customernotelists;