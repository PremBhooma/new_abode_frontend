import React, { useEffect, useState } from 'react';
import { IconEye, IconClock } from '@tabler/icons-react';
import Ageingrecordapi from '../api/Ageingrecordapi';
import Ageingrecorddetails from './Ageingrecorddetails';
import { Link } from 'react-router';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { Skeleton } from "@/components/ui/skeleton";

const Ageingrecord = () => {
  const permissions = useEmployeeDetails((state) => state.permissions);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchAgeingRecords();
  }, []);

  const fetchAgeingRecords = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError('');
    try {
      const response = await Ageingrecordapi.get('get-dashboard-ageing-records');
      if (response.data.status === 'success') {
        setRecords(response.data.records || []);
      } else {
        setError(response.data.message || 'Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching ageing records:', err);
      setError(err.message || 'Failed to fetch ageing records');
    } finally {
      setIsLoading(false);
    }
  };

  const openRecordDetails = (record) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleDrawerClose = (isOpen) => {
    setDrawerOpen(isOpen);
    if (!isOpen) {
      setSelectedRecord(null);
    }
  };

  const handleRefresh = () => {
    fetchAgeingRecords();
    setDrawerOpen(false);
    setSelectedRecord(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="p-6 space-y-4">
          {/* Table Header Skeleton */}
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-8 w-full" />
          </div>
          {/* Table Rows Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-3 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <IconClock className="text-amber-600" size={18} />
            <Link to="/ageing-records" className="hover:text-amber-600 transition-colors">
              Sales Reports
            </Link>
          </h4>
          <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
            {records.length} Records
          </span>
        </div>

        {error && (
          <div className="px-3 py-3 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {records.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                <tr>
                  <th className="px-3 py-2 w-[17%]">Customer</th>
                  <th className="px-3 py-2 w-[16%]">Flat Details</th>
                  <th className="px-3 py-2 w-[12%]">Booking Date</th>
                  <th className="px-3 py-2 w-[5%]">Ageing</th>
                  <th className="px-3 py-2 w-[13%]">Total Payment</th>
                  <th className="px-3 py-2 w-[14%]">Loan Status</th>
                  <th className="px-3 py-2 w-[15%]">Reg. Status</th>
                  {permissions?.ageing_page?.includes("view_ageing_details") && (
                    <th className="px-3 py-2 w-[6%] text-center">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {records.slice(0, 10).map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {record.customer?.first_name?.[0]}{record.customer?.last_name?.[0] || ''}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 text-xs break-words">
                            {record.customer?.first_name} {record.customer?.last_name}
                          </p>
                          <p className="text-[11px] text-neutral-500 break-words">
                            +{record.customer?.phone_code} {record.customer?.phone_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold border border-purple-100 flex-shrink-0">
                          {record.flat?.flat_no || '-'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 text-xs break-words">
                            {record.project?.project_name || '-'}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {record.flat?.block_name || 'N/A'} • Floor {record.flat?.floor_no || '-'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2 text-neutral-500 text-xs whitespace-nowrap">
                      {formatDate(record.booking_date)}
                    </td>
                    <td className="px-3 py-2 text-neutral-500 text-xs whitespace-nowrap">
                      {record.ageing_days}
                    </td>
                    <td className="px-3 py-2 text-neutral-700 text-xs font-medium whitespace-nowrap">
                      ₹{Number(record.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2">
                      {record.loan_time_days === true ? (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                          Loan Delayed
                        </span>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${record.loan_Status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-100' :
                          record.loan_Status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                            record.loan_Status === 'Applied' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              'bg-orange-50 text-orange-700 border border-orange-100' // Not Applied
                          }`}>
                          {record.loan_Status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${record.registration_status === 'Registered' ? 'bg-green-50 text-green-700 border border-green-100' :
                        'bg-orange-50 text-orange-700 border border-orange-100'
                        }`}>
                        {record.registration_status}
                      </span>
                    </td>
                    {permissions?.ageing_page?.includes("view_ageing_details") && (
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => openRecordDetails(record)}
                          className="p-1.5 cursor-pointer text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"
                        >
                          <IconEye size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-neutral-400 text-sm">
              No ageing records found
            </div>
          )}
        </div>
      </div>

      {/* Ageing Record Details Drawer */}
      <Ageingrecorddetails
        open={drawerOpen}
        onOpenChange={handleDrawerClose}
        recordData={selectedRecord}
        onRefresh={handleRefresh}
        onRecordUpdate={() => fetchAgeingRecords(false)}
      />
    </>
  );
};

export default Ageingrecord;
