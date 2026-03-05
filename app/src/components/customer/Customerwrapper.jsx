import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ExcelJS from "exceljs";
import Customerapi from "../api/Customerapi";
import Errorpanel from "../shared/Errorpanel";
import Datefilter from "../shared/Datefilter";
import DeleteModal from "../shared/DeleteModal";
import Deletecustomer from "./Deletecustomer.jsx";
import AssignProject from "../shared/AssignProject";
import Uploadcustomerexcel from "./excelcustomerwrapper/Uploadcustomerexcel.jsx";
import Excelcustomertemplate from "./excelcustomerwrapper/Excelcustomertemplate.jsx";
import { useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Modal, Pagination } from "@nayeshdaggula/tailify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FilterX } from "lucide-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconSearch,
  IconTrash,
  IconPlus,
  IconUserPlus,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useColumnStore } from "../zustand/useColumnStore";
import { useProjectDetails } from "../zustand/useProjectDetails";
import { useAllocatedProjectDetails } from "../zustand/useAllocatedProjectDetails";
import Customertolead from "./Customertolead";

function Customerwrapper() {
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;
  const storedColumns = useColumnStore((state) => state.storedColumns["customers"]);
  const hasFetchedColumns = useColumnStore((state) => state.hasFetched["customers"]);
  const { fetchColumns, handleColumnStore } = useColumnStore();
  const access_token = useEmployeeDetails((state) => state.access_token);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const permissions = useEmployeeDetails((state) => state.permissions);

  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCustomerCount, setPageCustomerCount] = useState(0);
  const [sortby, setSortby] = useState("created_at");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortbyType, setSortbyType] = useState("desc");
  const [singleCustomerId, setSingleCustomerId] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();
  const { allocatedProjectData, fetchAllocatedProjectData } = useAllocatedProjectDetails();

  const [selectedProject, setSelectedProject] = useState(null);

  const updateSelectedProject = (value) => {
    setSelectedProject(value);
    setPage(1);
    setIsLoading(true);
    GetAllCustomers(1, limit, searchQuery, sortbyType, sortby, value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLimit("10");
    setDateRange({ startDate: '', endDate: '' });
    setSelectedProject(null);
    setPage(1);
    setIsLoading(true);
    GetAllCustomers(1, '10', '', sortbyType, sortby, null);
  };

  const isFilterApplied = searchQuery || limit !== "10" || selectedProject || dateRange.startDate;

  const [projectModel, setProjectModel] = useState(false);
  const openProjectModel = () => {
    setProjectModel(true);
  };
  const closeProjectModel = () => {
    setProjectModel(false);
  };

  const [downloadTemplate, setDownloadTemplate] = useState(false)
  const openDownloadTemplate = () => {
    setDownloadTemplate(true)
  }
  const closeDownloadTemplate = () => {
    setDownloadTemplate(false)
  }

  const [uploadCustomerExcel, setUploadCustomerExcel] = useState(false)
  const openUploadCustomerExcel = () => {
    setUploadCustomerExcel(true)
  }
  const closeUploadCustomerExcel = () => {
    setUploadCustomerExcel(false)
  }


  useEffect(() => {
    fetchProjectData();
    fetchAllocatedProjectData();
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

  const [deleteModal, setDeleteModal] = useState(false);
  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSingleCustomerId(id);
  };
  const closeDeleteModal = () => setDeleteModal(false);

  const [convertModal, setConvertModal] = useState(false);
  const [selectedCustomerUuid, setSelectedCustomerUuid] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");

  const openConvertModal = (uuid, name) => {
    setSelectedCustomerUuid(uuid);
    setSelectedCustomerName(name);
    setConvertModal(true);
  };
  const closeConvertModal = () => {
    setConvertModal(false);
  };

  const [customersData, setCustomersData] = useState([]);

  async function GetAllCustomers(
    newPage,
    newLimit,
    newSearchQuery,
    newSortbyType,
    newSortby,
    selectedproject
  ) {
    const params = {
      page: newPage,
      limit: newLimit,
      searchQuery: newSearchQuery,
      sortbyType: newSortbyType,
      sortby: newSortby,
      projectId: selectedproject,
    };

    if (dateRange.startDate) params.startDate = dateRange.startDate;
    if (dateRange.endDate) params.endDate = dateRange.endDate;

    await Customerapi.get("/get-all-customers", {
      params,
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
          setIsLoading(false);
          return false;
        }
        setCustomersData(data?.customers || []);
        setTotalPages(data?.totalPages);
        setPageCustomerCount(data?.pageCustomerCount || 0);
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
      GetAllCustomers(value, limit);
      setIsLoading(true);
    },
    [limit]
  );

  const updateSortby = useCallback(
    (data) => {
      setSortby(data);
      GetAllCustomers(page, limit, searchQuery, sortbyType, data, selectedProject);
    },
    [page, limit, searchQuery, sortbyType, selectedProject]
  );

  const [sortByPanel, setSortByPanel] = useState(false);
  const sortByPanelToggle = () => setSortByPanel(!sortByPanel);

  const updateSortbyType = useCallback(
    (data) => {
      setSortbyType(data);
      GetAllCustomers(page, limit, searchQuery, data, sortby, selectedProject);
    },
    [page, limit, searchQuery, sortby, selectedProject]
  );

  const updateSearchQuery = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      GetAllCustomers(page, limit, e.target.value, sortbyType, sortby, selectedProject);
    },
    [page, limit, sortbyType, sortby, selectedProject]
  );

  const updateLimit = useCallback(
    (data) => {
      let newpage = 1;
      setLimit(data);
      setPage(newpage);
      GetAllCustomers(newpage, data, searchQuery, sortbyType, sortby, selectedProject);
    },
    [page, searchQuery, sortbyType, sortby, selectedProject]
  );

  useEffect(() => {
    setIsLoading(true);
    GetAllCustomers(page, limit, searchQuery, sortbyType, sortby, selectedProject);
  }, [page, limit, searchQuery, sortbyType, sortby, dateRange]);

  const refreshCustomerData = useCallback(() => {
    setIsLoading(true);
    GetAllCustomers(page, limit, searchQuery, sortbyType, sortby, selectedProject);
  }, [page, limit, searchQuery, sortbyType, sortby, selectedProject]);

  const handleDateFilterChange = (newDateRange) => {
    setDateRange(newDateRange);
    setPage(1);
    setIsLoading(true);
    GetAllCustomers(1, limit, searchQuery, sortbyType, sortby, selectedProject);
  };

  const handleDownload = async (searchQuery, dateRange, selectedProject) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const params = {
        searchQuery: searchQuery,
      };

      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      if (selectedProject) params.projectId = selectedProject;

      const response = await Customerapi.get("get-customers-for-excel", {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        responseType: "blob",
      });

      if (response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Dashboard Stats.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success({
          title: "Export Successful",
          message: "Dashboard stats downloaded successfully.",
          color: "green",
        });
      } else {
        toast.error({
          title: "Export Failed",
          message: "No data received for export.",
          color: "red",
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error Downloading Flat payments Data");
      const finalResonse =
        error.response?.data?.message || "An error occurred during download";
      setErrorMessage(finalResonse);
      setIsLoading(false);
    }
  };

  const handleDownloadFunction = () => {
    handleDownload(searchQuery, dateRange, selectedProject);
  };

  const [visibleColumns, setVisibleColumns] = useState({
    reference: true,
    flatNo: true, // Flats
    name: true, // Name
    email: true, // Email
    phone: true, // Phone
    fatherName: true, // FatherName
    adhar: true, // Adhar
    pan: true, // PAN
    citizenship: true, // Citizenship
    residence: true, // Residence
    motherTongue: true, // Mother Tongue
    maritalStatus: true, // Martial Status
    status: true, // Status
  });
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const containerRef = useRef(null);

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
      handleColumnStore(updated, employeeId, "customers");
      return updated;
    });
  };

  useEffect(() => {
    if (employeeId) {
      fetchColumns(employeeId, "customers");
    }
  }, [employeeId]);

  useEffect(() => {
    if (hasFetchedColumns && Array.isArray(storedColumns)) {
      let updatedColumns;

      if (storedColumns.length === 0) {
        // Only set to all true if we've actually fetched and there's no data
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

  console.log("customerData", customersData);


  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-semibold">Customers</p>
          <div className="flex flex-col lg:flex-row justify-end items-center gap-2">
            <div className="flex gap-2">
              {permissions?.customers_page?.includes("add_customer") && (
                <Link to={"/customers/onboarding"} className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-black flex items-center gap-1">
                  + Add Customer
                </Link>
              )}
              {permissions?.customers_page?.includes("download_customer_excel") && (
                <button onClick={openDownloadTemplate} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded !bg-[#0083bf]">
                  Download Customer Template
                </button>
              )}
              {permissions?.customers_page?.includes("export_customer_to_excel") && (
                <button
                  onClick={handleDownloadFunction}
                  className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-[#931f42] flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <IconDownload size={16} />
                  Export to Excel
                </button>
              )}
              {permissions?.customers_page?.includes("upload_customer_excel") && (
                <button onClick={openUploadCustomerExcel} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded bg-emerald-500">
                  Upload Bulk Customers
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <div className="w-[250px] relative">
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  onChange={updateSearchQuery}
                  value={searchQuery}
                  className="h-[38px] pl-9 bg-white border-[#ebecef] text-[14px] text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[160px]">
                <Select value={selectedProject || "all"} onValueChange={(val) => updateSelectedProject(val === "all" ? null : val)}>
                  <SelectTrigger className="h-[38px] bg-white border-[#ebecef] text-[14px] text-neutral-600 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select Project..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="all">All Projects</SelectItem>
                    {(allocatedProjectData || []).map(p => (
                      <SelectItem key={p.id} value={p.id?.toString()}>
                        {p.project_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[70px]">
                <Select value={limit} onValueChange={updateLimit}>
                  <SelectTrigger className="h-[38px] bg-white border-[#ebecef] text-[14px] text-neutral-600 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] min-w-[70px]">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* <Datefilter
                onFilterChange={handleDateFilterChange}
                onClearFilter={handleDateFilterChange}
              /> */}
              <div ref={containerRef} className="relative">
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="cursor-pointer flex items-center gap-1 px-2 py-2 text-sm border border-[#ebecef] rounded-sm bg-white hover:bg-gray-50"
                >
                  ⚙️ Columns
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
              {isFilterApplied && (
                <div onClick={clearFilters} className={`cursor-pointer transition-colors ${isFilterApplied ? '!text-[#ea2b2b] ' : '!text-[#6b7178] '}`}>
                  <FilterX className="!w-5 !h-5" />
                </div>
              )}
            </div>
          </div>
          <div className="w-full relative overflow-x-auto overflow-y-hidden border border-neutral-200 rounded-lg z-0">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="bg-gray-50 border-b border-neutral-200">
                <tr className="w-full">
                  {visibleColumns.reference && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                      Ref ID
                    </th>
                  )}
                  {visibleColumns.name && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[180px] border-r border-neutral-200">
                      Name
                    </th>
                  )}
                  {visibleColumns.email && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[200px] border-r border-neutral-200">
                      Email
                    </th>
                  )}
                  {visibleColumns.phone && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] border-r border-neutral-200">
                      Phone
                    </th>
                  )}
                  {visibleColumns.flatNo && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[180px] border-r border-neutral-200">
                      Flats
                    </th>
                  )}
                  {visibleColumns.fatherName && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] border-r border-neutral-200">
                      Father Name
                    </th>
                  )}
                  {visibleColumns.adhar && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] border-r border-neutral-200">
                      Aadhar
                    </th>
                  )}
                  {visibleColumns.pan && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] border-r border-neutral-200">
                      PAN
                    </th>
                  )}
                  {visibleColumns.citizenship && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[160px] border-r border-neutral-200">
                      Citizenship
                    </th>
                  )}
                  {visibleColumns.residence && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[160px] border-r border-neutral-200">
                      Residence
                    </th>
                  )}
                  {visibleColumns.motherTongue && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[160px] border-r border-neutral-200">
                      Mother Tongue
                    </th>
                  )}
                  {visibleColumns.maritalStatus && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[160px]">
                      Martial Status
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="sticky right-[120px] z-10 w-[120px] bg-gray-50 border-l border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px]">
                      Status
                    </th>
                  )}
                  {/* LAST (STICKY RIGHT) */}
                  <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {isLoading === false ? (
                  customersData?.length > 0 ? (
                    customersData?.map((customer, index) => (
                      <tr
                        key={index}
                        className="hover:bg-neutral-50 transition-colors duration-150 align-center group"
                      >
                        {visibleColumns.reference && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                            <NavLink
                              to={`/customers/${customer?.customer_uid}`}
                            >
                              <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                {customer?.customer_uid}
                              </p>
                            </NavLink>
                          </td>
                        )}
                        {visibleColumns.name && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <p className="text-neutral-900 text-xs font-semibold leading-[18px]">
                              {customer?.prefixes || ""} {customer?.first_name} {customer?.last_name}
                            </p>
                          </td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[200px] border-r border-neutral-200">
                            <NavLink to={`mailto:${customer.email}`}>
                              <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                {customer?.email || "----"}
                              </p>
                            </NavLink>
                          </td>
                        )}
                        {visibleColumns.phone && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <NavLink
                              to={`https://wa.me/${customer.phone_code}${customer.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                {customer?.phone_code && customer?.phone_number
                                  ? `+${customer?.phone_code} ${customer?.phone_number}`
                                  : "----"}
                              </p>
                            </NavLink>
                          </td>
                        )}
                        {visibleColumns.flatNo && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[220px] relative border-r border-neutral-200">
                            <div className="flex flex-col gap-2">
                              {customer?.flat_details &&
                                customer.flat_details.length > 0 ? (
                                <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
                                  {customer.flat_details.map(
                                    (flat, flatIndex) => (
                                      <div key={flat.uuid || flatIndex} className="group/flat relative inline-block">
                                        {pageCustomerCount < 5 ? (
                                          permissions?.flats_page?.includes("view_flat") ? (
                                            <Link to={`/flats/view-flat/${flat?.uuid}`}>
                                              <p
                                                className={`text-neutral-600 text-xs font-medium leading-[18px] capitalize break-words whitespace-normal cursor-pointer pr-2 hover:text-[#0083bf] ${customer.flat_details.length > 1 && flatIndex !== customer.flat_details.length - 1
                                                  ? "border-r border-neutral-300"
                                                  : ""
                                                  }`}
                                              >
                                                {flat.flat_no}
                                              </p>
                                            </Link>
                                          ) : (
                                            <p
                                              className={`text-neutral-600 text-xs font-medium leading-[18px] capitalize break-words whitespace-normal pr-2 ${customer.flat_details.length > 1 && flatIndex !== customer.flat_details.length - 1
                                                ? "border-r border-neutral-300"
                                                : ""
                                                }`}
                                            >
                                              {flat.flat_no}
                                            </p>
                                          )
                                        ) : (
                                          <p
                                            className={`text-neutral-600 text-xs font-medium leading-[18px] capitalize break-words whitespace-normal pr-2 ${customer.flat_details.length > 1 && flatIndex !== customer.flat_details.length - 1
                                              ? "border-r border-neutral-300"
                                              : ""
                                              }`}
                                          >
                                            {flat.flat_no}
                                          </p>
                                        )}


                                        {/* Hover Card */}
                                        {pageCustomerCount > 5 &&
                                          <div
                                            className="absolute z-[1000] invisible opacity-0 group-hover/flat:visible group-hover/flat:opacity-100 transition-all duration-200 delay-200 flex flex-col gap-2 bg-white shadow-lg border border-neutral-200 p-2 rounded-xl w-60 max-w-xs break-words"
                                            style={{
                                              top:
                                                index < 3
                                                  ? "calc(100% + 5px)"
                                                  : "auto",
                                              bottom:
                                                index >= 3
                                                  ? "calc(100% + 5px)"
                                                  : "auto",
                                              left: "0",
                                            }}
                                          >
                                            <div className="flex gap-2">
                                              <img
                                                crossOrigin="anonymous"
                                                src={
                                                  flat.flat_img_url ||
                                                  "./assets/flat-static-image.png"
                                                }
                                                alt="Flat"
                                                className="w-[40%] h-[130px] object-cover border border-gray-300 rounded"
                                              />

                                              <div className="flex flex-col items-center gap-3 w-full">
                                                <div className="flex flex-col break-words w-full gap-[1px]">
                                                  <p className="text-sm font-semibold text-gray-500 capitalize">
                                                    Block:{" "}
                                                    {flat?.block?.block_name ??
                                                      "N/A"}
                                                  </p>
                                                  <p className="text-sm font-semibold text-gray-500 capitalize">
                                                    Floor No:{" "}
                                                    {flat?.floor_no ?? "N/A"}
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    Flat No: {flat.flat_no}
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    Type: {flat?.type ?? "N/A"}
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    Area:{" "}
                                                    {flat.square_feet ?? "N/A"}{" "}
                                                    <strong>sq.ft</strong>
                                                  </p>
                                                </div>

                                                <div className="w-full">
                                                  {permissions?.flats_page?.includes("view_flat") && (
                                                    <Link
                                                      to={`/flats/view-flat/${flat?.uuid}`}
                                                      className="cursor-pointer text-xs text-[#0083bf] hover:text-white flex justify-center items-center relative px-4 py-1 rounded border border-[#0083bf] hover:bg-[#0083bf]"
                                                    >
                                                      View Flat
                                                    </Link>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                permissions?.flats_page?.includes("add_flat") && (
                                  <Link
                                    to={`/assign-flat?customer=${customer.uuid || customer.customer_uid}`}
                                    className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded w-fit mt-1"
                                  >
                                    <IconPlus size={12} />
                                    Assign Flat
                                  </Link>
                                )
                              )}


                            </div>
                          </td>
                        )}
                        {visibleColumns.fatherName && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {customer?.father_name || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.adhar && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {customer?.aadhar_card_no || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.pan && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {customer?.pan_card_no || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.citizenship && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[160px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {customer?.country_of_citizenship || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.residence && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[160px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {customer?.country_of_residence || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.motherTongue && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[160px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {customer?.mother_tongue || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.maritalStatus && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[160px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {customer?.marital_status || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[160px] sticky right-[120px] z-10 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                            {customer?.status === "Inactive" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            ) : customer?.status === "Active" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              customer?.status === "Suspended" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Suspended
                                </span>
                              )
                            )}
                          </td>
                        )}
                        <td className="px-3 py-2 text-center whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                          <div className="flex flex-row items-center justify-center gap-2">
                            {permissions?.customers_page?.includes("view_single_customer") && (
                              <Link
                                to={`/customers/${customer?.customer_uid}`}
                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                              >
                                <IconEye size={18} />
                              </Link>
                            )}
                            {permissions?.customers_page?.includes("edit_customer") && (
                              <Link
                                to={`/customers/editcustomer/${customer.customer_uid}`}
                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                              >
                                <IconEdit size={18} />
                              </Link>
                            )}
                            {permissions?.customers_page?.includes("delete_customer") && (
                              <div
                                onClick={() => openDeleteModal(customer?.id)}
                                className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                              >
                                <IconTrash size={18} />
                              </div>
                            )}
                            {customer?.flat_details?.length === 0 && (
                              <div
                                onClick={() => openConvertModal(customer?.customer_uid, `${customer?.first_name} ${customer?.last_name}`)}
                                className="p-1 hover:bg-orange-50 rounded-md transition-colors text-neutral-500 hover:text-orange-600 cursor-pointer"
                                title="Convert to Lead"
                              >
                                <IconUserPlus size={18} />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-3">
                        <p className="text-neutral-500 text-sm">
                          No customers found
                        </p>
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        Object.keys(visibleColumns).filter(
                          (key) => visibleColumns[key]
                        ).length + 2 // +1 for Actions, +1 for sticky? No, just enough to cover.
                      }
                      className="text-center py-6 text-gray-400 text-[15px] font-medium"
                    >
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {customersData?.length > 0 && (
            <div className="flex flex-row-reverse">
              <Pagination
                totalpages={totalPages}
                value={page}
                siblings={1}
                onChange={handlePageChange}
                color="#0083bf"
              />
            </div>
          )
          }

          {
            errorMessage !== "" && (
              <Errorpanel
                errorMessages={errorMessage}
                setErrorMessages={setErrorMessage}
              />
            )
          }
        </div >
      </div >

      {/* <DeleteModal
        title="Delete Customer"
        message={`Are you sure you want to delete this customer?`}
        open={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => {
          Customerapi.post("delete-customer", {
            singlecustomer_id: singleCustomerId,
            employeeId: employeeId,
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
              refreshCustomerData();
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
      /> */}

      <Modal
        open={projectModel}
        onClose={closeProjectModel}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {projectModel === true && (
          <AssignProject closeProjectModel={closeProjectModel} />
        )
        }
      </Modal>

      <Modal
        open={downloadTemplate}
        close={closeDownloadTemplate}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {downloadTemplate && (
          <Excelcustomertemplate
            closeDownloadTemplate={closeDownloadTemplate}
          />
        )}
      </Modal>

      <Modal
        open={deleteModal}
        onClose={closeDeleteModal}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {deleteModal === true && (
          <Deletecustomer refreshCustomerData={refreshCustomerData} closeDeleteModal={closeDeleteModal} singleCustomerId={singleCustomerId} employeeId={employeeId} />
        )}
      </Modal>

      <Modal
        open={uploadCustomerExcel}
        close={closeUploadCustomerExcel}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {uploadCustomerExcel && (
          <Uploadcustomerexcel
            closeUploadCustomerExcel={closeUploadCustomerExcel}
            refreshCustomerData={refreshCustomerData}
            setErrorMessage={setErrorMessage}
          />
        )}
      </Modal>

      {convertModal && (
        <Customertolead
          open={convertModal}
          closeConvertModal={closeConvertModal}
          customerUuid={selectedCustomerUuid}
          customerName={selectedCustomerName}
          refreshCustomerList={refreshCustomerData}
        />
      )}
    </>
  );
}

export default Customerwrapper;
