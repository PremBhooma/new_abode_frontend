import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconX, IconEdit, IconBuildingBank, IconUser, IconPhone, IconCash, IconCheck, IconLoader } from '@tabler/icons-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Modal } from '@nayeshdaggula/tailify';
import Ageingrecordapi from '../api/Ageingrecordapi';
import { toast } from 'react-toastify';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import Generalapi from '../api/Generalapi';

import CustomDateFilter from "../shared/CustomDateFilter";
import { useMediaQuery } from "../../hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawerCostSheet";

const Ageingrecorddetails = ({ open, onOpenChange, recordData, onRefresh, onRecordUpdate }) => {
  const permissions = useEmployeeDetails((state) => state.permissions);
  const [isLoading, setIsLoading] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [localRecord, setLocalRecord] = useState(null);
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await Generalapi.get('/get-all-banks-list?limit=1000');
        if (response.data.status === 'success') {
          setBankList(response.data.data.map(b => b.name));
        }
      } catch (e) {
        console.error("Error fetching banks:", e);
      }
    };
    fetchBanks();
  }, []);

  // Form states
  const [currentStep, setCurrentStep] = useState(1);
  const [loanStatus, setLoanStatus] = useState("NotApplied");
  const [registrationStatus, setRegistrationStatus] = useState("NotRegistered");
  const [bankName, setBankName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentNumber, setAgentNumber] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  // Step 2 & 3 states
  const [loanApprovedAmount, setLoanApprovedAmount] = useState('');
  const [customerBalancePayment, setCustomerBalancePayment] = useState('');
  const [bankAgreement, setBankAgreement] = useState('No');
  const [disbursement, setDisbursement] = useState('No');

  // Error states
  const [errors, setErrors] = useState({});

  // Cancel Ageing States
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [cancelDetails, setCancelDetails] = useState({ hasPayments: false, totalPaid: 0, totalRefunded: 0, remainingBalance: 0 });
  const [refundAmount, setRefundAmount] = useState('');
  const [refundDate, setRefundDate] = useState(new Date());
  const [refundTransactionId, setRefundTransactionId] = useState('');

  const [isCancelling, setIsCancelling] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch fresh record details
  const fetchRecordDetails = async () => {
    if (!recordData?.id) return;
    try {
      const response = await Ageingrecordapi.get(`get-single-ageing-record?id=${recordData.id}`);
      if (response.data.status === 'success') {
        setLocalRecord(response.data.record);
      }
    } catch (error) {
      console.error('Error fetching single record:', error);
    }
  };

  useEffect(() => {
    if (open && recordData) {
      setLocalRecord(recordData);
      fetchRecordDetails();
    }
  }, [open, recordData]);

  useEffect(() => {
    if (!open) setLocalRecord(null);
  }, [open]);

  // Reset/Init form when modal opens
  useEffect(() => {
    if (updateModalOpen && localRecord) {
      // Determine step based on status
      let step = 1;
      const status = localRecord?.loan_Status;
      if (status === 'Approved' || status === 'Rejected') {
        // If already approved, maybe go to step 3? Or stay step 2 to show details?
        // Logic: If Approved, go to Step 3.
        if (status === 'Approved') step = 3;
        // If Rejected, flow ends, but let's default to 2 to show status.
        if (status === 'Rejected') step = 2;
      } else if (status === 'Applied') {
        step = 2; // Move to approval step
      }

      setCurrentStep(step);

      setLoanStatus(status === "Not Applied" ? "NotApplied" : (status || "NotApplied"));
      setRegistrationStatus(localRecord?.registration_status === "Not Registered" ? "NotRegistered" : (localRecord?.registration_status || "NotRegistered"));
      setBankName(localRecord?.bank_name || '');
      setAgentName(localRecord?.agent_name || '');
      setAgentNumber(localRecord?.agent_number || '');
      setLoanAmount(localRecord?.loan_amount ? Number(localRecord?.loan_amount).toLocaleString('en-IN') : '');

      setLoanApprovedAmount(localRecord?.loan_approved_amount ? Number(localRecord?.loan_approved_amount).toLocaleString('en-IN') : '');
      setCustomerBalancePayment(localRecord?.customer_balance_payment ? Number(localRecord?.customer_balance_payment).toLocaleString('en-IN') : '');
      setBankAgreement(localRecord?.bank_agreement ? 'Yes' : 'No');
      setDisbursement(localRecord?.disbursement ? 'Yes' : 'No');

      setErrors({});
    }
  }, [updateModalOpen, localRecord]);


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (loanStatus === 'Applied' || loanStatus === 'Approved') {
      if (!bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!agentName.trim()) newErrors.agentName = 'Agent name is required';
      if (!agentNumber.trim()) newErrors.agentNumber = 'Agent number is required';
      else if (!/^\d{10}$/.test(agentNumber.trim())) newErrors.agentNumber = 'Must be 10 digits';
      if (!loanAmount || parseFloat(loanAmount) <= 0) newErrors.loanAmount = 'Required > 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    // If user is approving, require approved amount? Or is it optional? Assuming required.
    // Getting current selection from UI invocation, but here we can check pending state if we had one.
    // In this flow, the user clicks "Approved" or "Rejected".
    return true;
  };

  // Approved amount is now optional, so no validation needed
  const validateApprovedAmount = () => {
    // Approved amount is optional, so always return true
    return true;
  }

  const handleUpdate = async (statusOverride = null) => {
    if (!localRecord?.id) return;

    let payload = {
      id: localRecord.id,
      registration_status: registrationStatus // Global field available in all steps
    };

    // Step 1 Submission
    if (currentStep === 1) {
      if (!validateStep1()) return;
      payload = {
        ...payload,
        loan_Status: loanStatus,
        bank_name: bankName.trim(),
        agent_name: agentName.trim(),
        agent_number: agentNumber.trim(),
        loan_amount: loanAmount ? parseFloat(loanAmount.toString().replace(/,/g, '')) : null,
      };
    }

    // Step 2 Submission (Approval/Rejection)
    else if (currentStep === 2) {
      // Using override because button click determines status
      const finalStatus = statusOverride || loanStatus;

      if (finalStatus === 'Approved') {
        payload = {
          ...payload,
          loan_Status: 'Approved',
          loan_approved_amount: loanApprovedAmount ? parseFloat(loanApprovedAmount.toString().replace(/,/g, '')) : null,
          // Persist previous data just in case
          bank_name: bankName.trim(),
          agent_name: agentName.trim(),
          agent_number: agentNumber.trim(),
          loan_amount: loanAmount ? parseFloat(loanAmount.toString().replace(/,/g, '')) : null,
        };
      } else if (finalStatus === 'Reapply') {
        // Reset loan to NotApplied and clear bank details
        payload = {
          ...payload,
          loan_Status: 'NotApplied',
          bank_name: null,
          agent_name: null,
          agent_number: null,
          loan_amount: null,
          loan_approved_amount: null,
        };
      } else if (finalStatus === 'Rejected') {
        // destructive
        payload = { ...payload, loan_Status: 'Rejected' };
      } else {
        // "Applied" or others? Should not happen if buttons are used.
        return;
      }
    }

    // Step 3 Submission
    else if (currentStep === 3) {
      payload = {
        ...payload,
        loan_Status: 'Approved', // Ensure it stays approved
        customer_balance_payment: customerBalancePayment ? parseFloat(customerBalancePayment.toString().replace(/,/g, '')) : 0,
        bank_agreement: bankAgreement === 'Yes',
        disbursement: disbursement === 'Yes',
      };
    }

    setIsLoading(true);
    try {
      const response = await Ageingrecordapi.post('update-loan-status', payload);
      if (response.data.status === 'success') {
        toast.success(currentStep === 2 && statusOverride === 'Reapply' ? 'Loan reset for reapplication' : 'Updated successfully');
        await fetchRecordDetails();
        setUpdateModalOpen(false);
        if (onRecordUpdate) onRecordUpdate();
      } else {
        toast.error(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = async () => {
    if (!localRecord?.flat_id || !localRecord?.customer_id) return;

    setIsLoading(true);
    try {
      const response = await Ageingrecordapi.get(`get-cancellation-details?flat_id=${localRecord.flat_id}&customer_id=${localRecord.customer_id}&ageing_id=${localRecord.id}`);
      if (response.data.status === 'success') {
        const { hasPayments, totalPaid, totalRefunded, remainingBalance } = response.data;
        setCancelDetails({ hasPayments, totalPaid, totalRefunded, remainingBalance });
        setRefundAmount(remainingBalance || ''); // Default to remaining balance
        setRefundDate(new Date());
        setRefundTransactionId('');
        setCancelModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching cancellation details:", error);
      toast.error("Failed to fetch payment details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (cancelDetails.hasPayments) {
      if (!refundAmount && refundAmount !== 0) return toast.error("Refund Amount is required");
      if (parseFloat(refundAmount) > cancelDetails.remainingBalance) return toast.error(`Refund amount cannot exceed ₹${cancelDetails.remainingBalance}`);
      if (!refundTransactionId) return toast.error("Transaction ID is required");
    }

    setIsCancelling(true);
    try {
      const payload = {
        ageing_id: localRecord.id,
        flat_id: localRecord.flat_id,
        customer_id: localRecord.customer_id,
        project_id: localRecord.project?.id || localRecord.project_id, // Ensure project_id is available
        refund_amount: refundAmount ? parseFloat(refundAmount) : 0,
        refund_date: refundDate,
        refund_transactionid: refundTransactionId
      };

      const response = await Ageingrecordapi.post('process-ageing-cancellation', payload);
      if (response.data.status === 'success') {
        toast.success("Ageing cancelled successfully");
        setCancelModalOpen(false);
        onOpenChange(false); // Close main drawer
        if (onRefresh) onRefresh(); // Refresh list
      } else {
        toast.error(response.data.message || "Cancellation failed");
      }
    } catch (error) {
      console.error("Cancellation Error:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const DetailRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Icon size={16} className="text-gray-600" /></div>}
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
      </div>
    </div>
  );


  return (
    <>
      <div className={`h-screen fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => onOpenChange(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Sales Report Details</h2>
                <p className="text-sm text-gray-500">{localRecord?.customer?.full_name || 'Customer Details'}</p>
              </div>
              <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors group cursor-pointer">
                <IconX size={20} className="text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
              {/* Existing View Components (Customer Inf, Property, Ageing) */}
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-lg font-bold">
                    {localRecord?.customer?.first_name?.[0]}{localRecord?.customer?.last_name?.[0] || ''}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{localRecord?.customer?.first_name} {localRecord?.customer?.last_name}</h3>
                    <p className="text-sm text-gray-600">+{localRecord?.customer?.phone_code} {localRecord?.customer?.phone_number}</p>
                    <p className="text-xs text-gray-500">{localRecord?.customer?.email}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Property Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Flat No</p><p className="font-semibold text-gray-900">{localRecord?.flat?.flat_no || '-'}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Floor</p><p className="font-semibold text-gray-900">{localRecord?.flat?.floor_no || '-'}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Block</p><p className="font-semibold text-gray-900">{localRecord?.flat?.block_name || '-'}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Project</p><p className="font-semibold text-gray-900">{localRecord?.project?.project_name || '-'}</p></div>
                </div>
              </div>

              {/* Loan Status Section */}
              {!localRecord?.advance_payment ? (
                <div className="px-6 py-4 border-b border-gray-200 bg-orange-50/50">
                  <div className="flex gap-3">
                    <div className="mt-0.5 p-1.5 bg-orange-100 text-orange-600 rounded-md shrink-0"><IconCash size={18} /></div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Advance Payment Pending</h4>
                      <p className="text-sm text-gray-600 mt-0.5">Please complete the advance payment so we can move forward.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 border-b border-gray-200">
                  {localRecord?.loan_Status !== 'Cancelled' && (
                    <>
                      {permissions?.ageing_page?.includes("update_loan_details") && (
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Loan Details</h4>
                          <button onClick={() => setUpdateModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer">
                            <IconEdit size={14} /> Update
                          </button>
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Loan Status</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${localRecord?.loan_Status === 'Approved' ? 'bg-green-50 text-green-700' : localRecord?.loan_Status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
                            {localRecord?.loan_Status || 'Not Applied'}
                          </span>
                        </div>
                        <DetailRow label="Bank Name" value={localRecord?.bank_name} icon={IconBuildingBank} />
                        <DetailRow label="Agent Name" value={localRecord?.agent_name} icon={IconUser} />
                        <DetailRow label="Loan Amount" value={formatAmount(localRecord?.loan_amount)} icon={IconCash} />
                        <DetailRow label="Approved Amount" value={formatAmount(localRecord?.loan_approved_amount)} icon={IconCheck} />
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Bank Agreement</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-md ${localRecord?.bank_agreement === true ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{localRecord?.bank_agreement ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Disbursement</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-md ${localRecord?.disbursement === true ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{localRecord?.disbursement ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Customer Balance</span>
                          <span className="text-sm font-medium">{formatAmount(localRecord?.customer_balance_payment)}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-gray-100">
                          <span className="text-sm text-gray-600">Registration Status</span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide uppercase ${localRecord?.registration_status === 'Registered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {localRecord?.registration_status}
                          </span>
                        </div>
                      </div>
                    </>
                  )}



                  {localRecord?.bank_agreement !== true && !localRecord?.refund_status && permissions?.payments_page?.includes("cancel_booking") && (
                    <div className={` mt-0  ${localRecord?.loan_Status !== 'Cancelled' ? 'mt-6 pt-6 border-t border-gray-100' : 'py-3'}`}>
                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-red-50/50"
                        onClick={handleCancelClick}
                        disabled={isLoading}
                      >
                        {isLoading ? <IconLoader className="animate-spin mr-2" size={16} /> : null}
                        {localRecord?.loan_Status === 'Cancelled' ? 'Continue Refund' : 'Cancel Booking'}
                      </Button>
                    </div>
                  )}

                  <div className={`grid grid-cols-2 gap-4 py-3 ${localRecord?.loan_Status !== 'Cancelled' ? 'border-t border-gray-100' : ''}`}>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1.5 ml-0.5">Created At</span>
                      <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 text-center">
                        {formatDate(localRecord?.created_at)}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1.5 ml-0.5">Updated At</span>
                      <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 text-center">
                        {formatDate(localRecord?.updated_at) || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div >

      {/* Update Modal */}
      {/* Update Modal - Responsive */}
      {
        isDesktop ? (
          <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Loan Process</DialogTitle>
                <UpdateModalHeaderContent
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  loanStatus={loanStatus}
                  bankName={bankName}
                  agentName={agentName}
                  agentNumber={agentNumber}
                  loanAmount={loanAmount}
                  setUpdateModalOpen={setUpdateModalOpen}
                  isDesktop={true}
                />
              </DialogHeader>
              <UpdateModalContent
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                loanStatus={loanStatus}
                setLoanStatus={setLoanStatus}
                bankName={bankName}
                setBankName={setBankName}
                bankList={bankList}
                errors={errors}
                setErrors={setErrors}
                agentName={agentName}
                setAgentName={setAgentName}
                agentNumber={agentNumber}
                setAgentNumber={setAgentNumber}
                loanAmount={loanAmount}
                setLoanAmount={setLoanAmount}
                handleUpdate={handleUpdate}
                isLoading={isLoading}
                loanApprovedAmount={loanApprovedAmount}
                setLoanApprovedAmount={setLoanApprovedAmount}
                customerBalancePayment={customerBalancePayment}
                setCustomerBalancePayment={setCustomerBalancePayment}
                bankAgreement={bankAgreement}
                setBankAgreement={setBankAgreement}
                disbursement={disbursement}
                setDisbursement={setDisbursement}
                registrationStatus={registrationStatus}
                setRegistrationStatus={setRegistrationStatus}
                isDesktop={true}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Loan Process</DrawerTitle>
                <UpdateModalHeaderContent
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  loanStatus={loanStatus}
                  bankName={bankName}
                  agentName={agentName}
                  agentNumber={agentNumber}
                  loanAmount={loanAmount}
                  setUpdateModalOpen={setUpdateModalOpen}
                  isDesktop={false}
                />
              </DrawerHeader>
              <UpdateModalContent
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                loanStatus={loanStatus}
                setLoanStatus={setLoanStatus}
                bankName={bankName}
                setBankName={setBankName}
                bankList={bankList}
                errors={errors}
                setErrors={setErrors}
                agentName={agentName}
                setAgentName={setAgentName}
                agentNumber={agentNumber}
                setAgentNumber={setAgentNumber}
                loanAmount={loanAmount}
                setLoanAmount={setLoanAmount}
                handleUpdate={handleUpdate}
                isLoading={isLoading}
                loanApprovedAmount={loanApprovedAmount}
                setLoanApprovedAmount={setLoanApprovedAmount}
                customerBalancePayment={customerBalancePayment}
                setCustomerBalancePayment={setCustomerBalancePayment}
                bankAgreement={bankAgreement}
                setBankAgreement={setBankAgreement}
                disbursement={disbursement}
                setDisbursement={setDisbursement}
                registrationStatus={registrationStatus}
                setRegistrationStatus={setRegistrationStatus}
                isDesktop={false}
              />
            </DrawerContent>
          </Drawer>
        )
      }

      {/* Cancel Confirmation Modal - Responsive */}
      {
        isDesktop ? (
          <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cancel Booking?</DialogTitle>
                <DialogDescription>
                  {cancelDetails.hasPayments
                    ? "Process a refund for this cancellation. Partial refunds are allowed. The flat will only be unassigned when the full amount is refunded."
                    : "By confirming this cancellation, the assigned flat will be unassigned from the customer."
                  }
                </DialogDescription>
              </DialogHeader>
              <CancelAgeingContent
                cancelDetails={cancelDetails}
                refundAmount={refundAmount}
                setRefundAmount={setRefundAmount}
                refundDate={refundDate}
                setRefundDate={setRefundDate}
                refundTransactionId={refundTransactionId}
                setRefundTransactionId={setRefundTransactionId}
                isCancelling={isCancelling}
                handleConfirmCancel={handleConfirmCancel}
                setCancelModalOpen={setCancelModalOpen}
                isDesktop={true}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Cancel Booking?</DrawerTitle>
                <DrawerDescription>
                  {cancelDetails.hasPayments
                    ? "Process a refund for this cancellation. Partial refunds are allowed. The flat will only be unassigned when the full amount is refunded."
                    : "By confirming this cancellation, the assigned flat will be unassigned from the customer."
                  }
                </DrawerDescription>
              </DrawerHeader>
              <CancelAgeingContent
                cancelDetails={cancelDetails}
                refundAmount={refundAmount}
                setRefundAmount={setRefundAmount}
                refundDate={refundDate}
                setRefundDate={setRefundDate}
                refundTransactionId={refundTransactionId}
                setRefundTransactionId={setRefundTransactionId}
                isCancelling={isCancelling}
                handleConfirmCancel={handleConfirmCancel}
                setCancelModalOpen={setCancelModalOpen}
                isDesktop={false}
              />
            </DrawerContent>
          </Drawer>
        )
      }

    </>
  );
};

function CancelAgeingContent({
  cancelDetails,
  refundAmount,
  setRefundAmount,
  refundDate,
  setRefundDate,
  refundTransactionId,
  setRefundTransactionId,
  isCancelling,
  handleConfirmCancel,
  setCancelModalOpen,
  isDesktop
}) {
  return (
    <div className={isDesktop ? "" : "px-4"}>
      {cancelDetails.hasPayments && (
        <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Refund Details</Label>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center bg-white p-2 rounded-md border border-gray-100">
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Total Paid</p>
              <p className="text-sm font-semibold text-gray-900">₹{cancelDetails.totalPaid?.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Refunded</p>
              <p className="text-sm font-semibold text-green-600">₹{cancelDetails.totalRefunded?.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Remaining</p>
              <p className="text-sm font-semibold text-red-600">₹{cancelDetails.remainingBalance?.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div>
            <Label>Refund Amount <span className="text-red-500">*</span> (Max: ₹{cancelDetails.remainingBalance})</Label>
            <Input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="0.00"
              max={cancelDetails.remainingBalance}
              className="bg-white mt-1.5"
            />
          </div>
          <div>
            <CustomDateFilter
              label="Refund Date"
              selected={refundDate}
              onChange={setRefundDate}
              maxDateToday={true}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Transaction ID <span className="text-red-500">*</span></Label>
            <Input
              value={refundTransactionId}
              onChange={(e) => setRefundTransactionId(e.target.value)}
              placeholder="Enter Transaction ID"
              className="bg-white mt-1.5"
            />
          </div>
        </div>
      )}

      {!isDesktop && (
        <DrawerFooter className="pt-2 px-0">
          <Button onClick={handleConfirmCancel} disabled={isCancelling} className="bg-red-600 hover:bg-red-700 text-white w-full">
            {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      )}

      {isDesktop && (
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmCancel}
            disabled={isCancelling}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
          </Button>
        </div>
      )}
    </div>
  )
}


function UpdateModalHeaderContent({ currentStep, setCurrentStep, loanStatus, bankName, agentName, agentNumber, loanAmount, setUpdateModalOpen, isDesktop }) {
  // Check if bank details are complete
  const hasBankDetails = () => {
    const hasValidBankName = bankName && bankName.trim() !== '';
    const hasValidAgentName = agentName && agentName.trim() !== '';
    const hasValidAgentNumber = agentNumber && /^\d{10}$/.test(agentNumber.trim());
    const hasValidLoanAmount = loanAmount && parseFloat(loanAmount.toString().replace(/,/g, '')) > 0;
    return hasValidBankName && hasValidAgentName && hasValidAgentNumber && hasValidLoanAmount;
  };

  // Determine which steps are accessible based on loan status AND bank details
  const canAccessStep = (step) => {
    if (loanStatus === 'Rejected') return false;
    if (step === 3) return loanStatus === 'Approved'; // Step 3 requires Approved

    // If status is Approved, prev steps are NOT accessible
    if (loanStatus === 'Approved') return false;

    if (step === 1) return true; // Step 1 is always accessible
    // Step 2 requires Applied/Approved status AND complete bank details
    if (step === 2) return (loanStatus === 'Applied') && hasBankDetails();
    return false;
  };

  const handleStepClick = (step) => {
    if (canAccessStep(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-2">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(step => {
          const isAccessible = canAccessStep(step);
          const isCompleted = (step === 1 && (loanStatus === 'Applied' || loanStatus === 'Approved') && hasBankDetails()) ||
            (step === 2 && loanStatus === 'Approved');
          return (
            <div
              key={step}
              onClick={() => handleStepClick(step)}
              className={`h-1.5 w-8 rounded-full transition-all
                ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'} 
                ${currentStep >= step || isCompleted ? 'bg-amber-600' : 'bg-gray-200'}`}
              title={!isAccessible ? (step === 2 && !hasBankDetails() ? 'Complete bank details first' : 'Complete previous steps first') : `Go to Step ${step}`}
            />
          );
        })}
        <span className="text-xs text-gray-500 ml-1">Step {currentStep} of 3</span>
      </div>
    </div>
  )
}


function UpdateModalContent({
  currentStep,
  setCurrentStep,
  loanStatus,
  setLoanStatus,
  bankName,
  setBankName,
  bankList,
  errors,
  setErrors,
  agentName,
  setAgentName,
  agentNumber,
  setAgentNumber,
  loanAmount,
  setLoanAmount,
  handleUpdate,
  isLoading,
  loanApprovedAmount,
  setLoanApprovedAmount,
  customerBalancePayment,
  setCustomerBalancePayment,
  bankAgreement,
  setBankAgreement,
  disbursement,
  setDisbursement,
  registrationStatus,
  setRegistrationStatus,
  isDesktop
}) {
  return (
    <div className={isDesktop ? "" : "px-4 pb-4 overflow-y-auto max-h-[80vh]"}>
      {/* Step 1: Application */}
      {currentStep === 1 && (
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-gray-700">Application Status</Label>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              {['NotApplied', 'Applied'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setLoanStatus(s);
                    if (s === 'NotApplied') {
                      setBankName('');
                      setAgentName('');
                      setAgentNumber('');
                      setLoanAmount('');
                      if (setErrors) setErrors({});
                    }
                  }}
                  className={`py-2 px-3 rounded-md text-sm font-medium border-2 transition-all ${(s === loanStatus) || (s === 'Applied' && loanStatus === 'Approved')
                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                    : 'border-gray-100 bg-gray-50'
                    }`}>
                  {s === 'NotApplied' ? 'Not Applied' : 'Applied'}
                </button>
              ))}
            </div>
          </div>

          {(loanStatus === 'Applied' || loanStatus === 'Approved') && (
            <>
              <div>
                <Label>Bank Name <span className="text-red-500">*</span></Label>
                <Select value={bankName} onValueChange={(v) => { setBankName(v); if (errors.bankName) setErrors({ ...errors, bankName: '' }) }}>
                  <SelectTrigger className={errors.bankName ? 'border-red-500' : ''}><SelectValue placeholder="Select Bank" /></SelectTrigger>
                  <SelectContent className="max-h-[200px] z-[9999]">{bankList.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
              </div>
              <div>
                <Label>Agent Name <span className="text-red-500">*</span></Label>
                <Input value={agentName} onChange={e => setAgentName(e.target.value)} className={errors.agentName ? 'border-red-500' : ''} />
                {errors.agentName && <p className="text-red-500 text-xs mt-1">{errors.agentName}</p>}
              </div>
              <div>
                <Label>Agent Phone <span className="text-red-500">*</span></Label>
                <Input value={agentNumber} onChange={e => setAgentNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} maxLength={10} className={errors.agentNumber ? 'border-red-500' : ''} />
                {errors.agentNumber && <p className="text-red-500 text-xs mt-1">{errors.agentNumber}</p>}
              </div>
              <div>
                <Label>Loan Amount <span className="text-red-500">*</span></Label>
                <Input
                  value={loanAmount}
                  onChange={e => {
                    // Remove non-digits, format with Indian locale
                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                    const formatted = rawValue ? Number(rawValue).toLocaleString('en-IN') : '';
                    setLoanAmount(formatted);
                  }}
                  placeholder="0"
                  className={errors.loanAmount ? 'border-red-500' : ''}
                />
                {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
              </div>
            </>
          )}
          <div className="flex justify-end pt-4">
            <Button onClick={() => handleUpdate()} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
              {isLoading ? 'Saving...' : (loanStatus === 'Approved' ? 'Update Application' : 'Submit Application')}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Approval */}
      {currentStep === 2 && (
        <div className="space-y-5 mt-2">
          <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2 border border-gray-100">
            <div className="flex justify-between"><span className="text-gray-500">Bank:</span> <span className="font-medium">{bankName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Agent:</span> <span className="font-medium">{agentName} ({agentNumber})</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Requested Amount:</span> <span className="font-medium">{loanAmount}</span></div>
          </div>

          {/* Initial State - Show Reapply and Approve buttons */}
          {loanStatus !== 'Approved' && loanStatus !== 'showReapplyConfirm' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setLoanStatus('showReapplyConfirm')}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                >
                  Reapply Loan
                </Button>
                <Button onClick={() => setLoanStatus('Approved')} className="bg-green-600 hover:bg-green-700 text-white">
                  Approve Application
                </Button>
              </div>
              <div className="mt-2 text-center">
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-gray-500 hover:text-gray-700">
                  ← Back to Application
                </Button>
              </div>
            </>
          )}

          {/* Reapply Confirmation */}
          {loanStatus === 'showReapplyConfirm' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 text-center">
                <p className="text-sm text-orange-700 font-medium">
                  With this, you are going to reapply the loan.
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  This will reset the loan status and clear all bank details.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setLoanStatus('Applied')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdate('Reapply')}
                  disabled={isLoading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? 'Processing...' : 'Confirm Reapply'}
                </Button>
              </div>
            </div>
          )}

          {/* Approved - Show optional amount input and submit */}
          {loanStatus === 'Approved' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <Label>Approved Loan Amount <span className="text-gray-400 text-xs">(Optional)</span></Label>
                <Input
                  value={loanApprovedAmount}
                  onChange={e => {
                    // Remove non-digits, format with Indian locale
                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                    const formatted = rawValue ? Number(rawValue).toLocaleString('en-IN') : '';
                    setLoanApprovedAmount(formatted);
                  }}
                  placeholder="Enter amount (optional)"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setLoanStatus('Applied')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdate('Approved')}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? 'Processing...' : 'Submit'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Post-Approval */}
      {currentStep === 3 && (
        <div className="space-y-4 mt-2">
          <div>
            <Label>Customer Balance Payment</Label>
            <Input value={customerBalancePayment} readOnly onChange={e => setCustomerBalancePayment(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Label>Bank Agreement Signed?</Label>
            <div className="flex gap-3 mt-1.5">
              {['Yes', 'No'].map(opt => (
                <button key={opt} onClick={() => setBankAgreement(opt)} className={`flex-1 py-2 rounded-md border text-sm font-medium ${bankAgreement === opt ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200'}`}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <Label>Disbursement Completed?</Label>
            <div className="flex gap-3 mt-1.5">
              {['Yes', 'No'].map(opt => (
                <button key={opt} onClick={() => setDisbursement(opt)} className={`flex-1 py-2 rounded-md border text-sm font-medium ${disbursement === opt ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200'}`}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <Label>Registration Status</Label>
            <div className="flex gap-3 mt-1.5">
              {['Registered', 'NotRegistered'].map(opt => {
                const balanceValue = parseFloat(customerBalancePayment?.toString().replace(/,/g, '') || '0');
                const isBalanceZero = balanceValue === 0;

                return (
                  <button
                    key={opt}
                    onClick={() => setRegistrationStatus(opt)}
                    disabled={!isBalanceZero}
                    className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors
                    ${!isBalanceZero ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200' :
                        registrationStatus === opt
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {opt === 'NotRegistered' ? 'Pending' : 'Done'}
                  </button>
                )
              })}
            </div>
            {parseFloat(customerBalancePayment?.toString().replace(/,/g, '') || '0') > 0 && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-amber-600"></span>
                Clear customer balance to update registration status
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            {loanStatus !== 'Approved' && (
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="border-gray-200">
                Back
              </Button>
            )}
            <Button onClick={() => handleUpdate()} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
              {isLoading ? 'Saving...' : 'Save & Close'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ageingrecorddetails;
