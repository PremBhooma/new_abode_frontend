import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import EditEmployee from "./EditEmployee";
import AddnewEmployee from "./AddnewEmployee";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import DeleteModal from "../../../components/shared/DeleteModal";
import TableLoadingEffect from "../../shared/Tableloadingeffect";
import { NavLink, useNavigate } from "react-router-dom";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import { Modal, Pagination, Select } from "@nayeshdaggula/tailify";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IconEdit, IconEye, IconSearch, IconTrash, IconSettings } from "@tabler/icons-react";
import Projectapi from "../../api/Projectapi";
import AssignProject from "../../shared/AssignProject";
import { useProjectDetails } from "../../zustand/useProjectDetails";
import { useColumnStore } from "../../zustand/useColumnStore";

function Employeewrapper() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [totalPages, setTotalPages] = useState(0);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const access_token = useEmployeeDetails((state) => state.access_token);
  const permissions = useEmployeeDetails((state) => state.permissions);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [sortby, setSortby] = useState("created_date");
  const [sortbyType, setSortbyType] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState("10");

  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();
  const storedColumns = useColumnStore((state) => state.storedColumns["employees"]);
  const hasFetchedColumns = useColumnStore((state) => state.hasFetched["employees"]);
  const { fetchColumns, handleColumnStore } = useColumnStore();

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
      if (
        !projectData ||
        (typeof projectData === "object" &&
          Object.keys(projectData).length === 0)
      ) {
        openProjectModel();
      }
    }
  }, [hasFetched, projectData]);

  const [visibleColumns, setVisibleColumns] = useState({
    // reference: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    reportingHead: true,
    date: true,
  });
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowColumnToggle(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleColumn = (colKey) => {
    setVisibleColumns((prev) => {
      const updated = { ...prev, [colKey]: !prev[colKey] };
      handleColumnStore(updated, employeeInfo?.id, "employees");
      return updated;
    });
  };

  useEffect(() => {
    if (employeeInfo?.id) {
      fetchColumns(employeeInfo?.id, "employees");
    }
  }, [employeeInfo?.id]);

  useEffect(() => {
    if (hasFetchedColumns && Array.isArray(storedColumns)) {
      let updatedColumns;

      if (storedColumns.length === 0) {
        updatedColumns = Object.keys(visibleColumns).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
      } else {
        updatedColumns = Object.keys(visibleColumns).reduce((acc, key) => {
          acc[key] = storedColumns.includes(key);
          return acc;
        }, {});
      }

      setVisibleColumns(updatedColumns);
    }
  }, [storedColumns, hasFetchedColumns]);

  const [singleuserId, setSingleuserId] = useState(null);

  const openSingleuserview = (userId) => {
    navigate(`/single-employee-view/${userId}`);
  };
  const closeSingleuserview = () => {
    router.push(pathname);
    setSingleuserId(null);
  };

  const [addnewmodal, setAddnewmodal] = useState(false);
  const openAddnewmodal = () => {
    setAddnewmodal(true);
  };
  const closeAddnewmodal = () => setAddnewmodal(false);

  const [editusermodal, setEditusermodal] = useState(false);
  const openEditEmployeemodal = (user) => {
    setSingleuserId(user);
    setEditusermodal(true);
  };
  const closeEditEmployeemodal = () => {
    setEditusermodal(false);
    setSingleuserId(null);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSingleuserId(id);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSingleuserId(null);
  };

  const [usersdata, setUsersdata] = useState([]);
  async function GetAllEmployees(newPage, newLimit, newSearchQuery) {
    await Employeeapi.get("/get-all-employees", {
      params: {
        page: newPage,
        limit: newLimit,
        searchQuery: newSearchQuery,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response?.data;
        if (data?.status === "error") {
          let finalresponse = {
            message: data?.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoading(false);
          return false;
        }
        setUsersdata(data?.employees);
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

  const handlePageChange = useCallback(
    (value) => {
      setPage(value);
      GetAllEmployees(value, limit, searchQuery);
      setIsLoading(true);
    },
    [limit, searchQuery]
  );

  const updateSearchQuery = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      setPage(1);
      GetAllEmployees(page, limit, e.target.value);
    },
    [limit]
  );

  const updateLimit = useCallback(
    (data) => {
      let newpage = 1;
      setLimit(data);
      setPage(newpage);
      GetAllEmployees(newpage, data, searchQuery);
    },
    [searchQuery]
  );

  useEffect(() => {
    setIsLoading(true);
    GetAllEmployees(page, limit, searchQuery);
  }, [page, limit, searchQuery]);

  const refreshUserData = useCallback(() => {
    setIsLoading(true);
    GetAllEmployees(page, limit, searchQuery);
  }, [page, limit, searchQuery]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-[22px] font-semibold">Employees</p>
          <div className="flex justify-end items-center">
            {permissions?.employee_page?.includes("add_employee") && (
              <button
                onClick={openAddnewmodal}
                className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-black"
              >
                + Add Employee{" "}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white rounded-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Employees..."
                  className="focus:outline-none text-[14px] pl-6 py-2 rounded-md"
                  onChange={updateSearchQuery}
                  value={searchQuery}
                />
                <div className="absolute left-0 top-3 px-1">
                  <IconSearch size={16} color="#ebecef" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[50px]">
                <Select
                  data={[
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "30", label: "30" },
                    { value: "40", label: "40" },
                    { value: "50", label: "50" },
                  ]}
                  placeholder="10"
                  value={limit}
                  onChange={updateLimit}
                  selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-2 !bg-white !rounded-md !shadow-none !border !border-[#ebecef]"
                  className="!m-0 !p-0 !border-0"
                  dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                />
              </div>
              <div ref={containerRef} className="relative">
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="cursor-pointer flex items-center gap-1 px-2 py-2 text-sm border border-[#ebecef] rounded-sm bg-white hover:bg-gray-50"
                >
                  <IconSettings size={16} className="mr-1" /> Columns
                </button>

                {showColumnToggle && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#ebecef] rounded-md shadow z-50">
                    <div className="p-2">
                      {Object.keys(visibleColumns).map((colKey) => (
                        <label
                          key={colKey}
                          className="flex items-center gap-2 py-1 text-sm cursor-pointer capitalize"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns[colKey]}
                            onChange={() => toggleColumn(colKey)}
                          />
                          {colKey}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
              <table className="w-full table-fixed text-left border-collapse">
                <thead className="bg-gray-50 border-b border-neutral-200">
                  <tr className="w-full">
                    {/* {visibleColumns.reference && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[150px] sticky left-0 z-20 bg-gray-50 border border-neutral-200"
                      >
                        Ref ID
                      </th>
                    )} */}
                    {visibleColumns.name && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px] border border-neutral-200"
                      >
                        Name
                      </th>
                    )}
                    {visibleColumns.email && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[180px] border border-neutral-200"
                      >
                        Email Address
                      </th>
                    )}
                    {visibleColumns.phone && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px] border border-neutral-200"
                      >
                        Phone Number
                      </th>
                    )}
                    {visibleColumns.role && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[140px] border border-neutral-200"
                      >
                        Role
                      </th>
                    )}
                    {visibleColumns.reportingHead && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px] border border-neutral-200"
                      >
                        Reporting Head
                      </th>
                    )}
                    {visibleColumns.date && (
                      <th
                        scope="col"
                        className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[140px] border border-neutral-200"
                      >
                        Date Joined
                      </th>
                    )}
                    <th className="sticky right-[120px] z-10 w-[120px] bg-gray-50 border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px]">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border border-neutral-200"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {isLoading === false ? (
                    usersdata.length > 0 ? (
                      usersdata.map((user, index) => (
                        <tr
                          key={index}
                          className="hover:bg-neutral-50 transition-colors duration-150 align-center group border-b border-neutral-200"
                        >
                          {/* {visibleColumns.reference && (
                            <td className="px-3 py-2 whitespace-normal break-words w-[150px] sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border border-neutral-200">
                              <NavLink to={`/single-employee-view/${user.id}`}>
                                <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                  {user?.id}
                                </p>
                              </NavLink>
                            </td>
                          )} */}
                          {visibleColumns.name && (
                            <td className="px-3 py-2 whitespace-normal break-words w-[160px] border border-neutral-200">
                              <p className="text-neutral-900 text-xs font-semibold leading-[18px]">
                                {user.name}
                              </p>
                            </td>
                          )}
                          {visibleColumns.email && (
                            <td className="px-3 py-2 whitespace-normal break-words w-[180px] border border-neutral-200">
                              <NavLink to={`mailto:${user.email}`}>
                                <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                  {user.email}
                                </p>
                              </NavLink>
                            </td>
                          )}
                          {visibleColumns.phone && (
                            <td className="px-3 py-2 whitespace-normal break-words w-[160px] border border-neutral-200">
                              <NavLink
                                to={`https://wa.me/${user.phone_code}${user.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                  {user?.phone_number
                                    ? `+${user.phone_code} ${user.phone_number}`
                                    : "---"}
                                </p>
                              </NavLink>
                            </td>
                          )}
                          {visibleColumns.role && (
                            <td className="px-3 py-2 whitespace-normal break-words w-[140px] border border-neutral-200">
                              <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                {user.role_name}
                              </p>
                            </td>
                          )}
                          {visibleColumns.reportingHead && (
                            <td className="px-3 py-2 whitespace-normal break-words w-[160px] border border-neutral-200">
                              <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                {user.reporting_head_name
                                  ? user.reporting_head_name
                                  : "----"}
                              </p>
                            </td>
                          )}
                          {visibleColumns.date && (
                            <td className="px-3 py-2 whitespace-normal break-words w-[140px] border border-neutral-200">
                              <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                {dayjs(user?.joinedAt).format("DD MMM YYYY")}
                              </p>
                            </td>
                          )}
                          <td className="px-3 py-2 whitespace-normal break-words w-[160px] sticky right-[120px] z-10 bg-white group-hover:bg-neutral-50 border border-neutral-200">
                            {user?.employee_status === "Inactive" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            ) : user?.employee_status === "Active" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              user?.employee_status === "Suspended" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Suspended
                                </span>
                              )
                            )}
                          </td>
                          <td className="px-3 py-2 text-center whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white group-hover:bg-neutral-50 border border-neutral-200">
                            <div className="flex flex-row items-center justify-center gap-2">
                              {permissions?.employee_page?.includes(
                                "view_employee"
                              ) && (
                                  <div
                                    onClick={() => {
                                      openSingleuserview(user.id);
                                    }}
                                    className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                  >
                                    <IconEye size={18} />
                                  </div>
                                )}
                              {permissions?.employee_page?.includes(
                                "edit_employee"
                              ) && (
                                  <div
                                    onClick={() => {
                                      openEditEmployeemodal(user?.id);
                                    }}
                                    className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                  >
                                    <IconEdit size={18} />
                                  </div>
                                )}
                              {permissions?.employee_page?.includes(
                                "delete_employee"
                              ) && (
                                  <div
                                    onClick={() => openDeleteModal(user?.id)}
                                    className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                                  >
                                    <IconTrash size={18} />
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <p className="text-neutral-500 text-sm">
                            No employees found
                          </p>
                        </td>
                      </tr>
                    )
                  ) : (
                    <>
                      <TableLoadingEffect colspan={8} tr={5} />
                    </>
                  )}
                </tbody>
              </table>
            </div>
            {usersdata.length > 0 && (
              <div className="flex flex-row-reverse">
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
      {errorMessage !== "" && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}

      <Dialog open={addnewmodal} onOpenChange={setAddnewmodal}>
        <DialogContent className="max-w-[50%] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="hidden">Add New Employee</DialogTitle>
          <AddnewEmployee
            closeAddnewmodal={closeAddnewmodal}
            refreshUserData={refreshUserData}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editusermodal} onOpenChange={setEditusermodal}>
        <DialogContent className="max-w-[50%] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="hidden">Edit Employee</DialogTitle>
          <EditEmployee
            closeEditEmployeemodal={closeEditEmployeemodal}
            singleuserId={singleuserId}
            // userRole={userRole}
            refreshUserData={refreshUserData}
          // setRefreshStatus={setRefreshStatus}
          />
        </DialogContent>
      </Dialog>

      <DeleteModal
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        open={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => {
          Employeeapi.post("delete-employee", {
            singleuser_id: singleuserId,
          })
            .then((response) => {
              let data = response.data;
              if (data.status === "error") {
                let finalresponse = {
                  message: data.message,
                  server_res: data,
                };
                setErrorMessage(finalresponse);
                return false;
              }

              closeDeleteModal();
              refreshUserData();
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
          <AssignProject closeProjectModel={closeProjectModel} />
        )}
      </Modal>
    </>
  );
}

export default Employeewrapper;
