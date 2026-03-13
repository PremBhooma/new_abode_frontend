import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog.jsx";
import { Link, useParams, NavLink, useNavigate } from "react-router-dom";
import { ChevronRight, Zap, ArrowRightLeft, UserPlus, RefreshCw, FileText, UserCheck, LayoutDashboard } from "lucide-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails.jsx";
import { IconArrowLeft, IconEdit, IconPointFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import Leadapi from "../api/Leadapi.jsx";
import Leadinfo from "./viewtabs/Leadinfo.jsx";
import Errorpanel from "../shared/Errorpanel.jsx";
import AssignleadModal from "./AssignleadModal.jsx";
import Leadnotestab from "./viewtabs/Leadnotestab.jsx";
import TransferleadModal from "./TransferleadModal.jsx";
import Leadactivities from "./viewtabs/Leadactivities.jsx";
import Updateleadstage from "./leadstages/Updateleadstage.jsx";
import CostSheetDrawer from "./costSheetDrawer.jsx";
import Uploadleadprofile from "../shared/Uploadleadprofile.jsx";
import Leadsdocumentswrapper from "./documents/Leadsdocumentswrapper.jsx";
import profileStatic from "@/assets/customer_static_image.jpg";
import "react-modern-drawer/dist/index.css";

function Leadview() {
  const params = useParams();
  const navigate = useNavigate();
  const currentLeadId = params?.leadId;

  const permissions = useEmployeeDetails((state) => state.permissions);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  const [costSheetDrawer, setCostSheetDrawer] = useState(false);

  const availableTabs = [
    { key: "overview", label: "Overview" },
    permissions?.leads_page?.includes("lead_documents") && { key: "documents", label: "Documents" },
    permissions?.leads_page?.includes("lead_notes") && { key: "notes", label: "Notes" },
    { key: "activity", label: "Activity" }
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.key || "activity");

  const [uploadFileModal, setUploadFileModal] = useState(false);
  const closeUploadFileModal = () => {
    setUploadFileModal(false);
  };
  const openUploadFileModal = () => {
    setUploadFileModal(true);
  };

  const [leadData, setLeadData] = useState({});

  async function getSingleLeadData(id) {
    if (id === null) {
      setErrorMessage({
        message: "Lead ID is missing",
        server_res: null,
      });
      setIsLoadingEffect(false);
      return false;
    }

    setIsLoadingEffect(true);
    await Leadapi.get("get-single-lead", {
      params: {
        currentLeadId: currentLeadId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          if (data.message === "Lead not found") {
            navigate("/customers", { replace: true });
            return false;
          }
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        if (data !== null) {
          setLeadData(data?.data || {});
        }
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log("Fetch lead error:", error);
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
        setIsLoadingEffect(false);
        return false;
      });
  }

  const refreshLeadDetails = () => {
    getSingleLeadData(currentLeadId);
  };

  useEffect(() => {
    setIsLoadingEffect(true);
    if (currentLeadId) getSingleLeadData(currentLeadId);
  }, [currentLeadId]);

  const [assignLead, setAssignLead] = useState(false);
  const openAsignLead = () => {
    setAssignLead(true);
  }
  const closeAsignLead = () => {
    setAssignLead(false);
  }

  const [transferLead, setTransferLead] = useState(false)
  const openTransferLead = () => {
    setTransferLead(true)
  }
  const closeTransferLead = () => {
    setTransferLead(false)
  }

  const [leadStageValue, setLeadStageValue] = useState(null)
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [updateLeadStageModal, setUpdateLeadStageModal] = useState(false);
  const closeUpdateLeadStageModal = () => {
    setUpdateLeadStageModal(false);
  };
  const openUpdateLeadStageModal = (leadStageValue, idToUpdate) => {
    setUpdateLeadStageModal(true);
    setLeadStageValue(leadStageValue)
    setSelectedLeadId(idToUpdate)
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUpdateSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  console.log("Leads_single:", leadData)

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* <div className="flex justify-between items-center">
          <p className="text-[24px] font-semibold">View Lead</p>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="bg-[#fff] flex flex-row items-center gap-2 px-4 py-1 rounded-full border border-[#e11d80]">
              <IconPointFilled className="size-4" color="#e11d80" />
              <span className="font-bold text-black text-[12px]">{leadData?.lead_stage_name}</span>
            </div>
            {
              leadData?.lead_assignee !== null ?
                <div className="flex items-center gap-2">
                  <div className="bg-[#fff] flex flex-row items-center gap-2 px-4 py-1 rounded-full border border-[#16e216]">
                    <IconPointFilled className="size-4" color="#16e216" />
                    <p className="text-[12px] text-gray-600">Assigned To:</p>
                    <span className="font-bold text-black text-[12px]">{leadData?.lead_assignee?.name}</span>
                  </div>
                  {permissions?.leads_page?.includes("transfer_lead") && (
                    <Button onClick={openTransferLead} size="sm" className="px-3 py-2 border border-[#000] !rounded-sm !bg-[#000] hover:!bg-[#0083bf]/90 hover:border-[#0083bf]">
                      Transfer Lead
                    </Button>
                  )}
                </div>
                :
                <>
                  {permissions?.leads_page?.includes("assign_lead") && (
                    <Button onClick={openAsignLead} size="sm" className="px-3 py-2 border border-[#000] !rounded-sm !bg-[#000] hover:!bg-[#0083bf]/90 hover:border-[#0083bf]">
                      Assign to employee
                    </Button>
                  )}
                </>
            }
            {permissions?.leads_page?.includes("update_lead_stage") && (
              <div onClick={() => openUpdateLeadStageModal(leadData?.lead_stage_id, leadData?.id)} className="text-sm text-white px-3 py-2 border border-[#931f42] !rounded-sm !bg-[#931f42] hover:!bg-[#931f42]/90 cursor-pointer">
                Update Lead Stage
              </div>
            )}
            {permissions?.leads_page?.includes("convert_lead_to_customer") && (
              <Link to={`/lead/convert-lead-to-customer/${currentLeadId}`} className="text-sm text-white px-3 py-2 border border-emerald-500 !rounded-sm !bg-emerald-500 hover:!bg-emerald-500/90 cursor-pointer">
                Convert Lead to Customer
              </Link>
            )}
            {permissions?.leads_page?.includes("edit_lead") && (
              <Link to={`/lead/edit-lead/${currentLeadId}`} className="text-sm text-white px-3 py-2 border border-[#0083bf] !rounded-sm !bg-[#0083bf] hover:!bg-[#0083bf]/90">
                Edit
              </Link>
            )}
          </div>
        </div> */}

        {/* <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl font-bold">View Lead</h1>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-100 text-xs font-medium max-w-[120px]">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                <span className="truncate min-w-0 max-w-[80px]">{leadData?.lead_stage_name || "Unknown Stage"}</span>
              </div>

              {leadData?.lead_assignee ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-medium max-w-[200px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>

                  <span className="truncate min-w-0 max-w-[140px]">
                    Assigned: {leadData.lead_assignee.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  <span>Unassigned</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {leadData?.lead_assignee ? (
              permissions?.leads_page?.includes("transfer_lead") && (
                <button onClick={openTransferLead} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm cursor-pointer">
                  Transfer
                </button>
              )
            ) : (
              permissions?.leads_page?.includes("assign_lead") && (
                <button onClick={openAsignLead} className="px-3 py-2 text-sm font-medium text-white bg-black border border-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
                  Assign Lead
                </button>
              )
            )}

            {permissions?.leads_page?.includes("update_lead_stage") && (
              <button onClick={() => openUpdateLeadStageModal(leadData?.lead_stage_id, leadData?.id)} className="px-3 py-2 text-sm font-medium text-white bg-[#931f42] border border-[#931f42] rounded-lg hover:bg-[#a6234b] transition-colors shadow-sm cursor-pointer">
                Update Stage
              </button>
            )}


            {permissions?.leads_page?.includes("generate_cost_sheet") && (
              <button onClick={() => setCostSheetDrawer(true)} className="px-3 py-2 text-sm font-medium text-white bg-cyan-400 border border-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors shadow-sm cursor-pointer">
                Cost Sheet
              </button>
            )}

            {permissions?.leads_page?.includes("convert_lead_to_customer") && (
              <Link to={`/lead/convert-lead-to-customer/${currentLeadId}`} className="px-3 py-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer">
                Convert to Customer
              </Link>
            )}

            {permissions?.leads_page?.includes("edit_lead") && (
              <Link to={`/lead/edit-lead/${currentLeadId}`} className="px-3 py-2 text-sm font-medium text-white bg-[#0083bf] border border-[#0083bf] rounded-lg hover:bg-[#0072a6] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                <IconEdit size={16} />
                Edit
              </Link>
            )}
          </div>
        </div> */}


        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          {/* Row 1: Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase mb-4">
            <Link to="/dashboard" className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={12} />
              Dashboard
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <Link to="/leads" className="text-slate-400 hover:text-rose-600 transition-colors">
              Leads
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-rose-600">View Lead</span>
          </div>

          {/* Row 2: Title, Subtext & Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm transition-transform hover:scale-105 duration-300">
                <Zap size={22} fill="currentColor" fillOpacity={0.15} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                  Lead Details
                </h1>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                  Overview of lead status, history, and assignments.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">

              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 font-semibold uppercase tracking-wide shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="leading-none">
                  {leadData?.lead_stage_name || "Unknown Stage"}
                </span>
              </div>

              {leadData?.lead_assignee ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-semibold uppercase tracking-wide shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="leading-none">
                    {leadData.lead_assignee.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-200 font-semibold uppercase tracking-wide shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="leading-none">Unassigned</span>
                </div>
              )}

            </div>
          </div>

          <hr className="my-4 border-slate-100" />

          {/* Row 3: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {leadData?.lead_assignee ? (
              permissions?.leads_page?.includes("transfer_lead") && (
                <button
                  onClick={openTransferLead}
                  className="group flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-100 hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <ArrowRightLeft size={14} className="transition-transform group-hover:rotate-180 duration-500" />
                  Transfer
                </button>
              )
            ) : (
              permissions?.leads_page?.includes("assign_lead") && (
                <button
                  onClick={openAsignLead}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <UserPlus size={14} />
                  Assign Lead
                </button>
              )
            )}

            {permissions?.leads_page?.includes("update_lead_stage") && (
              <button
                onClick={() => openUpdateLeadStageModal(leadData?.lead_stage_id, leadData?.id)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg shadow-sm hover:bg-rose-100 hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <RefreshCw size={14} />
                Update Stage
              </button>
            )}

            {permissions?.leads_page?.includes("generate_cost_sheet") && (
              <button
                onClick={() => setCostSheetDrawer(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg shadow-sm hover:bg-cyan-100 hover:border-cyan-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <FileText size={14} />
                Cost Sheet
              </button>
            )}

            {permissions?.leads_page?.includes("convert_lead_to_customer") && (
              <Link
                to={`/lead/convert-lead-to-customer/${currentLeadId}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm hover:bg-emerald-100 hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <UserCheck size={14} />
                Convert
              </Link>
            )}

            {permissions?.leads_page?.includes("edit_lead") && (
              <Link
                to={`/lead/edit-lead/${currentLeadId}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0083bf] bg-[#0083bf]/5 border border-[#0083bf]/20 rounded-lg shadow-sm hover:bg-[#0083bf]/10 hover:border-[#0083bf]/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center cursor-pointer"
              >
                <IconEdit size={14} />
                Edit
              </Link>
            )}
          </div>
        </div>
        <div className="min-h-screen">
          <div className="flex gap-3">
            <div className="w-[22%] min-h-screen bg-white rounded-md shadow-md">
              <div className="relative mb-4 flex flex-col justify-center items-center">
                <div className="w-full h-24 rounded-t-md bg-gradient-to-br from-pink-500 via-pink-700 to-blue-800 flex items-center justify-center"></div>
                <div className="relative w-42 h-42 mt-[-65px]">
                  <div className="w-full h-full rounded-full border-4 border-white overflow-hidden">
                    <img crossOrigin="anonymous" src={leadData?.profile_pic_url?.trim() ? leadData?.profile_pic_url : profileStatic} alt="Profile" width={128} height={128} className="w-full h-full object-cover" />
                  </div>
                  {permissions?.leads_page?.includes("edit_lead") && (
                    <div className="absolute bottom-1 right-4 bg-white border border-gray-300 rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100">
                      <IconEdit onClick={openUploadFileModal} className="size-4" />
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 break-all">{leadData?.first_name}</h2>
                  <p className="text-gray-600 break-all">{leadData?.email}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Full Name</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {leadData?.prefixes} {leadData?.full_name}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Email</div>
                      <NavLink to={`mailto:${leadData?.email}`}>
                        <div className="text-gray-900 font-semibold break-all">{leadData?.email}</div>
                      </NavLink>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Phone Number</div>
                      <NavLink to={`https://wa.me/${leadData?.phone_code || "+91"}${leadData?.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`} target="_blank" rel="noopener noreferrer">
                        <div className="text-gray-900 font-semibold break-all">{leadData?.phone_number ? `+${leadData?.phone_code} ${leadData?.phone_number}` : "---"}</div>
                      </NavLink>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Address</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {[leadData?.correspondenceAddress, leadData?.correspondenceCityName, leadData?.correspondenceStateName, leadData?.correspondenceCountryName].filter(Boolean).join(", ") || "---"}
                        {" - "}
                        {leadData?.correspondencePincode || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Lead added by</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {leadData?.lead_added_by || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Source of lead</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {leadData?.source_of_lead || "---"}
                      </div>
                    </div>
                    {
                      leadData?.lead_assigned_date &&
                      <div className="flex flex-col w-full">
                        <div className="text-gray-600 shrink-0">Lead Assigned Date</div>
                        <div className="text-gray-900 font-semibold break-all">
                          {leadData?.lead_assigned_date ? dayjs(leadData?.lead_assigned_date).format("DD/MM/YYYY HH:mm") : null || "---"}
                        </div>
                      </div>
                    }
                    {/* <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Designation</div>
                      <div className="text-gray-900 font-semibold break-all">{leadData?.current_designation || "---"}</div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Organization</div>
                      <div className="text-gray-900 font-semibold break-all">{leadData?.name_of_current_organization || "---"}</div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Mother Tongue</div>
                      <div className="text-gray-900 font-semibold break-all">{leadData?.mother_tongue || "---"}</div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="relative w-[78%]">
              <div className="mb-3 grid grid-cols-6 relative border border-[#ebecef] rounded-md bg-[#f1f1f1] p-2">
                {availableTabs.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`py-2 px-2 font-medium relative cursor-pointer flex justify-center items-center rounded-md
                    transition duration-300 ease-in-out
                    ${activeTab === key ? "text-[#0083bf] bg-white shadow-md" : "text-gray-900 bg-transparent"}`}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-6 bg-white rounded-md shadow-md">
                {activeTab === "overview" && (
                  <Leadinfo leadData={leadData} />
                )}

                {activeTab === "documents" && permissions?.leads_page?.includes("lead_documents") && (
                  <Leadsdocumentswrapper />
                )}

                {activeTab === "notes" && permissions?.leads_page?.includes("lead_notes") && (
                  <Leadnotestab />
                )}

                {activeTab === "activity" && (
                  <div className="text-center text-gray-500">
                    <Leadactivities currentLeadId={currentLeadId} refreshTrigger={refreshTrigger} />
                  </div>
                )}
              </div>
            </div> */}

            <div className="relative w-[78%]">

              <div className="flex items-center gap-6 border-b border-slate-200 pb-2">

                {availableTabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative py-2 text-sm font-semibold transition-all duration-300 cursor-pointer
                     ${activeTab === key
                        ? "text-rose-600"
                        : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {label}

                    {activeTab === key && (
                      <span className="absolute left-0 -bottom-[9px] h-[2px] w-full bg-rose-600 rounded-full"></span>
                    )}
                  </button>
                ))}

              </div>


              <div className="flex-1 p-4 bg-white rounded-md shadow-sm border border-slate-100 mt-4">

                {activeTab === "overview" && (
                  <Leadinfo leadData={leadData} />
                )}

                {activeTab === "documents" && permissions?.leads_page?.includes("lead_documents") && (
                  <Leadsdocumentswrapper />
                )}

                {activeTab === "notes" && permissions?.leads_page?.includes("lead_notes") && (
                  <Leadnotestab />
                )}

                {activeTab === "activity" && (
                  <div className="text-center text-gray-500">
                    <Leadactivities
                      currentLeadId={currentLeadId}
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      </div>
      {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

      <Dialog open={uploadFileModal} onOpenChange={setUploadFileModal}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px] px-5 [&>button]:hidden">
          {uploadFileModal && (
            <Uploadleadprofile
              closeUploadFileModal={closeUploadFileModal}
              setIsLoadingEffect={setIsLoadingEffect}
              lead_id={leadData?.id}
              refreshLead={refreshLeadDetails}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={assignLead} onOpenChange={setAssignLead}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px] p-5 [&>button]:hidden">
          {assignLead && (
            <AssignleadModal
              closeAsignLead={closeAsignLead}
              currentLeadId={currentLeadId}
              refreshLeadDetails={refreshLeadDetails}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={transferLead} onOpenChange={setTransferLead}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px] p-5 [&>button]:hidden">
          {transferLead && (
            <TransferleadModal
              closeTransferLead={closeTransferLead}
              currentLeadId={currentLeadId}
              refreshLeadDetails={refreshLeadDetails}
              leadData={leadData}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={updateLeadStageModal} onOpenChange={setUpdateLeadStageModal}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px] !p-5 [&>button]:hidden">
          {updateLeadStageModal && (
            <Updateleadstage
              closeUpdateLeadStageModal={closeUpdateLeadStageModal}
              leadStageValue={leadStageValue}
              currentLeadId={selectedLeadId}
              refreshLead={refreshLeadDetails}
              onUpdateLeadStage={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>


      <CostSheetDrawer
        open={costSheetDrawer}
        onOpenChange={setCostSheetDrawer}
        leadData={leadData}
        refreshLeadDetails={refreshLeadDetails}
      />
    </>
  );
}

export default Leadview;
