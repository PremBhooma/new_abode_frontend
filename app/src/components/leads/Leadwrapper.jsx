import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ExcelJS from "exceljs";
import Customerapi from "../api/Customerapi.jsx";
import Groupownerapi from "../api/Groupownerapi.jsx";
import Leadapi from "../api/Leadapi.jsx";
import Errorpanel from "../shared/Errorpanel.jsx";
import Datefilter from "../shared/Datefilter.jsx";
import DeleteModal from "../shared/DeleteModal.jsx";
import Uploadleadsexcel from "./excelleadswrapper/Uploadleadsexcel.jsx";
import Excelleadstemplate from "./excelleadswrapper/Excelleadstemplate.jsx";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router-dom";
import { useColumnStore } from "../zustand/useColumnStore.jsx";
import { Button, Modal, Pagination } from "@nayeshdaggula/tailify";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectDetails } from "../zustand/useProjectDetails.jsx";
import { useAllocatedProjectDetails } from "../zustand/useAllocatedProjectDetails.jsx";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails.jsx";
import { IconDownload, IconEdit, IconEye, IconSearch, IconTrash, IconSettings } from "@tabler/icons-react";
import MultipleleadassignModal from "./MultipleleadassignModal.jsx";
import { FilterX } from "lucide-react";

function Leadwrapper() {
  const permissions = useEmployeeDetails((state) => state.permissions);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const storedColumns = useColumnStore((state) => state.storedColumns["leads"]);
  const hasFetchedColumns = useColumnStore((state) => state.hasFetched["leads"]);
  const { fetchColumns, handleColumnStore } = useColumnStore();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCustomerCount, setPageCustomerCount] = useState(0);

  const [sortby, setSortby] = useState("created_at");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortbyType, setSortbyType] = useState("desc");
  const [singleLeadId, setSingleLeadId] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null)
  const updateSelectedProject = (value) => {
    setSelectedProject(value)
    setPage(1);
  };

  const [dateRange, setDateRange] = useState({
    // startDate: new Date(new Date().setDate(new Date().getDate() - 30))
    //   .toISOString()
    //   .split("T")[0],
    // endDate: new Date().toISOString().split("T")[0],
    startDate: "",
    endDate: "",
  });

  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();

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

  const [uploadLeadExcel, setUploadLeadExcel] = useState(false)
  const openUploadLeadExcel = () => {
    setUploadLeadExcel(true)
  }
  const closeUploadLeadExcel = () => {
    setUploadLeadExcel(false)
  }

  const [leadStages, setLeadStages] = useState([]);
  const [selectedLeadStage, setSelectedLeadStage] = useState(null);
  const handleLeadStageChange = (value) => {
    setSelectedLeadStage(value);
  };

  const { allocatedProjectData, fetchAllocatedProjectData } = useAllocatedProjectDetails();

  useEffect(() => {
    fetchProjectData();
    getLeadStagesData();
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
    setSingleLeadId(id);
  };
  const closeDeleteModal = () => setDeleteModal(false);

  const [leadsData, setLeadsData] = useState([]);

  const [subordinateId, setSubordinateId] = useState(null);
  const updateSubordinateId = (id) => {
    setSubordinateId(id);
    setPage(1);
  };

  async function getLeadsData(newPage, newLimit, newSearchQuery, newSortbyType, newSortby, newLeadStage, selectedproject, subordinateid) {
    const params = {
      page: newPage,
      limit: newLimit,
      searchQuery: newSearchQuery,
      sortbyType: newSortbyType,
      sortby: newSortby,
      leadStage: newLeadStage,
      projectId: selectedproject,
      employee_id: employeeId,
      subordinateId: subordinateid
    };

    // if (dateRange.startDate) params.startDate = dateRange.startDate;
    // if (dateRange.endDate) params.endDate = dateRange.endDate;

    await Leadapi.get("/get-all-leads", {
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
        setLeadsData(data?.leads || []);
        setTotalPages(data?.totalPages);
        setPageCustomerCount(data?.pageLeadsCount || 0);
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

  async function getLeadStagesData() {
    setIsLoading(true);
    try {
      const response = await Leadapi.get("/get-lead-stages-order-wise");
      const data = response?.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoading(false);
        return false;
      }
      setLeadStages(data?.data);

      setIsLoading(false);
      return true;
    } catch (error) {
      const finalresponse = {
        message: error.message || "Failed to fetch group owners",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoading(false);
      return false;
    }
  }

  const handlePageChange = useCallback(
    (value) => {
      setPage(value);
      getLeadsData(value, limit);
      setIsLoading(true);
    },
    [limit]
  );

  const updateSortby = useCallback(
    (data) => {
      setSortby(data);
      getLeadsData(page, limit, searchQuery, sortbyType, data, selectedLeadStage, selectedProject, subordinateId);
    },
    [page, limit, searchQuery, sortbyType, selectedLeadStage, selectedProject, subordinateId]
  );

  const [sortByPanel, setSortByPanel] = useState(false);
  const sortByPanelToggle = () => setSortByPanel(!sortByPanel);

  const updateSortbyType = useCallback(
    (data) => {
      setSortbyType(data);
      getLeadsData(page, limit, searchQuery, data, sortby, selectedLeadStage, selectedProject, subordinateId);
    },
    [page, limit, searchQuery, sortby, selectedLeadStage, selectedProject, subordinateId]
  );

  const updateSearchQuery = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      getLeadsData(page, limit, e.target.value, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId);
    },
    [page, limit, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId]
  );

  const updateLimit = useCallback(
    (data) => {
      let newpage = 1;
      setLimit(data);
      setPage(newpage);
      getLeadsData(newpage, data, searchQuery, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId);
    },
    [page, searchQuery, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId]
  );

  useEffect(() => {
    setIsLoading(true);
    getLeadsData(page, limit, searchQuery, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId);
  }, [page, limit, searchQuery, sortbyType, sortby, dateRange, selectedLeadStage, selectedProject, subordinateId]);

  const refreshLeadsData = useCallback(() => {
    setIsLoading(true);
    getLeadsData(page, limit, searchQuery, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId);
  }, [page, limit, searchQuery, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId]);

  const handleDateFilterChange = (newDateRange) => {
    setDateRange(newDateRange);
    setPage(1);
    setIsLoading(true);
    getLeadsData(1, limit, searchQuery, sortbyType, sortby, selectedLeadStage, selectedProject, subordinateId);
  };

  const handleDownload = async (searchQuery, dateRange) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const params = {
        searchQuery: searchQuery,
      };

      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await Customerapi.get("get-customers-for-excel", {
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
    handleDownload(searchQuery, dateRange);
  };

  const [visibleColumns, setVisibleColumns] = useState({
    // reference: true,
    name: true, // Name
    email: true, // Email
    phone: true, // Phone
    project: true, // Project
    leadStage: true,
    assignedto: true,
    // status: true, // Status
  });
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const containerRef = useRef(null);

  const [allSubordinates, setAllSubordinates] = useState([]);
  const fetchAllSubordinates = async () => {
    setIsLoading(true);
    await Leadapi.get('/getallsubordinates', {
      params: {
        employee_id: employeeId
      }
    })
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoading(false);
          return false;
        }
        setAllSubordinates(data?.subordinates || [])
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error:", error);
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

  useEffect(() => {
    fetchAllSubordinates();
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
      handleColumnStore(updated, employeeId, "leads");
      return updated;
    });
  };

  useEffect(() => {
    if (employeeId) {
      fetchColumns(employeeId, "leads");
    }
  }, [employeeId]);

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

  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Check if a lead is assigned (has lead_assigned_employee)
  const isLeadAssigned = (lead) => {
    return lead?.lead_assigned_employee && lead.lead_assigned_employee !== "----";
  };

  // Function to handle individual checkbox selection
  const handleSingleCheckboxChange = (leadId, isChecked, isAssigned) => {
    // Prevent selection if lead is assigned
    if (isAssigned) {
      return;
    }

    if (isChecked) {
      // Add lead ID to selectedLeadIds if not already present
      setSelectedLeadIds(prev => [...prev, leadId]);
    } else {
      // Remove lead ID from selectedLeadIds
      setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
    }
  };

  // Function to handle select all checkbox
  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      // Select only unassigned lead IDs from current page
      const unassignedLeadIds = leadsData
        .filter(lead => !isLeadAssigned(lead))
        .map(lead => lead.id);
      setSelectedLeadIds(unassignedLeadIds);
    } else {
      // Deselect all
      setSelectedLeadIds([]);
    }
  };

  // Get unassigned leads from current page
  const unassignedLeads = leadsData.filter(lead => !isLeadAssigned(lead));

  // Check if all unassigned leads on current page are selected
  const isAllUnassignedSelected = unassignedLeads.length > 0 &&
    unassignedLeads.every(lead => selectedLeadIds.includes(lead.id));

  // Check if some unassigned leads are selected (for indeterminate state)
  const isSomeUnassignedSelected = unassignedLeads.some(lead => selectedLeadIds.includes(lead.id)) &&
    !isAllUnassignedSelected;

  // Check if any leads are assigned on current page
  const hasAssignedLeads = leadsData.some(lead => isLeadAssigned(lead));

  const [assigneLeaModal, setAssigneLeaModal] = useState(false);
  const openAssigneLeaModal = () => {
    if (selectedLeadIds.length <= 0) {
      toast.error("Please select at least one lead before assigning.")
      return false;
    }
    setAssigneLeaModal(true);
  };

  const closeAssigneLeaModal = () => {
    setAssigneLeaModal(false);
  };

  const isFilterApplied =
    searchQuery !== '' ||
    limit !== '10' ||
    dateRange.startDate !== '' ||
    dateRange.endDate !== '' ||
    selectedProject !== null ||
    selectedLeadStage !== null ||
    subordinateId !== null;

  const clearFilters = () => {
    setSearchQuery("");
    setLimit("10");
    setDateRange({ startDate: '', endDate: '' });
    setSelectedProject(null);
    setSelectedLeadStage(null);
    setSubordinateId(null);
    setPage(1);
    setIsLoading(true);
    getLeadsData(1, '10', '', sortbyType, sortby, null, null, null);
  }

  return (
    <>
      <div className="crm-page">
        <div className="crm-header">
          <p className="crm-title">Leads</p>
          <div className="crm-actions">
            <div className="crm-actions">
              {permissions?.leads_page?.includes("add_lead") && (
                <Link to={"/lead/add-lead"} className="crm-btn crm-btn-primary">
                  + Add Lead
                </Link>
              )}
              {permissions?.leads_page?.includes("assign_bulk_leads_to_employee") && (
                <Button onClick={openAssigneLeaModal} size="sm" className="px-3 py-2 border border-[#B4295E] !rounded-md !text-[12px] !bg-[#B4295E] hover:!bg-[#B4295E]/90 hover:border-[#B4295E]">
                  Assign leads to employee
                </Button>
              )}
              {permissions?.leads_page?.includes("download_lead_template") && (
                <button onClick={openDownloadTemplate} className="crm-btn crm-btn-primary">
                  Download Lead Template
                </button>
              )}
              {permissions?.leads_page?.includes("upload_bulk_leads") && (
                <button onClick={openUploadLeadExcel} className="crm-btn border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700">
                  Upload Bulk Leads
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="crm-panel crm-panel-body">
          <div className="crm-toolbar">
            <div>
              <div className="crm-search-wrap">
                <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                <Input
                  type="text"
                  placeholder="Search leads..."
                  onChange={updateSearchQuery}
                  value={searchQuery}
                  className="h-9 pl-9 bg-white border-[#e2e8f0] text-[13px] text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <div className="crm-toolbar-right">
              {
                allSubordinates.length > 0 &&
                <div className="w-[165px]">
                  <Select value={subordinateId || "all"} onValueChange={(val) => updateSubordinateId(val === "all" ? null : val)}>
                    <SelectTrigger className="h-9 bg-white border-[#e2e8f0] text-[13px] text-neutral-600 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Select subordinate..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectItem value="all">All Subordinates</SelectItem>
                      {allSubordinates.map((sub) => (
                        <SelectItem key={sub.value} value={sub.value}>
                          {sub.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              }
              <div className="w-[160px]">
                <Select value={selectedProject || "all"} onValueChange={(val) => updateSelectedProject(val === "all" ? null : val)}>
                  <SelectTrigger className="h-9 bg-white border-[#e2e8f0] text-[13px] text-neutral-600 focus:ring-0 focus:ring-offset-0">
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
              <div className="w-[160px]">
                <Select value={selectedLeadStage || "all"} onValueChange={(val) => handleLeadStageChange(val === "all" ? null : val)}>
                  <SelectTrigger className="h-9 bg-white border-[#e2e8f0] text-[13px] text-neutral-600 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select Lead Stages..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="all">All Lead Stages</SelectItem>
                    {(leadStages || []).map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[70px]">
                <Select value={limit} onValueChange={updateLimit}>
                  <SelectTrigger className="h-9 bg-white border-[#e2e8f0] text-[13px] text-neutral-600 focus:ring-0 focus:ring-offset-0">
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
          <div className="crm-table-wrap w-full relative overflow-y-hidden z-0">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="bg-gray-50 border-b border-neutral-200">
                <tr className="w-full">
                  <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[50px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                    <input
                      type="checkbox"
                      checked={isAllUnassignedSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isSomeUnassignedSelected;
                        }
                      }}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      disabled={unassignedLeads.length === 0}
                    />
                  </th>
                  {/* {visibleColumns.reference && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] sticky left-[50px] z-20 bg-gray-50 border-r border-neutral-200">
                      Ref ID
                    </th>
                  )} */}
                  {visibleColumns.project && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] border-r border-neutral-200">
                      Project
                    </th>
                  )}
                  {visibleColumns.name && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] border-r border-neutral-200">
                      Name
                    </th>
                  )}
                  {visibleColumns.email && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[160px] border-r border-neutral-200">
                      Email
                    </th>
                  )}
                  {visibleColumns.phone && (
                    <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[140px] border-r border-neutral-200">
                      Phone
                    </th>
                  )}
                  {visibleColumns.leadStage && (
                    <th className="bg-gray-50 border-l border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px]">
                      Lead Stage
                    </th>
                  )}
                  {visibleColumns.assignedto && (
                    <th className="bg-gray-50 border-l border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px]">
                      Assigned To
                    </th>
                  )}
                  {/* {visibleColumns.status && (
                    <th className="sticky right-[120px] z-10 w-[120px] bg-gray-50 border-l border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px]">
                      Status
                    </th>
                  )} */}
                  {/* LAST (STICKY RIGHT) */}
                  <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {isLoading === false ? (
                  leadsData?.length > 0 ? (
                    leadsData?.map((ele, index) => (
                      <tr
                        key={index}
                        className="hover:bg-neutral-50 transition-colors duration-150 align-center group"
                      >
                        <th className="px-3 py-2 text-neutral-700 text-xs font-bold leading-[18px] w-[50px] sticky left-0 z-20 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                          {
                            ele?.lead_assigned_employee ?
                              <input
                                type="checkbox"
                                checked={true}
                                disabled={ele?.lead_assigned_employee}
                              />
                              :
                              <input
                                type="checkbox"
                                checked={selectedLeadIds.includes(ele.id)}
                                disabled={ele?.lead_assigned_employee}
                                onChange={(e) => handleSingleCheckboxChange(ele.id, e.target.checked, ele?.lead_assigned_employee)}
                              />
                          }
                        </th>
                        {/* {visibleColumns.reference && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] sticky left-[50px] z-10 bg-white group-hover:bg-neutral-50 border-r border-neutral-200 text-xs font-medium leading-[18px]">
                            {permissions?.leads_page?.includes("view_lead") ? (
                              <NavLink to={`/lead/${ele?.id}`}>
                                <p className="text-neutral-600 hover:text-[#0083bf]">
                                  {ele?.id}
                                </p>
                              </NavLink>
                            ) : (
                              <p className="text-neutral-600">
                                {ele?.id}
                              </p>
                            )}
                          </td>
                        )} */}
                        {visibleColumns.project && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.project_name || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.name && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <p className="text-neutral-600 text-xs font-semibold leading-[18px] break-all">
                              {ele?.full_name}
                            </p>
                          </td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[200px] border-r border-neutral-200">
                            <NavLink to={`mailto:${ele.email}`}>
                              <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf] break-all">
                                {ele?.email || "----"}
                              </p>
                            </NavLink>
                          </td>
                        )}
                        {visibleColumns.phone && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[140px] border-r border-neutral-200">
                            <NavLink
                              to={`https://wa.me/${ele.phone_code}${ele.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                {ele?.phone_code && ele?.phone_number
                                  ? `+${ele?.phone_code} ${ele?.phone_number}`
                                  : "----"}
                              </p>
                            </NavLink>
                          </td>
                        )}
                        {/* {visibleColumns.fatherName && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.father_name || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.adhar && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.aadhar_card_no || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.pan && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.pan_card_no || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.citizenship && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.country_of_citizenship || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.residence && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.country_of_residence || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.motherTongue && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.mother_tongue || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.maritalStatus && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.marital_status || "----"}
                            </p>
                          </td>
                        )} */}
                        {visibleColumns.leadStage && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[120px] bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.lead_stage_name || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.assignedto && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[120px] bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                            <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                              {ele?.lead_assigned_employee || "----"}
                            </p>
                          </td>
                        )}
                        {/* {visibleColumns.status && (
                          <td className="px-3 py-2 whitespace-normal break-words w-[120px] sticky right-[120px] z-10 bg-white group-hover:bg-neutral-50 border-l border-neutral-200 text-xs font-medium leading-[18px]">
                            {ele?.status === "Inactive" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            ) : ele?.status === "Active" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              ele?.status === "Suspended" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-800">
                                  Suspended
                                </span>
                              )
                            )}
                          </td>
                        )} */}
                        <td className="px-3 py-2 text-center whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                          <div className="flex flex-row items-center justify-center gap-2">
                            {permissions?.leads_page?.includes("view_lead") && (
                              <Link
                                to={`/lead/${ele?.id}`}
                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                              >
                                <IconEye size={18} />
                              </Link>
                            )}
                            {permissions?.leads_page?.includes("edit_lead") && (
                              <Link
                                to={`/lead/edit-lead/${ele.id}`}
                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                              >
                                <IconEdit size={18} />
                              </Link>
                            )}
                            {permissions?.leads_page?.includes("delete_lead") && (
                              <div
                                onClick={() => openDeleteModal(ele?.id)}
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
                      <td
                        colSpan={
                          Object.keys(visibleColumns).filter(
                            (key) => visibleColumns[key]
                          ).length + 2
                        }
                        className="text-center py-2 text-neutral-500 text-sm"
                      >
                        No leads found
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        Object.keys(visibleColumns).filter(
                          (key) => visibleColumns[key]
                        ).length + 2
                      }
                      className="text-center py-2 text-gray-400 text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {leadsData?.length > 0 && (
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

          {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
      </div>

      <DeleteModal
        title="Delete Lead"
        message={`Are you sure you want to delete this lead?`}
        open={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => {
          Leadapi.post("delete-lead", {
            leadId: singleLeadId,
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
              refreshLeadsData();
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
        open={assigneLeaModal}
        onClose={closeAssigneLeaModal}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {assigneLeaModal === true && (
          <MultipleleadassignModal
            closeAssigneLeaModal={closeAssigneLeaModal}
            selectedLeadIds={selectedLeadIds}
            refreshLeadsData={refreshLeadsData}
            setSelectedLeadIds={setSelectedLeadIds}
          />
        )}
      </Modal>

      {/* <Modal
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
          <Deletecustomer refreshLeadsData={refreshLeadsData} closeDeleteModal={closeDeleteModal} singleLeadId={singleLeadId} employeeId={employeeId} />
        )}
      </Modal>
       */}

      <Modal
        open={downloadTemplate}
        close={closeDownloadTemplate}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {downloadTemplate && (
          <Excelleadstemplate
            closeDownloadTemplate={closeDownloadTemplate}
          />
        )}
      </Modal>

      <Modal
        open={uploadLeadExcel}
        close={closeUploadLeadExcel}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {uploadLeadExcel && (
          <Uploadleadsexcel
            closeUploadLeadExcel={closeUploadLeadExcel}
            refreshLeadsData={refreshLeadsData}
            setErrorMessage={setErrorMessage}
          />
        )}
      </Modal>
    </>
  );
}

export default Leadwrapper;
