import React, { useState, useEffect } from 'react';
import { IconSearch, IconUser, IconHome, IconChevronRight, IconArrowLeft } from "@tabler/icons-react";
import Generalapi from '../../components/api/Generalapi';
import Errorpanel from '../../components/shared/Errorpanel';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'react-toastify';
import RedemptionWrapper from '../../components/rewards/RedemptionWrapper';
import { Button } from '../../components/ui/button';

function Rewards() {
  const [searchType, setSearchType] = useState('flatNo');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [rewardStatus, setRewardStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchQuery('');
    setResults([]);
    setShowDropdown(false);
    setSelectedFlat(null);
  };

  const updateSearchQuery = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      setShowDropdown(true);
      debouncedSearch(query);
    } else {
      setShowDropdown(false);
      setResults([]);
    }
  };

  // Simple debounce implementation
  const [debounceTimer, setDebounceTimer] = useState(null);
  const debouncedSearch = (query) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      getFlatsData(query);
    }, 500);
    setDebounceTimer(timer);
  };

  const getFlatsData = async (query) => {
    setLoading(true);
    try {
      const params = searchType === 'flatNo' ? { flat_no: query } : { searchQuery: query };
      const response = await Generalapi.get('/search-sold-flats-with-advance', { params });

      if (response.data.status === "success") {
        setResults(response.data.data || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search Error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlat = async (flat) => {
    setSelectedFlat(flat);
    setSearchQuery(flat.label);
    setShowDropdown(false);
    setRewardStatus(null);

    // Check if there's an existing reward session for this flat
    if (flat.flat_reward) {
      setCheckingStatus(true);
      try {
        const response = await Generalapi.get('/get-reward-status', {
          params: { flat_id: flat.id, customer_id: flat.customer_id }
        });
        if (response.data.status === "success" && response.data.data) {
          setRewardStatus(response.data.data);
        }
      } catch (error) {
        console.error("Error checking reward status:", error);
      } finally {
        setCheckingStatus(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedFlat(null);
    setSearchQuery('');
    setIsRedeeming(false);
    setRewardStatus(null);
  };

  const handleVerificationSuccess = (data) => {
    setRewardStatus(data);
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-50">
      {!isRedeeming ? (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rewards Redemption</h1>
            <p className="text-gray-500 text-sm font-medium">Verify eligibility and unlock delightful rewards for your customers.</p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Search Eligible Sold Flats</label>
              <div className="flex gap-4 p-1.5 bg-gray-50 rounded-2xl w-fit">
                <button
                  onClick={() => handleSearchTypeChange({ target: { value: 'flatNo' } })}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${searchType === 'flatNo' ? 'bg-white text-[#0083bf] shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  By Flat No
                </button>
                <button
                  onClick={() => handleSearchTypeChange({ target: { value: 'customer' } })}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${searchType === 'customer' ? 'bg-white text-[#0083bf] shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  By Customer
                </button>
              </div>
            </div>

            <div className="relative flex flex-col gap-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconSearch className="h-5 w-5 text-gray-300 group-focus-within:text-[#0083bf] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={searchType === 'flatNo' ? 'Enter Flat No (e.g. A-101)' : 'Name, Email or Phone'}
                  value={searchQuery}
                  onChange={updateSearchQuery}
                  className="block w-full pl-12 pr-4 h-14 bg-gray-50 border-2 border-transparent rounded-[20px] text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0083bf] focus:ring-4 focus:ring-[#0083bf]/10 transition-all shadow-sm"
                />
              </div>

              {showDropdown && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-white border border-gray-100 rounded-[24px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] max-h-72 overflow-y-auto divide-y divide-gray-50 p-2">
                    {loading ? (
                      <div className="p-4 flex flex-col gap-2">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    ) : results.length > 0 ? (
                      results.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectFlat(item)}
                          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-all group text-left"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <span className="text-base font-bold text-gray-900 leading-none">{item.flat_no}</span>
                              <span className="text-[10px] font-black uppercase tracking-tighter text-[#0083bf] bg-blue-50 px-2 py-1 rounded-lg">
                                {item.project_name}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1.5">
                              <IconUser size={14} className="text-gray-300" />
                              {item.customer_name}
                            </span>
                          </div>
                          <IconChevronRight className="h-5 w-5 text-gray-100 group-hover:text-[#0083bf] group-hover:translate-x-1 transition-all" />
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm font-medium text-gray-400">No eligible sold flats found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedFlat && (
              <div className="flex flex-col gap-6 mt-4">
                <div className="p-6 bg-[#0083bf]/5 rounded-3xl border border-[#0083bf]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in zoom-in-95 duration-500">
                  <div className="flex items-start gap-5">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-[#0083bf] shrink-0">
                      <IconHome size={28} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-black text-gray-900 leading-none flex items-center gap-3">
                        {selectedFlat.flat_no}
                        <span className="text-[10px] font-black tracking-widest uppercase bg-[#0083bf] text-white px-3 py-1 rounded-full">
                          {selectedFlat.project_name}
                        </span>
                      </h3>
                      <p className="text-sm font-bold text-gray-500 mt-2">
                        Customer: <span className="text-gray-900">{selectedFlat.customer_name}</span>
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-black text-[#0083bf] uppercase tracking-wider">Eligible for Redemption</span>
                      </div>
                    </div>
                  </div>
                  {selectedFlat.flat_reward ? (
                    checkingStatus ? (
                      <Skeleton className="h-14 w-48 rounded-2xl" />
                    ) : (
                      <Button
                        onClick={() => setIsRedeeming(true)}
                        className="h-14 px-10 bg-[#0083bf] hover:bg-[#006e9f] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all"
                      >
                        {rewardStatus?.rewards_step >= 4 ? 'Continue Redemption' : 'Start Redemption Flow'}
                      </Button>
                    )
                  ) : (
                    <div className="flex items-center gap-3 px-6 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold text-amber-700">
                        The reward has not been allocated for this flat.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Hide cancel button on step 4 (Verification Complete) and step 5 (Gift Revealed) */}
          {!(rewardStatus?.rewards_step >= 4) && (
            <button
              onClick={() => setIsRedeeming(false)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors w-fit"
            >
              <IconArrowLeft size={18} /> Cancel and change flat
            </button>
          )}
          <RedemptionWrapper
            selectedFlat={selectedFlat}
            onReset={handleReset}
            existingRewardData={rewardStatus}
            onVerified={handleVerificationSuccess}
          />
        </div>
      )}

      {errorMessage && (
        <Errorpanel errorMessages={{ message: errorMessage }} setErrorMessages={() => setErrorMessage("")} />
      )}
    </div>
  );
}

export default Rewards;
