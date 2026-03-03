import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Icon } from "lucide-react";
import { IconBell, IconBuilding, IconCaretDown, IconChevronCompactDown, IconCreditCardPay, IconHome2, IconLogout, IconLogout2, IconNotification, IconSearch, IconSettings, IconUser, IconUsers, IconUsersGroup } from "@tabler/icons-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeInfo, isLogged, resetEmployeeAuthdetails, permissions } = useEmployeeDetails();

  const [openMenu, setOpenMenu] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const isSearchPage = location.pathname.startsWith("/search");

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle submenu state based on location
  useEffect(() => {
    const subItemLinks = ["/employees", "/roles"];
    const matchedIndex = subItemLinks.some((link) => location.pathname.startsWith(link)) ? 0 : null;
    setOpenMenu(matchedIndex);
  }, [location.pathname, employeeInfo]);

  const toggleMenu = (index) => {
    setOpenMenu((prev) => (prev === index ? null : index));
  };

  const handleLogout = () => {
    resetEmployeeAuthdetails();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/dashboard">
              <img crossOrigin="anonymous" src="/assets/dashboard/logo.png" alt="CRM Logo" className="h-12 w-auto object-contain" />
            </NavLink>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-0 xl:space-x-4 2xl:space-x-6">
            <NavLink to="/dashboard" className={({ isActive }) => `px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-200 flex gap-1 ${isActive ? "bg-blue-100 text-[#0083bf]" : "text-[#1F2937] hover:bg-blue-100 hover:text-[#0083bf]"}`}>
              <IconHome2 size={18} strokeWidth={2} /> Dashboard
            </NavLink>

            {employeeInfo?.role_name === "Super Admin" || permissions?.main_page?.includes("employee_page") ? (
              <div className="relative group" onMouseEnter={() => setOpenMenu(0)} onMouseLeave={() => setOpenMenu(null)}>
                <button className={`px-3 py-2 rounded-sm text-sm font-medium flex items-center gap-1 transition-colors duration-200 ${location.pathname.startsWith("/employees") || location.pathname.startsWith("/roles") || openMenu === 0 ? "bg-blue-100 hover:text-[#0083bf]" : "text-[#1F2937] hover:bg-blue-100 hover:text-[#0083bf]"}`}>
                  <IconUser size={18} strokeWidth={2} />
                  Employee
                  <IconCaretDown size={16} className={`transition-transform ${openMenu === 0 ? "rotate-180" : ""}`} />
                </button>

                <div className={`absolute left-0  w-48 bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-200 z-50 ${openMenu === 0 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                  <NavLink to="/employees" className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? "text-[#0083bf] font-medium" : "text-[#1F2937] hover:text-[#0083bf] hover:bg-blue-100"}`}>
                    All Employees
                  </NavLink>

                  {employeeInfo?.role_name === "Super Admin" && (
                    <NavLink to="/roles" className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? "text-[#0083bf] font-medium" : "text-[#1F2937] hover:text-[#0083bf] hover:bg-blue-100"}`}>
                      Roles & Permissions
                    </NavLink>
                  )}
                </div>
              </div>
            ) : null}


            {permissions?.main_page?.includes("leads_page") && (
              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-sm text-sm font-medium flex gap-1 items-center justify-center transition-colors duration-200 
                ${isActive ? "bg-blue-100 text-[#0083bf]" : "text-[#1F2937] hover:bg-blue-100 hover:text-[#0083bf]"}`
                }
              >
                <IconUsersGroup size={18} strokeWidth={2} /> Leads
              </NavLink>
            )}

            {permissions?.main_page?.includes("flats_page") && (
              <NavLink
                to="/flats"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-sm text-sm font-medium flex gap-1 items-center justify-center transition-colors duration-200 
                ${isActive ? "bg-blue-100 text-[#0083bf]" : "text-[#1F2937] hover:bg-blue-100 hover:text-[#0083bf]"}`
                }
              >
                <IconBuilding size={18} strokeWidth={2} /> Flats
              </NavLink>
            )}

            {permissions?.main_page?.includes("customers_page") && (
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-sm text-sm font-medium flex gap-1 transition-colors duration-200 
                ${isActive ? "bg-blue-100 text-[#0083bf]" : "text-[#1F2937] hover:bg-blue-100 hover:text-[#0083bf]"}`
                }
              >
                <IconUsers size={18} strokeWidth={2} /> Customers
              </NavLink>
            )}

            {permissions?.main_page?.includes("payments_page") && (
              <NavLink to="/payments" className={({ isActive }) => `px-3 py-2 rounded-sm text-sm font-medium flex items-center justify-center gap-1 transition-colors duration-200 ${isActive ? "bg-blue-100 text-[#0083bf]" : "text-[#1F2937] hover:bg-blue-100 hover:text-[#0083bf]"}`}>
                <IconCreditCardPay size={18} strokeWidth={2} /> Payments
              </NavLink>
            )}

            {permissions?.main_page?.includes("settings_page") && (
              <NavLink to="/settings" className={({ isActive }) => `px-3 py-2 rounded-sm text-sm font-medium flex gap-1 transition-colors duration-200 ${isActive ? "bg-blue-100 text-[#0083bf]" : "text-[#1F2937] hover:bg-blue-100 hover:text-[#0083bf]"}`}>
                <IconSettings size={20} /> Settings
              </NavLink>
            )}
          </div>

          {/* Right Side: Search, Notifications, Profile */}
          <div className="flex items-center space-x-2">
            {!isSearchPage && (
              <Link to={"/search"}>
                <div className="relative " ref={searchRef}>
                  <button onClick={() => setSearchOpen((prev) => !prev)} className="p-2 rounded-full  hover:bg-blue-100 cursor-pointer">
                    {/* <i className="ti ti-search text-white-700"></i> */}
                    <IconSearch size={20} />
                  </button>
                </div>
              </Link>
            )}

            {isLogged && (
              <div className="relative flex items-center gap-2">
                <Link to={`/single-employee-view/${employeeInfo.id}`} className="flex items-center gap-2 rounded-full focus:outline-none">
                  <img src={employeeInfo?.profile_pic_url || '/assets/dashboard/user.png'} crossOrigin="anonymous" alt="User" className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-[12px] font-medium italic text-[#2b2b2b]">{employeeInfo.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-red-600 hover:bg-red-50 rounded-full flex items-center justify-center cursor-pointer">
                  <IconLogout size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
