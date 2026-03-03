import React, { useEffect, useState } from "react";
import { IconArrowLeft, IconEdit, IconUser, IconMail, IconPhone, IconBriefcase, IconUserCheck, IconLock, IconGenderMale } from "@tabler/icons-react";
import { Modal } from "@nayeshdaggula/tailify";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate, Link, NavLink } from "react-router-dom";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import Changepassword from "./Changepassword";
import BasicEditEmployee from "./BasicEditEmployee";
import ProjectAllocation from "./ProjectAllocation";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import Uploademployeeprofile from "../../shared/Uploademployeeprofile";
import profileStatic from "../../../../public/assets/customer_static_image.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button as ShadcnButton } from "@/components/ui/button";

function SingleEmployeeview() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const permissions = useEmployeeDetails((state) => state.permissions);

  const [userdata, setUserdata] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  // const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal-info");

  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const closeUploadFileModal = () => {
    setUploadFileModal(false);
  };
  const openUploadFileModal = () => {
    setUploadFileModal(true);
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
  };
  const openEditDialog = () => {
    setShowEditDialog(true);
  };

  async function getSingleEmployee(singleUserid) {
    setIsFetching(true);
    Employeeapi.get("/get-single-employee-data", {
      params: {
        single_user_id: singleUserid,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsFetching(false);
          return false;
        }
        setUserdata(data?.employee_data || {});
        setIsFetching(false);
      })
      .catch((error) => {
        console.log("Error:", error);
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
        setIsFetching(false);
      });
  }

  const refreshUserDetails = () => {
    getSingleEmployee(userId); // This will re-fetch the details including the new image
  };

  useEffect(() => {
    getSingleEmployee(userId);
  }, [userId]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-[24px] font-semibold">View Employee</p>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex flex-col w-full mr-5">
              <div className="text-gray-600 shrink-0 text-[10px]">Status</div>
              <div className="text-gray-900 font-semibold break-all">
                {userdata?.status === "Inactive" ? (
                  <span className="text-red-500">Inactive</span>
                ) : userdata?.status === "Active" ? (
                  <span className="text-green-500">Active</span>
                ) : userdata?.status === "Suspended" ? (
                  <span className="text-gray-500">Suspended</span>
                ) : (
                  "---"
                )}
              </div>
            </div>

            <Link
              to={"/employees"}
              className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-2 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
            >
              <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
              Back
            </Link>
          </div>
        </div>

        <div className="">
          <div className="flex gap-4">
            {/* Left Profile Card */}
            <div className="w-[22%] min-h-fit bg-white rounded-xl shadow-xl">
              <div className="relative mb-4 flex flex-col justify-center items-center">
                <div className="w-full h-24 rounded-t-xl bg-gradient-to-br from-pink-500 via-pink-700 to-blue-800 flex items-center justify-center"></div>
                <div className="relative w-42 h-42 mt-[-65px]">
                  <div className="w-full h-full rounded-full border-4 border-white overflow-hidden">
                    <img
                      crossOrigin="anonymous"
                      src={
                        userdata?.profile_pic_url?.trim()
                          ? userdata.profile_pic_url
                          : profileStatic
                      }
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-4 bg-white border border-gray-300 rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100">
                    <IconEdit
                      onClick={openUploadFileModal}
                      className="size-4"
                    />
                  </div>

                  {/* )} */}
                </div>
              </div>

              <div className="px-5 pb-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 break-all">
                    {userdata?.name || "---"}
                  </h2>
                  <p className="text-gray-600 break-all">
                    {userdata?.email || "---"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Name</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {userdata?.name || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Email</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {userdata?.email || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Phone Number</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {userdata?.phone
                          ? `+${userdata?.phone_code} ${userdata?.phone}`
                          : "---"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="relative w-[78%]">
              {!isFetching &&
                <>
                  <div className="mb-3 p-1 grid grid-cols-3 gap-1 bg-gray-100/80 rounded-lg border border-gray-200">
                    <button
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300
                      ${activeTab === "personal-info"
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        }`}
                      onClick={() => setActiveTab("personal-info")}
                    >
                      <IconUser size={18} />
                      Personal Info
                    </button>

                    <button
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300
                          ${activeTab === "project-allocation"
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        }`}
                      onClick={() => setActiveTab("project-allocation")}
                    >
                      <IconBriefcase size={18} />
                      Project Allocation
                    </button>

                    {/* {permissions?.employee_page?.includes("change_password_tab") && ( */}
                    <button
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300
                          ${activeTab === "change-password"
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        }`}
                      onClick={() => setActiveTab("change-password")}
                    >
                      <IconLock size={18} />
                      Change Password
                    </button>
                    {/* )} */}
                  </div>

                  <div className="flex-1 p-6 bg-white rounded-xl shadow-xl">
                    {activeTab === "personal-info" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 rounded-full">
                              <IconUser size={20} className="text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                              Employee Details
                            </h3>
                          </div>
                          <ShadcnButton
                            variant="ghost"
                            size="sm"
                            onClick={openEditDialog}
                            className="text-[#0083bf] hover:text-[#0083bf]/80 hover:bg-[#0083bf]/5 gap-2"
                          >
                            <IconEdit size={16} />
                            Edit
                          </ShadcnButton>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconUser size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                              <p className="text-sm font-semibold text-gray-900">{userdata?.name || "---"}</p>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconMail size={20} stroke={1.5} />
                            </div>
                            <div className="w-full">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                              <NavLink to={`mailto:${userdata?.email}`} className="block">
                                <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                                  {userdata?.email || "---"}
                                </p>
                              </NavLink>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconBriefcase size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Designation / Role</p>
                              <p className="text-sm font-semibold text-gray-900">{userdata?.role_name || "---"}</p>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconUserCheck size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Reporting Manager</p>
                              <p className="text-sm font-semibold text-gray-900">{userdata?.reporting_head_name || "---"}</p>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconGenderMale size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                              <p className="text-sm font-semibold text-gray-900">{userdata?.gender || "---"}</p>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-green-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconPhone size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact Number</p>
                              <NavLink
                                to={`https://wa.me/${userdata?.phone_code || "+91"}${userdata?.phone}?text=Hello!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 group/link"
                              >
                                <span className="text-sm font-semibold text-gray-900 group-hover/link:text-green-600 transition-colors">
                                  {userdata?.phone ? `+${userdata?.phone_code} ${userdata?.phone}` : "---"}
                                </span>
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "change-password" && (
                      <div className="text-gray-500">
                        {/* {permissions?.employee_page?.includes("change_password_tab") && */}
                        <Changepassword singleUserid={userdata?.id} />
                        {/* } */}
                      </div>
                    )}

                    {activeTab === "project-allocation" && (
                      <ProjectAllocation singleUserid={userdata?.id} />
                    )}
                  </div>
                </>
              }

            </div>
            {isFetching && (
              <div className="absolute top-0 left-0 w-full h-full bg-white/50 z-10 flex gap-4">
                <div className="w-[22%] h-[500px] bg-white rounded-xl shadow-xl p-4 space-y-4">
                  <Skeleton className="h-24 w-full rounded-t-xl" />
                  <div className="flex justify-center -mt-12">
                    <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
                  </div>
                  <div className="space-y-2 text-center">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="w-[78%] h-full">
                  <div className="mb-3 p-1 grid grid-cols-2 gap-1 bg-gray-100/80 rounded-lg border border-gray-200">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="flex-1 p-6 bg-white rounded-xl shadow-xl space-y-6">
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div >





      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )
      }

      <Modal
        open={uploadFileModal}
        close={closeUploadFileModal}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {uploadFileModal && (
          <Uploademployeeprofile
            closeUploadFileModal={closeUploadFileModal}
            setIsLoadingEffect={setIsFetching}
            employee_id={userdata?.id}
            refreshUserDetails={refreshUserDetails}
          />
        )}
      </Modal>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0083bf] text-xl">Edit Personal Information</DialogTitle>
          </DialogHeader>
          <BasicEditEmployee
            closeEditEmployeemodal={closeEditDialog}
            singleuserId={userId}
            refreshUserData={refreshUserDetails}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SingleEmployeeview;
