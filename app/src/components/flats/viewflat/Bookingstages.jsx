// import React, { useEffect, useId, useState } from "react";
// import Flatapi from "../../api/Flatapi";

// function Bookingstages({
//   flat_uuid,
  
// }) {

//   const stages = ["Booking", "Agreement", "Loan Process", "Hand over"]
//   const durationsDays = [30, 60, 30] // Days for each stage transition
//   const inactiveColor = "#d1d5db"

//   // Arrow props
//   const arrowLength = 100
//   const arrowStrokeWidth = 1.5
//   const arrowHeadWidth = 6
//   const arrowHeadHeight = 6
//   const arrowHeadRefX = 5.5

//   // Circle props
//   const circleSize = 40
//   const activeColor = "#0083bf"
//   const completedColor = "#10b981" // Green for completed stages
//   const stageActiveColors = ""
//   const id = useId();
//   const grayMarkerId = `${id}-gray`;
//   const activeMarkerId = `${id}-active`;
//   const completedMarkerId = `${id}-completed`;

//   const VIEWBOX_W = arrowLength;
//   const VIEWBOX_H = 6;
//   const LINE_Y = VIEWBOX_H / 2;

//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [flatStages, setFlatStages] = useState([]);

//   // Fetch flat booking stages from API
//   const fetchFlatStages = async (flat_uuid) => {
//     setIsLoading(true);
//     setErrorMessage(null);

//     try {
//       const response = await Flatapi.get("get-flat-stages", {
//         params: { flat_uuid },
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = response?.data;

//       if (data?.status === "error") {
//         setErrorMessage(data?.message);
//       } else {
//         setFlatStages(data?.flat_stages || []);
//       }
//     } catch (error) {
//       console.log(error);
//       let finalresponse;
//       if (error.response !== undefined) {
//         finalresponse = {
//           message: error.message,
//           server_res: error.response.data,
//         };
//       } else {
//         finalresponse = {
//           message: error.message,
//           server_res: null,
//         };
//       }
//       setErrorMessage(finalresponse);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (flat_uuid) fetchFlatStages(flat_uuid);
//   }, [flat_uuid]);

//   // Get the current active stage index based on API response
//   const getCurrentStageIndex = () => {
//     if (!flatStages.length) return -1;
    
//     // Find the highest stage index that exists in the response
//     let currentIndex = -1;
//     flatStages.forEach(apiStage => {
//       const stageIndex = stages.findIndex(stage => 
//         stage.toLowerCase() === apiStage.name.toLowerCase()
//       );
//       if (stageIndex > currentIndex) {
//         currentIndex = stageIndex;
//       }
//     });
    
//     return currentIndex;
//   };

//   // Get stage creation date
//   const getStageCreatedDate = (stageName) => {
//     const apiStage = flatStages.find(stage => 
//       stage.name.toLowerCase() === stageName.toLowerCase()
//     );
//     return apiStage ? new Date(apiStage.created_at) : null;
//   };

//   // Calculate days left for next stage
//   const getDaysLeft = (stageIndex) => {
//     const currentStageIndex = getCurrentStageIndex();
    
//     // Only show days left for the current active stage transition
//     if (stageIndex !== currentStageIndex || stageIndex >= stages.length - 1) {
//       return null;
//     }

//     const currentStageDate = getStageCreatedDate(stages[stageIndex]);
//     if (!currentStageDate || !durationsDays[stageIndex]) {
//       return null;
//     }

//     const today = new Date();
//     const totalDays = durationsDays[stageIndex];
//     const endDate = new Date(currentStageDate);
//     endDate.setDate(currentStageDate.getDate() + totalDays);

//     const remaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
//     if (remaining < 0) {
//       return "Overdue";
//     }
    
//     return `${remaining} days left`;
//   };

//   // Check if stage is completed, active, or inactive
//   const getStageStatus = (stageIndex) => {
//     const currentStageIndex = getCurrentStageIndex();
    
//     if (stageIndex < currentStageIndex) return 'completed';
//     if (stageIndex === currentStageIndex) return 'active';
//     return 'inactive';
//   };

//   // Check if connector should be active
//   const isConnectorActive = (stageIndex) => {
//     const currentStageIndex = getCurrentStageIndex();
//     return stageIndex < currentStageIndex;
//   };

//   // Get color based on stage status
//   const getStageColor = (stageIndex) => {
//     const status = getStageStatus(stageIndex);
//     if (status === 'completed') return completedColor;
//     if (status === 'active') return stageActiveColors?.[stageIndex] || activeColor;
//     return inactiveColor;
//   };

//   // Get connector color and status
//   const getConnectorColor = (stageIndex) => {
//     return isConnectorActive(stageIndex) ? completedColor : inactiveColor;
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full flex justify-center py-8">
//         <div className="text-sm text-gray-500">Loading stages...</div>
//       </div>
//     );
//   }

//   if (errorMessage) {
//     return (
//       <div className="w-full flex justify-center py-8">
//         <div className="text-sm text-red-500">
//           Error loading stages: {typeof errorMessage === 'string' ? errorMessage : errorMessage.message}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-x-auto">
//       {/* Arrow head definitions */}
//       <svg width="0" height="0" className="absolute pointer-events-none">
//         <defs>
//           <marker
//             id={grayMarkerId}
//             viewBox="0 0 10 10"
//             markerWidth={arrowHeadWidth}
//             markerHeight={arrowHeadHeight}
//             refX={arrowHeadRefX}
//             refY="5"
//             orient="auto"
//             markerUnits="userSpaceOnUse"
//           >
//             <path d="M 0 0 L 10 5 L 0 10 z" fill={inactiveColor} />
//           </marker>
//           <marker
//             id={completedMarkerId}
//             viewBox="0 0 10 10"
//             markerWidth={arrowHeadWidth}
//             markerHeight={arrowHeadHeight}
//             refX={arrowHeadRefX}
//             refY="5"
//             orient="auto"
//             markerUnits="userSpaceOnUse"
//           >
//             <path d="M 0 0 L 10 5 L 0 10 z" fill={completedColor} />
//           </marker>
//           <marker
//             id={activeMarkerId}
//             viewBox="0 0 10 10"
//             markerWidth={arrowHeadWidth}
//             markerHeight={arrowHeadHeight}
//             refX={arrowHeadRefX}
//             refY="5"
//             orient="auto"
//             markerUnits="userSpaceOnUse"
//           >
//             <path d="M 0 0 L 10 5 L 0 10 z" fill={activeColor} />
//           </marker>
//         </defs>
//       </svg>

//       {/* Stages */}
//       <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
//         {stages.map((label, i) => {
//           const status = getStageStatus(i);
//           const stageColor = getStageColor(i);
//           const connectorActive = isConnectorActive(i);
//           const connectorColor = getConnectorColor(i);
//           const createdDate = getStageCreatedDate(label);

//           return (
//             <React.Fragment key={label}>
//               {/* Circle + label */}
//               <div className="flex flex-col items-center text-center min-w-[80px]">
//                 <div
//                   className={`flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 relative`}
//                   style={{
//                     width: circleSize,
//                     height: circleSize,
//                     borderColor: stageColor,
//                     backgroundColor: status === 'inactive' ? 'white' : stageColor,
//                     color: status === 'inactive' ? stageColor : 'white',
//                   }}
//                 >
//                   {status === 'completed' ? (
//                     // Checkmark for completed stages
//                     <svg 
//                       width="20" 
//                       height="20" 
//                       viewBox="0 0 24 24" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       strokeWidth="3"
//                     >
//                       <polyline points="20,6 9,17 4,12"></polyline>
//                     </svg>
//                   ) : (
//                     i + 1
//                   )}
                  
//                   {/* Pulse animation for active stage */}
//                   {/* {status === 'active' && (
//                     <div 
//                       className="absolute inset-0 rounded-full animate-ping"
//                       style={{ backgroundColor: stageColor, opacity: 0.3 }}
//                     />
//                   )} */}
//                 </div>
                
//                 {/* Stage label */}
//                 <span className={`mt-2 text-xs font-medium ${
//                   status === 'active' ? 'text-blue-600 font-semibold' : 
//                   status === 'completed' ? 'text-green-600' : 'text-gray-500'
//                 }`}>
//                   {label}
//                 </span>
                
//                 {/* Creation date */}
//                 {createdDate && (
//                   <span className="text-xs text-gray-400 mt-1">
//                     {createdDate.toLocaleDateString()}
//                   </span>
//                 )}
//               </div>

//               {/* Connector */}
//               {i < stages.length - 1 && (
//                 <div className="relative flex-1 mx-1 sm:mx-2">
//                   {/* Duration above connector */}
//                   <div className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs z-10">
//                     {(() => {
//                       const daysLeft = getDaysLeft(i);
//                       if (!daysLeft) return null;
                      
//                       const isOverdue = daysLeft === "Overdue";
//                       return (
//                         <span
//                           className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 font-medium ${
//                             isOverdue 
//                               ? 'bg-red-50 border-red-300 text-red-700'
//                               : status === 'active'
//                               ? 'bg-blue-50 border-blue-300 text-blue-700'
//                               : 'bg-gray-50 border-gray-300 text-gray-600'
//                           }`}
//                         >
//                           {daysLeft}
//                         </span>
//                       );
//                     })()}
//                   </div>

//                   {/* Arrow Line */}
//                   <svg
//                     className="w-full overflow-visible"
//                     style={{ height: 12 }}
//                     viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
//                     preserveAspectRatio="none"
//                   >
//                     <line
//                       x1="0"
//                       y1={LINE_Y}
//                       x2={VIEWBOX_W}
//                       y2={LINE_Y}
//                       stroke={connectorColor}
//                       strokeWidth={arrowStrokeWidth}
//                       markerEnd={`url(#${
//                         connectorActive ? completedMarkerId : grayMarkerId
//                       })`}
//                       className="transition-all duration-300"
//                     />
//                   </svg>
//                 </div>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>

//       {/* Debug info (remove in production) */}
//       {/* {process.env.NODE_ENV === 'development' && (
//         <div className="mt-4 text-xs text-gray-500">
//           <div>Current Stage: {getCurrentStageIndex() >= 0 ? stages[getCurrentStageIndex()] : 'None'}</div>
//           <div>API Stages: {flatStages.map(s => s.name).join(', ')}</div>
//         </div>
//       )} */}
//     </div>
//   );
// }

// export default Bookingstages;

import React, { useEffect, useId, useState } from "react";
import Flatapi from "../../api/Flatapi";

function Bookingstages({
  flat_uuid,
}) {
  const stages = ["Booking", "Agreement", "Loan Process", "Hand over"]
  const durationsDays = [30, 60, 30] // Days for each stage transition
  const inactiveColor = "#d1d5db"

  // Arrow props
  const arrowLength = 100
  const arrowStrokeWidth = 1.5
  const arrowHeadWidth = 6
  const arrowHeadHeight = 6
  const arrowHeadRefX = 5.5

  // Circle props
  const circleSize = 40
  const activeColor = "#0083bf"
  const completedColor = "#10b981" // Green for completed stages
  const stageActiveColors = ""
  const id = useId();
  const grayMarkerId = `${id}-gray`;
  const activeMarkerId = `${id}-active`;
  const completedMarkerId = `${id}-completed`;

  const VIEWBOX_W = arrowLength;
  const VIEWBOX_H = 6;
  const LINE_Y = VIEWBOX_H / 2;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [flatStages, setFlatStages] = useState([]);

  // Fetch flat booking stages from API
  const fetchFlatStages = async (flat_uuid) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await Flatapi.get("get-flat-stages", {
        params: { flat_uuid },
        headers: { "Content-Type": "application/json" },
      });

      const data = response?.data;

      if (data?.status === "error") {
        setErrorMessage(data?.message);
      } else {
        setFlatStages(data?.flat_stages || []);
      }
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flat_uuid) fetchFlatStages(flat_uuid);
  }, [flat_uuid]);

  // Get the current active stage index based on API response
  const getCurrentStageIndex = () => {
    if (!flatStages.length) return -1;
    
    // Find the highest stage index that exists in the response
    let currentIndex = -1;
    flatStages.forEach(apiStage => {
      const stageIndex = stages.findIndex(stage => 
        stage.toLowerCase() === apiStage.name.toLowerCase()
      );
      if (stageIndex > currentIndex) {
        currentIndex = stageIndex;
      }
    });
    
    return currentIndex;
  };

  // Get stage creation date
  const getStageCreatedDate = (stageName) => {
    const apiStage = flatStages.find(stage => 
      stage.name.toLowerCase() === stageName.toLowerCase()
    );
    return apiStage ? new Date(apiStage.created_at) : null;
  };

  // Get duration info for connector
  const getConnectorDuration = (stageIndex) => {
    const currentStageIndex = getCurrentStageIndex();
    const fromStage = stages[stageIndex];
    const toStage = stages[stageIndex + 1];
    
    // For completed transitions, show actual days taken
    if (stageIndex < currentStageIndex) {
      const fromDate = getStageCreatedDate(fromStage);
      const toDate = getStageCreatedDate(toStage);
      
      if (fromDate && toDate) {
        const daysTaken = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
        const expectedDays = durationsDays[stageIndex];
        
        return {
          text: `${daysTaken} days taken`,
          isCompleted: true,
          isOnTime: expectedDays ? daysTaken <= expectedDays : true,
          daysTaken,
          expectedDays
        };
      }
    }
    
    // For current active stage transition, show remaining days
    if (stageIndex === currentStageIndex && stageIndex < stages.length - 1) {
      const currentStageDate = getStageCreatedDate(fromStage);
      
      if (currentStageDate && durationsDays[stageIndex]) {
        const today = new Date();
        const totalDays = durationsDays[stageIndex];
        const endDate = new Date(currentStageDate);
        endDate.setDate(currentStageDate.getDate() + totalDays);

        const remaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        if (remaining < 0) {
          return {
            text: "Overdue",
            isCompleted: false,
            isOverdue: true
          };
        }
        
        return {
          text: `${remaining} days left`,
          isCompleted: false,
          isOnTime: true
        };
      }
    }
    
    return null;
  };

  // Check if stage is completed, active, or inactive
  const getStageStatus = (stageIndex) => {
    const currentStageIndex = getCurrentStageIndex();
    
    if (stageIndex < currentStageIndex) return 'completed';
    if (stageIndex === currentStageIndex) return 'active';
    return 'inactive';
  };

  // Check if connector should be active
  const isConnectorActive = (stageIndex) => {
    const currentStageIndex = getCurrentStageIndex();
    return stageIndex < currentStageIndex;
  };

  // Get color based on stage status
  const getStageColor = (stageIndex) => {
    const status = getStageStatus(stageIndex);
    if (status === 'completed') return completedColor;
    if (status === 'active') return stageActiveColors?.[stageIndex] || activeColor;
    return inactiveColor;
  };

  // Get connector color and status
  const getConnectorColor = (stageIndex) => {
    return isConnectorActive(stageIndex) ? completedColor : inactiveColor;
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="text-sm text-gray-500">Loading stages...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="text-sm text-red-500">
          Error loading stages: {typeof errorMessage === 'string' ? errorMessage : errorMessage.message}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Arrow head definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <marker
            id={grayMarkerId}
            viewBox="0 0 10 10"
            markerWidth={arrowHeadWidth}
            markerHeight={arrowHeadHeight}
            refX={arrowHeadRefX}
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={inactiveColor} />
          </marker>
          <marker
            id={completedMarkerId}
            viewBox="0 0 10 10"
            markerWidth={arrowHeadWidth}
            markerHeight={arrowHeadHeight}
            refX={arrowHeadRefX}
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={completedColor} />
          </marker>
          <marker
            id={activeMarkerId}
            viewBox="0 0 10 10"
            markerWidth={arrowHeadWidth}
            markerHeight={arrowHeadHeight}
            refX={arrowHeadRefX}
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={activeColor} />
          </marker>
        </defs>
      </svg>

      {/* Stages */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {stages.map((label, i) => {
          const status = getStageStatus(i);
          const stageColor = getStageColor(i);
          const connectorActive = isConnectorActive(i);
          const connectorColor = getConnectorColor(i);
          const createdDate = getStageCreatedDate(label);

          return (
            <React.Fragment key={label}>
              {/* Circle + label */}
              <div className="flex flex-col items-center text-center min-w-[80px]">
                <div
                  className={`flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 relative`}
                  style={{
                    width: circleSize,
                    height: circleSize,
                    borderColor: stageColor,
                    backgroundColor: status === 'inactive' ? 'white' : stageColor,
                    color: status === 'inactive' ? stageColor : 'white',
                  }}
                >
                  {status === 'completed' ? (
                    // Checkmark for completed stages
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3"
                    >
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                
                {/* Stage label */}
                <span className={`mt-2 text-xs font-medium ${
                  status === 'active' ? 'text-blue-600 font-semibold' : 
                  status === 'completed' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                
                {/* Creation date */}
                {createdDate && (
                  <span className="text-xs text-gray-400 mt-1">
                    {createdDate.toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Connector */}
              {i < stages.length - 1 && (
                <div className="relative flex-1 mx-1 sm:mx-2">
                  {/* Duration above connector */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs z-10">
                    {(() => {
                      const durationInfo = getConnectorDuration(i);
                      if (!durationInfo) return null;
                      
                      let badgeClass = '';
                      
                      if (durationInfo.isCompleted) {
                        // For completed stages - green if on time, orange if delayed
                        badgeClass = durationInfo.isOnTime
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'bg-orange-50 border-orange-300 text-orange-700';
                      } else if (durationInfo.isOverdue) {
                        // For overdue active stages
                        badgeClass = 'bg-red-50 border-red-300 text-red-700';
                      } else {
                        // For active stages with time left
                        badgeClass = 'bg-blue-50 border-blue-300 text-blue-700';
                      }

                      return (
                        <span
                          className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 font-medium ${badgeClass}`}
                          title={durationInfo.isCompleted && durationInfo.expectedDays ? 
                            `Expected: ${durationInfo.expectedDays} days` : undefined}
                        >
                          {durationInfo.text}
                          {durationInfo.isCompleted && durationInfo.expectedDays && (
                            <span className="ml-1 text-xs opacity-70">
                              (exp. {durationInfo.expectedDays})
                            </span>
                          )}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Arrow Line */}
                  <svg
                    className="w-full overflow-visible"
                    style={{ height: 12 }}
                    viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1={LINE_Y}
                      x2={VIEWBOX_W}
                      y2={LINE_Y}
                      stroke={connectorColor}
                      strokeWidth={arrowStrokeWidth}
                      markerEnd={`url(#${
                        connectorActive ? completedMarkerId : grayMarkerId
                      })`}
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Bookingstages;


// import React, { useEffect, useId, useState } from "react";

// function Bookingstages({
//   flat_uuid,
//   stages = ["Booking", "Agreement", "Loan Process", "Hand over"],
//   durationsDays = [30, 60, 30], // Days for each stage transition
//   inactiveColor = "#d1d5db",
  
//   // Test mode props
//   testMode = true,
//   mockStages = [], // For testing different scenarios
  
//   // Arrow props
//   arrowLength = 100,
//   arrowStrokeWidth = 1.5,
//   arrowHeadWidth = 6,
//   arrowHeadHeight = 6,
//   arrowHeadRefX = 5.5,

//   // Circle props
//   circleSize = 40,
//   activeColor = "#0083bf",
//   completedColor = "#10b981", // Green for completed stages
//   stageActiveColors,
// }) {
//   const id = useId();
//   const grayMarkerId = `${id}-gray`;
//   const activeMarkerId = `${id}-active`;
//   const completedMarkerId = `${id}-completed`;

//   const VIEWBOX_W = arrowLength;
//   const VIEWBOX_H = 6;
//   const LINE_Y = VIEWBOX_H / 2;

//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [flatStages, setFlatStages] = useState([]);

//   // Mock API responses for testing
//   const mockApiResponses = {
//     scenario1: [
//       { name: "Booking", created_at: "2024-01-15T10:00:00Z" }
//     ],
//     scenario2: [
//       { name: "Booking", created_at: "2024-01-15T10:00:00Z" },
//       { name: "Agreement", created_at: "2024-02-10T10:00:00Z" }
//     ],
//     scenario3: [
//       { name: "Booking", created_at: "2024-01-15T10:00:00Z" },
//       { name: "Agreement", created_at: "2024-02-10T10:00:00Z" },
//       { name: "Loan Process", created_at: "2024-03-15T10:00:00Z" }
//     ],
//     scenario4: [
//       { name: "Booking", created_at: "2024-01-15T10:00:00Z" },
//       { name: "Agreement", created_at: "2024-02-10T10:00:00Z" },
//       { name: "Loan Process", created_at: "2024-03-15T10:00:00Z" },
//       { name: "Hand over", created_at: "2024-04-20T10:00:00Z" }
//     ],
//     overdue: [
//       { name: "Booking", created_at: "2023-12-01T10:00:00Z" }
//     ],
//     recent: [
//       { name: "Booking", created_at: new Date().toISOString() }
//     ],
//     custom: mockStages
//   };

//   // Simulate API call with mock data
//   const fetchFlatStages = async (scenario = 'scenario1') => {
//     if (!testMode) {
//       // Original API call would go here
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage(null);

//     // Simulate network delay
//     setTimeout(() => {
//       try {
//         const mockResponse = mockApiResponses[scenario] || mockApiResponses.scenario1;
//         setFlatStages(mockResponse);
//         setIsLoading(false);
//       } catch (error) {
//         setErrorMessage("Mock API error");
//         setIsLoading(false);
//       }
//     }, 500);
//   };

//   useEffect(() => {
//     if (testMode) {
//       // Auto-fetch with scenario based on flat_uuid or use custom mock
//       const scenario = mockStages.length > 0 ? 'custom' : (flat_uuid || 'scenario1');
//       fetchFlatStages(scenario);
//     }
//   }, [flat_uuid, testMode, mockStages]);

//   // Get the current active stage index based on API response
//   const getCurrentStageIndex = () => {
//     if (!flatStages.length) return -1;
    
//     // Find the highest stage index that exists in the response
//     let currentIndex = -1;
//     flatStages.forEach(apiStage => {
//       const stageIndex = stages.findIndex(stage => 
//         stage.toLowerCase() === apiStage.name.toLowerCase()
//       );
//       if (stageIndex > currentIndex) {
//         currentIndex = stageIndex;
//       }
//     });
    
//     return currentIndex;
//   };

//   // Get stage creation date
//   const getStageCreatedDate = (stageName) => {
//     const apiStage = flatStages.find(stage => 
//       stage.name.toLowerCase() === stageName.toLowerCase()
//     );
//     return apiStage ? new Date(apiStage.created_at) : null;
//   };

//   // Calculate days left for next stage
//   const getDaysLeft = (stageIndex) => {
//     const currentStageIndex = getCurrentStageIndex();
    
//     // Only show days left for the current active stage transition
//     if (stageIndex !== currentStageIndex || stageIndex >= stages.length - 1) {
//       return null;
//     }

//     const currentStageDate = getStageCreatedDate(stages[stageIndex]);
//     if (!currentStageDate || !durationsDays[stageIndex]) {
//       return null;
//     }

//     const today = new Date();
//     const totalDays = durationsDays[stageIndex];
//     const endDate = new Date(currentStageDate);
//     endDate.setDate(currentStageDate.getDate() + totalDays);

//     const remaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
//     if (remaining < 0) {
//       return "Overdue";
//     }
    
//     return `${remaining} days left`;
//   };

//   // Check if stage is completed, active, or inactive
//   const getStageStatus = (stageIndex) => {
//     const currentStageIndex = getCurrentStageIndex();
    
//     if (stageIndex < currentStageIndex) return 'completed';
//     if (stageIndex === currentStageIndex) return 'active';
//     return 'inactive';
//   };

//   // Check if connector should be active
//   const isConnectorActive = (stageIndex) => {
//     const currentStageIndex = getCurrentStageIndex();
//     return stageIndex < currentStageIndex;
//   };

//   // Get color based on stage status
//   const getStageColor = (stageIndex) => {
//     const status = getStageStatus(stageIndex);
//     if (status === 'completed') return completedColor;
//     if (status === 'active') return stageActiveColors?.[stageIndex] || activeColor;
//     return inactiveColor;
//   };

//   // Get connector color and status
//   const getConnectorColor = (stageIndex) => {
//     return isConnectorActive(stageIndex) ? completedColor : inactiveColor;
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full flex justify-center py-8">
//         <div className="text-sm text-gray-500">Loading stages...</div>
//       </div>
//     );
//   }

//   if (errorMessage) {
//     return (
//       <div className="w-full flex justify-center py-8">
//         <div className="text-sm text-red-500">
//           Error loading stages: {typeof errorMessage === 'string' ? errorMessage : errorMessage.message}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Test Controls */}
//       {testMode && (
//         <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-semibold text-sm mb-3">🧪 Test Scenarios:</h3>
//           <div className="flex flex-wrap gap-2 mb-3">
//             <button 
//               onClick={() => fetchFlatStages('scenario1')}
//               className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Only Booking
//             </button>
//             <button 
//               onClick={() => fetchFlatStages('scenario2')}
//               className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Booking + Agreement
//             </button>
//             <button 
//               onClick={() => fetchFlatStages('scenario3')}
//               className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Up to Loan Process
//             </button>
//             <button 
//               onClick={() => fetchFlatStages('scenario4')}
//               className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               All Complete
//             </button>
//             <button 
//               onClick={() => fetchFlatStages('overdue')}
//               className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Overdue
//             </button>
//             <button 
//               onClick={() => fetchFlatStages('recent')}
//               className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
//             >
//               Recent Booking
//             </button>
//           </div>
//           <div className="text-xs text-gray-600">
//             Current: {getCurrentStageIndex() >= 0 ? stages[getCurrentStageIndex()] : 'None'} | 
//             API Data: {flatStages.map(s => s.name).join(', ') || 'None'}
//           </div>
//         </div>
//       )}

//       {/* Main Component */}
//       <div className="overflow-x-auto">
//         {/* Arrow head definitions */}
//         <svg width="0" height="0" className="absolute pointer-events-none">
//           <defs>
//             <marker
//               id={grayMarkerId}
//               viewBox="0 0 10 10"
//               markerWidth={arrowHeadWidth}
//               markerHeight={arrowHeadHeight}
//               refX={arrowHeadRefX}
//               refY="5"
//               orient="auto"
//               markerUnits="userSpaceOnUse"
//             >
//               <path d="M 0 0 L 10 5 L 0 10 z" fill={inactiveColor} />
//             </marker>
//             <marker
//               id={completedMarkerId}
//               viewBox="0 0 10 10"
//               markerWidth={arrowHeadWidth}
//               markerHeight={arrowHeadHeight}
//               refX={arrowHeadRefX}
//               refY="5"
//               orient="auto"
//               markerUnits="userSpaceOnUse"
//             >
//               <path d="M 0 0 L 10 5 L 0 10 z" fill={completedColor} />
//             </marker>
//             <marker
//               id={activeMarkerId}
//               viewBox="0 0 10 10"
//               markerWidth={arrowHeadWidth}
//               markerHeight={arrowHeadHeight}
//               refX={arrowHeadRefX}
//               refY="5"
//               orient="auto"
//               markerUnits="userSpaceOnUse"
//             >
//               <path d="M 0 0 L 10 5 L 0 10 z" fill={activeColor} />
//             </marker>
//           </defs>
//         </svg>

//         {/* Stages */}
//         <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
//           {stages.map((label, i) => {
//             const status = getStageStatus(i);
//             const stageColor = getStageColor(i);
//             const connectorActive = isConnectorActive(i);
//             const connectorColor = getConnectorColor(i);
//             const createdDate = getStageCreatedDate(label);

//             return (
//               <React.Fragment key={label}>
//                 {/* Circle + label */}
//                 <div className="flex flex-col items-center text-center min-w-[80px]">
//                   <div
//                     className={`flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 relative`}
//                     style={{
//                       width: circleSize,
//                       height: circleSize,
//                       borderColor: stageColor,
//                       backgroundColor: status === 'inactive' ? 'white' : stageColor,
//                       color: status === 'inactive' ? stageColor : 'white',
//                     }}
//                   >
//                     {status === 'completed' ? (
//                       // Checkmark for completed stages
//                       <svg 
//                         width="20" 
//                         height="20" 
//                         viewBox="0 0 24 24" 
//                         fill="none" 
//                         stroke="currentColor" 
//                         strokeWidth="3"
//                       >
//                         <polyline points="20,6 9,17 4,12"></polyline>
//                       </svg>
//                     ) : (
//                       i + 1
//                     )}
                    
//                     {/* Pulse animation for active stage */}
//                     {status === 'active' && (
//                       <div 
//                         className="absolute inset-0 rounded-full animate-ping"
//                         style={{ backgroundColor: stageColor, opacity: 0.3 }}
//                       />
//                     )}
//                   </div>
                  
//                   {/* Stage label */}
//                   <span className={`mt-2 text-xs font-medium ${
//                     status === 'active' ? 'text-blue-600 font-semibold' : 
//                     status === 'completed' ? 'text-green-600' : 'text-gray-500'
//                   }`}>
//                     {label}
//                   </span>
                  
//                   {/* Creation date */}
//                   {createdDate && (
//                     <span className="text-xs text-gray-400 mt-1">
//                       {createdDate.toLocaleDateString()}
//                     </span>
//                   )}
//                 </div>

//                 {/* Connector */}
//                 {i < stages.length - 1 && (
//                   <div className="relative flex-1 mx-1 sm:mx-2">
//                     {/* Duration above connector */}
//                     <div className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs z-10">
//                       {(() => {
//                         const daysLeft = getDaysLeft(i);
//                         if (!daysLeft) return null;
                        
//                         const isOverdue = daysLeft === "Overdue";
//                         return (
//                           <span
//                             className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 font-medium ${
//                               isOverdue 
//                                 ? 'bg-red-50 border-red-300 text-red-700'
//                                 : status === 'active'
//                                 ? 'bg-blue-50 border-blue-300 text-blue-700'
//                                 : 'bg-gray-50 border-gray-300 text-gray-600'
//                             }`}
//                           >
//                             {daysLeft}
//                           </span>
//                         );
//                       })()}
//                     </div>

//                     {/* Arrow Line */}
//                     <svg
//                       className="w-full overflow-visible"
//                       style={{ height: 12 }}
//                       viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
//                       preserveAspectRatio="none"
//                     >
//                       <line
//                         x1="0"
//                         y1={LINE_Y}
//                         x2={VIEWBOX_W}
//                         y2={LINE_Y}
//                         stroke={connectorColor}
//                         strokeWidth={arrowStrokeWidth}
//                         markerEnd={`url(#${
//                           connectorActive ? completedMarkerId : grayMarkerId
//                         })`}
//                         className="transition-all duration-300"
//                       />
//                     </svg>
//                   </div>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Example usage components for different scenarios
// export const TestScenarios = () => {
//   return (
//     <div className="space-y-8 p-6">
//       <h2 className="text-xl font-bold mb-4">Booking Stages Test Scenarios</h2>
      
//       {/* Default stages */}
//       <div>
//         <h3 className="font-semibold mb-2">Default Stages (Interactive Test)</h3>
//         <Bookingstages testMode={true} />
//       </div>

//       {/* Custom stages */}
//       <div>
//         <h3 className="font-semibold mb-2">Custom Stages</h3>
//         <Bookingstages 
//           testMode={true}
//           stages={["Registration", "Documentation", "Payment", "Verification", "Completion"]}
//           durationsDays={[15, 20, 10, 7]}
//           mockStages={[
//             { name: "Registration", created_at: "2024-01-10T10:00:00Z" },
//             { name: "Documentation", created_at: "2024-01-25T10:00:00Z" }
//           ]}
//         />
//       </div>

//       {/* Long stage names */}
//       <div>
//         <h3 className="font-semibold mb-2">Long Stage Names</h3>
//         <Bookingstages 
//           testMode={true}
//           stages={["Initial Application", "Document Verification", "Credit Assessment", "Final Approval"]}
//           durationsDays={[45, 30, 21]}
//           mockStages={[
//             { name: "Initial Application", created_at: "2024-01-01T10:00:00Z" }
//           ]}
//         />
//       </div>

//       {/* Many stages */}
//       <div>
//         <h3 className="font-semibold mb-2">Many Stages</h3>
//         <Bookingstages 
//           testMode={true}
//           stages={["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6"]}
//           durationsDays={[10, 10, 10, 10, 10]}
//           mockStages={[
//             { name: "Step 1", created_at: "2024-01-01T10:00:00Z" },
//             { name: "Step 2", created_at: "2024-01-15T10:00:00Z" },
//             { name: "Step 3", created_at: "2024-02-01T10:00:00Z" },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default Bookingstages;