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
import flatStaticImage from "../../../public/assets/imageplaceholder.png";
import { IconArrowLeft, IconDownload, IconEdit, IconPencil } from "@tabler/icons-react";
import { useNavigate, useParams, Link, NavLink } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Fileinput, Loadingoverlay, Modal, Select } from "@nayeshdaggula/tailify";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import Bookingstages from "./viewflat/Bookingstages.jsx";
import { DownloadIcon, File, Files, Upload, X } from "lucide-react";
import config from "../../config.jsx";
import Errorpanel from "../shared/Errorpanel.jsx";
import { set } from "date-fns";
import { toast } from "react-toastify";
import AgreementtemplateModal from "./templates/AgreementtemplateModal.jsx";
import Downloadtemplate from "./templates/Downloadtemplate.jsx";
import Overviewtab from "./viewflat/Overviewtab";

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
  const { uuid } = useParams();

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
    fetchFlat(uuid);
  };

  const fetchFlat = async (uuid) => {
    setIsLoadingEffect(true);

    Flatapi.get(`get-flat/${uuid}`, {
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
        return false;
      });
  };

  // console.log("Customer Flat Details", customerFlatDetails)

  useEffect(() => {
    fetchFlat(uuid);
  }, [uuid]);

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
        flatuuid: uuid
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
          link = `/flats/edit-flat/${uuid}`;
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
      fetchFlat(uuid);
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
        flatuuid: uuid
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
          link = `/flats/edit-flat/${uuid}`;
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
      fetchFlat(uuid);
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
        <div className="flex justify-between">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-[20px] font-semibold">Flat No: {flatDetails?.flat_no} / {flatDetails?.block?.block_name} / Floor No: {flatDetails?.floor_no}</h1>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${flatDetails?.status === 'Sold' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${flatDetails?.status === 'Sold' ? 'bg-green-600' : 'bg-red-600'}`} ></span>
              <span>{flatDetails?.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {flatDetails?.status !== 'Sold' && canAssignFlat && (
              <div onClick={openFlatToCustomer} className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded  bg-[#b4295e]">
                Assign Flat to Customer
              </div>
            )}
            {flatDetails?.status === 'Sold' && (
              <>
                {/* {
                  (flatDetails?.pdf_agreement_template_url || flatDetails?.word_agreement_template_url) ?
                    <>
                      <button
                        onClick={() => openDownloadTemplate('agreement')}
                        className="text-[#000] px-3 gap-1 text-[14px] font-semibold flex items-center justify-center py-[7px] rounded-sm bg-[#e1e1e1] transition-colors duration-200 cursor-pointer"
                      >
                        <DownloadIcon size={16} color="#000" />
                        Download Agreement
                      </button>
                      <button
                        onClick={openCreateAgreementModal}
                        className="text-[#fff] px-3 gap-1 text-[14px] font-semibold flex items-center justify-center py-[7px] rounded-sm bg-[#000] transition-colors duration-200 cursor-pointer"
                      >
                        Re-genrate Agreement
                      </button>
                    </>
                    :
                    <button
                      onClick={openCreateAgreementModal}
                      className="text-[#fff] px-3 gap-1 text-[14px] font-semibold flex items-center justify-center py-[7px] rounded-sm bg-[#000] transition-colors duration-200 cursor-pointer"
                    >
                      Create Agreement
                    </button>
                } */}
                {/* {permissions?.flats_page?.includes("upload_sale_deed_template") &&
                  <button
                    onClick={openSaleDeedTemplateModal}
                    className="text-[#fff] px-3 gap-1 text-[12px] font-semibold flex items-center justify-center py-[7px] rounded-sm bg-[#0083bf] transition-colors duration-200 cursor-pointer"
                  >
                    Upload Sale Deed Template
                  </button>
                } */}
                {/* {permissions?.flats_page?.includes("download_sale_deed") &&
                  <>
                    {
                      (flatDetails?.word_sale_deed_template_url || flatDetails?.pdf_sale_deed_template_url) ?
                        <>
                          <button
                            onClick={() => openDownloadTemplate('saledeed')}
                            className="text-[#fff] px-3 gap-1 text-[14px] font-semibold flex items-center justify-center py-[7px] rounded-sm bg-[#0083bf] transition-colors duration-200 cursor-pointer"
                          >
                            <DownloadIcon size={16} color="#fff" />
                            Download Sale Deed Template
                          </button>
                          <button
                            onClick={openSaleDeedModal}
                            className="text-[#fff] px-3 gap-1 text-[14px] font-semibold flex items-center justify-center py-[7px] rounded-sm bg-[#e0589c] transition-colors duration-200 cursor-pointer"
                          >
                            Re-genrate Sale Deed
                          </button>
                        </>
                        :
                        <button
                          onClick={openSaleDeedModal}
                          className="text-[#fff] px-3 gap-1 text-[14px] font-semibold flex items-center justify-center py-[7px] rounded-sm bg-[#e0589c] transition-colors duration-200 cursor-pointer"
                        >
                          Create Sale Deed
                        </button>
                    }
                  </>
                } */}
              </>
            )}
            {permissions?.flats_page?.includes("edit_flat") && (
              <Link to={`/flats/edit-flat/${uuid}`} className="text-[14px] text-white font-semibold px-5 py-[7px] border border-[#0083bf] !rounded-sm !bg-[#0083bf] hover:!bg-[#0083bf]/90">
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
                        flat_uuid={uuid}
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
                      onClick={() => setActiveTab(tab)}
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
                        <Activitiestab flat_uuid={uuid} />
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
      <Modal
        open={uploadFileModal}
        close={closeUploadFileModal}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {uploadFileModal && (
          <Uploadprofile
            closeUploadFileModal={closeUploadFileModal}
            setIsLoadingEffect={setIsLoadingEffect}
            flat_id={flatDetails?.id}
            refreshUserDetails={refreshUserDetails}
          />
        )}
      </Modal>

      <Modal
        open={isSaleDeedModalOpen}
        close={closeSaleDeedModal}
        withCloseButton={false}
        padding="0"
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {isSaleDeedModalOpen && (
          <div>
            <div className="flex items-center justify-between py-3 border-b px-5 mb-3">
              <p className="font-semibold text-lg text-[#0083bf]">Select Formate</p>
              <X className="x-11 cursor-pointer text-[#0083bf] hover:text-[#00628f]/50" onClick={closeSaleDeedModal} />
            </div>
            <Select
              placeholder="Please select the formate"
              value={formate}
              onChange={(value) => setFormate(value)}
              data={[
                { label: "Word", value: 'word' },
                { label: "PDF", value: 'pdf' }
              ]}
              mainContainerClass="!px-5"
              selectWrapperClass="!text-[#000000] font-semibold"
            />
            <div className="w-full justify-end flex border-t py-3 px-5 mt-3">
              <button
                onClick={downloadSaleDeed}
                className="px-3 py-2 bg-[#0083bf] text-white cursor-pointer rounded-md hover:bg-[#00628f]"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isSaleDeedTemplateModalOpen}
        close={closeSaleDeedTemplateModal}
        withCloseButton={false}
        padding="0"
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {isSaleDeedTemplateModalOpen && (
          <div>
            <div className="flex items-center justify-between py-3 border-b px-5 mb-3">
              <p className="font-semibold text-lg text-[#0083bf]">Upload Template</p>
              <X className="x-11 cursor-pointer text-[#0083bf] hover:text-[#00628f]/50" onClick={closeSaleDeedTemplateModal} />
            </div>
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
            <Fileinput
              placeholder="Click here to select a file"
              accept=".docx"
              error={fileError}
              value={file}
              onChange={updateFile}
              mainContainerClass="!px-5"
            />
            <div className="w-full justify-end flex border-t py-3 px-5 mt-3">
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
      </Modal>

      {/* agreement template modal */}
      <Modal
        open={agreementTemplate}
        close={closeAgreementTemplateModal}
        withCloseButton={false}
        padding="0"
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {agreementTemplate && (
          <AgreementtemplateModal
            closeAgreementTemplateModal={closeAgreementTemplateModal}
            agreementTemplateFile={agreementTemplateFile}
            agreementTemplateFileError={agreementTemplateFileError}
            updateAgreementTemplateFile={updateAgreementTemplateFile}
            uploadAgreementTemplate={uploadAgreementTemplate}
          />
        )}
      </Modal>

      {/* create agreement modal */}
      <Modal
        open={createAgreement}
        close={closeCreateAgreementModal}
        withCloseButton={false}
        padding="0"
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {createAgreement && (
          <div>
            <div className="flex items-center justify-between py-3 border-b border-[#ebecef] px-5 mb-3">
              <p className="font-semibold text-lg text-[#0083bf]">Select Formate</p>
              <X className="x-11 cursor-pointer text-[#0083bf] hover:text-[#00628f]/50" onClick={closeCreateAgreementModal} />
            </div>
            <Select
              placeholder="Please select the formate"
              value={formate}
              onChange={(value) => setFormate(value)}
              data={[
                { label: "Word", value: 'word' },
                { label: "PDF", value: 'pdf' }
              ]}
              mainContainerClass="!px-5"
              selectWrapperClass="!text-[#000000] font-semibold"
            />
            <div className="w-full justify-end flex border-t border-[#ebecef] py-3 px-5 mt-3">
              <button
                onClick={downloadAgreement}
                className="px-3 py-1.5 text-[12px] bg-[#0083bf] text-white cursor-pointer rounded-md hover:bg-[#00628f]"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={downloadTemplate}
        close={closeDownloadTemplate}
        withCloseButton={false}
        padding="0"
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {
          downloadTemplate &&
          <Downloadtemplate
            closeDownloadTemplate={closeDownloadTemplate}
            flatDetails={flatDetails}
            type={type}
          />
        }
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
