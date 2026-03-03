'use client'
import React, { useState, useEffect } from 'react'
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { Text } from '@nayeshdaggula/tailify';
import Flatapi from '../../api/Flatapi';
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import profileStatic from "../../../../public/assets/customer_static_image.jpg";
import { NavLink } from 'react-router';

function Activitiestab({ flat_uuid }) {
    const employeeInfo = useEmployeeDetails(state => state.employeeInfo);
    const access_token = useEmployeeDetails(state => state.access_token);
    const permissions = useEmployeeDetails(state => state.permissions);
    const employee_uuid = employeeInfo?.uuid || null;

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [taskActvities, setTaskActvities] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const limit = 5; // Initial limit

    const formatTime = (datetimeString) => {
        const date = typeof datetimeString === 'string' ? parseISO(datetimeString) : new Date(datetimeString);
        const daysDiff = differenceInDays(new Date(), date);
        if (daysDiff >= 1) {
            return format(date, 'dd MMM yyyy, hh:mm a');
        }
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const getTasksactivities = async (loadMore = false) => {
        const currentOffset = loadMore ? offset + limit : 0;
        setIsLoadingEffect(!loadMore);
        setIsLoadingMore(loadMore);

        try {
            const response = await Flatapi.get(`flat/activities`, {
                params: {
                    employee_uuid: employee_uuid,
                    flat_uuid: flat_uuid,
                    limit: limit,
                    offset: currentOffset
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });

            const data = response.data;
            if (data.status === "error") {
                setErrorMessage(data.message);
                return;
            }

            setTaskActvities(prev =>
                loadMore ? [...prev, ...data.activities] : data.activities
            );
            setHasMore(data.hasMore);
            setOffset(currentOffset);
            setErrorMessage('');
        } catch (error) {
            console.log(error);
            let finalresponse;
            if (error.response !== undefined) {
                finalresponse = {
                    message: error.message,
                    server_res: error.response.data,
                };
            } else {
                finalresponse = {
                    message: error.message,
                    server_res: null,
                };
            }
            setErrorMessage(finalresponse);
        } finally {
            setIsLoadingEffect(false);
            setIsLoadingMore(false);
        }
    };

    const loadMoreActivities = () => {
        getTasksactivities(true);
    };

    useEffect(() => {
        getTasksactivities();
    }, [flat_uuid]);

    if (isLoadingEffect) {
        return (
            <div className="flex flex-col justify-start gap-[5px] items-center h-[150px]">
                <h1>Loading</h1>
            </div>
        )
    }

    if (taskActvities?.length === 0) {
        return (
            <div className="flex flex-col justify-center gap-[10px] items-center h-[150px]">
                <Text className="!text-[14px] text-gray-400">No activities found</Text>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-[22px] text-left font-bold text-[#2b2b2b]/90 pb-2">
                Activities
            </h1>

            {/* Scrollable container */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-330px)] pr-2">
                {taskActvities?.map((taskActivity, index) => (
                    <div className="mt-2 flex gap-3" key={`taskactivity-${index}`}>
                        <div
                            className={`flex flex-col align-middle ${index !== taskActvities.length - 1 ? "justify-center" : "justify-start"
                                } items-center gap-2`}
                        >
                            <div
                                className={`${index !== taskActvities.length - 1
                                        ? "min-w-[30px] w-[30px] min-h-[30px] h-[45px]"
                                        : "min-w-[30px] w-[30px] min-h-[30px] h-[30px]"
                                    } rounded-full overflow-hidden flex justify-center items-center bg-gray-200`}
                            >
                                <img
                                    crossOrigin="anonymous"
                                    src={
                                        taskActivity?.profilePicture?.trim()
                                            ? taskActivity.profilePicture
                                            : profileStatic
                                    }
                                    alt={taskActivity?.employee_short_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {index !== taskActvities.length - 1 && (
                                <div className="h-full" style={{ border: "0.2px solid #cbcbcb" }}></div>
                            )}
                        </div>

                        <div className="w-full flex flex-col gap-3 pb-4">
                            <div className="flex flex-col justify-start relative gap-1">
                                <p className="text-xs text-left text-[#2b2b2b] flex items-center gap-2">
                                    {taskActivity?.ta_message}
                                </p>
                                <div className="flex flex-row items-center gap-1">
                                    <p className="text-xs text-left text-[#2b2b2b]/50">
                                        {formatTime(taskActivity?.created_at)}
                                    </p>
                                    <NavLink to={`/single-employee-view/${taskActivity?.employee_id}`}>
                                        <p className="text-[11px] ml-[5px] text-left text-[#2b2b2b]/50">
                                            - By {taskActivity?.employee_name}
                                        </p>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoadingMore && (
                    <div className="flex justify-center py-4">
                        <p>Loading more activities...</p>
                    </div>
                )}
            </div>

            {hasMore && !isLoadingMore && (
                <div className="flex justify-center mt-2 pt-2 border-t border-gray-200">
                    <button
                        onClick={loadMoreActivities}
                        className="px-3 py-1 bg-[#0083bf] text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );


}

export default Activitiestab;