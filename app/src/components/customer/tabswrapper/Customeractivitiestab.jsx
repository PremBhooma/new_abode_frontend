"use client";
import React, { useState, useEffect } from "react";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import profileStatic from "@/assets/customer_static_image.jpg";
import { Text } from "@nayeshdaggula/tailify";
import {
  format,
  formatDistanceToNow,
  differenceInDays,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  Clock,
  Plus,
  Trash2,
  PhoneIncoming,
  Pencil,
  ChevronDown
} from "lucide-react";
import Customerapi from "../../api/Customerapi";

function Customeractivitiestab({ customerId }) {
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const access_token = useEmployeeDetails((state) => state.access_token);
  const employeeId = employeeInfo?.id || null;

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [taskActvities, setTaskActvities] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 5; // Initial limit

  const formatTime = (datetimeString) => {
    const date =
      typeof datetimeString === "string"
        ? parseISO(datetimeString)
        : new Date(datetimeString);
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff >= 1) {
      return format(date, "dd MMM yyyy, hh:mm a");
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getTasksactivities = async (loadMore = false) => {
    const currentOffset = loadMore ? offset + limit : 0;
    setIsLoadingEffect(!loadMore);
    setIsLoadingMore(loadMore);

    try {
      const response = await Customerapi.get(`customeractivities`, {
        params: {
          employeeId: employeeId,
          customerId: customerId,
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

      setTaskActvities((prev) =>
        loadMore ? [...prev, ...data.activities] : data.activities
      );

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
    getTasksactivities(true);
  };

  useEffect(() => {
    getTasksactivities();
  }, [customerId]);

  const groupedActivities = taskActvities.reduce((acc, activity) => {
    const date = format(parseISO(activity.created_at), "dd.MM.yyyy");
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return (
      new Date(groupedActivities[b][0].created_at) -
      new Date(groupedActivities[a][0].created_at)
    );
  });

  const getActivityIcon = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("assigned") || msg.includes("add"))
      return <Plus className="w-4 h-4 text-blue-500" />;
    if (msg.includes("delete") || msg.includes("remove"))
      return <Trash2 className="w-4 h-4 text-gray-500" />;
    if (msg.includes("call"))
      return <PhoneIncoming className="w-4 h-4 text-teal-600" />;
    if (
      msg.includes("update") ||
      msg.includes("edit") ||
      msg.includes("address")
    )
      return <Pencil className="w-4 h-4 text-blue-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === "resolved")
      return "bg-green-100 text-green-700 border-green-200";
    if (
      status?.toLowerCase() === "in work" ||
      status?.toLowerCase() === "pending"
    )
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (isLoadingEffect) {
    return (
      <div className="flex flex-col justify-center items-center h-[200px] gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0083bf]"></div>
        <p className="text-sm text-gray-500 font-medium">Fetching activities...</p>
      </div>
    );
  }

  if (taskActvities?.length === 0) {
    return (
      <div className="flex flex-col justify-center gap-2 items-center h-[200px] bg-gray-50/50 rounded-xl border border-dashed border-gray-200 m-4">
        <Clock className="w-8 h-8 text-gray-300" />
        <Text className="!text-[14px] text-gray-400 font-medium">
          No activities found yet
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="pb-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center sticky top-0 z-20 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-gray-800">Activity Timeline</h1>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Live Tracking
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent max-h-[400px]">
        <div className="space-y-8 relative">
          {/* Central Line - drawn once for the whole timeline */}
          <div className="absolute left-[139px] top-4 bottom-4 w-px border-l border-dashed border-gray-300 pointer-events-none"></div>

          {sortedDates.map((date) => (
            <div key={date} className="relative">
              {groupedActivities[date].map((activity, idx) => (
                <div
                  key={activity.id}
                  className="flex gap-6 mb-8 last:mb-0 relative group"
                >
                  {/* Date Column */}
                  <div className="w-[100px] flex-shrink-0 pt-1 text-right">
                    {idx === 0 && (
                      <span className="text-[13px] font-bold text-gray-800 tracking-tight">
                        {date}
                      </span>
                    )}
                  </div>

                  {/* Icon Column */}
                  <div className="relative flex flex-col items-center">
                    <div className="z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      {getActivityIcon(activity.ca_message)}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 pt-0.5 pb-2">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-[14px] text-left leading-relaxed text-gray-700">
                        {/* Simple bolding for key words - usually product or agent names */}
                        {activity.ca_message.split(" ").map((word, i) => {
                          const isSpecial =
                            word.startsWith("A1") ||
                            word.includes("Smart") ||
                            activity.employee?.name.includes(word);
                          return (
                            <span
                              key={i}
                              className={
                                isSpecial ? "font-semibold text-gray-900" : ""
                              }
                            >
                              {word}{" "}
                            </span>
                          );
                        })}
                      </p>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-400 font-medium">
                          {formatTime(activity.created_at)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="text-[11px] text-gray-500 font-semibold hover:text-primary cursor-default">
                            {activity.employee?.name}
                          </span>
                        </div>
                      </div>

                      {/* Detail Card for specific actions like calls (similar to design) */}
                      {activity.ca_message.toLowerCase().includes("call") && (
                        <div className="mt-3 p-3 bg-gray-50/80 rounded-lg border border-gray-100 flex flex-wrap items-center gap-y-2 gap-x-4">
                          <div className="flex items-center bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                            <span className="text-[11px] font-medium text-gray-600">
                              Root tag
                            </span>
                            <span className="mx-1 text-gray-300 text-[10px]">
                              →
                            </span>
                            <span className="text-[11px] font-medium text-gray-600">
                              Child tag
                            </span>
                          </div>

                          <div className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                            <Pencil className="w-3 h-3" />
                            Notes Logged
                          </div>

                          <div
                            className={cn(
                              "ml-auto text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                              getStatusColor(activity.status || "Resolved")
                            )}
                          >
                            {activity.status || "Resolved"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {isLoadingMore && (
            <div className="flex justify-center pt-4 pb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#0083bf]"></div>
                <span className="text-xs font-medium text-gray-500">
                  Loading more...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasMore && !isLoadingMore && (
        <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex justify-center sticky bottom-0 z-20 backdrop-blur-sm">
          <button
            onClick={loadMoreActivities}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 cursor-pointer uppercase tracking-widest"
          >
            Load More Activities
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );


}

export default Customeractivitiestab;
