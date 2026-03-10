import React, { useEffect, useState } from "react";
import Flatapi from "../../api/Flatapi";
import Paymentapi from "../../api/Paymentapi";
import Generalapi from "../../api/Generalapi";
import ReactSelect from 'react-select';
import Errorpanel from "../../shared/Errorpanel";
import photo from "@/assets/photo.png";
import pdficon from "@/assets/pdficon.png";
import { IconX } from "@tabler/icons-react";
import { toast, ToastContainer } from "react-toastify";
import {
  Textinput,
  Loadingoverlay,
  Select,
  Textarea,
  Fileinput,
  Button,
} from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import CustomDateFilter from "../../shared/CustomDateFilter";

const getFileInfo = (url) => {
  if (!url) return { fileName: "", fileType: "" };
  const fileName = url.split("/").pop();
  const extension = fileName.split(".").pop().toLowerCase();
  const fileType =
    extension === "pdf"
      ? "pdf"
      : ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)
        ? "image"
        : "unknown";
  return { fileName, fileType };
};

function Editpaymentincustomer({
  closeEditDrawer,
  paymentUuid,
  customerId,
  refreshAllPayments,
}) {
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await Generalapi.get('/get-all-banks-list?limit=1000');
        if (response.data.status === 'success') {
          setBankList(response.data.data.map(b => ({ value: b.name, label: b.name })));
        }
      } catch (e) {
        console.error("Error fetching banks:", e);
      }
    };
    fetchBanks();
  }, []);

  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const updateAmount = (e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    setAmount(value);
    setAmountError("");
  };

  const [paymentType, setPaymentType] = useState(null);
  const [paymentTypeError, setPaymentTypeError] = useState('');
  const updatePaymentType = (value) => {
    setPaymentType(value);
    setPaymentTypeError('');
  };

  const [paymentTowards, setPaymentTowards] = useState(null);
  const [paymentTowardsError, setPaymentTowardsError] = useState('');
  const updatePaymentTowards = (value) => {
    setPaymentTowards(value);
    setPaymentTowardsError('');
  };

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const updatePaymentMethod = (value) => {
    setPaymentMethod(value);
    setPaymentMethodError("");
    setBank("");
  };

  const [bank, setBank] = useState("");
  const [bankError, setBankError] = useState("");
  const updateBank = (selectedOption) => {
    setBank(selectedOption ? selectedOption.value : '');
    setBankError("");
  };

  const [paymentDate, setPaymentDate] = useState("");
  const [paymentDateError, setPaymentDateError] = useState("");
  const updatePaymentDate = (value) => {
    setPaymentDate(value);
    setPaymentDateError("");
  };

  const [transactionId, setTransactionId] = useState("");
  const [transactionIdError, setTransactionIdError] = useState("");
  const updateTransactionId = (e) => {
    setTransactionId(e.currentTarget.value);
    setTransactionIdError("");
  };

  const [receipt, setReceipt] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptError, setReceiptError] = useState("");
  const [receiptUpdated, setReceiptUpdated] = useState(false);
  const updateFeaturedImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceipt(file);
      setReceiptUrl(URL.createObjectURL(file));
      setReceiptError("");
      setReceiptUpdated(true);
    }
  };
  const removeReceipt = () => {
    setReceipt(null);
    setReceiptUrl("");
    setReceiptUpdated(true);
  };

  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const updateComment = (e) => {
    setComment(e.currentTarget.value);
    setCommentError("");
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  const [flatsData, setFlatsData] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [selectedFlatError, setSelectedFlatError] = useState("");

  async function getFlatsData() {
    try {
      setIsLoadingEffect(true);
      const response = await Flatapi.get(`search-sold-flats-for-customer`, {
        params: {
          customerId: customerId,
        },
        headers: { "Content-Type": "application/json" },
      });

      const data = response?.data;
      if (data?.status === "error") {
        setErrorMessage({ message: data.message, server_res: data });
        setFlatsData([]);
        return false;
      }
      setFlatsData(data?.data || []);
      return true;
    } catch (error) {
      console.log(error);
      setErrorMessage({
        message: error.message,
        server_res: error.response?.data || null,
      });
      return false;
    } finally {
      setIsLoadingEffect(false);
    }
  }

  async function getSinglePaymentData(paymentUuid) {
    setIsLoadingEffect(true);
    try {
      const response = await Paymentapi.get("getsinglepayment", {
        params: { paymentuid: paymentUuid },
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({ message: data.message, server_res: data });
        setIsLoadingEffect(false);
        return false;
      }

      if (data.payment_details) {
        const payment = data.payment_details;
        setAmount(payment.amount ? payment.amount.toString() : "");
        setPaymentType(payment.payment_type || null);
        setPaymentTowards(payment?.payment_towards || null);
        setPaymentMethod(payment.payment_method || null);
        setBank(payment.bank || "");
        setPaymentDate(
          payment.payment_date ? new Date(payment.payment_date) : new Date()
        );
        setTransactionId(payment.transaction_id || "");
        setReceiptUrl(payment.receipt_url || "");
        setComment(payment.comment || "");

        // Pre-fill flat/customer data
        if (payment.flat && payment.customer) {
          setSelectedFlat({
            id: payment.flat.id,
            value: payment.flat.id,
            label: `${payment.flat.flat_no} - ${payment.flat.block_name}`,
            flat_no: payment.flat.flat_no,
            block_name: payment.flat.block_name,
            facing: payment.flat.facing,
            floor_no: payment.floor_no,
            square_feet: payment.flat.square_feet,
            type: payment.flat.type,
            bedrooms: payment.flat.bedrooms,
            bathrooms: payment.flat.bathrooms,
            balconies: payment.flat.balconies,
            parking: payment.flat.parking,
            furnished_status: payment.flat.furnished_status,
            id: payment.flat.id,
            customer: {
              id: payment.customer.id,
              first_name: payment.customer.first_name,
              last_name: payment.customer.last_name,
              email: payment.customer.email,
              phone_code: payment.customer.phone_code,
              phone_number: payment.customer.phone_number,
              profile_pic_url: payment.customer.profile_pic_url,
              id: payment.customer.id,
            },
          });
        }
      }
      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.log("Fetch payment error:", error);
      setErrorMessage({
        message: error.message,
        server_res: error.response?.data || null,
      });
      setIsLoadingEffect(false);
      return false;
    }
  }

  useEffect(() => {
    if (paymentUuid) {
      getSinglePaymentData(paymentUuid);
    }
    getFlatsData();
  }, [paymentUuid]);

  const [receiptFileType, setReceiptFileType] = useState("");
  const [receiptFileName, setReceiptFileName] = useState("");

  useEffect(() => {
    if (receiptUrl) {
      const { fileName, fileType } = getFileInfo(receiptUrl);
      setReceiptFileType(fileType);
      setReceiptFileName(fileName);
    } else {
      setReceiptFileType("");
      setReceiptFileName("");
    }
  }, [receiptUrl]);

  const handleSubmit = async () => {
    setIsLoadingEffect(true);

    // Collect all validation errors at once
    let hasErrors = false;

    if (!selectedFlat) {
      setSelectedFlatError("Please select a flat/customer");
      hasErrors = true;
    }
    if (amount === "") {
      setAmountError("Amount is required");
      hasErrors = true;
    }
    if (!paymentType) {
      setPaymentTypeError('Select payment type');
      hasErrors = true;
    }
    if (!paymentTowards) {
      setPaymentTowardsError('Select payment towards');
      hasErrors = true;
    }
    if (!paymentMethod) {
      setPaymentMethodError("Select payment method");
      hasErrors = true;
    }
    if ((paymentMethod === "DD" || paymentMethod === "Bank Deposit" || paymentMethod === "Cheque") && !bank) {
      setBankError("Enter the bank name");
      hasErrors = true;
    }
    if (!paymentDate) {
      setPaymentDateError("Select payment date");
      hasErrors = true;
    }
    if (!transactionId) {
      setTransactionIdError("Enter transaction id");
      hasErrors = true;
    }

    if (hasErrors) {
      setIsLoadingEffect(false);
      return false;
    }

    const formatDateOnly = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formdata = new FormData();
    formdata.append("amount", amount);
    formdata.append('payment_type', paymentType);
    formdata.append('payment_towards', paymentTowards);
    formdata.append("payment_method", paymentMethod);
    formdata.append("bank", bank);
    formdata.append("paymentdate", formatDateOnly(paymentDate));
    formdata.append("transactionid", transactionId);
    formdata.append("receipt", receipt || "");
    formdata.append("comment", comment);
    formdata.append("customerFlatId", selectedFlat?.value || "");
    formdata.append("flat_id", selectedFlat?.id || "");
    formdata.append("customer_id", selectedFlat?.customer?.id || "");
    formdata.append("receipt_updated", receiptUpdated.toString());
    formdata.append("payment_uid", paymentUuid); employeeId
    formdata.append("employee_id", employeeId);

    try {
      const res = await Paymentapi.post("/updatepayment", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;
      if (data.status === "error") {
        setErrorMessage({ message: data.message, server_res: data });
        setIsLoadingEffect(false);
        return false;
      }
      setIsLoadingEffect(false);
      toast.success("Payment updated successfully");
      closeEditDrawer();
      refreshAllPayments();
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage({
        message: error.message,
        server_res: error.response?.data || null,
      });
      setIsLoadingEffect(false);
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-800 text-lg font-semibold">Edit Payment</h1>
        <div
          onClick={closeEditDrawer}
          className="cursor-pointer py-1 px-2 rounded-sm !bg-red-500 text-white font-semibold"
        >
          Close
        </div>
      </div>
      <hr className="border border-gray-200" />
      <div className="relative flex flex-col gap-8 bg-white">
        <div className="w-full flex flex-row gap-4">
          <div className="w-1/2 flex flex-col gap-4">
            <Textinput
              placeholder="Enter Amount"
              label="Amount"
              error={amountError}
              value={amount}
              onChange={updateAmount}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Select
              label="Payment Type"
              labelClass="text-sm font-medium text-gray-600 mb-1"
              placeholder="Select Payment Type"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              className="w-full"
              dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
              selectWrapperClass="!shadow-none"
              error={paymentTypeError}
              value={paymentType}
              onChange={updatePaymentType}
              data={[
                { value: 'Customer Pay', label: 'Customer Pay' },
                { value: 'Loan Pay', label: 'Loan Pay' },
              ]}
            />
            <Select
              label="Payment Towards"
              labelClass="text-sm font-medium text-gray-600 mb-1"
              placeholder="Select Payment Towards"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              className="w-full"
              dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
              selectWrapperClass="!shadow-none"
              error={paymentTowardsError}
              value={paymentTowards}
              onChange={updatePaymentTowards}
              data={[
                { value: 'Flat', label: 'Flat' },
                { value: 'GST', label: 'GST' },
                { value: 'Corpus fund', label: 'Corpus fund' },
                { value: 'Registration', label: 'Registration' },
                { value: 'TDS', label: 'TDS' },
                { value: 'Maintenance', label: 'Maintenance' },
              ]}
            />
            <Select
              label="Payment Method"
              labelClass="text-sm font-medium text-gray-600 mb-1"
              placeholder="Select Payment Method"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              className="w-full"
              dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
              selectWrapperClass="!shadow-none"
              error={paymentMethodError}
              value={paymentMethod}
              onChange={updatePaymentMethod}
              data={[
                { value: "DD", label: "DD" },
                { value: "UPI", label: "UPI" },
                { value: "Bank Deposit", label: "Bank Deposit" },
                { value: "Cheque", label: "Cheque" },
                {
                  value: "Online Transfer (IMPS, NFT)",
                  label: "Online Transfer (IMPS, NFT)",
                },
              ]}
            />
            {(paymentMethod === "DD" || paymentMethod === "Bank Deposit" || paymentMethod === "Cheque") && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Bank</label>
                <ReactSelect
                  placeholder="Select Bank"
                  value={bankList.find(b => b.value === bank)}
                  onChange={updateBank}
                  options={bankList}
                  isClearable
                  className="w-full"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: bankError ? '#ef4444' : '#d1d5db',
                      '&:hover': {
                        borderColor: bankError ? '#ef4444' : '#9ca3af',
                      },
                      boxShadow: 'none',
                      minHeight: '2.5rem',
                    }),
                    input: (base) => ({
                      ...base,
                      'input:focus': {
                        boxShadow: 'none',
                      },
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                    }),
                    option: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                    }),
                  }}
                />
                {bankError && <div className="text-red-500 text-xs mt-1">{bankError}</div>}
              </div>
            )}
            <CustomDateFilter
              label="Date of Payment"
              selected={paymentDate}
              onChange={updatePaymentDate}
              error={paymentDateError}
              maxDateToday={true}
            />
            <Textinput
              placeholder="Enter transaction id"
              label="Transaction Id"
              error={transactionIdError}
              value={transactionId}
              onChange={updateTransactionId}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            {receiptUrl ? (
              <div className="relative">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Receipt
                </p>
                <div className="relative flex items-center gap-2 justify-center border border-amber-50 rounded-md p-3 bg-gray-50">
                  <img
                    src={receiptFileType === "pdf" ? pdficon : photo}
                    className={
                      receiptFileType === "pdf"
                        ? "h-[50px] w-[50px]"
                        : "h-[40px] w-[40px]"
                    }
                    alt="Receipt"
                  />
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-medium truncate max-w-[200px]"
                  >
                    {receiptFileName || "View Receipt"}
                  </a>
                  <div
                    className="absolute right-2 top-2"
                    onClick={removeReceipt}
                  >
                    <IconX size={18} color="red" className="cursor-pointer" />
                  </div>
                </div>
              </div>
            ) : (
              <Fileinput
                label="Receipt (optional)"
                accept="image/*,application/pdf"
                labelClassName="text-sm font-medium text-gray-600 mb-1"
                multiple={false}
                clearable
                value={receipt}
                error={receiptError}
                onChange={updateFeaturedImage}
              />
            )}
            <Textarea
              placeholder="Enter comments"
              label="Comments"
              error={commentError}
              value={comment}
              onChange={updateComment}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
          </div>

          <div className="w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="">
                <div className="text-sm font-semibold text-gray-800 mb-1">
                  Select Flat
                </div>
                {flatsData.length > 0 ? (
                  <div className="bg-[#f9fafc] border border-[#ced4da] rounded-md flex flex-col gap-4 p-2">
                    {flatsData.map((flat) => (
                      <div key={flat.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`flat-${flat.id}`}
                          name="flat-selection"
                          checked={selectedFlat?.id === flat.id}
                          onChange={() => {
                            setSelectedFlat(flat);
                            setSelectedFlatError("");
                          }}
                          className="h-4 w-4 text-[#044093] focus:ring-[#044093] border-gray-300"
                        />
                        <label
                          htmlFor={`flat-${flat.id}`}
                          className="text-sm text-gray-700"
                        >
                          {flat.label}
                        </label>
                      </div>
                    ))}
                    {selectedFlatError && (
                      <div className="text-red-500 text-sm">
                        {selectedFlatError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">
                    No flats available
                  </div>
                )}
              </div>
              {selectedFlat && (
                <div className="bg-white border border-[#ced4da] rounded-md p-4">
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    Flat No: {selectedFlat.label}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Block:</span>{" "}
                      {selectedFlat.block_name}
                    </div>
                    <div>
                      <span className="font-medium">Facing:</span>{" "}
                      {selectedFlat.facing}
                    </div>
                    <div>
                      <span className="font-medium">Floor:</span>{" "}
                      {selectedFlat.floor_no}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>{" "}
                      {selectedFlat.square_feet} sqft
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoadingEffect ? (
          isLoadingEffect && (
            <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
              <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
            </div>
          )
        ) : (
          <div className="flex justify-end mt-auto">
            <Button
              onClick={handleSubmit}
              disabled={isLoadingEffect}
              size="md"
              className="cursor-pointer text-xs text-white !bg-[#0083bf]"
            >
              Update Payment
            </Button>
          </div>
        )}
      </div>
      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Editpaymentincustomer;
