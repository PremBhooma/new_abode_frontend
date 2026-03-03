
import React, { useState, useRef, useEffect } from 'react';
import { Datepicker, Select } from '@nayeshdaggula/tailify';

const Datefilter = ({ onFilterChange, onClearFilter, initialRange = 'pastMonth' }) => {
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  const selectRef = useRef(null);

  const rangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Past Week', value: 'pastWeek' },
    { label: 'Past Month', value: 'pastMonth' },
    { label: 'Past Year', value: 'pastYear' },
    { label: 'Custom Range', value: 'custom' },
  ];

  const calculateDateRange = (range) => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate;

    switch (range) {
      case 'today':
        startDate = endDate;
        break;
      case 'pastWeek':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 6);
        startDate = weekStart.toISOString().split('T')[0];
        break;
      case 'pastMonth':
        const monthStart = new Date(now);
        monthStart.setDate(now.getDate() - 29);
        startDate = monthStart.toISOString().split('T')[0];
        break;
      case 'pastYear':
        const yearStart = new Date(now);
        yearStart.setFullYear(now.getFullYear() - 1);
        startDate = yearStart.toISOString().split('T')[0];
        break;
      case 'custom':
        return {
          startDate: customRange.startDate || endDate,
          endDate: customRange.endDate || endDate,
        };
      default:
        startDate = endDate;
    }

    return { startDate, endDate };
  };

  const handleRangeChange = (value) => {
    setSelectedRange(value);
    if (value === 'custom') {
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
      setCustomRange({ startDate: '', endDate: '' });
      const dateRange = calculateDateRange(value);
      onFilterChange(dateRange);
    }
  };

  const updateStartDate = (value) => {
    setCustomRange({ ...customRange, startDate: value });
  };

  const updateEndDate = (value) => {
    setCustomRange({ ...customRange, endDate: value });
  };

  const applyCustomFilter = () => {
    if (selectedRange === 'custom' && customRange.startDate && customRange.endDate) {
      onFilterChange(customRange);
      setIsPopoverOpen(false);
    }
  };

  const handleClearFilter = () => {
    setSelectedRange('today');
    setCustomRange({ startDate: '', endDate: '' });
    setIsPopoverOpen(false);
    const todayRange = calculateDateRange('today');
    onClearFilter(todayRange);
  };

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        // Check if the click is not within a Datepicker calendar
        const isDatepickerClick = event.target.closest('.datepicker-container');
        if (!isDatepickerClick) {
          setIsPopoverOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-shrink-0 flex gap-3 relative">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="min-w-[120px]" ref={selectRef}>
          <Select
            data={rangeOptions}
            value={selectedRange}
            onChange={handleRangeChange}
            selectWrapperClass="w-full px-3 !py-[7px] !bg-transparent border border-gray-300 rounded-sm focus:border-[#044093] focus:outline-none transition-colors duration-200 text-sm !shadow-none !border !border-[#ebecef]"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto text-sm"
          />
        </div>
        {/* <button
          onClick={handleClearFilter}
          className="bg-gray-300 text-neutral-900 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm whitespace-nowrap"
        >
          Clear
        </button> */}
      </div>
      {isPopoverOpen && selectedRange === 'custom' && (
        <div
          // ref={popoverRef}
          className="absolute z-50 mt-2 top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 flex flex-col gap-3 w-[240px]"
        >
          <div className="min-w-[140px] datepicker-container">
            <Datepicker
              value={customRange.startDate}
              onChange={updateStartDate}
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 text-sm"
              placeholder="Start Date"
              calendarClassName="datepicker-container"
            />
          </div>
          <div className="min-w-[140px] datepicker-container">
            <Datepicker
              value={customRange.endDate}
              onChange={updateEndDate}
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 text-sm"
              placeholder="End Date"
              calendarClassName="datepicker-container"
            />
          </div>
          <button
            onClick={applyCustomFilter}
            className="bg-[#0083bf] text-white px-3 py-2 rounded-md hover:bg-[#006ea3] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            disabled={!customRange.startDate || !customRange.endDate}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default Datefilter;