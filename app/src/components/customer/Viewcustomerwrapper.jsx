import react, { useEffect, useState } from "react";
import Otherinfo from "./tabswrapper/Otherinfo";
import Customerapi from "../api/Customerapi";
import profileStatic from "../../../public/assets/customer_static_image.jpg";
import Errorpanel from "../shared/Errorpanel";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { Link, useParams, useNavigate, NavLink } from "react-router-dom";
import { Modal } from "@nayeshdaggula/tailify";
import Uploadcustomerprofile from "../shared/Uploadcustomerprofile";
import Customernotestab from "./tabswrapper/Customernotestab";
import Flatinfo from "./tabswrapper/Flatinfo";
import Customerdocumentswrapper from "./documents/Customerdocumentswrapper";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import Paymentswrapper from "./paymentswrapper/Paymentswrapper";
import Customeractivitiestab from "./tabswrapper/Customeractivitiestab";
import Assignflattocustomer from "./Assignflattocustomer";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

function Viewcustomerwrapper() {
  const params = useParams();
  const customerUuid = params?.customer_uuid;

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
  async function getSingleCustomerData(customerUuid) {
    if (customerUuid === null) {
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
        customerUuid: customerUuid,
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
    getSingleCustomerData(customerUuid); // This will re-fetch the details including the new image
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
    if (customerUuid) getSingleCustomerData(customerUuid);
  }, [customerUuid]);

  console.log("customerData", customerData);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <p className="text-[24px] font-semibold">View Customer</p>
            {customerData?.loan_rejected && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium">
                Loan Rejected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div
              onClick={openAssignFlatToCustomer}
              className="cursor-pointer text-[14px] text-white px-4 py-[8.5px] rounded bg-[#931f42] flex items-center gap-1"
            >
              Assign Flat to Customer
            </div>
            {permissions?.customers_page?.includes("edit_customer") && (
              <Link
                to={`/customers/editcustomer/${customerUuid}`}
                className="text-sm text-white px-4 py-2 border border-[#0083bf] !rounded-sm !bg-[#0083bf] hover:!bg-[#0083bf]/90"
              >
                Edit
              </Link>
            )}

            {/* <Link
              to={"/customers"}
              className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-2 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
            >
              <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
              Back
            </Link> */}
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
              <div className="mb-3 grid grid-cols-6 relative border border-[#ebecef] rounded-md bg-[#f1f1f1] p-2">
                {[
                  { key: "other-info", label: "Other Info" },
                  { key: "flat-information", label: "Flats Info" },
                  // { key: "payments-information", label: "Payments Info" },
                  { key: "documents", label: "Documents" },
                  { key: "notes", label: "Notes" },
                  { key: "activity", label: "Activity" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`py-2 px-2 font-medium relative cursor-pointer flex justify-center items-center rounded-md
                    transition duration-300 ease-in-out
                    ${activeTab === key
                        ? "text-[#0083bf] bg-white shadow-md"
                        : "text-gray-900 bg-transparent"
                      }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-6 bg-white rounded-md shadow-md">
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
                          customerUuid={customerUuid}
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
                        <Paymentswrapper customerUuid={customerUuid} />
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
                      // <Customeractivitiestab customerUuid={customerUuid}/>
                      // <Customernotestab />
                      <h1>Rahul</h1>

                    )} */}
                    <Customeractivitiestab customerUuid={customerUuid} />
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

      <Modal
        open={uploadFileModal}
        close={closeUploadFileModal}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {uploadFileModal && (
          <Uploadcustomerprofile
            closeUploadFileModal={closeUploadFileModal}
            setIsLoadingEffect={setIsLoadingEffect}
            customer_id={customerData?.id}
            refreshUserDetails={refreshUserDetails}
          />
        )}
      </Modal>


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
            customerUuid={customerUuid}
            projectId={customerData?.project_id}
            refreshFlats={refreshFlats}
          />
        )}
      </Drawer>
    </>
  );
}

export default Viewcustomerwrapper;
