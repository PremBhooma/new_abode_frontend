import React, { useEffect, useState } from "react";
import { Modal, Fileinput } from "@nayeshdaggula/tailify";
import { DownloadIcon, Upload, X, File as FileIcon } from "lucide-react";
import Flatapi from "../../api/Flatapi";
import { toast } from "react-toastify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";

function Templates() {
  const permissions = useEmployeeDetails((state) => state.permissions);
  // Loading and error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // URLs from server
  const [agreementUrl, setAgreementUrl] = useState("");
  const [saleDeedUrl, setSaleDeedUrl] = useState("");

  // Agreement modal + file
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [agreementFile, setAgreementFile] = useState(null);
  const [agreementFileError, setAgreementFileError] = useState("");

  // Sale Deed modal + file
  const [isSaleDeedModalOpen, setIsSaleDeedModalOpen] = useState(false);
  const [saleDeedFile, setSaleDeedFile] = useState(null);
  const [saleDeedFileError, setSaleDeedFileError] = useState("");

  const hasAgreement = Boolean(agreementUrl);
  const hasSaleDeed = Boolean(saleDeedUrl);

  const resetAgreementState = () => {
    setAgreementFile(null);
    setAgreementFileError("");
  };

  const resetSaleDeedState = () => {
    setSaleDeedFile(null);
    setSaleDeedFileError("");
  };

  const openAgreementModal = () => {
    resetAgreementState();
    setIsAgreementModalOpen(true);
  };

  const closeAgreementModal = () => {
    setIsAgreementModalOpen(false);
  };

  const openSaleDeedModal = () => {
    resetSaleDeedState();
    setIsSaleDeedModalOpen(true);
  };

  const closeSaleDeedModal = () => {
    setIsSaleDeedModalOpen(false);
  };

  const validateDocx = (file) => {
    if (!file) return "Please select a file.";
    const isDocx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");
    if (!isDocx) return "Only .docx files are allowed.";
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) return "File size must be under 10 MB.";
    return "";
  };

  const onAgreementFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateDocx(f);
    if (err) {
      setAgreementFile(null);
      setAgreementFileError(err);
      return;
    }
    setAgreementFile(f);
    setAgreementFileError("");
  };

  const onSaleDeedFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateDocx(f);
    if (err) {
      setSaleDeedFile(null);
      setSaleDeedFileError(err);
      return;
    }
    setSaleDeedFile(f);
    setSaleDeedFileError("");
  };

  const getFileName = (url) => {
    try {
      const last = url.split("?")[0].split("/").pop();
      return decodeURIComponent(last || "template.docx");
    } catch {
      return "template.docx";
    }
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await Flatapi.get("get-templates");
      const data = response?.data;
      if (data?.status === "error") {
        setErrorMessage(data?.message || "Failed to load templates.");
        setIsLoading(false);
        return;
      }
      setAgreementUrl(data?.agreement_file_url || "");
      setSaleDeedUrl(data?.sale_deed_file_url || "");
    } catch (error) {
      const finalresponse =
        error?.response !== undefined
          ? {
            message: error.message,
            server_res: error.response?.data,
          }
          : {
            message: error.message,
            server_res: null,
          };
      setErrorMessage(finalresponse?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const uploadAgreementTemplate = async () => {
    if (!agreementFile) {
      setAgreementFileError("Please select a .docx file.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("uploadfile", agreementFile);
    try {
      const res = await Flatapi.post("uploadagreementtemplate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = res?.data;
      if (data?.status === "error") {
        setErrorMessage(data?.message || "Upload failed.");
        setIsLoading(false);
        return;
      }
      toast.success("Agreement template uploaded successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      closeAgreementModal();
      resetAgreementState();
      await fetchTemplates();
    } catch (error) {
      const finalresponse =
        error?.response !== undefined
          ? {
            message: error.message,
            server_res: error.response?.data,
          }
          : {
            message: error.message,
            server_res: null,
          };
      setErrorMessage(finalresponse?.message || "Upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadSaleDeedTemplate = async () => {
    if (!saleDeedFile) {
      setSaleDeedFileError("Please select a .docx file.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("uploadfile", saleDeedFile);
    try {
      const res = await Flatapi.post("uploadtemplate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = res?.data;
      if (data?.status === "error") {
        setErrorMessage(data?.message || "Upload failed.");
        setIsLoading(false);
        return;
      }
      toast.success("Sale deed template uploaded successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      closeSaleDeedModal();
      resetSaleDeedState();
      await fetchTemplates();
    } catch (error) {
      const finalresponse =
        error?.response !== undefined
          ? {
            message: error.message,
            server_res: error.response?.data,
          }
          : {
            message: error.message,
            server_res: null,
          };
      setErrorMessage(finalresponse?.message || "Upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto  px-4 py-6 md:py-10">
        {/* Page header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
            Templates
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage Agreement and Sale Deed templates with preview, download, and replace actions.
          </p>
        </div>

        {/* Two cards */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Sale Deed Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5 text-sky-600" />
                <h3 className="text-base font-semibold text-slate-900">Sale Deed Template</h3>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${hasSaleDeed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                  }`}
              >
                {hasSaleDeed ? "Available" : "Not uploaded"}
              </span>
            </div>

            <div className="px-6 py-5 space-y-4">
              {hasSaleDeed ? (
                <>
                  <div className="text-sm text-slate-700 flex items-center gap-2">
                    <span className="text-slate-500">Current file:</span>
                    <span className="font-medium truncate" title={getFileName(saleDeedUrl)}>
                      {getFileName(saleDeedUrl)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={saleDeedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-sky-600 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
                      download
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Preview/Download
                    </a>
                    {permissions?.settings_page?.includes("template_upload") && (
                      <button
                        onClick={openSaleDeedModal}
                        className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                      >
                        <Upload className="h-4 w-4" />
                        Replace
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">
                    No sale deed template found, upload to get started.
                  </p>
                  {permissions?.settings_page?.includes("template_upload") && (
                    <button
                      onClick={openSaleDeedModal}
                      className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Agreement Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5 text-sky-600" />
                <h3 className="text-base font-semibold text-slate-900">Agreement Template</h3>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${hasAgreement
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                  }`}
              >
                {hasAgreement ? "Available" : "Not uploaded"}
              </span>
            </div>

            <div className="px-6 py-5 space-y-4">
              {hasAgreement ? (
                <>
                  <div className="text-sm text-slate-700 flex items-center gap-2">
                    <span className="text-slate-500">Current file:</span>
                    <span className="font-medium truncate" title={getFileName(agreementUrl)}>
                      {getFileName(agreementUrl)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={agreementUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-sky-600 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
                      download
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Preview/Download
                    </a>
                    {permissions?.settings_page?.includes("template_upload") && (
                      <button
                        onClick={openAgreementModal}
                        className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                      >
                        <Upload className="h-4 w-4" />
                        Replace
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-700">
                    No agreement template found, upload to get started.
                  </p>
                  {permissions?.settings_page?.includes("template_upload") && (
                    <button
                      onClick={openAgreementModal}
                      className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Agreement Modal */}
      <Modal
        open={isAgreementModalOpen}
        close={closeAgreementModal}
        withCloseButton={false}
        padding="0"
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[480px]"
      >
        {isAgreementModalOpen && (
          <div>
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <p className="text-lg font-semibold text-sky-700">
                Upload Agreement Template
              </p>
              <X
                className="h-5 w-5 cursor-pointer text-sky-700 hover:opacity-70"
                onClick={closeAgreementModal}
              />
            </div>

            <div className="px-5 py-3 text-sm text-slate-800 space-y-2">
              <p className="font-medium">Guidelines:</p>
              <p>
                Wrap placeholders inside &lt;&lt; &gt;&gt; tags, e.g. &lt;&lt;FLAT_NAME&gt;&gt;.
              </p>
              <p className="text-slate-700">
                Available placeholders: DATE, NUM_KEY, NAME, GUARDIAN_NAME, AGE,
                OCCUPATION, AADHAAR_NUMBER, PAN_NUMBER, ADDRESS, PROJECT_NAME,
                FLAT_NO, FLOOR_NO, BLOCK_NO, SFT, CAR_PARKING, UDS, SALE_VALUE,
                RCPT_NUM, RCPT_VALUE, RCPT_TYPE, RCPT_DATE, NORTH, SOUTH, EAST, WEST.
              </p>
            </div>

            <Fileinput
              placeholder="Click here to select a .docx file"
              accept=".docx"
              error={agreementFileError}
              value={agreementFile}
              onChange={onAgreementFileChange}
              mainContainerClass="!px-5 !pb-2"
            />

            <div className="w-full justify-end flex border-t py-3 px-5">
              <button
                disabled={!agreementFile || !!agreementFileError || isLoading}
                onClick={uploadAgreementTemplate}
                className={`inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 ${!agreementFile || !!agreementFileError || isLoading
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                  }`}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Sale Deed Modal */}
      <Modal
        open={isSaleDeedModalOpen}
        close={closeSaleDeedModal}
        withCloseButton={false}
        padding="0"
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[480px]"
      >
        {isSaleDeedModalOpen && (
          <div>
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <p className="text-lg font-semibold text-sky-700">
                Upload Sale Deed Template
              </p>
              <X
                className="h-5 w-5 cursor-pointer text-sky-700 hover:opacity-70"
                onClick={closeSaleDeedModal}
              />
            </div>

            <div className="px-5 py-3 text-sm text-slate-800 space-y-2">
              <p className="font-medium">Guidelines:</p>
              <p>
                Wrap placeholders inside &lt;&lt; &gt;&gt; tags, e.g. &lt;&lt;FLAT_NAME&gt;&gt;.
              </p>
              <p className="text-slate-700">
                Available placeholders: DATE, NUM_KEY, NAME, GUARDIAN_NAME, AGE,
                OCCUPATION, AADHAAR_NUMBER, PAN_NUMBER, ADDRESS, PROJECT_NAME,
                FLAT_NO, FLOOR_NO, BLOCK_NO, SFT, CAR_PARKING, UDS, SALE_VALUE,
                RCPT_NUM, RCPT_VALUE, RCPT_TYPE, RCPT_DATE, NORTH, SOUTH, EAST, WEST.
              </p>
            </div>

            <Fileinput
              placeholder="Click here to select a .docx file"
              accept=".docx"
              error={saleDeedFileError}
              value={saleDeedFile}
              onChange={onSaleDeedFileChange}
              mainContainerClass="!px-5 !pb-2"
            />

            <div className="w-full justify-end flex border-t py-3 px-5">
              <button
                disabled={!saleDeedFile || !!saleDeedFileError || isLoading}
                onClick={uploadSaleDeedTemplate}
                className={`inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 ${!saleDeedFile || !!saleDeedFileError || isLoading
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                  }`}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Templates;
