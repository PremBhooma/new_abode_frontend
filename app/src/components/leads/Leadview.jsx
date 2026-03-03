import { useEffect, useState } from "react";
import { Button, Modal } from "@nayeshdaggula/tailify";
import { Link, useParams, NavLink } from "react-router-dom";
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
import profileStatic from "../../../public/assets/customer_static_image.jpg";
import "react-modern-drawer/dist/index.css";

function Leadview() {
  const params = useParams();
  const leadUuid = params?.lead_uuid;

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

  async function getSingleLeadData(leadUuid) {
    if (leadUuid === null) {
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
        leadUuid: leadUuid,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
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
    getSingleLeadData(leadUuid);
  };

  useEffect(() => {
    setIsLoadingEffect(true);
    if (leadUuid) getSingleLeadData(leadUuid);
  }, [leadUuid]);

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
  const [leadId, setLeadId] = useState(null)
  const [updateLeadStageModal, setUpdateLeadStageModal] = useState(false);
  const closeUpdateLeadStageModal = () => {
    setUpdateLeadStageModal(false);
  };
  const openUpdateLeadStageModal = (leadStageValue, leadId) => {
    setUpdateLeadStageModal(true);
    setLeadStageValue(leadStageValue)
    setLeadId(leadId)
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUpdateSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  console.log("Leads_single:", leadData)

  return (
    <>
      <div className="flex flex-col gap-6">
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
                    <Button onClick={openTransferLead} size="sm" className="px-4 py-2 border border-[#000] !rounded-sm !bg-[#000] hover:!bg-[#0083bf]/90 hover:border-[#0083bf]">
                      Transfer Lead
                    </Button>
                  )}
                </div>
                :
                <>
                  {permissions?.leads_page?.includes("assign_lead") && (
                    <Button onClick={openAsignLead} size="sm" className="px-4 py-2 border border-[#000] !rounded-sm !bg-[#000] hover:!bg-[#0083bf]/90 hover:border-[#0083bf]">
                      Assign to employee
                    </Button>
                  )}
                </>
            }
            {permissions?.leads_page?.includes("update_lead_stage") && (
              <div onClick={() => openUpdateLeadStageModal(leadData?.lead_stage_id, leadData?.id)} className="text-sm text-white px-4 py-2 border border-[#931f42] !rounded-sm !bg-[#931f42] hover:!bg-[#931f42]/90 cursor-pointer">
                Update Lead Stage
              </div>
            )}
            {permissions?.leads_page?.includes("convert_lead_to_customer") && (
              <Link to={`/lead/convert-lead-to-customer/${leadUuid}`} className="text-sm text-white px-4 py-2 border border-emerald-500 !rounded-sm !bg-emerald-500 hover:!bg-emerald-500/90 cursor-pointer">
                Convert Lead to Customer
              </Link>
            )}
            {permissions?.leads_page?.includes("edit_lead") && (
              <Link to={`/lead/edit-lead/${leadUuid}`} className="text-sm text-white px-4 py-2 border border-[#0083bf] !rounded-sm !bg-[#0083bf] hover:!bg-[#0083bf]/90">
                Edit
              </Link>
            )}
          </div>
        </div> */}

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-xl font-bold">View Lead</h1>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-100 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                <span>{leadData?.lead_stage_name || "Unknown Stage"}</span>
              </div>

              {leadData?.lead_assignee ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Assigned: {leadData.lead_assignee.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  <span>Unassigned</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {leadData?.lead_assignee ? (
              permissions?.leads_page?.includes("transfer_lead") && (
                <button onClick={openTransferLead} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm cursor-pointer">
                  Transfer
                </button>
              )
            ) : (
              permissions?.leads_page?.includes("assign_lead") && (
                <button onClick={openAsignLead} className="px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
                  Assign Lead
                </button>
              )
            )}

            {permissions?.leads_page?.includes("update_lead_stage") && (
              <button onClick={() => openUpdateLeadStageModal(leadData?.lead_stage_id, leadData?.id)} className="px-4 py-2 text-sm font-medium text-white bg-[#931f42] border border-[#931f42] rounded-lg hover:bg-[#a6234b] transition-colors shadow-sm cursor-pointer">
                Update Stage
              </button>
            )}


            {permissions?.leads_page?.includes("generate_cost_sheet") && (
              <button onClick={() => setCostSheetDrawer(true)} className="px-4 py-2 text-sm font-medium text-white bg-cyan-400 border border-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors shadow-sm cursor-pointer">
                Cost Sheet
              </button>
            )}

            {permissions?.leads_page?.includes("convert_lead_to_customer") && (
              <Link to={`/lead/convert-lead-to-customer/${leadUuid}`} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer">
                Convert to Customer
              </Link>
            )}

            {permissions?.leads_page?.includes("edit_lead") && (
              <Link to={`/lead/edit-lead/${leadUuid}`} className="px-4 py-2 text-sm font-medium text-white bg-[#0083bf] border border-[#0083bf] rounded-lg hover:bg-[#0072a6] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                <IconEdit size={16} />
                Edit
              </Link>
            )}
          </div>
        </div>
        <div className="min-h-screen">
          <div className="flex gap-4">
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
            <div className="relative w-[78%]">
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
                    <Leadactivities leadUuid={leadUuid} refreshTrigger={refreshTrigger} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

      <Modal
        open={uploadFileModal}
        close={closeUploadFileModal}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {uploadFileModal && (
          <Uploadleadprofile
            closeUploadFileModal={closeUploadFileModal}
            setIsLoadingEffect={setIsLoadingEffect}
            lead_id={leadData?.id}
            refreshLead={refreshLeadDetails}
          />
        )}
      </Modal>

      <Modal
        open={assignLead}
        close={closeAsignLead}
        padding="p-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {assignLead && (
          <AssignleadModal
            closeAsignLead={closeAsignLead}
            leadUuid={leadUuid}
            refreshLeadDetails={refreshLeadDetails}
          />
        )}
      </Modal>

      <Modal
        open={transferLead}
        close={closeTransferLead}
        padding="p-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {transferLead && (
          <TransferleadModal
            closeTransferLead={closeTransferLead}
            leadUuid={leadUuid}
            refreshLeadDetails={refreshLeadDetails}
            leadData={leadData}
          />
        )}
      </Modal>

      <Modal
        open={updateLeadStageModal}
        close={closeUpdateLeadStageModal}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px] !p-5"
      >
        {updateLeadStageModal && (
          <Updateleadstage
            closeUpdateLeadStageModal={closeUpdateLeadStageModal}
            leadStageValue={leadStageValue}
            leadId={leadId}
            refreshLead={refreshLeadDetails}
            onUpdateLeadStage={handleUpdateSuccess}
          />
        )}
      </Modal>


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
