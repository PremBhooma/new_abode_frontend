import React, { useCallback, useEffect, useState } from "react";
import Editrole from "./Editrole";
import Addnewform from "./Addnewform";
import Permissionpopup from "./Permissionpopup";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import DeleteModal from "../../shared/DeleteModal";
import { Modal, Pagination, Select } from "@nayeshdaggula/tailify";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import Projectapi from "../../api/Projectapi";
import AssignProject from "../../shared/AssignProject";
import { useProjectDetails } from "../../zustand/useProjectDetails";

function Rolesandpermissionwrapper() {
  const userInfo = useEmployeeDetails((state) => state.employeeInfo);
  const access_token = useEmployeeDetails((state) => state.access_token);
  let user_id = userInfo?.id;

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");

  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    setIsLoading(true);
    getClinetroledata(1, newLimit);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roledata, setRoledata] = useState([]);

  async function getClinetroledata(newPage, newlimit) {
    await Employeeapi.get(
      "/getallroledata",
      {
        params: {
          page: newPage,
          limit: newlimit,
          user_id: user_id,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data?.status === "error") {
          let finalresponse = {
            message: data?.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoading(false);
          return false;
        }
        setRoledata(data?.roledata);
        setTotalCount(data?.totalrolescount);
        setTotalPages(data?.totalpages);
        setIsLoading(false);
        return false;
      })
      .catch((error) => {
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
        setIsLoading(false);
        return false;
      });
  }

  const handlePageChange = useCallback((value) => {
    setPage(value);
    getClinetroledata(value, limit);
    setIsLoading(true);
  }, []);

  const reloadGetroledata = useCallback(() => {
    setIsLoading(true);
    getClinetroledata(page, limit);
  }, [page, limit]);

  useEffect(() => {
    setIsLoading(true);
    getClinetroledata(page, limit);
  }, []);

  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();

  const [projectModel, setProjectModel] = useState(false);
  const openProjectModel = () => {
    setProjectModel(true);
  };
  const closeProjectModel = () => {
    setProjectModel(false);
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  useEffect(() => {
    if (hasFetched) {
      if (!projectData || (typeof projectData === 'object' && Object.keys(projectData).length === 0)) {
        openProjectModel();
      }
    }
  }, [hasFetched, projectData]);

  const [permissionModal, setPermissionModal] = useState(false);

  const [roleId, setRoleId] = useState("");
  const openPermisissionsModal = useCallback(
    (id) => {
      setRoleId(id);
      setPermissionModal(true);
    },
    [roleId]
  );

  const closePermissionsModal = () => {
    setPermissionModal(false);
    setRoleId("");
  };

  const [roleDetails, setRoleDetails] = useState(null);
  const [roleEditModel, setRoleEditModel] = useState(false);
  const openEditRoleEditModel = useCallback(
    (id, role_details) => {
      setRoleEditModel(true);
      setRoleDetails(role_details);
      setRoleId(id);
    },
    [roleDetails, roleId]
  );

  const closeEditRoleEditModel = () => {
    setRoleEditModel(false);
    setRoleDetails(null);
    setRoleId("");
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const openRoleDeleteModal = (id) => {
    setDeleteUserId(id);
    setOpenDeleteModal(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-[22px] font-semibold">
            Roles & Permissions
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[300px] flex-none">
            <Addnewform reloadGetroledata={reloadGetroledata} />
          </div>
          <div className="flex-1 w-full bg-white p-4 border border-neutral-200 rounded-md overflow-hidden">
            {/* <div className="flex justify-end mb-4">
              <div className="w-[70px]">
                <Select
                  data={[
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "50", label: "50" },
                    { value: "100", label: "100" },
                  ]}
                  placeholder="10"
                  value={limit}
                  onChange={updateLimit}
                  selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[6px] !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
                  className="!m-0 !p-0 !border-0"
                  dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                />
              </div>
            </div> */}
            <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg z-0">
              <table className="w-full table-fixed text-left border-collapse">
                <thead className="bg-gray-50 border-b border-neutral-200">
                  <tr className="w-full">
                    <th scope="col" className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[50px] sticky left-0 z-20 bg-gray-50 border-b border-r border-neutral-200">
                      SL#
                    </th>
                    <th scope="col" className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[140px] border-b border-r border-neutral-200">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[160px] border-b border-r border-neutral-200">
                      Permissions
                    </th>
                    {/* <th scope="col" className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[100px] border-b border-r border-neutral-200">
                      Default
                    </th> */}
                    <th scope="col" className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[100px] border-b border-r border-neutral-200">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[100px] text-center sticky right-0 z-20 bg-gray-50 border-b border-l border-neutral-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {isLoading === false ? (
                    roledata?.length > 0 ? (
                      roledata?.map((roledata, index) => (
                        <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150 align-middle group">
                          <td className="px-3 py-2 whitespace-normal break-words sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-b border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium">
                              {index + 1}
                            </p>
                          </td>
                          <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                            <p className="text-neutral-900 text-xs font-semibold">
                              {roledata.role_name}
                            </p>
                          </td>
                          <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                            <button
                              className="cursor-pointer px-3 py-1 bg-white border border-[#0083bf] text-[#0083bf] hover:bg-[#0083bf] hover:text-white transition-colors rounded-md text-[11px] font-medium"
                              onClick={() =>
                                openPermisissionsModal(roledata.role_id)
                              }
                            >
                              Update Permission
                            </button>
                          </td>
                          {/* <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                            {roledata.default_role === "Yes" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-700 border border-gray-200">
                                No
                              </span>
                            )}
                          </td> */}
                          <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                            {roledata.status === "Inactive" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                                Inactive
                              </span>
                            ) : roledata.status === "Active" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                                Active
                              </span>
                            ) : (
                              roledata.status === "Suspended" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-700 border border-gray-200">
                                  Suspended
                                </span>
                              )
                            )}
                          </td>
                          <td className="px-3 py-2 text-center sticky right-0 z-10 bg-white group-hover:bg-neutral-50 border-b border-l border-neutral-200">
                            {roledata.role_name !== "Super Admin" ? (
                              <div className="flex flex-row items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    openEditRoleEditModel(
                                      roledata.role_id,
                                      roledata
                                    )
                                  }
                                  className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <IconEdit size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    openRoleDeleteModal(roledata.role_id)
                                  }
                                  className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <IconTrash size={18} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold uppercase text-neutral-400">System</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500 border-b border-neutral-200">
                          No roles found
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 border-b border-neutral-200">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#0083bf] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-neutral-500 text-xs">Loading roles...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {roledata?.length > 0 && (
              <div className="flex flex-row-reverse mt-4">
                <Pagination
                  totalpages={totalPages}
                  value={page}
                  siblings={1}
                  onChange={handlePageChange}
                  color="#0083bf"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

      <Modal
        open={permissionModal}
        onClose={closePermissionsModal}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {permissionModal === true && (
          <Permissionpopup
            closePermissionsModel={closePermissionsModal}
            roleId={roleId}
          />
        )}
      </Modal>

      <Modal
        open={roleEditModel}
        onClose={closeEditRoleEditModel}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {roleEditModel === true && (
          <Editrole
            closeEditRoleEditModel={closeEditRoleEditModel}
            roleId={roleId}
            roleDetails={roleDetails}
            reloadGetroledata={reloadGetroledata}
          />
        )}
      </Modal>

      <DeleteModal
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          Employeeapi.post(
            "/deleterole",
            {
              role_id: deleteUserId,
            },
            {}
          )
            .then((response) => {
              let data = response.data;
              if (data.status === "error") {
                let finalresponse = {
                  message: data.message,
                  server_res: data,
                };
                setIsLoading(false);
                return false;
              }

              setOpenDeleteModal(false);
              setIsLoading(false);
              reloadGetroledata();
              return false;
            })
            .catch((error) => {
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
              setIsLoading(false);
              return false;
            });
        }}
      />

      <Modal
        open={projectModel}
        onClose={closeProjectModel}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {projectModel === true && (
          <AssignProject
            closeProjectModel={closeProjectModel}
          />
        )}
      </Modal>
    </>
  );
}

export default Rolesandpermissionwrapper;
