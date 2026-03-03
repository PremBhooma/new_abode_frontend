import { useState, useEffect } from "react";
import { Text } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import { format, formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import Leadapi from "../../api/Leadapi.jsx";
import profileStatic from "../../../../public/assets/customer_static_image.jpg";

const Leadactivities = ({ leadUuid, refreshTrigger }) => {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const access_token = useEmployeeDetails((state) => state.access_token);
    const employee_uuid = employeeInfo?.uuid || null;

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [leadActivities, setLeadActivities] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const limit = 5;

    const formatTime = (datetimeString) => {
        const date = typeof datetimeString === "string" ? parseISO(datetimeString) : new Date(datetimeString);
        const daysDiff = differenceInDays(new Date(), date);
        if (daysDiff >= 1) {
            return format(date, "dd MMM yyyy, hh:mm a");
        }
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const getLeadActivities = async (loadMore = false) => {
        const currentOffset = loadMore ? offset + limit : 0;
        setIsLoadingEffect(!loadMore);
        setIsLoadingMore(loadMore);

        try {
            const response = await Leadapi.get(`get-lead-activies`, {
                params: {
                    employee_uuid: employee_uuid,
                    lead_uuid: leadUuid,
                    limit: limit,
                    offset: currentOffset,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            });

            const data = response.data;
            if (data.status === "error") {
                setErrorMessage(data.message);
                return;
            }

            setLeadActivities((prev) => (loadMore ? [...prev, ...data.activities] : data.activities));

            setHasMore(data.hasMore);
            setOffset(currentOffset);
            setErrorMessage("");
        } catch (error) {
            console.log(error);
            const finalresponse = {
                message: error.message,
                server_res: error.response?.data || null,
            };
            setErrorMessage(finalresponse);
        } finally {
            setIsLoadingEffect(false);
            setIsLoadingMore(false);
        }
    };

    const loadMoreActivities = () => {
        getLeadActivities(true);
    };

    useEffect(() => {
        getLeadActivities();
    }, [leadUuid, refreshTrigger]);

    //     useEffect(() => {
    //     fetchActivities();
    //   }, [refreshTrigger]);

    if (isLoadingEffect) {
        return (
            <div className="flex flex-col justify-start gap-[5px] items-center h-[150px]">
                <h1>Loading</h1>
            </div>
        );
    }

    if (leadActivities?.length === 0) {
        return (
            <div className="flex flex-col justify-center gap-[10px] items-center h-[150px]">
                <Text className="!text-[14px] text-gray-400">No activities found</Text>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-[22px] text-left font-bold text-[#2b2b2b]/90 pb-2 sticky top-0 bg-white z-10">Activities</h1>

            {/* Scrollable container with fixed height */}
            <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-[#0083bf]/20 scrollbar-track-gray-100">
                {leadActivities?.map((ele, index) => (
                    <div className="mt-2 flex gap-3" key={`taskactivity-${ele.id}`}>
                        <div className={`flex flex-col align-middle ${index !== leadActivities.length - 1 ? "justify-center" : "justify-start"} items-center gap-2`}>
                            <div className={`${index !== leadActivities.length - 1 ? "min-w-[30px] w-[30px] min-h-[30px] h-[45px]" : "min-w-[30px] w-[30px] min-h-[30px] h-[30px]"} rounded-full overflow-hidden flex justify-center items-center bg-gray-200`}>
                                <img crossOrigin="anonymous" src={ele?.employee?.profilePicture?.trim() ? ele.employee.profilePicture : profileStatic} alt={ele?.employee_short_name} className="w-full h-full object-cover" />
                            </div>

                            {index !== leadActivities.length - 1 && <div className="h-full" style={{ border: "0.2px solid #cbcbcb" }}></div>}
                        </div>

                        <div className="w-full flex flex-col gap-3 pb-4">
                            <div className="flex flex-col justify-start relative gap-1">
                                <p className="text-xs text-left text-[#2b2b2b] flex items-center gap-2">{ele?.ca_message}</p>
                                <div className="flex flex-row items-center gap-1">
                                    <p className="text-xs text-left text-[#2b2b2b]/50">{formatTime(ele?.created_at)}</p>
                                    <p className="text-[11px] ml-[5px] text-left text-[#2b2b2b]/50">- By {ele?.employee?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoadingMore && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#0083bf]"></div>
                    </div>
                )}
            </div>

            {hasMore && !isLoadingMore && (
                <div className="flex justify-center mt-2 pt-2 border-t border-gray-200 sticky bottom-0 bg-white">
                    <button onClick={loadMoreActivities} className="px-4 py-2 bg-[#0083bf] text-white rounded hover:bg-[#0083bf]/90 transition-colors cursor-pointer text-sm">
                        Load More Activities
                    </button>
                </div>
            )}
        </div>
    );
};

export default Leadactivities;
