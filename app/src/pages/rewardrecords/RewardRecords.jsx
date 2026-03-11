import React, { useCallback, useEffect, useState } from 'react';
import { Pagination, Select } from "@nayeshdaggula/tailify";
import { IconSearch, IconDownload, IconEye } from "@tabler/icons-react";
import Generalapi from '../../components/api/Generalapi';
import Errorpanel from '../../components/shared/Errorpanel';
import { useEmployeeDetails } from '../../components/zustand/useEmployeeDetails';
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/badge';
import { IconCalendar, IconUser, IconHome, IconX, IconCheck } from "@tabler/icons-react";

const formatDateLocally = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

function RewardRecords() {
  const permissions = useEmployeeDetails((state) => state.permissions);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortby, setSortby] = useState("created_at");
  const [sortbyType, setSortbyType] = useState("desc");

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchRecords = async (newPage, newLimit, newSearchQuery, newSortby, newSortbyType) => {
    setIsLoading(true);
    try {
      const params = {
        page: newPage,
        limit: newLimit,
        searchQuery: newSearchQuery,
        sortby: newSortby,
        sortbyType: newSortbyType
      };

      const response = await Generalapi.get('get-reward-records', { params });

      if (response.data.status === 'success') {
        setRecords(response.data.records || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalRecords(response.data.totalRecords || 0);
      } else {
        setErrorMessage({ message: response.data.message || "Failed to fetch reward records" });
      }
    } catch (error) {
      console.error("Error fetching reward records:", error);
      setErrorMessage({ message: error.message || "Internal server error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(page, limit, searchQuery, sortby, sortbyType);
  }, [page, limit, searchQuery, sortby, sortbyType]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const updateSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const openDrawer = (record) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecord(null);
  };

  const handleUpdateReceivedStatus = async (status) => {
    if (!selectedRecord) return;
    setIsUpdatingStatus(true);
    try {
      const response = await Generalapi.post('update-reward-received-status', {
        reward_id: selectedRecord.id,
        received_reward: status
      });

      if (response.data.status === 'success') {
        toast.success(`Reward status updated to ${status ? 'Received' : 'Not Received'}`);
        // Update local record state
        const updatedRecord = {
          ...selectedRecord,
          received_reward: status,
          received_reward_date: status ? new Date().toISOString() : null
        };
        setSelectedRecord(updatedRecord);
        setRecords(prev => prev.map(r => r.id === selectedRecord.id ? updatedRecord : r));
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Internal server error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await Generalapi.get('get-reward-records-excel', {
        params: { searchQuery },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'RewardRecords.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading excel:", error);
      setErrorMessage({ message: "Failed to download Excel file" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[22px] font-semibold">Reward Reports</p>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
        >
          <IconDownload size={18} />
          Export to Excel
        </button>
      </div>

      {/* Filters Panel */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
        <div className="flex justify-between items-center">
          {/* Search */}
          <div>
            <div className="rounded-md relative">
              <input
                type="text"
                placeholder="Search..."
                className="focus:outline-none text-[14px] pl-6 py-1.5"
                onChange={updateSearchQuery}
                value={searchQuery}
              />
              <div className="absolute left-0 top-2 px-1">
                <IconSearch size={16} color="#ebecef" />
              </div>
            </div>
          </div>

          {/* Limit Selector */}
          <div className="w-[50px]">
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
              selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[7px] !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
              className="!m-0 !p-0 !border-0"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg z-0 min-h-[400px]">
          <table className="w-full table-fixed text-left border-collapse">
            <thead className="bg-gray-50 border-b border-neutral-200">
              <tr>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[140px] border-b border-r border-neutral-200">Employee</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[140px] border-b border-r border-neutral-200">Customer</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[160px] border-b border-r border-neutral-200">Flat Details</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[100px] border-b border-r border-neutral-200">Coupon ID</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[140px] border-b border-r border-neutral-200">Gift Name</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[140px] border-b border-r border-neutral-200">Reward Received</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[80px] border-b border-neutral-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="animate-pulse border-b border-neutral-200">
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-32" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-32" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-2 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-20" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-40" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-20" /></td>
                    <td className="px-3 py-2 text-center"><Skeleton className="h-6 w-6 rounded-full mx-auto" /></td>
                  </tr>
                ))
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50 transition-colors duration-150 align-center group">
                    {/* Employee */}
                    <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 text-xs leading-[18px] truncate">
                          {record.employee?.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {record.employee?.phone_number}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 text-xs leading-[18px] truncate">
                          {record.customer?.first_name} {record.customer?.last_name}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {record.customer?.phone_number}
                        </p>
                      </div>
                    </td>

                    {/* Flat Details */}
                    <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold border border-purple-100 flex-shrink-0">
                          {record.flat?.flat_no || '-'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 text-xs leading-[18px] truncate">
                            {record.project?.project_name || '-'}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {record.flat?.block?.block_name || 'N/A'} • Floor {record.flat?.floor_no || '-'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Coupon ID */}
                    <td className="px-3 py-2 text-neutral-900 text-xs font-medium border-b border-r border-neutral-200">
                      {record.coupon_gift_id}
                    </td>

                    {/* Gift Name */}
                    <td className="px-3 py-2 whitespace-normal break-words border-b border-r border-neutral-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1 flex-shrink-0">
                          <img src={record.coupon_gift_pic_url} className="w-full h-full object-contain" alt="" crossOrigin='anonymous' />
                        </div>
                        <span className="text-neutral-900 text-xs font-semibold truncate leading-[18px]">
                          {record.coupon_name}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2 border-b border-r border-neutral-200">
                      {record.received_reward ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                          Received
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2 border-b border-neutral-200 text-center">
                      <button
                        onClick={() => openDrawer(record)}
                        className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-[#0083bf] hover:border-[#0083bf] transition-all flex items-center justify-center mx-auto"
                      >
                        <IconEye size={16} stroke={2.5} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-neutral-500 border-b border-neutral-200">No reward reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {records?.length > 0 && (
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

      {errorMessage && (
        <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
      )}

      {/* Side Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[9998]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[500px] h-screen bg-white shadow-2xl z-[9999] flex flex-col overflow-hidden border-l border-neutral-200"
            >
              {/* Drawer Header */}
              <div className="px-8 py-8 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Reward Details</h2>
                  <p className="text-sm text-gray-500">Full redemption overview</p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="w-10 h-10 rounded-2xl bg-neutral-50 hover:bg-neutral-100 text-neutral-500 transition-colors flex items-center justify-center"
                >
                  <IconX size={20} stroke={3} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Gift Card */}
                <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0083bf]/5 to-blue-50/10 border border-[#0083bf]/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0083bf] opacity-[0.03] rounded-full -mr-16 -mt-16" />
                  <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-3xl bg-white p-3 border border-neutral-100 shadow-sm flex-shrink-0">
                      <img src={selectedRecord?.coupon_gift_pic_url} className="w-full h-full object-contain" alt="" crossOrigin='anonymous' />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-lg bg-blue-100/50 text-[#0083bf] text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                        {selectedRecord?.coupon_gift_id}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedRecord?.coupon_name}</h3>
                      <p className="text-sm text-gray-400 font-medium mt-1 flex items-center gap-1">
                        <IconCalendar size={14} /> {formatDateLocally(selectedRecord?.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Customer Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-neutral-50 text-neutral-400"><IconUser size={18} stroke={2.5} /></div>
                      <h4 className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Customer Information</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                        <p className="font-semibold text-gray-900">{selectedRecord?.customer?.first_name} {selectedRecord?.customer?.last_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="font-semibold text-gray-900">{selectedRecord?.customer?.phone_number}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project/Flat Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-neutral-50 text-neutral-400"><IconHome size={18} stroke={2.5} /></div>
                      <h4 className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Flat Assignment</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Project</p>
                        <p className="font-semibold text-gray-900">{selectedRecord?.project?.project_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Flat No & Floor</p>
                        <p className="font-semibold text-gray-900">
                          {selectedRecord?.flat?.flat_no} ({selectedRecord?.flat?.floor_no} Floor)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Confirmation Section */}
                <div className="pt-4 border-t border-neutral-100 space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Gift Received Status</h4>
                    <p className="text-sm text-gray-500 font-medium">Update whether the customer has collected the gift.</p>
                  </div>

                  {selectedRecord?.received_reward ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-[24px] flex items-center gap-4 w-full">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                          <IconCheck size={24} stroke={3} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-emerald-900 uppercase tracking-wider">Confirmed Received</p>
                          <p className="text-xs text-emerald-600 font-medium">On {formatDateLocally(selectedRecord.received_reward_date)}</p>
                        </div>
                        <button
                          onClick={() => handleUpdateReceivedStatus(false)}
                          className="px-4 py-2 border-2 border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                        >
                          Undo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        disabled={isUpdatingStatus}
                        onClick={() => handleUpdateReceivedStatus(true)}
                        className="h-20 rounded-[28px] bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-100 transition-all flex flex-col items-center justify-center gap-1 group active:scale-95 disabled:opacity-50"
                      >
                        <IconCheck size={28} stroke={3} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider leading-none">Yes</span>
                      </button>
                      <button
                        disabled={isUpdatingStatus}
                        onClick={() => handleUpdateReceivedStatus(false)}
                        className="h-20 rounded-[28px] bg-neutral-50 border-2 border-neutral-100 text-neutral-400 hover:bg-neutral-100 transition-all flex flex-col items-center justify-center gap-1 group active:scale-95 disabled:opacity-50"
                      >
                        <IconX size={28} stroke={3} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider leading-none">No</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
        `}
      </style>
    </div>
  );
}

export default RewardRecords;
