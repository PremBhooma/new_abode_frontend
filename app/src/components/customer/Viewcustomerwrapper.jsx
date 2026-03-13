import react, { useEffect, useState } from "react";
import Otherinfo from "./tabswrapper/Otherinfo";
import Customerapi from "../api/Customerapi";
import profileStatic from "@/assets/customer_static_image.jpg";
import Errorpanel from "../shared/Errorpanel";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { Link, useParams, useNavigate, NavLink } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Uploadcustomerprofile from "../shared/Uploadcustomerprofile";
import Customernotestab from "./tabswrapper/Customernotestab";
import Flatinfo from "./tabswrapper/Flatinfo";
import Customerdocumentswrapper from "./documents/Customerdocumentswrapper";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import Paymentswrapper from "./paymentswrapper/Paymentswrapper";
import Customeractivitiestab from "./tabswrapper/Customeractivitiestab";
import Assignflattocustomer from "./Assignflattocustomer";
import { ChevronRight, Users, LayoutDashboard, UserPlus } from "lucide-react";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

function Viewcustomerwrapper() {
  const params = useParams();
  const customerId = params?.customerId;

  const permissions = useEmployeeDetails((state) => state.permissions);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  const [activeTab, setActiveTab] = useState("other-info");
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const closeUploadFileModal = () => {
    setUploadFileModal(false);
  };
  const openUploadFileModal = () => {
    setUploadFileModal(true);
  };

  const [customerData, setCustomerData] = useState({});
  const [totalCustomerFlat, setTotalCustomerFlat] = useState(0);
  async function getSingleCustomerData(customerId) {
    if (customerId === null) {
      setErrorMessage({
        message: "Customer ID is missing wowo",
        server_res: null,
      });
      setIsLoadingEffect(false);
      return false;
    }

    setIsLoadingEffect(true);
    await Customerapi.get("get-single-customer-data", {
      params: {
        customerId: customerId,
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
          setCustomerData(data?.data || {});
          setTotalCustomerFlat(data?.totalFlats || 0);
        }
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log("Fetch customer error:", error);
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

  const refreshUserDetails = () => {
    getSingleCustomerData(customerId); // This will re-fetch the details including the new image
  };

  const [assignFlatToCustomer, setAssignFlatToCustomer] = useState(false);
  const openAssignFlatToCustomer = () => {
    setAssignFlatToCustomer(true);
  };

  const closeAssignFlatToCustomer = () => {
    setAssignFlatToCustomer(false);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const refreshFlats = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    setIsLoadingEffect(true);
    if (customerId) getSingleCustomerData(customerId);
  }, [customerId]);

  console.log("customerData", customerData);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          {/* Row 1: Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase mb-4">
            <Link to="/dashboard" className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={12} />
              Dashboard
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <Link to="/customers" className="text-slate-400 hover:text-blue-600 transition-colors">
              Customers
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-blue-600">View Customer</span>
          </div>

          {/* Row 2: Title, Subtext & Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform hover:scale-105 duration-300">
                <Users size={22} fill="currentColor" fillOpacity={0.15} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                  {customerData?.first_name} {customerData?.last_name}
                </h1>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                  Project: {customerData?.project_name || "---"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {customerData?.loan_rejected && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-semibold uppercase tracking-wide shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="leading-none">Loan Rejected</span>
                </div>
              )}
            </div>
          </div>

          <hr className="my-4 border-slate-100" />

          {/* Row 3: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openAssignFlatToCustomer}
              className="group flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg shadow-sm hover:bg-rose-100 hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <UserPlus size={14} />
              Assign Flat to Customer
            </button>

            {permissions?.customers_page?.includes("edit_customer") && (
              <Link
                to={`/customers/editcustomer/${customerId}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0083bf] bg-[#0083bf]/5 border border-[#0083bf]/20 rounded-lg shadow-sm hover:bg-[#0083bf]/10 hover:border-[#0083bf]/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center cursor-pointer"
              >
                <IconEdit size={14} />
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
                    <img
                      crossOrigin="anonymous"
                      src={
                        customerData?.profile_pic_url?.trim()
                          ? customerData.profile_pic_url
                          : profileStatic
                      }
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Edit Icon */}
                  {permissions?.customers_page?.includes(
                    "uploading_customer_image_in_single_customer"
                  ) && (
                      <div className="absolute bottom-1 right-4 bg-white border border-gray-300 rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100">
                        <IconEdit
                          onClick={openUploadFileModal}
                          className="size-4"
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 break-all">
                    {customerData?.first_name}
                  </h2>
                  <p className="text-gray-600 break-all">
                    {customerData?.email}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Full Name</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {customerData?.prefixes} {customerData?.first_name} {customerData?.last_name}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Email</div>
                      <NavLink to={`mailto:${customerData?.email}`}>
                        <div className="text-gray-900 font-semibold break-all">
                          {customerData?.email}
                        </div>
                      </NavLink>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Phone Number</div>
                      <NavLink
                        to={`https://wa.me/${customerData?.phone_code || "+91"}${customerData?.phone_number
                          }?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-gray-900 font-semibold break-all">
                          {customerData?.phone_number
                            ? `+${customerData?.phone_code} ${customerData?.phone_number}`
                            : "---"}
                        </div>
                      </NavLink>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Designation</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {customerData?.current_designation || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Organization</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {customerData?.name_of_current_organization || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">
                        Mother Tongue
                      </div>
                      <div className="text-gray-900 font-semibold break-all">
                        {customerData?.mother_tongue || "---"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-[78%]">
              <div className="flex items-center gap-6 border-b border-slate-200 pb-2 mb-4">
                {[
                  { key: "other-info", label: "Other Info" },
                  { key: "flat-information", label: "Flats Info" },
                  { key: "documents", label: "Documents" },
                  { key: "notes", label: "Notes" },
                  { key: "activity", label: "Activity" },
                ].map(({ key, label }) => (
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

              <div className="flex-1 p-6 bg-white rounded-2xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100">
                {activeTab === "other-info" && (
                  <>
                    {permissions?.customers_page?.includes(
                      "other_info_single_customer"
                    ) && <Otherinfo customerData={customerData} />}
                  </>
                )}

                {activeTab === "flat-information" && (
                  <>
                    {permissions?.customers_page?.includes(
                      "flats_info_single_customer"
                    ) && (
                        <Flatinfo
                          customerData={customerData}
                          customerId={customerId}
                          refreshTrigger={refreshKey}
                        />
                      )}
                  </>
                )}

                {activeTab === "payments-information" && (
                  <div className="text-center  text-gray-500">
                    {permissions?.customers_page?.includes(
                      "payments_info_single_customer"
                    ) &&
                      // if totalCustomer flat is 0 then need to display a message that No Sold flats are availble for this customer.
                      (totalCustomerFlat === 0 ? (
                        <p>No Payments are availble for this customer.</p>
                      ) : (
                        <Paymentswrapper customerId={customerId} />
                      ))}
                  </div>
                )}

                {activeTab === "documents" && (
                  <>
                    {permissions?.customers_page?.includes(
                      "documents_single_customer"
                    ) && <Customerdocumentswrapper />}
                  </>
                )}
                {activeTab === "notes" && (
                  <>
                    {permissions?.customers_page?.includes(
                      "notes_single_customer"
                    ) && <Customernotestab />}
                  </>
                )}
                {activeTab === "activity" && (
                  <div className="text-center text-gray-500">
                    {/* {permissions?.customers_page?.includes("activity_single_customer") && (
                      // <p>Activity content goes here</p>
                      // <Customeractivitiestab customerId={customerId}/>
                      // <Customernotestab />
                      <h1>Rahul</h1>

                    )} */}
                    <Customeractivitiestab customerId={customerId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}

      <Dialog open={uploadFileModal} onOpenChange={(val) => !val && closeUploadFileModal()}>
        <DialogContent className="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px] p-0 overflow-hidden">
          {uploadFileModal && (
            <Uploadcustomerprofile
              closeUploadFileModal={closeUploadFileModal}
              setIsLoadingEffect={setIsLoadingEffect}
              customer_id={customerData?.id}
              refreshUserDetails={refreshUserDetails}
            />
          )}
        </DialogContent>
      </Dialog>


      <Drawer
        open={assignFlatToCustomer}
        onClose={closeAssignFlatToCustomer}
        direction='right'
        className='h-screen overflow-y-auto'
        size='80vw'
        zIndex={100}
        lockBackgroundScroll={true}
      >
        {assignFlatToCustomer && (
          <Assignflattocustomer
            closeAssignFlatToCustomer={closeAssignFlatToCustomer}
            customerId={customerId}
            projectId={customerData?.project_id}
            refreshFlats={refreshFlats}
          />
        )}
      </Drawer>
    </>
  );
}

export default Viewcustomerwrapper;
