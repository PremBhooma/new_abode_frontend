import React, { use, useEffect, useState } from "react";
import Flatapi from "../api/Flatapi";
import Flatnotestab from "./viewflat/Flatnotestab";
import Uploadprofile from "../shared/Uploadprofile";
import Activitiestab from "./viewflat/Activitiestab";
import Flatinformation from "./viewflat/Flatinformation";
import Paymentstab from "./viewflat/paymenttab/Paymentstab";
import Assignflattocustomer from "./viewflat/Assignflattocustomer.jsx";
import Flatdocumentswrapper from "./documents/Flatdocumentswrapper";
import Customerflatinformation from "./viewflat/Customerflatinformation";
import flatStaticImage from "@/assets/imageplaceholder.png";
import { IconArrowLeft, IconDownload, IconEdit, IconPencil } from "@tabler/icons-react";
import { useNavigate, useParams, Link, NavLink } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Loadingoverlay } from "@nayeshdaggula/tailify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import Bookingstages from "./viewflat/Bookingstages.jsx";
import { DownloadIcon, File, Files, Upload, X, ChevronRight, Building2, LayoutDashboard, UserPlus, ArrowRightLeft, FileText, UserCheck, RefreshCw } from "lucide-react";
import config from "../../config.jsx";
import Errorpanel from "../shared/Errorpanel.jsx";
import { set } from "date-fns";
import { toast } from "react-toastify";
import AgreementtemplateModal from "./templates/AgreementtemplateModal.jsx";
import Downloadtemplate from "./templates/Downloadtemplate.jsx";
import Overviewtab from "./viewflat/Overviewtab";
import Costsheet from "./viewflat/Costsheet";

function Viewflat() {
  const navigate = useNavigate();
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaleDeedModalOpen, setIsSaleDeedModalOpen] = useState(false);
  const openSaleDeedModal = () => setIsSaleDeedModalOpen(true);
  const closeSaleDeedModal = () => setIsSaleDeedModalOpen(false);
  const [isSaleDeedTemplateModalOpen, setIsSaleDeedTemplateModalOpen] = useState(false);
  const openSaleDeedTemplateModal = () => setIsSaleDeedTemplateModalOpen(true);
  const closeSaleDeedTemplateModal = () => setIsSaleDeedTemplateModalOpen(false);

  const [agreementTemplate, setAgreementTemplate] = useState(false);
  const openAgreementTemplateModal = () => {
    setAgreementTemplate(true);
  }
  const closeAgreementTemplateModal = () => {
    setAgreementTemplate(false);
  }

  const [formate, setFormate] = useState("word");
  const { id } = useParams();

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") return "---";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const updateFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileError("");
    }
  };

  const [agreementTemplateFile, setAgreementTemplateFile] = useState(null);
  const [agreementTemplateFileError, setAgreementTemplateFileError] = useState("");
  const updateAgreementTemplateFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAgreementTemplateFile(file);
      setAgreementTemplateFileError("");
    }
  };

  const [flatCostUpdate, setFlatCostUpdate] = useState(false);
  const openFlatCostUpdate = () => {
    setFlatCostUpdate(true);
  };
  const closeFlatCostUpdate = () => {
    setFlatCostUpdate(false);
  }

  const permissions = useEmployeeDetails((state) => state.permissions);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const [flatToCustomer, setFlatToCustomer] = useState(false);
  const openFlatToCustomer = () => {
    setFlatToCustomer(true);
  };

  const closeFlatToCustomer = () => {
    setFlatToCustomer(false);
  }

  const [flatDetails, setFlatDetails] = useState({});
  const [canAssignFlat, setCanAssignFlat] = useState(false);
  const [customerFlatDetails, setCustomerFlatDetails] = useState({});
  const [paymentSummary, setPaymentSummary] = useState({});
  const [activeTab, setActiveTab] = useState("flat-info");

  const [uploadFileModal, setUploadFileModal] = useState(false);
  const closeUploadFileModal = () => {
    setUploadFileModal(false);
  };
  const openUploadFileModal = () => {
    setUploadFileModal(true);
  };

  const openbackmodal = () => {
    navigate("/flats");
  };

  const refreshUserDetails = () => {
    fetchFlat(id);
  };

  const fetchFlat = async (id, showLoading = true) => {
    if (showLoading) setIsLoadingEffect(true);

    Flatapi.get(`get-flat/${id}`, {
      params: {
        employeeId: employeeId
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response?.data;

        if (data?.status === "error") {
          setErrorMessage(data?.message);
          setIsLoadingEffect(false);
          return false;
        }
        const flat = data?.flat;
        console.log("flat", flat)
        setFlatDetails(flat);
        setCanAssignFlat(data?.canAssignFlat)
        setCustomerFlatDetails(data?.getCustomerFlat)
        setPaymentSummary(data?.paymentSummary)
        if (showLoading) setIsLoadingEffect(false);
        return false;
      }).catch((error) => {
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
  };

  // console.log("Customer Flat Details", customerFlatDetails)

  useEffect(() => {
    fetchFlat(id);
  }, [id]);

  const allTabs = [
    "flat-info",
    // ...(customerFlatDetails ? ["customer-info-tab"] : []),
    "documents-tab",
    "payments-tab",
    "notes-tab",
    "activities-tab",
  ];

  const downloadSaleDeed = () => {
    setIsLoadingEffect(true);
    Flatapi.get('/download-sale-deed', {
      params: {
        formate: formate,
        flatid: id
      },
      responseType: "blob",
    }).then(async (response) => {
      const text = await response.data.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = null;
      }
      if (data?.status === "main_error") {
        const finalresponse = {
          message: data.message,
          server_res: null,
        };
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      }
      if (data?.status === "error") {
        const message = data.missingFields.map(f => f.field).join(", ");
        let link = null;
        let click = null;
        const sections = data.missingFields.map(f => f.section);

        if (sections.includes("customer")) {
          link = `/customers/editcustomer/${data.customerUid}`;
        } else if (sections.includes("flat")) {
          link = `/flats/edit-flat/${id}`;
        } else if (sections.includes("payment")) {
          link = "/payments/addnew";
        }
        if (sections.includes("flatcost")) {
          click = setFlatCostUpdate;
        }

        const finalresponse = {
          type: data.message,
          message: message,
          link: link,
          click: click
        };
        setErrorMessage(finalresponse);
        setIsSaleDeedModalOpen(false);
        setIsLoadingEffect(false);
        return false;
      }
      let filename = "SaleDeed.docx";
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      fetchFlat(id);
      setIsSaleDeedModalOpen(false);
      setIsLoadingEffect(false);
      return false;
    }).catch((error) => {
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
      setIsSaleDeedModalOpen(false);
      setIsLoadingEffect(false);
      return false;
    });
  }

  const uploadTemplate = () => {
    setIsLoadingEffect(true);
    const formData = new FormData();
    formData.append("uploadfile", file);

    Flatapi.post("uploadtemplate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => {
      let data = res.data;
      if (data.status === "error") {
        let finalresponse = {
          message: data.message,
          server_res: data,
        };
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      }
      toast.success("Template uploaded successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      closeSaleDeedTemplateModal();
      setIsLoadingEffect(false);
      return false;
    }).catch((error) => {
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
      setIsLoadingEffect(false);
      return false;
    });
  };

  const uploadAgreementTemplate = () => {
    setIsLoadingEffect(true);
    const formData = new FormData();
    formData.append("uploadfile", agreementTemplateFile);
    Flatapi.post("uploadagreementtemplate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => {
      let data = res.data;
      if (data.status === "error") {
        let finalresponse = {
          message: data.message,
          server_res: data,
        };
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      }
      toast.success("Template uploaded successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      closeAgreementTemplateModal();
      setIsLoadingEffect(false);
      return false;
    }).catch((error) => {
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
      setIsLoadingEffect(false);
      return false;
    });
  }

  const [createAgreement, setCreateAgreement] = useState(false);
  const openCreateAgreementModal = () => {
    setCreateAgreement(true);
  };
  const closeCreateAgreementModal = () => {
    setCreateAgreement(false);
  };

  const downloadAgreement = () => {
    setIsLoadingEffect(true);
    Flatapi.get('/downloadagreementtemplate', {
      params: {
        formate: formate,
        flatid: id
      },
      responseType: "blob",
    }).then(async (response) => {
      const text = await response.data.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = null;
      }
      if (data?.status === "main_error") {
        const finalresponse = {
          message: data.message,
          server_res: null,
        };
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      }
      if (data?.status === "error") {
        const message = data.missingFields.map(f => f.field).join(", ");
        let link = null;
        let click = null;
        const sections = data.missingFields.map(f => f.section);

        if (sections.includes("customer")) {
          link = `/customers/editcustomer/${data.customerUid}`;
        } else if (sections.includes("flat")) {
          link = `/flats/edit-flat/${id}`;
        } else if (sections.includes("payment")) {
          link = "/payments/addnew";
        }
        if (sections.includes("flatcost")) {
          click = setFlatCostUpdate;
        }

        const finalresponse = {
          type: data.message,
          message: message,
          link: link,
          click: click
        };
        setErrorMessage(finalresponse);
        closeCreateAgreementModal(false);
        setIsLoadingEffect(false);
        return false;
      }
      let filename = "Agreement.docx";
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      fetchFlat(id);
      closeCreateAgreementModal(false);
      setIsLoadingEffect(false);
      return false;
    }).catch((error) => {
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
      closeCreateAgreementModal(false);
      setIsLoadingEffect(false);
      return false;
    });
  }

  const [type, setType] = useState('');
  const [downloadTemplate, setDownloadTemplate] = useState(false);
  const openDownloadTemplate = (type) => {
    setDownloadTemplate(true);
    setType(type);
  }
  const closeDownloadTemplate = () => {
    setDownloadTemplate(false);
    setType('');
  }

  console.log("paymentSummary__nmew:", paymentSummary)

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          {/* Row 1: Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase mb-4">
            <Link to="/dashboard" className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={12} />
              Dashboard
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <Link to="/flats" className="text-slate-400 hover:text-blue-600 transition-colors">
              Flats
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-blue-600">View Flat</span>
          </div>

          {/* Row 2: Title, Subtext & Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform hover:scale-105 duration-300">
                <Building2 size={22} fill="currentColor" fillOpacity={0.15} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                  Flat {flatDetails?.flat_no} Details
                </h1>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                  Block: {flatDetails?.block?.block_name} • Floor: {flatDetails?.floor_no}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold uppercase tracking-wide shadow-sm ${flatDetails?.status === 'Sold' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${flatDetails?.status === 'Sold' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                <span className="leading-none">{flatDetails?.status}</span>
              </div>
            </div>
          </div>

          <hr className="my-4 border-slate-100" />

          {/* Row 3: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {flatDetails?.status !== 'Sold' && canAssignFlat && (
              <button
                onClick={openFlatToCustomer}
                className="group flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg shadow-sm hover:bg-rose-100 hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <UserPlus size={14} />
                Assign Flat to Customer
              </button>
            )}

            {/* {flatDetails?.status === 'Sold' && (
              <>
                {permissions?.flats_page?.includes("upload_sale_deed_template") && (
                  <button
                    onClick={openSaleDeedTemplateModal}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-100 hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <Upload size={14} />
                    Upload Sale Deed Template
                  </button>
                )}

                {permissions?.flats_page?.includes("download_sale_deed") && (
                  <>
                    {(flatDetails?.word_sale_deed_template_url || flatDetails?.pdf_sale_deed_template_url) ? (
                      <>
                        <button
                          onClick={() => openDownloadTemplate('saledeed')}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        >
                          <DownloadIcon size={14} />
                          Download Sale Deed Template
                        </button>
                        <button
                          onClick={openSaleDeedModal}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg shadow-sm hover:bg-amber-100 hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        >
                          <RefreshCw size={14} />
                          Re-generate Sale Deed
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={openSaleDeedModal}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm hover:bg-emerald-100 hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      >
                        <FileText size={14} />
                        Create Sale Deed
                      </button>
                    )}
                  </>
                )}
              </>
            )} */}

            {permissions?.flats_page?.includes("edit_flat") && (
              <Link
                to={`/flats/edit-flat/${id}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0083bf] bg-[#0083bf]/5 border border-[#0083bf]/20 rounded-lg shadow-sm hover:bg-[#0083bf]/10 hover:border-[#0083bf]/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center cursor-pointer"
              >
                <IconEdit size={14} />
                Edit
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="h-fit bg-white w-[25%] rounded-lg overflow-hidden shadow-md">
            <div className="flex flex-col gap-2">
              <div className="w-full overflow-hidden bg-white rounded-lg ">
                <div className="relative p-3">
                  <div className="w-[100%] h-[230px] rounded-t-lg rounded-b-lg flex items-center justify-center overflow-hidden">
                    <img crossOrigin="anonymous" src={flatDetails?.flat_img_url?.trim() ? flatDetails.flat_img_url : flatStaticImage} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  {permissions?.flats_page?.includes("edit_flat_image_single_flat") && (
                    <div onClick={openUploadFileModal} className='absolute top-3 right-3 bg-[#0083bf] rounded-md p-[6px] cursor-pointer'>
                      <IconEdit size={16} color='white' />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 px-3 pb-3">
                <div className="space-y-3 text-sm">
                  {customerFlatDetails && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Flat Owned (Customer) By
                      </h3>
                      <div className="flex flex-row items-center w-full">
                        <div className="text-gray-600 shrink-0 w-[55%]">Name</div>
                        <div className="text-gray-900 font-semibold break-all capitalize w-[45%]">
                          {`${customerFlatDetails?.customer?.prefixes || ''} ${customerFlatDetails?.customer?.first_name}` || '---'}
                        </div>
                      </div>
                      <div className="flex flex-row items-center w-full">
                        <div className="text-gray-600 shrink-0 w-[55%]">Phone Number</div>
                        <div className="text-gray-900 font-semibold break-all capitalize w-[45%]">
                          {customerFlatDetails?.customer?.phone_number || '---'}
                        </div>
                      </div>
                      {customerFlatDetails?.customer?.email && (
                        <div className="flex flex-row items-center w-full">
                          <div className="text-gray-600 shrink-0 w-[55%]">Email</div>
                          <div className="text-gray-900 font-semibold break-all capitalize w-[45%]">
                            {customerFlatDetails?.customer?.email || '---'}
                          </div>
                        </div>
                      )}
                      {/* <div className="flex flex-row w-full">
                        <div className="text-gray-600 shrink-0 w-[55%]">Saleable Area</div>
                        <div className="text-gray-900 font-semibold break-all w-[45%]">
                          {customerFlatDetails?.saleable_area_sq_ft || '---'} sq.ft.
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
                        <div className="text-gray-600 shrink-0 w-[55%]">
                          Rate Per (sq.ft)
                        </div>
                        <div className="text-gray-900 font-semibold break-all w-[45%]">
                          {formatPrice(customerFlatDetails?.rate_per_sq_ft)}
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
                        <div className="text-gray-600 shrink-0 w-[55%]">
                          Base Cost Unit
                        </div>
                        <div className="text-gray-900 font-semibold break-all w-[45%]">
                          {formatPrice(customerFlatDetails?.base_cost_unit)}
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
                        <div className="text-gray-600 shrink-0 w-[55%]">
                          Total Cost of Flat
                        </div>
                        <div className="text-gray-900 font-semibold break-all w-[45%]">
                          {formatPrice(customerFlatDetails?.toatlcostofuint)}
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
                        <div className="text-gray-600 shrink-0 w-[55%]">
                          Grand Total
                        </div>
                        <div className="text-gray-900 font-semibold break-all w-[45%]">
                          {formatPrice(customerFlatDetails?.grand_total)}
                        </div>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[75%] relative">
            {!isLoadingEffect &&
              <>
                {/* {
                  flatDetails?.status === 'Sold' && (
                    <div className="p-3 ">
                      <Bookingstages
                        flat_id={id}
                      />
                    </div>
                  )
                } */}
                <div className={`mb-3 grid ${customerFlatDetails ? 'grid-cols-6' : 'grid-cols-5'} relative border border-[#ebecef] rounded-md bg-[#f1f1f1] p-2`}>
                  {allTabs.map((tab) => (
                    <button
                      key={tab}
                      className={`py-2 px-2 font-medium relative cursor-pointer flex justify-center items-center rounded-md
                    transition duration-300 ease-in-out
                    ${activeTab === tab
                          ? "text-[#0083bf] bg-white shadow-md"
                          : "text-gray-900 bg-transparent"}`}
                      onClick={() => {
                        setActiveTab(tab);
                        if (tab === "flat-info" && activeTab !== "flat-info") {
                          fetchFlat(id, false);
                        }
                      }}
                    >
                      {tab
                        .replace("-tab", "")
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6 bg-white rounded-md shadow-md">
                  {activeTab === "flat-info" && (
                    <div className="space-y-6">
                      {permissions?.flats_page?.includes("flat_info_single_flat") && (
                        <Flatinformation flatDetails={flatDetails} customerFlatDetails={customerFlatDetails} refreshUserDetails={refreshUserDetails} flatCostUpdate={flatCostUpdate} openFlatCostUpdate={openFlatCostUpdate} closeFlatCostUpdate={closeFlatCostUpdate} />
                      )}
                    </div>
                  )}

                  {activeTab === "documents-tab" && (
                    <div className="text-center text-gray-500">
                      {permissions?.flats_page?.includes("documents_single_flat") && (
                        <Flatdocumentswrapper />
                      )}
                    </div>
                  )}

                  {activeTab === "payments-tab" && (
                    <div className="text-center text-gray-500">
                      {permissions?.flats_page?.includes("payments_single_flat") && (
                        <Paymentstab flat_id={flatDetails?.id} customerId={customerFlatDetails?.customer_id} project_id={flatDetails?.project_id} />
                      )}
                    </div>
                  )}

                  {activeTab === "notes-tab" && (
                    <div className="text-center text-gray-500">
                      {permissions?.flats_page?.includes("notes_single_flat") && (
                        <Flatnotestab />
                      )}
                    </div>
                  )}

                  {activeTab === "activities-tab" && (
                    <div className="text-center text-gray-500">
                      {permissions?.flats_page?.includes("activities_single_flat") && (
                        <Activitiestab flat_id={id} />
                      )}
                    </div>
                  )}

                  {customerFlatDetails && activeTab === "customer-info-tab" && (
                    <div className="space-y-6">
                      {permissions?.flats_page?.includes("customer_flat_single_flat") && (
                        <Customerflatinformation customerFlatDetails={customerFlatDetails} />
                      )}
                    </div>
                  )}
                </div>
              </>
            }
          </div>
        </div>
        {activeTab === "flat-info" && (
          permissions?.flats_page?.includes("flat_info_single_flat") && (
            customerFlatDetails && (
              <div className="space-y-3">
                <Costsheet customerFlatDetails={customerFlatDetails} flatDetails={flatDetails} fetchFlat={fetchFlat} />

                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Flat Cost Details :</p>
                  <button onClick={openFlatCostUpdate} className="text-[14px] text-white px-5 py-1.5 cursor-pointer !rounded-sm !bg-[#0083bf] hover:!bg-[#0083bf]/90">Update</button>
                </div>
                <Overviewtab customerFlatDetails={customerFlatDetails} paymentSummary={paymentSummary} />
                {customerFlatDetails?.custom_note && (
                  <div className="w-full flex flex-col gap-2">
                    <p className="text-sm font-bold text-gray-600">Custom Note:</p>
                    <p className='text-sm font-semibold text-gray-900'>{customerFlatDetails?.custom_note}</p>
                  </div>
                )}
              </div>
            )))}
      </div>

      {errorMessage && (
        <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
      )}
      <Dialog
        open={uploadFileModal}
        onOpenChange={setUploadFileModal}
      >
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          {uploadFileModal && (
            <Uploadprofile
              closeUploadFileModal={closeUploadFileModal}
              setIsLoadingEffect={setIsLoadingEffect}
              flat_id={flatDetails?.id}
              refreshUserDetails={refreshUserDetails}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSaleDeedModalOpen}
        onOpenChange={setIsSaleDeedModalOpen}
      >
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          {isSaleDeedModalOpen && (
            <div>
              <DialogHeader className="py-3 border-b px-5 mb-3">
                <DialogTitle className="text-[#0083bf]">Select Formate</DialogTitle>
              </DialogHeader>
              <div className="px-5">
                <Select value={formate} onValueChange={(value) => setFormate(value)}>
                  <SelectTrigger className="w-full text-[#000000] font-semibold">
                    <SelectValue placeholder="Please select the formate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full justify-end flex border-t py-3 px-5 mt-5">
                <button
                  onClick={downloadSaleDeed}
                  className="px-3 py-2 bg-[#0083bf] text-white cursor-pointer rounded-md hover:bg-[#00628f]"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSaleDeedTemplateModalOpen}
        onOpenChange={setIsSaleDeedTemplateModalOpen}
      >
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          {isSaleDeedTemplateModalOpen && (
            <div>
              <DialogHeader className="py-3 border-b px-5 mb-3">
                <DialogTitle className="text-[#0083bf]">Upload Template</DialogTitle>
              </DialogHeader>
              <div className="px-5 mb-3 text-sm text-black">
                <p className="font-medium">Guidelines:</p>
                <p className="mt-1">
                  The placeholders should be wrapped inside <code>&lt;&lt; &gt;&gt;</code> tags, e.g.{" "}
                  <code>&lt;&lt;FLAT_NAME&gt;&gt;</code>.
                </p>
                <p className="mt-1">
                  Available placeholders:{" "}
                  <span className="block mt-1 text-black">
                    DATE, NUM_KEY, NAME, GUARDIAN_NAME, AGE, OCCUPATION, AADHAAR_NUMBER,
                    PAN_NUMBER, ADDRESS, PROJECT_NAME, FLAT_NO, FLOOR_NO, BLOCK_NO, SFT,
                    CAR_PARKING, UDS, SALE_VALUE, RCPT_NUM, RCPT_VALUE, RCPT_TYPE, RCPT_DATE,
                    NORTH, SOUTH, EAST, WEST
                  </span>
                </p>
              </div>
              <div className="px-5">
                <Input
                  type="file"
                  accept=".docx"
                  onChange={updateFile}
                  className="w-full"
                />
                {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
              </div>
              <div className="w-full justify-end flex border-t py-3 px-5 mt-5">
                <button
                  disabled={!file}
                  onClick={uploadTemplate}
                  className={`px-3 py-2 bg-[#0083bf] text-white rounded-md hover:bg-[#00628f] ${!file ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* agreement template modal */}
      <Dialog
        open={agreementTemplate}
        onOpenChange={setAgreementTemplate}
      >
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          {agreementTemplate && (
            <AgreementtemplateModal
              closeAgreementTemplateModal={closeAgreementTemplateModal}
              agreementTemplateFile={agreementTemplateFile}
              agreementTemplateFileError={agreementTemplateFileError}
              updateAgreementTemplateFile={updateAgreementTemplateFile}
              uploadAgreementTemplate={uploadAgreementTemplate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* create agreement modal */}
      <Dialog
        open={createAgreement}
        onOpenChange={setCreateAgreement}
      >
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          {createAgreement && (
            <div>
              <DialogHeader className="py-3 border-b border-[#ebecef] px-5 mb-3">
                <DialogTitle className="text-[#0083bf]">Select Formate</DialogTitle>
              </DialogHeader>
              <div className="px-5">
                <Select value={formate} onValueChange={(value) => setFormate(value)}>
                  <SelectTrigger className="w-full text-[#000000] font-semibold">
                    <SelectValue placeholder="Please select the formate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full justify-end flex border-t border-[#ebecef] py-3 px-5 mt-5">
                <button
                  onClick={downloadAgreement}
                  className="px-3 py-1.5 text-[12px] bg-[#0083bf] text-white cursor-pointer rounded-md hover:bg-[#00628f]"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={downloadTemplate}
        onOpenChange={setDownloadTemplate}
      >
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          {
            downloadTemplate &&
            <Downloadtemplate
              closeDownloadTemplate={closeDownloadTemplate}
              flatDetails={flatDetails}
              type={type}
            />
          }
        </DialogContent>
      </Dialog>

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
          <Assignflattocustomer
            closeFlatToCustomer={closeFlatToCustomer}
            flatNo={flatDetails?.flat_no}
            block_id={flatDetails?.block_id}
            refreshUserDetails={refreshUserDetails}
          />
        )}
      </Drawer >
    </>
  );
}

export default Viewflat;
