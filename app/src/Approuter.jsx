import React from 'react'
import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import Login from './pages/login/Login'
import Customer from './pages/customer/Customer'
import Dashboard from './pages/dashboard/Dashboard'
import Employee from './pages/employee/employees/Employee'
import Rolesandpermission from './pages/employee/rolesandpermissions/Rolesandpermission'
import Setting from './pages/setting/Settings'
import Customerview from './pages/customer/Customerview'
import Addcustomer from './pages/customer/Addcustomer'
import Flats from './pages/flats/Flats'
import Addflatpage from './pages/flats/Addflatpage'
import Singleemployee from './pages/employee/employees/Singleemployee'
import Editcustomer from './pages/customer/Editcustomer'
import Editflatpage from './pages/flats/Editflatpage'
import Viewflatpage from './pages/flats/Viewflatpage'
import Allpaymentspage from './pages/payments/Allpaymentspage'
import Addnewpaymentpage from './pages/payments/Addnewpaymentpage'
import Editpaymentpage from './pages/payments/Editpaymentpage'
import Paymentview from './pages/payments/Paymentview'
import Onboarding from './pages/customer/Onboarding'
import Viewbulkpayments from './pages/payments/Viewbulkpayments'
import Flatpaymentspage from './pages/payments/Flatpaymentspage'
import Searchpage from './pages/search/Searchpage'
import Lead from './pages/leads/Lead'
import Addlead from './pages/leads/Addlead'
import Viewlead from './pages/leads/Viewlead'
import Editlead from './pages/leads/Editlead'
import Backup from './pages/backup/Backup'
import Ageing from './pages/ageing/Ageing'
import RefundRecords from './pages/refundrecords/RefundRecords'

import { useEmployeeDetails } from './components/zustand/useEmployeeDetails'
import Convertleadtocustomer from './pages/leads/Convertleadtocustomer'
import Flattocustomer from './components/customer/Flattocustomer';

import MainLayout from './components/layout/MainLayout'
import Rewards from './pages/rewards/Rewards'
import RewardRecords from './pages/rewardrecords/RewardRecords'

const ProtectedRoute = ({ element, requiredPermission }) => {
  const isLogged = useEmployeeDetails(state => state?.isLogged);
  const permissions = useEmployeeDetails(state => state?.permissions);
  const employeeInfo = useEmployeeDetails(state => state?.employeeInfo);
  const params = useParams();

  if (!isLogged) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !requiredPermission(permissions, employeeInfo, params)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      {element}
    </MainLayout>
  );
}

const PublicRoute = ({ element }) => {
  const isLogged = useEmployeeDetails((state) => state?.isLogged);
  return !isLogged ? element : <Navigate to="/dashboard" replace />;
};

function Approuter() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute element={<Login />} />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />

      {/* Employee Module */}
      <Route path="/employees" element={<ProtectedRoute element={<Employee />} requiredPermission={(p, i) => i?.role_name === "Super Admin" || p?.main_page?.includes("employee_page")} />} />
      <Route path="/roles" element={<ProtectedRoute element={<Rolesandpermission />} requiredPermission={(p, i) => i?.role_name === "Super Admin" || p?.main_page?.includes("employee_page")} />} />
      <Route path="/single-employee-view/:userId" element={<ProtectedRoute element={<Singleemployee />} requiredPermission={(p, i, params) => i?.role_name === "Super Admin" || p?.main_page?.includes("employee_page") || (params.userId && i?.id?.toString() === params.userId)} />} />
      <Route path="/single-employee-view" element={<ProtectedRoute element={<Singleemployee />} requiredPermission={(p, i) => i?.role_name === "Super Admin" || p?.main_page?.includes("employee_page")} />} />

      {/* Ageing Module */}
      <Route path="/ageing-records" element={<ProtectedRoute element={<Ageing />} requiredPermission={(p) => p?.main_page?.includes("ageing_page")} />} />
      <Route path="/refund-records" element={<ProtectedRoute element={<RefundRecords />} requiredPermission={(p) => p?.main_page?.includes("ageing_page")} />} />

      {/* Customer Module */}
      <Route path="/customers" element={<ProtectedRoute element={<Customer />} requiredPermission={(p) => p?.main_page?.includes("customers_page")} />} />
      <Route path="/customers/addnew" element={<ProtectedRoute element={<Addcustomer />} requiredPermission={(p) => p?.main_page?.includes("customers_page")} />} />
      <Route path="/customers/:customer_uuid" element={<ProtectedRoute element={<Customerview />} requiredPermission={(p) => p?.main_page?.includes("customers_page")} />} />
      <Route path="/customers/onboarding" element={<ProtectedRoute element={<Onboarding />} requiredPermission={(p) => p?.main_page?.includes("customers_page")} />} />
      <Route path="/customers/editcustomer/:single_customer_id" element={<ProtectedRoute element={<Editcustomer />} requiredPermission={(p) => p?.main_page?.includes("customers_page")} />} />
      <Route path="/assign-flat" element={<ProtectedRoute element={<Flattocustomer />} requiredPermission={(p) => p?.main_page?.includes("customers_page")} />} />

      {/* Flats Module */}
      <Route path="/flats" element={<ProtectedRoute element={<Flats />} requiredPermission={(p) => p?.main_page?.includes("flats_page")} />} />
      <Route path="/flats/add-flat" element={<ProtectedRoute element={<Addflatpage />} requiredPermission={(p) => p?.main_page?.includes("flats_page")} />} />
      <Route path="/flats/edit-flat/:uuid" element={<ProtectedRoute element={<Editflatpage />} requiredPermission={(p) => p?.main_page?.includes("flats_page")} />} />
      <Route path="/flats/view-flat/:uuid" element={<ProtectedRoute element={<Viewflatpage />} requiredPermission={(p) => p?.main_page?.includes("flats_page")} />} />

      {/* Payments Module */}
      <Route path="/payments" element={<ProtectedRoute element={<Allpaymentspage />} requiredPermission={(p) => p?.main_page?.includes("payments_page")} />} />
      <Route path="/payments/addnew" element={<ProtectedRoute element={<Addnewpaymentpage />} requiredPermission={(p) => p?.main_page?.includes("payments_page")} />} />
      <Route path="/payments/edit/:payment_uid" element={<ProtectedRoute element={<Editpaymentpage />} requiredPermission={(p) => p?.main_page?.includes("payments_page")} />} />
      <Route path="/singlepaymentview/:payment_uid" element={<ProtectedRoute element={<Paymentview />} requiredPermission={(p) => p?.main_page?.includes("payments_page")} />} />
      <Route path="/payments/view-bulk-payments" element={<ProtectedRoute element={<Viewbulkpayments />} requiredPermission={(p) => p?.main_page?.includes("payments_page")} />} />
      <Route path="/payments/flat/:flat_id" element={<ProtectedRoute element={<Flatpaymentspage />} requiredPermission={(p) => p?.main_page?.includes("payments_page")} />} />

      {/* Leads Module */}
      <Route path="/leads" element={<ProtectedRoute element={<Lead />} requiredPermission={(p) => p?.main_page?.includes("leads_page")} />} />
      <Route path="/lead/add-lead" element={<ProtectedRoute element={<Addlead />} requiredPermission={(p) => p?.main_page?.includes("leads_page")} />} />
      <Route path="/lead/edit-lead/:single_lead_id" element={<ProtectedRoute element={<Editlead />} requiredPermission={(p) => p?.main_page?.includes("leads_page")} />} />
      <Route path="/lead/:lead_uuid" element={<ProtectedRoute element={<Viewlead />} requiredPermission={(p) => p?.main_page?.includes("leads_page")} />} />
      <Route path="/lead/convert-lead-to-customer/:lead_uuid" element={<ProtectedRoute element={<Convertleadtocustomer />} requiredPermission={(p) => p?.main_page?.includes("leads_page")} />} />

      {/* Settings Module */}
      <Route path="/settings" element={<ProtectedRoute element={<Setting />} requiredPermission={(p) => p?.main_page?.includes("settings_page")} />} />

      <Route path="/search" element={<ProtectedRoute element={<Searchpage />} />} />

      <Route path="/rewards" element={<ProtectedRoute element={<Rewards />} requiredPermission={(p, i) => i?.role_name === "Super Admin" || p?.main_page?.includes("payments_page") || p?.main_page?.includes("rewards_page")} />} />
      <Route path="/reward-records" element={<ProtectedRoute element={<RewardRecords />} requiredPermission={(p, i) => i?.role_name === "Super Admin" || p?.main_page?.includes("reward_records_page")} />} />

      {/* <Route path="/backup" element={<Backup />} /> */}
    </Routes>
  )
}

export default Approuter