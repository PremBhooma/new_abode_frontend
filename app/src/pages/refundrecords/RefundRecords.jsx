import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Pagination, Select } from "@nayeshdaggula/tailify";
import { IconSearch, IconDownload } from "@tabler/icons-react";
import Ageingrecordapi from '../../components/api/Ageingrecordapi';
import Errorpanel from '../../components/shared/Errorpanel';
import { useEmployeeDetails } from '../../components/zustand/useEmployeeDetails';
import { Skeleton } from "@/components/ui/skeleton";

const formatDateLocally = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatAmountLocally = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

function RefundRecords() {
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

      const response = await Ageingrecordapi.get('get-refund-records', { params });

      if (response.data.status === 'success') {
        setRecords(response.data.records || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalRecords(response.data.totalRecords || 0);
      } else {
        setErrorMessage({ message: response.data.message || "Failed to fetch refund records" });
      }
    } catch (error) {
      console.error("Error fetching refund records:", error);
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

  const handleDownloadExcel = async () => {
    try {
      const response = await Ageingrecordapi.get('get-refund-records-excel', {
        params: { searchQuery },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'RefundRecords.xlsx');
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
        <p className="text-[22px] font-semibold">Refund Reports</p>
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
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[170px] sticky left-0 z-20 bg-gray-50 border-b border-r border-neutral-200">Customer</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[180px] border-b border-r border-neutral-200">Flat Details</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[110px] border-b border-r border-neutral-200">Refund Amount</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[120px] border-b border-r border-neutral-200">Refund Date</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[150px] border-b border-r border-neutral-200">Transaction ID</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[140px] border-b border-r border-neutral-200">Refund Status</th>
                <th className="px-3 py-2 text-neutral-700 uppercase tracking-wider text-[12px] font-bold w-[100px] border-b border-r border-neutral-200">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="animate-pulse border-b border-neutral-200">
                    <td className="px-3 py-2 border-r border-neutral-200 sticky left-0 z-10 bg-white">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-2 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-200">
                      <div className="flex items-center gap-2">
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-2 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-20" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-20" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-24" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-5 w-24 rounded-full" /></td>
                    <td className="px-3 py-2 border-r border-neutral-200"><Skeleton className="h-3 w-20" /></td>
                  </tr>
                ))
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50 transition-colors duration-150 align-center group ">
                    {/* Customer */}
                    <td className="px-3 py-2 whitespace-normal break-words sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-b border-r border-neutral-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {record.customer?.first_name?.[0]}{record.customer?.last_name?.[0] || ''}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 text-xs leading-[18px] truncate">
                            {record.customer?.first_name} {record.customer?.last_name}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">
                            +{record.customer?.phone_code} {record.customer?.phone_number}
                          </p>
                        </div>
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

                    {/* Refund Amount */}
                    <td className="px-3 py-2 font-semibold text-neutral-900 text-xs leading-[18px] border-b border-r border-neutral-200">
                      {formatAmountLocally(record.refund_amount)}
                    </td>

                    {/* Refund Date */}
                    <td className="px-3 py-2 text-neutral-500 text-xs font-medium leading-[18px] border-b border-r border-neutral-200">
                      {formatDateLocally(record.refund_date)}
                    </td>

                    {/* Transaction ID */}
                    <td className="px-3 py-2 text-neutral-700 text-xs font-medium leading-[18px] border-b border-r border-neutral-200 truncate">
                      {record.refund_transactionid || '-'}
                    </td>

                    {/* Refund Status */}
                    <td className="px-3 py-2 border-b border-r border-neutral-200">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${record.refund_status ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                        {record.refund_status ? 'Full Refund' : 'Partial Refund'}
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="px-3 py-2 text-neutral-500 text-xs font-medium leading-[18px] border-b border-r border-neutral-200">
                      {formatDateLocally(record.created_at)}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500 sticky left-0 right-0 border-b border-neutral-200">No refund records found</td>
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
    </div>
  )
}

export default RefundRecords;