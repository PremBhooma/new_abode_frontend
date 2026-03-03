import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { Pagination, Select } from '@nayeshdaggula/tailify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Errorpanel from '../shared/Errorpanel';
import TableLoadingEffect from '../shared/Tableloadingeffect';
import Dashboardapi from '../api/Dashboardapi';

function Searchresults() {
  const [sections, setSections] = useState({
    employees: {
      data: [],
      // page: 1,
      // limit: '10',
      // totalPages: 0,
      visibleColumns: { uuid: true, name: true, email: true, role_name: true },
      showColumnToggle: false,
    },
    customers: {
      data: [],
      // page: 1,
      // limit: '10',
      // totalPages: 0,
      visibleColumns: { uuid: true, first_name: true, last_name: true, email: true },
      showColumnToggle: false,
    },
    flats: {
      data: [],
      // page: 1,
      // limit: '10',
      // totalPages: 0,
      visibleColumns: { uuid: true, flat_no: true, description: true, block_name: true, first_name: true, last_name: true },
      showColumnToggle: false,
    },
    payments: {
      data: [],
      // page: 1,
      // limit: '10',
      // totalPages: 0,
      visibleColumns: { uuid: true, amount: true, paymentMethod: true, flat_no: true, block_name: true, customer_name: true, transaction_id: true },
      showColumnToggle: false,
    },
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  }


  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(() => {
      handleSearch(query);
    }, 400)
  }
  const containerRefs = {
    employees: useRef(null),
    customers: useRef(null),
    flats: useRef(null),
    payments: useRef(null),
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(containerRefs).forEach((section) => {
        if (containerRefs[section].current && !containerRefs[section].current.contains(event.target)) {
          setSections((prev) => ({
            ...prev,
            [section]: { ...prev[section], showColumnToggle: false },
          }));
        }
      });
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function fetchSearchResults(section, newSearchQuery) {
    setIsLoading(true);
    try {
      const response = await Dashboardapi.get('search', {
        params: {
          searchQuery: newSearchQuery,
          // page: newPage,
          // limit: newLimit,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      if (data.status === 'error') {
        setErrorMessage({ message: data.message });
        setIsLoading(false);
        return;
      }
      setSections((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          data: data[section] || [],
          // totalPages: data.totalpages || 0,
        },
      }));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMessage({ message: error.message, server_res: error.response?.data });
      setIsLoading(false);
    }
  }

  const handlePageChange = useCallback(
    (section) => (value) => {
      setSections((prev) => ({
        ...prev,
        [section]: { ...prev[section], page: value },
      }));
      fetchSearchResults(section, value, sections[section].limit, searchQuery);
    },
    [searchQuery]
  );

  const updateLimit = useCallback(
    (section) => (data) => {
      setSections((prev) => ({
        ...prev,
        [section]: { ...prev[section], limit: data, page: 1 },
      }));
      fetchSearchResults(section, 1, data, searchQuery);
    },
    [searchQuery]
  );

  useEffect(() => {
    if (!searchQuery) {
      setSections({
        employees: { data: [], totalPages: 0, visibleColumns: sections.employees.visibleColumns, showColumnToggle: false },
        customers: { data: [], totalPages: 0, visibleColumns: sections.customers.visibleColumns, showColumnToggle: false },
        flats: { data: [], totalPages: 0, visibleColumns: sections.flats.visibleColumns, showColumnToggle: false },
        payments: { data: [], totalPages: 0, visibleColumns: sections.payments.visibleColumns, showColumnToggle: false },
      });
      setIsLoading(false);
      setErrorMessage('');
      return;
    }
    Object.keys(sections).forEach((section) => {
      fetchSearchResults(section, searchQuery);
    });
  }, [searchQuery]);

  const renderSection = (section, title, columns) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[18px] font-semibold text-[#2B2B2B]">{title}</p>
        <div className="flex items-center gap-2">
          {/* <div className="w-[50px]">
            <Select
              data={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '30', label: '30' },
                { value: '40', label: '40' },
                { value: '50', label: '50' },
              ]}
              placeholder="10"
              value={sections[section].limit}
              onChange={updateLimit(section)}
              selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-2 !bg-white !rounded-md !shadow-none !border !border-[#ebecef]"
              className="!m-0 !p-0 !border-0"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
            />
          </div> */}
          <div ref={containerRefs[section]} className="relative">
            <button
              onClick={() =>
                setSections((prev) => ({
                  ...prev,
                  [section]: { ...prev[section], showColumnToggle: !prev[section].showColumnToggle },
                }))
              }
              className="cursor-pointer flex items-center gap-1 px-2 py-2 text-sm border border-[#ebecef] rounded-sm bg-white hover:bg-gray-50"
            >
              ⚙️ Columns
            </button>
            {sections[section].showColumnToggle && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#ebecef] rounded-md shadow z-50">
                <div className="p-2">
                  {Object.keys(sections[section].visibleColumns).map((colKey) => (
                    <label key={colKey} className="flex items-center gap-2 py-1 text-sm cursor-pointer capitalize">
                      <input
                        type="checkbox"
                        checked={sections[section].visibleColumns[colKey]}
                        onChange={() =>
                          setSections((prev) => ({
                            ...prev,
                            [section]: {
                              ...prev[section],
                              visibleColumns: {
                                ...prev[section].visibleColumns,
                                [colKey]: !prev[section].visibleColumns[colKey],
                              },
                            },
                          }))
                        }
                      />
                      {colKey.replace('_', ' ')}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md">
        <table className="w-full table-fixed text-left border-collapse">
          <thead className="border-b-[0.6px] border-b-[#ebecef] bg-white">
            <tr className="w-full">
              {columns.uuid && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[150px] sticky left-0 z-20 bg-white border-r border-[#ebecef]">
                  Ref ID
                </th>
              )}
              {columns.name && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[160px]">
                  Name
                </th>
              )}
              {columns.first_name && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[160px]">
                  First Name
                </th>
              )}
              {columns.last_name && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[160px]">
                  Last Name
                </th>
              )}
              {columns.email && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[180px]">
                  Email
                </th>
              )}
              {columns.role_name && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[140px]">
                  Role
                </th>
              )}
              {columns.flat_no && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[140px]">
                  Flat No
                </th>
              )}
              {columns.description && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[180px]">
                  Description
                </th>
              )}
              {columns.block_name && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[140px]">
                  Block Name
                </th>
              )}
              {columns.amount && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[120px]">
                  Amount
                </th>
              )}
              {columns.paymentMethod && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[120px]">
                  Payment Method
                </th>
              )}
              {columns.customer_name && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[160px]">
                  Customer Name
                </th>
              )}
              {columns.transaction_id && (
                <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[150px]">
                  Transaction ID
                </th>
              )}
              <th className="px-4 py-3 text-[#2B2B2B] text-[14px] font-[500] leading-[18px] w-[120px] sticky right-0 z-20 bg-white border-l border-[#ebecef]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableLoadingEffect colspan={Object.keys(columns).length + 1} tr={10} />
            ) : sections[section].data.length > 0 ? (
              sections[section].data.map((item, index) => (
                <tr key={index} className="border-b-[0.6px] border-b-[#ebecef] align-top bg-white">
                  {columns.uuid && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[150px] sticky left-0 z-10 bg-white border-r border-[#ebecef]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.uuid}</p>
                    </td>
                  )}
                  {columns.name && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.name || 'N/A'}</p>
                    </td>
                  )}
                  {columns.first_name && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.first_name || 'N/A'}</p>
                    </td>
                  )}
                  {columns.last_name && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.last_name || 'N/A'}</p>
                    </td>
                  )}
                  {columns.email && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.email || 'No email'}</p>
                    </td>
                  )}
                  {columns.role_name && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                      <p className="text-[#4b5563] text-[12px] font-[500] leading-[18px]">{item.role_name || 'N/A'}</p>
                    </td>
                  )}
                  {columns.flat_no && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.flat_no || 'N/A'}</p>
                    </td>
                  )}
                  {columns.description && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.description || 'No description'}</p>
                    </td>
                  )}
                  {columns.block_name && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.block_name || 'N/A'}</p>
                    </td>
                  )}
                  {columns.amount && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[120px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.amount || 'N/A'}</p>
                    </td>
                  )}
                  {columns.paymentMethod && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[120px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.paymentMethod || 'N/A'}</p>
                    </td>
                  )}
                  {columns.customer_name && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.customer_name || 'N/A'}</p>
                    </td>
                  )}
                  {columns.transaction_id && (
                    <td className="px-4 py-3 whitespace-normal break-words w-[150px]">
                      <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">{item.transaction_id || 'N/A'}</p>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white border-l border-[#ebecef]">
                    <div className="flex flex-row items-center gap-1.5 justify-center">
                      <div
                        onClick={() => {
                          const route =
                            section === 'employees'
                              ? `/single-employee-view/${item.id}`
                              : section === 'customers'
                                ? `/customers/${item.uuid}`
                                : section === 'flats'
                                  ? `/flats/view-flat/${item.uuid}`
                                  : `/singlepaymentview/${item.uuid}`;
                          // window.location.href = route;
                          navigate(route);
                        }}
                        className="cursor-pointer"
                      >
                        <IconEye size={20} color="#4b5563" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Object.keys(columns).length + 1} className="text-center py-4">
                  <p className="text-[#4A4D53CC] text-[14px] not-italic font-[400] leading-[18px]">No results found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* {sections[section].data.length > 0 && (
        <div className="flex flex-row-reverse mt-4">
          <Pagination
            totalpages={sections[section].totalPages}
            value={sections[section].page}
            siblings={1}
            onChange={handlePageChange(section)}
            color="#0083bf"
          />
        </div>
      )} */}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Search Input Section */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <IconSearch className="text-neutral-400" size={24} />
          </div>
          <input
            type="text"
            ref={searchRef}
            placeholder="Search employees, customers, flats..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-full shadow-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0083bf]/20 focus:border-[#0083bf] transition-all"
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="flex flex-col gap-6">
        {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

        {!searchQuery ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <IconSearch size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Start typing to search...</p>
          </div>
        ) : (
          <>
            {renderSection('employees', 'Employees', sections.employees.visibleColumns)}
            {renderSection('customers', 'Customers', sections.customers.visibleColumns)}
            {renderSection('flats', 'Flats', sections.flats.visibleColumns)}
            {renderSection('payments', 'Payments', sections.payments.visibleColumns)}
          </>
        )}
      </div>
    </div>
  );
}

export default Searchresults;