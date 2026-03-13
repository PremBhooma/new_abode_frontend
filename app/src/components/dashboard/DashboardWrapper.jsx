import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Bar, Line } from 'react-chartjs-2';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProjectDetails } from '../zustand/useProjectDetails';
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Datepicker, Modal, Select } from '@nayeshdaggula/tailify';
import { IconCash, IconCreditCardPay, IconEye, IconIdBadge2, IconUsers, IconUsersGroup, IconClock } from '@tabler/icons-react';
import { Users, User, Home, UserCheck, UserMinus, UserX, CheckCircle, XCircle, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Filler, Tooltip, Legend } from 'chart.js';
import Flatschart from './Flatschart';
import Paymentchart from './Paymentchart';
import Customerschart from './Customerschart';
import Dashboardapi from '../api/Dashboardapi';
import AssignProject from '../shared/AssignProject';
import Ageingrecord from './Ageingrecord';
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Dataset 2',
      data: labels.map(() => faker.number.int()),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

function DashboardWrapper() {

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  const [dashboardData, setDashboardData] = useState({
    totalFlats: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    totalPayments: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    suspendedCustomers: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    suspendedEmployees: 0,
    soldFlats: 0,
    unsoldFlats: 0,
    totalLeads: 0,
    assignedLeads: 0,
    unassignedLeads: 0,
    flatsData: [],
    unsoldFlatsData: [],
    customersData: [],
    employeesData: [],
    paymentsData: [],
    leadsData: [],
    loanDelayCount: 0, // Added loanDelayCount
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const permissions = useEmployeeDetails((state) => state.permissions);

  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();
  const [projectModel, setProjectModel] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // Default to current year (2025)

  const openProjectModel = () => setProjectModel(true);
  const closeProjectModel = () => setProjectModel(false);

  useEffect(() => {
    fetchProjectData();
  }, []);

  useEffect(() => {
    if (hasFetched) {
      if (!projectData || (typeof projectData === 'object' && Object.keys(projectData).length === 0)) {
        openProjectModel();
      }
    }
  }, [hasFetched, projectData]);

  const fetchGetAllData = () => {
    setIsLoadingEffect(true);
    setErrorMessage('');
    const url = `get-dashboard-data`;

    Dashboardapi.get(url)
      .then((response) => {
        const data = response.data;

        if (data.status === 'error') {
          setErrorMessage({
            message: data.message,
            server_res: data,
          });
          setIsLoadingEffect(false);
          return;
        }

        if (data?.adobe_data) {
          const apiData = data.adobe_data;
          setDashboardData({
            totalFlats: apiData.total_flats || 0,
            totalCustomers: apiData.total_customers || 0,
            totalEmployees: apiData.total_employees || 0,
            totalPayments: apiData.total_payments || 0,
            activeCustomers: apiData.active_customers || 0,
            inactiveCustomers: apiData.inactive_customers || 0,
            suspendedCustomers: apiData.suspended_customers || 0,
            activeEmployees: apiData.active_employees || 0,
            inactiveEmployees: apiData.inactive_employees || 0,
            suspendedEmployees: apiData.suspended_employees || 0,
            soldFlats: apiData.sold_flats || 0,
            unsoldFlats: apiData.unsold_flats || 0,
            totalLeads: apiData.total_leads || 0,
            assignedLeads: apiData.assigned_leads || 0,
            unassignedLeads: apiData.unassigned_leads || 0,
            flatsData: apiData.flatsData || [],
            unsoldFlatsData: apiData.unsoldFlatsData || [],
            customersData: apiData.customersData || [],
            employeesData: apiData.employeesData || [],
            paymentsData: apiData.payment_details || [],
            leadsData: apiData.leads_details || [],
            loanDelayCount: apiData.loan_delay_count || 0, // Set loanDelayCount
          });
        }
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.log('Fetch dashboard error:', error);
        setErrorMessage({
          message: error.message,
          server_res: error.response?.data || null,
        });
        setIsLoadingEffect(false);
      });
  };

  useEffect(() => {
    fetchGetAllData();
  }, []);

  const openSingleFlatView = (id) => navigate(`/singlepaymentview/${id}`);
  const openSingleCustomer = (id) => navigate(`/customers/${id}`);
  const openSingleLead = (id) => navigate(`/lead/${id}`);
  const openSingleFlat = (id) => navigate(`/flats/view-flat/${id}`);

  // Generate years for the dropdown (2020 to 2040)
  const years = Array.from({ length: 21 }, (_, i) => 2020 + i).map(year => ({
    value: year.toString(),
    label: year.toString()
  }));

  // Process data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Payments Chart Data
  const paymentData = months.map(() => 0);
  dashboardData.paymentsData.forEach(payment => {
    // Link payment to flat's created_at or use a fallback date
    const flat = dashboardData.flatsData.find(f => f.flat_no === payment.flat_no);
    const date = new Date(flat?.created_at || '2025-08-01'); // Fallback to Aug 2025 if no flat match
    if (date.getFullYear().toString() === selectedYear) {
      const monthIndex = date.getMonth();
      paymentData[monthIndex] += payment.amount || 0;
    }
  });

  const paymentsChartData = {
    labels: months,
    datasets: [{
      label: 'Payments (₹)',
      data: paymentData,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }]
  };

  // Customers Chart Data
  const customerData = months.map(() => 0);
  dashboardData.customersData.forEach(customer => {
    const date = new Date(customer.created_at);
    if (date.getFullYear().toString() === selectedYear) {
      customerData[date.getMonth()] += 1;
    }
  });

  const customersChartData = {
    labels: months,
    datasets: [{
      label: 'Customers',
      data: customerData,
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    }]
  };

  // Flats Chart Data
  const flatsData = months.map(() => 0);
  dashboardData.flatsData.forEach(flat => {
    const date = new Date(flat.created_at);
    if (date.getFullYear().toString() === selectedYear) {
      flatsData[date.getMonth()] += 1;
    }
  });

  const flatsChartData = {
    labels: months,
    datasets: [{
      label: 'Flats',
      data: flatsData,
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = (title, yAxisLabel, yMin, yMax) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title, font: { size: 16 } },
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: {
        title: { display: true, text: yAxisLabel },
        min: yMin,
        max: yMax,
        ticks: {
          callback: (value) => {
            if (yAxisLabel === 'Amount (₹)') {
              return value >= 10000000 ? `${(value / 10000000).toFixed(1)}Cr` : `${(value / 100000).toFixed(1)}L`;
            }
            return value;
          }
        }
      }
    }
  });

  const statsCards = [
    // {
    //   title: 'Total Leads',
    //   value: dashboardData.totalLeads,
    //   icon: <IconUsersGroup size={20} />,
    //   bgColor: 'from-blue-600/10 to-blue-50',
    //   iconBg: 'bg-orange-300',
    //   subStats: [
    //     { label: 'Assigned Leads', value: dashboardData.assignedLeads, color: 'text-green-600', icon: <CheckCircle size={14} /> },
    //     { label: 'Unassigned Leads', value: dashboardData.unassignedLeads, color: 'text-orange-600', icon: <XCircle size={14} /> },
    //   ]
    // },
    {
      title: 'Total Flats',
      value: dashboardData.totalFlats,
      icon: <Home size={24} />,
      cardClass: 'bg-white border-[#e8ecef] border-b-2 border-b-[#de4183]',
      titleClass: 'text-neutral-900',
      valueClass: 'text-[#de4183]',
      iconClass: 'text-[#de4183]',
      iconWrapClass: 'bg-[#de4183]/12',
      subLabelClass: 'text-[#8a96a2]',
      subValueClass: 'text-[#4f5c68]',
      subStats: [
        { label: 'Sold', value: dashboardData.soldFlats, color: 'text-[#2f9e8f]', icon: <CheckCircle size={14} /> },
        { label: 'Unsold', value: dashboardData.unsoldFlats, color: 'text-[#b35f72]', icon: <XCircle size={14} /> }
      ]
    },
    {
      title: 'Total Customers',
      value: dashboardData.totalCustomers,
      icon: <Users size={24} />,
      cardClass: 'bg-white border-[#e8ecef] border-b-2 border-b-[#2d8dd6]',
      titleClass: 'text-neutral-900',
      valueClass: 'text-[#2d8dd6]',
      iconClass: 'text-[#2d8dd6]',
      iconWrapClass: 'bg-[#2d8dd6]/12',
      subLabelClass: 'text-[#8a96a2]',
      subValueClass: 'text-[#4f5c68]',
      subStats: [
        // { label: 'Active', value: dashboardData.activeCustomers, color: 'text-white/90', icon: <UserCheck size={14} /> },
        // { label: 'Inactive', value: dashboardData.inactiveCustomers, color: 'text-white/90', icon: <UserMinus size={14} /> },
        // { label: 'Suspended', value: dashboardData.suspendedCustomers, color: 'text-white/90', icon: <UserX size={14} /> }
        { label: `Loan${dashboardData.loanDelayCount > 1 ? 's' : ''} Delay`, value: dashboardData.loanDelayCount, color: 'text-[#c05b7d]', icon: <IconClock size={14} /> }
      ]
    },
    // {
    //   title: 'Total Employees',
    //   value: dashboardData.totalEmployees,
    //   icon: <User size={20} />,
    //   bgColor: 'from-blue-600/10 to-blue-50',
    //   iconBg: 'bg-blue-300',
    //   subStats: [
    //     { label: 'Active', value: dashboardData.activeEmployees, color: 'text-green-600', icon: <UserCheck size={14} /> },
    //     { label: 'Inactive', value: dashboardData.inactiveEmployees, color: 'text-gray-600', icon: <UserMinus size={14} /> },
    //     { label: 'Suspended', value: dashboardData.suspendedEmployees, color: 'text-red-600', icon: <UserX size={14} /> }
    //   ]
    // },
    // {
    //   title: 'Total Payments',
    //   value: dashboardData.totalPayments,
    //   icon: <IconCreditCardPay size={20} />,
    //   bgColor: 'from-cyan-600/10 to-cyan-50',
    //   iconBg: 'bg-cyan-300',
    // }
  ];

  if (isLoadingEffect) {
    return (
      <div className="w-full space-y-3">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[180px] w-full rounded-2xl" />
          <Skeleton className="h-[180px] w-full rounded-2xl" />
        </div>

        {/* Charts & Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-3">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <XCircle size={18} />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{errorMessage.message}</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="crm-header">
          <div>
            <h1 className="crm-title">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-[12px]">{greeting}, {employeeInfo?.name || "User"}!</p>
          </div>
          {/* Action Buttons could go here */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {statsCards?.map((card, index) => (
            <div
              key={index}
              className={`${card.cardClass || 'bg-white border-neutral-200'} rounded-md shadow-sm border relative overflow-hidden p-4 flex flex-col justify-between min-h-[150px]`}
            >
              <div className="relative z-10 w-full h-full flex flex-col justify-between">
                {/* Header: Title and Icon */}
                <div className="flex justify-between items-start mb-2">
                  <p className={`font-semibold text-[13px] tracking-wide ${card.titleClass || 'text-slate-700'}`}>{card.title}</p>
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center ${card.iconWrapClass || 'bg-slate-100'}`}>
                    <span className={`${card.iconClass || 'text-slate-600'} opacity-90`}>
                      {card.icon}
                    </span>
                  </div>
                </div>

                {/* Main Value */}
                <div className="mb-4">
                  <h3 className={`text-[28px] font-bold tracking-tight ${card.valueClass || 'text-slate-900'}`}>{card.value}</h3>
                </div>

                {/* Sub-stats */}
                {card.subStats && (
                  <div className="grid grid-cols-4 gap-y-1 gap-x-2">
                    {card.subStats.map((stat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 min-w-0">
                        <span className={`shrink-0 ${stat.color || 'text-slate-500'}`}>{stat.icon}</span>
                        <div className="flex items-baseline gap-1 truncate">
                          <span className={`text-[12px] font-semibold ${card.subValueClass || 'text-slate-800'}`}>{stat.value}</span>
                          <span className={`text-[9px] uppercase tracking-widest ${card.subLabelClass || 'text-slate-500'}`}>{stat.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {permissions?.main_page?.includes("ageing_page") && (
          <Ageingrecord />
        )}
        {/* Divide Sections */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

              {permissions?.main_page?.includes("flats_page") && (
                <div>
                  <Flatschart />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-full bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-3 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <Home className="text-purple-600" size={18} />
                Available Flats
              </h4>
              <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">{dashboardData.unsoldFlatsData.length} New</span>
            </div>
            <div className="overflow-x-auto">
              {dashboardData.unsoldFlatsData.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                    <tr>
                      <th className="px-3 py-2">Flat Details</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {dashboardData.unsoldFlatsData.slice(0, 5).map((flat) => (
                      <tr key={flat.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold border border-purple-100">
                              {flat.flat_no}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900 text-xs">Block {flat.block_name || flat.block_id}</p>
                              <p className="text-[11px] text-neutral-500">Floor {flat.floor_no}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${flat.status === 'Sold'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-orange-50 text-orange-700 border border-orange-100'
                            }`}>
                            {flat.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-neutral-500 text-xs text-nowrap">
                          {new Date(flat.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button onClick={() => openSingleFlat(flat.id)} className="p-1.5 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all">
                            <IconEye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-neutral-400 text-sm">No recent unsold flats</div>
              )}
            </div>
          </div> 
         <div className="lg:col-span-1 bg-white border border-neutral-200 shadow-sm rounded-xl p-3 h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-neutral-900 ">Recent Lead</h3>
            </div>

            <div className="space-y-6">
              {dashboardData.leadsData.slice(0, 5).map((lead, index) => (
                <div key={lead.id || index} className="flex items-center justify-between group cursor-pointer" onClick={() => openSingleLead(lead.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-semibold text-sm overflow-hidden border border-neutral-100 shrink-0">
                      {lead.full_name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                        {lead.prefixes} {lead.full_name}
                      </span>
                      <span className="text-xs text-neutral-500  block max-w-[150px] sm:max-w-[200px] break-all">
                        {lead.email}
                      </span>
                    </div>
                  </div>

                  <button className="text-neutral-300 group-hover:text-neutral-500 transition-colors ml-2 shrink-0">
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}

              {dashboardData.leadsData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                  <p className="text-sm">No recent leads found</p>
                </div>
              )}
            </div>
          </div> 

        </div> */}


        {/* Charts Section */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {permissions?.main_page?.includes("customers_page") && (
            <div>
              <Customerschart />
            </div>
          )}

          {permissions?.main_page?.includes("payments_page") && (
            <div>
              <Paymentchart />
            </div>
          )}
        </div> */}



        {/* Flats Table */}
        {/* {permissions?.main_page?.includes("flats_page") && ( 
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-3 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
              <Home className="text-purple-600" size={18} />
              Recent Flats
            </h4>
            <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">{dashboardData.flatsData.length} New</span>
          </div>
          <div className="overflow-x-auto">
            {dashboardData.flatsData.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                  <tr>
                    <th className="px-3 py-2">Flat Details</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {dashboardData.flatsData.slice(0, 5).map((flat) => (
                    <tr key={flat.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold border border-purple-100">
                            {flat.flat_no}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 text-xs">Block {flat.block_id}</p>
                            <p className="text-[11px] text-neutral-500">Floor {flat.floor_no}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${flat.status === 'Sold'
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'bg-orange-50 text-orange-700 border border-orange-100'
                          }`}>
                          {flat.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-neutral-500 text-xs text-nowrap">
                        {new Date(flat.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => openSingleFlat(flat.id)} className="p-1.5 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all">
                          <IconEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-neutral-400 text-sm">No recent flats</div>
            )}
          </div>
        </div>
         )}  */}

        <div className={`grid grid-cols-1 ${permissions?.main_page?.includes("customers_page") && permissions?.main_page?.includes("payments_page") ? 'xl:grid-cols-2' : 'xl:grid-cols-1'} gap-3`}>
          {/* Customers Table */}
          {permissions?.main_page?.includes("customers_page") && (
            <div className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-3 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-[13px] font-semibold text-neutral-900 flex items-center gap-2">
                  <IconUsers className="text-teal-600" size={18} />
                  Recent Customers
                </h4>
                <span className="text-[11px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{dashboardData.customersData.length} New</span>
              </div>
              <div className="overflow-x-auto">
                {dashboardData.customersData.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                      <tr>
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">Contact</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {dashboardData.customersData.slice(0, 5).map((customer) => (
                        <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">
                                {customer.first_name?.[0]}
                              </div>
                              <div>
                                <p className="text-neutral-900 text-xs font-semibold leading-[18px]">{customer.prefixes} {customer.first_name}</p>
                                <p className="text-neutral-500 text-[10px] leading-[18px]">{customer.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-900">+{customer.phone_code} {customer.phone_number}</span>
                              {/* <a href={`mailto:${customer.email}`} className="text-neutral-500 hover:text-teal-600 truncate max-w-[120px]">{customer.email}</a> */}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-neutral-500 text-xs text-nowrap">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={() => openSingleCustomer(customer.id)} className="p-1.5 text-neutral-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-all">
                              <IconEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">No recent customers</div>
                )}
              </div>
            </div>
          )}

          {/* Payments Table */}
          {permissions?.main_page?.includes("payments_page") && (
            <div className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-3 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-[13px] font-semibold text-neutral-900 flex items-center gap-2">
                  <IconCash className="text-green-600" size={18} />
                  Recent Payments
                </h4>
                <span className="text-[11px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{dashboardData.paymentsData.length} New</span>
              </div>
              <div className="overflow-x-auto">
                {dashboardData.paymentsData.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                      <tr>
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">Details</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {dashboardData.paymentsData.slice(0, 5).map((payment) => (
                        <tr key={payment.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                                ₹
                              </div>
                              <div>
                                <p className="text-neutral-900 text-xs font-semibold leading-[18px]s">{payment.customer_prefixes} {payment.customer_name}</p>
                                <p className="text-neutral-500 text-[10px] leading-[18px]">{payment.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs">
                            <p className="font-medium text-neutral-700">Flat {payment.flat_no}</p>
                            <p className="text-neutral-500">{payment.block_name}</p>
                          </td>
                          <td className="px-3 py-2 text-sm font-semibold text-neutral-900">
                            ₹{payment.amount?.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={() => openSingleFlatView(payment.id)} className="p-1.5 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all">
                              <IconEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">No recent payments</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div >



      <Modal
        open={projectModel}
        onClose={closeProjectModel}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {projectModel === true && (
          <AssignProject closeProjectModel={closeProjectModel} />
        )}
      </Modal>
    </>
  );
}

export default DashboardWrapper;
