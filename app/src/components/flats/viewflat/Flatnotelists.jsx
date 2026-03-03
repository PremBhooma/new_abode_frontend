import React, { useEffect, useState } from 'react';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { useParams } from 'react-router-dom';
import Flatapi from '../../api/Flatapi';
import { toast } from 'react-toastify';
import Errorpanel from '../../shared/Errorpanel';
import defaultuser from '../../../../public/assets/user_avatar.jpg'

function Flatnotelists({ refreshKey }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const access_token = useEmployeeDetails((state) => state.access_token);
    const user_id = employeeInfo?.id || null;

    const { uuid: flat_uuid } = useParams();

    const [flatDetails, setFlatDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    async function getFlatNotes() {
        setIsLoadingEffect(true);
        try {
            const response = await Flatapi.get('get-flat-notes', {
                params: {
                    flat_uuid,
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
            setFlatDetails(data.flat);
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
        getFlatNotes();
    }, [refreshKey]);

    console.log("flatDetails:", flatDetails)

    return (
        <div className="flex w-full overflow-y-auto  h-[50vh]">
            {errorMessage && (
                <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
            )}
            {isLoadingEffect ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : flatDetails?.notes?.length > 0 ? (
                <div className="space-y-2 flex flex-col w-full">
                    {flatDetails.notes.map((note) => (
                        <div
                            key={note.id}
                            className="flex w-full items-start justify-between p-2 border border-[#91cce9] rounded-[4px] bg-[#e3eef357] gap-4"
                        >
                            {/* Note Message Section - Left Side */}
                            {/* <div className="flex flex-1 flex-col text-left h-fit w-[70%]">
                                <p className='text-[13px] text-[#014262] font-medium'>Note:</p>
                                <p className="text-[#014262] text-[14px] font-normal flex text-wrap w-[200px]">
                                    {note.note_message}
                                </p>
                            </div> */}
                            <div className="flex flex-1 flex-col text-left h-fit w-[70%]">
                                <p className='text-[13px] text-[#014262] font-medium'>Note:</p>
                                <p className="text-[#014262] text-[14px] font-normal w-[400px] break-words whitespace-pre-wrap">
                                    {note.note_message}
                                </p>
                            </div>


                            {/* User Details Section - Right Side */}
                            <div className="flex flex-row items-end justify-end gap-1 mt-auto w-[30%]">
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
                                    src={note?.user?.profile_pic_url || defaultuser}
                                    alt={`${note.user.name}'s profile`}
                                    className="w-10 h-10 rounded-full object-cover"
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

export default Flatnotelists;