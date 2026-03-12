import ExcelJS from "exceljs";
import Flatapi from "../api/Flatapi.jsx";
import Flattocustomer from "./Flattocustomer";
import Datefilter from "../shared/Datefilter";
import DeleteModal from "../shared/DeleteModal";
import Customerapi from "../api/Customerapi.jsx";
import AssignProject from "../shared/AssignProject";
import Groupownerapi from "../api/Groupownerapi.jsx";
import Uploadflatexcel from "./excelflatwrapper/Uploadflatexcel.jsx";
import Excelflattemplate from "./excelflatwrapper/Excelflattemplate.jsx";
import { Funnel, FilterX, ChevronRight, Building2, Download, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { useColumnStore } from "../zustand/useColumnStore";
import { useNavigate, Link, NavLink, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useProjectDetails } from "../zustand/useProjectDetails";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Modal, Pagination, Select } from "@nayeshdaggula/tailify";
import { IconEdit, IconEye, IconSearch, IconTrash, IconDownload, IconSettings } from "@tabler/icons-react";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import Deleteflat from "./Deleteflat.jsx";

function Flatswrapper() {
  const navigate = useNavigate();
  const permissions = useEmployeeDetails((state) => state.permissions);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const containerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [prefilledAssignmentData, setPrefilledAssignmentData] = useState(null);

  const [totalPages, setTotalPages] = useState(0);
  const [totalFlats, setTotalFlats] = useState(0);
  const [pageFlatsCount, setPageFlatsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState("10");
  const [flats, setFlats] = useState([]);
  const [singleFlatId, setSingleFlatId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [flatToCustomer, setFlatToCustomer] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });


  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();
  const storedColumns = useColumnStore((state) => state.storedColumns["flats"]);
  const hasFetchedColumns = useColumnStore((state) => state.hasFetched["flats"]);
  const { fetchColumns, handleColumnStore } = useColumnStore();

  const [downloadTemplate, setDownloadTemplate] = useState(false)
  const openDownloadTemplate = () => {
    setDownloadTemplate(true)
  }
  const closeDownloadTemplate = () => {
    setDownloadTemplate(false)
  }

  const [uploadFlatExcel, setUploadFlatExcel] = useState(false)
  const openUploadFlatExcel = () => {
    setUploadFlatExcel(true)
  }
  const closeUploadFlatExcel = () => {
    setUploadFlatExcel(false)
  }

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

  useEffect(() => {
    const openDrawer = searchParams.get("openDrawer");
    const flatStr = searchParams.get("flat");
    const customerStr = searchParams.get("customer");
    const projectStr = searchParams.get("project");

    if (openDrawer === "true" && flatStr && customerStr) {
      setPrefilledAssignmentData({
        flatNo: flatStr,
        customerUid: customerStr,
        projectUid: projectStr,
      });
      setFlatToCustomer(true);
    }
  }, [searchParams]);

  const [visibleColumns, setVisibleColumns] = useState({
    project: true,
    block: true,
    floorNo: true,
    flatNo: true,
    customer: true,
    status: true,
  });
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const toggleColumn = (colKey) => {
    setVisibleColumns((prev) => {
      const updated = { ...prev, [colKey]: !prev[colKey] };
      handleColumnStore(updated, employeeInfo?.id, "flats");
      return updated;
    });
  };

  useEffect(() => {
    if (employeeInfo?.id) {
      fetchColumns(employeeInfo?.id, "flats");
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

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleChange = (value) => {
    setSelectedCustomer(value);
  };

  async function fetchCustomers() {
    setLoading(true);

    await Customerapi.get("getcustomerslist", {
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
          setLoading(false);
          return false;
        }

        setCustomers(data?.data);
        setLoading(false);
        return false;
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);

        const finalResponse = {
          message: error.message,
          server_res: error?.response?.data || null,
        };

        setErrorMessage(finalResponse);
        setLoading(false);
        return false;
      });
  }

  const [groupOwners, setGroupOwners] = useState([]);
  const [selectedGroupOwner, setSelectedGroupOwner] = useState(null);
  const [selectedMortgage, setSelectedMortgage] = useState(null);

  const handleGroupOwnerChange = (value) => {
    setSelectedGroupOwner(value);
  };

  const handleMortgageChange = (value) => {
    setSelectedMortgage(value);
  };

  async function fetchGroupOwners() {
    setIsLoadingEffect(true);
    try {
      const response = await Groupownerapi.get("/get-list-group-owners");
      const data = response?.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return false;
      }
      setGroupOwners(data?.groupOwners);

      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.error("fetchGroupOwners error:", error);
      const finalresponse = {
        message: error.message || "Failed to fetch group owners",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return false;
    }
  }

  useEffect(() => {
    fetchCustomers();
    fetchGroupOwners()
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

  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const openFlatToCustomer = (id) => {
    setFlatToCustomer(true);
  };
  const closeFlatToCustomer = () => {
    setFlatToCustomer(false);
  };

  const updateLimit = (value) => {
    setLimit(value);
    setPage(1);
  };
  const updateSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleDateFilterChange = (newDateRange) => {
    setDateRange(newDateRange);
    setPage(1);
  };

  const openAddnewmodal = () => {
    navigate("/flats/add-flat");
  };

  const openSingleFlatView = (id) => {
    navigate(`/flats/view-flat/${id}`);
  };

  const openDeleteModal = (id) => {
    setSingleFlatId(id);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSingleFlatId(null);
  };

  const openEditPage = (id) => {
    navigate(`/flats/edit-flat/${id}`);
  };

  const getAllFlats = (page, limit, searchQuery, dateRange, statusFilter, customerId, selectedGroupOwner, selectedMortgage) => {
    setIsLoadingEffect(true);
    setErrorMessage("");

    const params = {
      page,
      limit,
      searchQuery,
    };
    if (dateRange.startDate) params.startDate = dateRange?.startDate;
    if (dateRange.endDate) params.endDate = dateRange?.endDate;
    if (statusFilter) params.status = statusFilter;
    if (customerId) params.customerId = customerId;
    if (selectedGroupOwner) params.selectedGroupOwner = selectedGroupOwner;
    if (selectedMortgage) params.selectedMortgage = selectedMortgage;

    Flatapi.get("get-all-flats", {
      params,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          setErrorMessage(data.message);
          setFlats([]);
          setTotalFlats(0);
          setTotalPages(0);
        } else {
          setErrorMessage("");
          setFlats(data.flats || []);
          setTotalFlats(data.totalFlats || 0);
          setTotalPages(data.totalPages || 0);
          setPageFlatsCount(data.pageFlatsCount || 0);
        }
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.error("Error fetching flats:", error);
        const finalResponse =
          error.response?.data?.message || "An error occurred";
        setErrorMessage(finalResponse);
        setFlats([]);
        setTotalFlats(0);
        setTotalPages(0);
        setIsLoadingEffect(false);
      });
  };


  const handleDownload = async (
    searchQuery,
    statusFilter,
    selectedCustomer,
    dateRange
  ) => {
    setIsLoadingEffect(true);
    setErrorMessage("");
    try {
      const params = {
        searchQuery: searchQuery,
        status: statusFilter,
        customerId: selectedCustomer,
      };

      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await Flatapi.get("get-flats-for-excel", {
        params,
        headers: {
          "Content-Type": "application/json",
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

      setIsLoadingEffect(false);
    } catch (error) {
      console.error("Error Downloading Flat payments Data");
      const finalResonse =
        error.response?.data?.message || "An error occurred during download";
      setErrorMessage(finalResonse);
      setIsLoadingEffect(false);
    }
  };

  const handleDownloadFunction = () => {
    handleDownload(searchQuery, statusFilter, selectedCustomer, dateRange);
  };

  useEffect(() => {
    getAllFlats(
      page,
      limit,
      searchQuery,
      dateRange,
      statusFilter,
      selectedCustomer,
      selectedGroupOwner,
      selectedMortgage,
    );
  }, [page, limit, searchQuery, dateRange, statusFilter, selectedCustomer, selectedGroupOwner, selectedMortgage]);

  const refreshGetAllFlats = () => {
    setIsLoadingEffect(true);
    getAllFlats(
      page,
      limit,
      searchQuery,
      dateRange,
      statusFilter,
      selectedCustomer,
      selectedGroupOwner,
      selectedMortgage,
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLimit('10')
    setPage(1)
    setDateRange({ startDate: '', endDate: '' });
    setStatusFilter("")
    setSelectedCustomer(null);
    setSelectedGroupOwner(null);
    setSelectedMortgage(null);
    getAllFlats(1, limit, '', { startDate: '', endDate: '' }, "", null, null, null);
  };

  const isFilterApplied =
    searchQuery !== '' ||
    limit !== '10' ||
    dateRange.startDate !== '' ||
    dateRange.endDate !== '' ||
    statusFilter !== '' ||
    selectedCustomer !== null ||
    selectedGroupOwner !== null ||
    selectedMortgage !== null;


  // const handleDeleteFlat = () => {
  //   Flatapi.post("delete-flat", {
  //     uuid: singleFlatId,
  //     employeeId: employeeInfo?.id,
  //   })
  //     .then((response) => {
  //       const data = response.data;
  //       if (data.status === "error") {
  //         setErrorMessage(data.message);
  //         return;
  //       }
  //       closeDeleteModal();
  //       refreshGetAllFlats();
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting flat:", error);
  //       const finalResponse =
  //         error.response?.data?.message || "An error occurred";
  //       setErrorMessage(finalResponse);
  //     });
  // };

  const typeToLabelMap = {
    Studio: "Studio",
    OneBHK: "1 BHK",
    OnePointFiveBHK: "1.5 BHK",
    TwoBHK: "2 BHK",
    TwoPointFiveBHK: "2.5 BHK",
    ThreeBHK: "3 BHK",
    ThreePointFiveBHK: "3.5 BHK",
    FourBHK: "4 BHK",
    FourPointFiveBHK: "4.5 BHK",
    FiveBHK: "5 BHK",
    Penthouse: "Penthouse",
    Duplex: "Duplex",
  };

  return (
    <>
      <div className="crm-page">
        {/* <div className="crm-header">
          <p className="crm-title">Flats</p>
          <div className="crm-actions">
            <div className="crm-actions">
              {permissions?.flats_page?.includes("add_flat") && (
                <Link
                  to={"/flats/add-flat"}
                  className="crm-btn crm-btn-primary"
                >
                  + Add Flat
                </Link>
              )}

              {permissions?.flats_page?.includes("assign_flat_to_customer") && (
                <div
                  onClick={openFlatToCustomer}
                  className="crm-btn border-[#b4295e] bg-[#b4295e] text-white hover:bg-[#9a234f]"
                >
                  Assign Flat to Customer
                </div>
              )}
              {permissions?.flats_page?.includes("download_flat_excel") && (
                <button onClick={openDownloadTemplate} className="crm-btn crm-btn-primary">
                  Download Flat Template
                </button>
              )}
              {permissions?.flats_page?.includes("export_flat_to_excel") && (
                <button
                  onClick={handleDownloadFunction}
                  className="crm-btn crm-btn-muted disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={isLoadingEffect}
                >
                  <IconDownload size={16} />
                  Export to Excel
                </button>
              )}
              {permissions?.flats_page?.includes("upload_flat_excel") && (
                <button onClick={openUploadFlatExcel} className="crm-btn border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700">
                  Upload Bulk Flats
                </button>
              )}
            </div>
          </div>
        </div> */}

        <div className="bg-white rounded-md shadow-sm border-b border-slate-100 px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-4">
            <Link to="/dashboard" className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Dashboard
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-xs font-bold text-[#de4183] uppercase tracking-widest">
              Flats
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4">

            {/* top Section */}
            <div className="flex items-center gap-4">

              <div className="w-10 h-10 rounded-xl border border-blue-300 bg-blue-50 flex items-center justify-center shadow-sm transition hover:bg-blue-100">
                <Building2 size={18} className="text-blue-600" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                  Flats
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage and organize flats in your project
                </p>
              </div>

            </div>


            {/* bottom Section - Actions */}
            <div className="flex flex-wrap items-center gap-2.5 border-t pt-4">

              {/* Add Flat */}
              {permissions?.flats_page?.includes("add_flat") && (
                <Link to={"/flats/add-flat"}>
                  <button className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-rose-300 text-rose-700 bg-rose-50 text-xs font-semibold shadow-sm hover:bg-rose-100 hover:border-rose-400 hover:-translate-y-[1px] transition-all duration-200">
                    + Add Flat
                  </button>
                </Link>
              )}

              {/* Assign Flat */}
              {permissions?.flats_page?.includes("assign_flat_to_customer") && (
                <button
                  onClick={openFlatToCustomer}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-indigo-300 text-indigo-700 bg-indigo-50 text-xs font-semibold shadow-sm hover:bg-indigo-100 hover:border-indigo-400 hover:-translate-y-[1px] transition-all duration-200"
                >
                  Assign Flat to Customer
                </button>
              )}

              {/* Download Template */}
              {permissions?.flats_page?.includes("download_flat_excel") && (
                <button
                  onClick={openDownloadTemplate}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-amber-300 text-amber-700 bg-amber-50 text-xs font-semibold shadow-sm hover:bg-amber-100 hover:border-amber-400 hover:-translate-y-[1px] transition-all duration-200"
                >
                  <Download size={15} strokeWidth={2.5} />
                  Download Template
                </button>
              )}

              {/* Export Excel */}
              {permissions?.flats_page?.includes("export_flat_to_excel") && (
                <button
                  onClick={handleDownloadFunction}
                  disabled={isLoadingEffect}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-slate-700 bg-slate-50 text-xs font-semibold shadow-sm hover:bg-slate-100 hover:border-slate-400 hover:-translate-y-[1px] transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  <IconDownload size={16} />
                  Export to Excel
                </button>
              )}

              {/* Upload Flats */}
              {permissions?.flats_page?.includes("upload_flat_excel") && (
                <button
                  onClick={openUploadFlatExcel}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-emerald-300 text-emerald-700 bg-emerald-50 text-xs font-semibold shadow-sm hover:bg-emerald-100 hover:border-emerald-400 hover:-translate-y-[1px] transition-all duration-200"
                >
                  <Upload size={15} strokeWidth={2.5} />
                  Upload Flats
                </button>
              )}

            </div>
          </div>
        </div>

        <div className="crm-panel crm-panel-body z-0">
          <div className="crm-toolbar">
            <div className="crm-search-wrap z-0">
              <input
                type="text"
                placeholder="Search Flats..."
                className="h-9 focus:outline-none text-[13px] pl-8 py-1.5 rounded-md border border-[#e2e8f0]"
                onChange={updateSearchQuery}
                value={searchQuery}
              />
              <div className="absolute left-2.5 top-2.5">
                <IconSearch size={14} color="#94a3b8" />
              </div>
            </div>
            <div className="crm-toolbar-right">


              {/* <Select
                data={groupOwners}
                value={selectedGroupOwner}
                isLoading={isLoadingEffect}
                onChange={handleGroupOwnerChange}
                placeholder="Search Group..."
                searchable
                mainContainerClass="!w-35"
                selectWrapperClass="!bg-white !rounded-sm !shadow-none !border !border-[#e2e8f0] !py-1.5"
                dropDownClass=" overflow-y-hidden"
                clearable
              /> */}
              {/* <Select
                data={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={selectedMortgage}
                isLoading={isLoadingEffect}
                onChange={handleMortgageChange}
                placeholder="Select Mortgage"
                searchable
                mainContainerClass="!w-35"
                selectWrapperClass="!bg-white !rounded-sm !shadow-none !border !border-[#e2e8f0] !py-1.5"
                dropDownClass=" overflow-y-hidden"
                clearable
              /> */}
              {!selectedCustomer && (
                <>
                  {/* <Datefilter
                    onFilterChange={handleDateFilterChange}
                    onClearFilter={handleDateFilterChange}
                  /> */}
                  <div className="">
                    <Select
                      data={[
                        { value: "", label: "All Statuses" },
                        { value: "Sold", label: "Sold" },
                        { value: "Unsold", label: "Unsold" },
                      ]}
                      placeholder="Select Status"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      mainContainerClass="!w-30"
                      selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-1 !bg-white !rounded-md !shadow-none !border !border-[#e2e8f0]"
                      className="!m-0 !p-0 !border-0 "
                      dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                    />
                  </div>
                </>
              )}
              <Select
                data={customers}
                value={selectedCustomer}
                isLoading={loading}
                onChange={handleChange}
                placeholder="Search Customers..."
                searchable
                mainContainerClass="!w-40"
                selectWrapperClass="!bg-white !rounded-md !shadow-none !border !border-[#e2e8f0] !py-1"
                dropDownClass=" overflow-y-hidden"
                clearable
              />
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
                  selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[5px] !bg-white !rounded-md !shadow-none !border !border-[#e2e8f0]"
                  className="!m-0 !p-0 !border-0"
                  dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                />
              </div>

              <div ref={containerRef} className="relative">
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="crm-btn h-9 px-2.5 py-0"
                >
                  <IconSettings size={16} className="mr-1" /> Columns
                </button>

                {showColumnToggle && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-md shadow-sm z-50">
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
          <div className="crm-table-wrap w-full relative z-0">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="bg-gray-50 border-b border-neutral-200">
                <tr className="w-full">
                  {visibleColumns.project && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[180px] border-r border-neutral-200">
                      Project
                    </th>
                  )}
                  {visibleColumns.block && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[120px] border-r border-neutral-200">
                      Block
                    </th>
                  )}
                  {visibleColumns.floorNo && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[120px] border-r border-neutral-200">
                      Floor No
                    </th>
                  )}
                  {visibleColumns.flatNo && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[120px] border-r border-neutral-200">
                      Flat No
                    </th>
                  )}
                  {visibleColumns.customer && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[180px] border-r border-neutral-200">
                      Customer
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] sticky right-[120px] z-10 w-[120px] bg-gray-50 border-l border-neutral-200">
                      Status
                    </th>
                  )}

                  {/* LAST (STICKY RIGHT) */}
                  <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoadingEffect ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-6 text-gray-400 text-[15px] font-medium"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : flats.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-3 text-neutral-500 text-sm"
                    >
                      No flats found.
                    </td>
                  </tr>
                ) : (
                  flats.map((flat, index) => (
                    <tr
                      key={flat?.id}
                      className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-150 align-center group"
                    >
                      {visibleColumns.project && (
                        <td className="px-3 py-2 whitespace-normal break-all !text-[11px] border-r border-neutral-200">
                          <p className="text-neutral-600 text-xs font-medium leading-[18px] capitalize break-all whitespace-normal">
                            {flat?.project_name || "-"}
                          </p>
                        </td>
                      )}
                      {visibleColumns.block && (
                        <td className="px-3 py-2 whitespace-normal break-words !text-[11px] border-r border-neutral-200">
                          <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                            {flat?.block?.block_name || "---"}
                          </p>
                        </td>
                      )}
                      {visibleColumns.floorNo && (
                        <td className="px-3 py-2 whitespace-normal break-words !text-[11px] border-r border-neutral-200">
                          <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                            {flat?.floor_no || "---"}
                          </p>
                        </td>
                      )}
                      {visibleColumns.flatNo && (
                        <td className="px-3 py-2 whitespace-normal break-words !text-[11px] border-r border-neutral-200">
                          <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                            <NavLink to={`/flats/view-flat/${flat?.id}`} className="hover:text-[#0083bf] hover:underline">
                              {flat?.flat_no || "---"}
                            </NavLink>
                          </p>
                        </td>
                      )}
                      {visibleColumns.customer && (
                        <td className="px-3 py-2 whitespace-normal break-all relative !text-[11px] border-r border-neutral-200">
                          {flat?.customer ? (
                            <div className="group/customer relative w-full">
                              {flat?.customer && flat?.customer !== "N/A" ? (
                                <Link
                                  to={`/customers/${flat?.customer_details?.id}`}
                                  className="text-neutral-600 text-xs font-medium leading-[18px] capitalize break-words whitespace-normal cursor-pointer hover:text-[#0083bf] hover:underline"
                                >
                                  {flat?.customer}
                                </Link>
                              ) : (
                                <p className="text-neutral-600 text-xs font-medium leading-[18px] capitalize break-words whitespace-normal">
                                  {flat?.customer}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-neutral-400 text-xs font-normal leading-[18px]">---</p>
                          )}
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-3 py-2 whitespace-normal break-words sticky right-[120px] z-10 w-[120px] bg-white group-hover:bg-neutral-50 !border-l border-neutral-200 !text-[11px]">
                          <span
                            className={`${flat?.status === "Sold"
                              ? "text-green-800 bg-green-100"
                              : "text-red-800 bg-red-100"
                              } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                          >
                            {flat?.status}
                          </span>
                        </td>
                      )}
                      {/* LAST (STICKY RIGHT) */}
                      <td className="px-3 py-2 whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                        <div className="flex flex-row gap-2 justify-center">
                          {permissions?.flats_page?.includes("view_flat") && (
                            <div
                              onClick={() => openSingleFlatView(flat.id)}
                              className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                            >
                              <IconEye size={18} />
                            </div>
                          )}
                          {permissions?.flats_page?.includes("edit_flat") && (
                            <div
                              onClick={() => openEditPage(flat.id)}
                              className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                            >
                              <IconEdit size={18} />
                            </div>
                          )}
                          {permissions?.flats_page?.includes("delete_flat") && (
                            <div
                              onClick={() => openDeleteModal(flat.id)}
                              className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                            >
                              <IconTrash size={18} />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!isLoadingEffect && flats.length > 0 && (
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

      {errorMessage && (
        <p className="text-sm text-[#ec0606] mb-4">{errorMessage}</p>
      )}

      {/* <DeleteModal
        title="Delete Flat"
        message="Are you sure you want to delete this flat?"
        open={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteFlat}
      /> */}

      <Modal
        open={deleteModal}
        onClose={closeDeleteModal}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {deleteModal === true && (
          <Deleteflat
            refreshGetAllFlats={refreshGetAllFlats}
            closeDeleteModal={closeDeleteModal}
            singleflatid={singleFlatId}
            employeeId={employeeInfo?.id}
          />
        )}
      </Modal>


      <Drawer
        open={flatToCustomer}
        onClose={closeFlatToCustomer}
        direction='right'
        className='h-screen overflow-y-auto'
        size='80vw'
        zIndex={100}
        lockBackgroundScroll={true}
      >
        {flatToCustomer && (
          <Flattocustomer
            closeFlatToCustomer={closeFlatToCustomer}
            refreshGetAllFlats={refreshGetAllFlats}
            prefilledData={prefilledAssignmentData}
          />
        )}
      </Drawer>

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

      <Modal
        open={downloadTemplate}
        close={closeDownloadTemplate}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {downloadTemplate && (
          <Excelflattemplate
            closeDownloadTemplate={closeDownloadTemplate}
          />
        )}
      </Modal>

      <Modal
        open={uploadFlatExcel}
        close={closeUploadFlatExcel}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {uploadFlatExcel && (
          <Uploadflatexcel
            closeUploadFlatExcel={closeUploadFlatExcel}
            refreshGetAllFlats={refreshGetAllFlats}
            setErrorMessage={setErrorMessage}
          />
        )}
      </Modal>
    </>
  );
}

export default Flatswrapper;
