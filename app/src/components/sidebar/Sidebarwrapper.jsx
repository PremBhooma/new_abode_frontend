"use client";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IconLayoutDashboard, IconUsers, IconUserCircle, IconSettings, IconBuilding, IconCreditCardPay, IconChevronRight } from "@tabler/icons-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails.jsx";

function Sidebarwrapper({ isOpen, isCollapsed, toggleSidebar }) {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const permissions = useEmployeeDetails((state) => state.permissions);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);

  useEffect(() => {
    const subItemLinks = ["/employees", "/roles"];
    const matchedIndex = subItemLinks.some((link) => location.pathname.startsWith(link)) ? 0 : null;
    setOpenMenu(matchedIndex);
  }, [location.pathname]);

  const toggleMenu = (index) => {
    setOpenMenu((prev) => (prev === index ? null : index));
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
      <button type="button" className="sidebar-close-btn mt-4" onClick={toggleSidebar}></button>

      <div>
        <NavLink to="/dashboard" className="sidebar-logo">
          <img src="./assets/dashboard/logo.png" alt="site logo" className="light-logo" />
          <img src="../assets/images/logo-light.png" alt="site logo" className="dark-logo" />
          <img src="../assets/images/logo-icon.png" alt="site logo" className="logo-icon" />
        </NavLink>
      </div>

      <div className="sidebar-menu-area">
        <ul className="sidebar-menu" id="sidebar-menu">

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-[#0083bf] font-medium" : "text-[#4b5563] hover:text-[#0083bf]"
                }`
              }
            >
              <span className="menu-icon-wrapper pr-2">
                <IconLayoutDashboard size={18} />
              </span>
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>

          {permissions?.main_page?.includes("employee_page") && (
            <li className="dropdown">
              <a
                href="#"
                onClick={() => toggleMenu(0)}
                className={`flex items-center gap-3 px-4 py-2 text-[14px] w-full text-left rounded-md transition-all duration-200 ${openMenu === 0 ? "bg-[#0083bf] text-white" : "text-[#4b5563] hover:text-[#0083bf]"
                  }`}
              >
                <span className="menu-icon-wrapper mt-1 pr-2">
                  <IconUsers size={18} />
                </span>
                <span className="menu-text flex-grow">Employee</span>
                <IconChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${openMenu === 0 ? "rotate-90 text-white" : "text-[#4b5563]"}`}
                />
              </a>

              <ul className={`pl-6 transition-all duration-200 ${openMenu === 0 ? "block" : "hidden"}`}>
                <li>
                  <NavLink
                    to="/employees"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-[#0083bf] font-medium" : "text-[#4b5563] hover:text-[#0083bf]"
                      }`
                    }
                  >
                    <span className="menu-text">All Employees</span>
                  </NavLink>
                </li>
                {employeeInfo?.role_name === "Super Admin" && (
                  <li>
                    <NavLink
                      to="/roles"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-[#0083bf] font-medium" : "text-[#4b5563] hover:text-[#0083bf]"
                        }`
                      }
                    >
                      <span className="menu-text">Roles & Permissions</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </li>
          )}

          {permissions?.main_page?.includes("flats_page") && (
            <li>
              <NavLink
                to="/flats"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-[#0083bf] font-medium" : "text-[#4b5563] hover:text-[#0083bf]"
                  }`
                }
              >
                <span className="menu-icon-wrapper pr-2">
                  <IconBuilding size={18} />
                </span>
                <span className="menu-text">Flats</span>
              </NavLink>
            </li>
          )}

          {permissions?.main_page?.includes("customers_page") && (
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-[#0083bf] font-medium" : "text-[#4b5563] hover:text-[#0083bf]"
                  }`
                }
              >
                <span className="menu-icon-wrapper pr-2">
                  <IconUserCircle size={18} />
                </span>
                <span className="menu-text">Customers</span>
              </NavLink>
            </li>
          )}

          {permissions?.main_page?.includes("payments_page") && (
            <li>
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-[#0083bf] font-medium" : "text-[#4b5563] hover:text-[#0083bf]"
                  }`
                }
              >
                <span className="menu-icon-wrapper pr-2">
                  <IconCreditCardPay size={18} />
                </span>
                <span className="menu-text">Payments</span>
              </NavLink>
            </li>
          )}

          {permissions?.main_page?.includes("settings_page") && (
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-[#0083bf] font-medium" : "text-[#4b5563] hover:text-[#0083bf]"
                  }`
                }
              >
                <span className="menu-icon-wrapper pr-2">
                  <IconSettings size={18} />
                </span>
                <span className="menu-text">Settings</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebarwrapper;

// "use client";
// import { useState, useEffect } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { IconLayoutDashboard, IconUsers, IconUserCircle, IconSettings, IconBuilding, IconCreditCardPay, IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
// import { useEmployeeDetails } from "../zustand/useEmployeeDetails";

// function Sidebarwrapper({ isOpen, toggleSidebar, onCollapseChange }) {
//   const [openMenu, setOpenMenu] = useState(null);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const location = useLocation();
//   const permissions = useEmployeeDetails((state) => state.permissions);
//   const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);

//   useEffect(() => {
//     const subItemLinks = ["/employees", "/roles"];
//     const matchedIndex = subItemLinks.some((link) => location.pathname.startsWith(link)) ? 0 : null;
//     setOpenMenu(matchedIndex);
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleResize = () => {
//       const shouldCollapse = window.innerWidth <= 768;
//       setIsCollapsed(shouldCollapse);
//       onCollapseChange(shouldCollapse);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [onCollapseChange]);

//   const toggleMenu = (index) => {
//     setOpenMenu((prev) => (prev === index ? null : index));
//   };

//   const toggleCollapse = () => {
//     setIsCollapsed((prev) => {
//       const newState = !prev;
//       onCollapseChange(newState);
//       return newState;
//     });
//   };

//   return (
//     <aside className={`fixed h-full z-50 bg-white shadow-md transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "w-16" : "w-64"} md:translate-x-0`}>
//       <div className="flex items-center justify-between p-4">
//         <NavLink to="/" className="flex items-center">
//           {!isCollapsed && (
//             <>
//               <img src="/assets/dashboard/logo.png" alt="site logo" className="h-8" />
//               <img src="../assets/images/logo-light.png" alt="site logo" className="h-8 hidden" />
//             </>
//           )}
//           <img src="../assets/images/logo-icon.png" alt="site logo" className="h-8" />
//         </NavLink>
//         <button
//           type="button"
//           className="p-2 rounded-full hover:bg-gray-100 hidden md:block"
//           onClick={toggleCollapse}
//         >
//           {isCollapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
//         </button>
//         <button
//           type="button"
//           className="p-2 rounded-full hover:bg-gray-100 md:hidden"
//           onClick={toggleSidebar}
//         >
//           <IconChevronLeft size={20} />
//         </button>
//       </div>

//       <div className="mt-4">
//         <ul className="space-y-2">
//           <li>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
//                   isActive ? "text-[#0083bf] font-medium bg-[#e6f3fa]" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                 }`
//               }
//             >
//               <span className="pr-2">
//                 <IconLayoutDashboard size={18} />
//               </span>
//               {!isCollapsed && <span>Dashboard</span>}
//             </NavLink>
//           </li>

//           {permissions?.main_page?.includes("employee_page") && (
//             <li>
//               <a
//                 href="#"
//                 onClick={() => toggleMenu(0)}
//                 className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left rounded-md transition-all duration-200 ${
//                   openMenu === 0 ? "bg-[#0083bf] text-white" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                 }`}
//               >
//                 <span className="pr-2">
//                   <IconUsers size={18} />
//                 </span>
//                 {!isCollapsed && <span className="flex-grow">Employee</span>}
//                 {!isCollapsed && (
//                   <IconChevronRight
//                     size={16}
//                     className={`transition-transform duration-200 ${openMenu === 0 ? "rotate-90 text-white" : "text-gray-600"}`}
//                   />
//                 )}
//               </a>

//               <ul className={`pl-6 transition-all duration-200 ${openMenu === 0 && !isCollapsed ? "block" : "hidden"}`}>
//                 <li>
//                   <NavLink
//                     to="/employees"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
//                         isActive ? "text-[#0083bf] font-medium bg-[#e6f3fa]" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                       }`
//                     }
//                   >
//                     <span>All Employees</span>
//                   </NavLink>
//                 </li>
//                 {employeeInfo?.role_name === "Super Admin" && (
//                   <li>
//                     <NavLink
//                       to="/roles"
//                       className={({ isActive }) =>
//                         `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
//                           isActive ? "text-[#0083bf] font-medium bg-[#e6f3fa]" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                         }`
//                       }
//                     >
//                       <span>Roles & Permissions</span>
//                     </NavLink>
//                   </li>
//                 )}
//               </ul>
//             </li>
//           )}

//           {permissions?.main_page?.includes("flats_page") && (
//             <li>
//               <NavLink
//                 to="/flats"
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
//                     isActive ? "text-[#0083bf] font-medium bg-[#e6f3fa]" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 <span className="pr-2">
//                   <IconBuilding size={18} />
//                 </span>
//                 {!isCollapsed && <span>Flats</span>}
//               </NavLink>
//             </li>
//           )}

//           {permissions?.main_page?.includes("customers_page") && (
//             <li>
//               <NavLink
//                 to="/customers"
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
//                     isActive ? "text-[#0083bf] font-medium bg-[#e6f3fa]" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 <span className="pr-2">
//                   <IconUserCircle size={18} />
//                 </span>
//                 {!isCollapsed && <span>Customers</span>}
//               </NavLink>
//             </li>
//           )}

//           {permissions?.main_page?.includes("payments_page") && (
//             <li>
//               <NavLink
//                 to="/payments"
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
//                     isActive ? "text-[#0083bf] font-medium bg-[#e6f3fa]" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 <span className="pr-2">
//                   <IconCreditCardPay size={18} />
//                 </span>
//                 {!isCollapsed && <span>Payments</span>}
//               </NavLink>
//             </li>
//           )}

//           {permissions?.main_page?.includes("settings_page") && (
//             <li>
//               <NavLink
//                 to="/settings"
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
//                     isActive ? "text-[#0083bf] font-medium bg-[#e6f3fa]" : "text-gray-600 hover:text-[#0083bf] hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 <span className="pr-2">
//                   <IconSettings size={18} />
//                 </span>
//                 {!isCollapsed && <span>Settings</span>}
//               </NavLink>
//             </li>
//           )}
//         </ul>
//       </div>
//     </aside>
//   );
// }

// export default Sidebarwrapper;