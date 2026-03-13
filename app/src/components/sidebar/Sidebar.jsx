import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import {
    IconLayoutDashboard,
    IconUsers,
    IconBuildingSkyscraper,
    IconUserDollar,
    IconSettings,
    IconUsersGroup,
    IconChevronDown,
    IconCurrencyRupee,
    IconFolder,
    IconGift
} from "@tabler/icons-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { employeeInfo, permissions } = useEmployeeDetails();
    const [openSubmenu, setOpenSubmenu] = useState(null);

    // Auto-expand submenu if current path matches
    useEffect(() => {
        if (
            location.pathname.startsWith("/employees") ||
            location.pathname.startsWith("/roles") ||
            location.pathname.startsWith("/single-employee-view")
        ) {
            setOpenSubmenu("employee");
        } else if (
            location.pathname.startsWith("/ageing-records") ||
            location.pathname.startsWith("/refund-records") ||
            location.pathname.startsWith("/reward-records")
        ) {
            setOpenSubmenu("records");
        } else {
            setOpenSubmenu(null);
        }
    }, [location.pathname]);

    const toggleSubmenu = (key) => {
        setOpenSubmenu(prev => prev === key ? null : key);
    };

    const navItemClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-[12px] font-medium transition-all duration-200 ${isActive
            ? "bg-white/20 text-white border border-white/30"
            : "text-white/85 hover:bg-white/10 hover:text-white border border-transparent"
        }`;

    const subItemClass = ({ isActive }) =>
        `block pl-10 pr-3 py-1.5 text-[12px] rounded-md transition-colors duration-200 ${isActive
            ? "text-white bg-white/20 font-medium"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-slate-900/40 backdrop-blur-[1px] z-40 transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`m-3 rounded-md fixed lg:static top-16 lg:top-0 left-0 w-[220px] shadow-sm border border-[#0083bf]/20 z-50 transform transition-transform duration-300 ease-in-out relative overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-700/50 to-blue-800/60" />
                <div className="absolute inset-0 bg-[url('/assets/auth_build.jpg')] bg-cover bg-center opacity-15 mix-blend-soft-light" />
                <div className="absolute inset-0 bg-[#0083bf]/10" />

                <div className="flex flex-col h-full relative z-10">
                    {/* Logo Area */}
                    {/* <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <img
                                crossOrigin="anonymous"
                                src="./assets/dashboard/logo.png"
                                alt="Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-md"
                        >
                            <IconX size={20} />
                        </button>
                    </div> */}

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto no-scrollbar py-5 px-3 space-y-1">
                        <p className="px-3 text-[10px] font-semibold text-white/60 uppercase tracking-[0.12em] mb-2">
                            Main Menu
                        </p>

                        <NavLink to="/dashboard" className={navItemClass}>
                            <IconLayoutDashboard size={20} stroke={1.5} />
                            <span>Dashboard</span>
                        </NavLink>

                        {/* Employee Submenu */}
                        {(employeeInfo?.role_name === "Super Admin" || permissions?.main_page?.includes("employee_page")) && (
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleSubmenu("employee")}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[12px] font-medium transition-all duration-200 ${openSubmenu === "employee" || location.pathname.startsWith("/single-employee-view")
                                        ? "text-white bg-white/15 border-white/25"
                                        : "text-white/85 hover:text-white border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <IconUsers size={20} stroke={1.5} />
                                        <span>Employee</span>
                                    </div>
                                    <IconChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${openSubmenu === "employee" ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {openSubmenu === "employee" && (
                                    <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                                        <NavLink to="/employees" className={subItemClass}>
                                            All Employees
                                        </NavLink>
                                        {employeeInfo?.role_name === "Super Admin" && (
                                            <NavLink to="/roles" className={subItemClass}>
                                                Roles & Permissions
                                            </NavLink>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {permissions?.main_page?.includes("leads_page") && (
                            <NavLink
                                to="/leads"
                                className={({ isActive }) =>
                                    navItemClass({ isActive: isActive || location.pathname.startsWith("/lead") })
                                }
                            >
                                <IconUsersGroup size={20} stroke={1.5} />
                                <span>Leads</span>
                            </NavLink>
                        )}

                        {permissions?.main_page?.includes("flats_page") && (
                            <NavLink to="/flats" className={navItemClass}>
                                <IconBuildingSkyscraper size={20} stroke={1.5} />
                                <span>Flats</span>
                            </NavLink>
                        )}

                        {permissions?.main_page?.includes("customers_page") && (
                            <NavLink to="/customers" className={navItemClass}>
                                <IconUserDollar size={20} stroke={1.5} />
                                <span>Customers</span>
                            </NavLink>
                        )}

                        {permissions?.main_page?.includes("payments_page") && (
                            <NavLink
                                to="/payments"
                                className={({ isActive }) =>
                                    navItemClass({ isActive: isActive || location.pathname.startsWith("/singlepaymentview") })
                                }
                            >
                                <IconCurrencyRupee size={20} stroke={1.5} />
                                <span>Payments</span>
                            </NavLink>
                        )}

                        {(permissions?.main_page?.includes("reward_records_page")) && (
                            <NavLink to="/rewards" className={navItemClass}>
                                <IconGift size={20} stroke={1.5} />
                                <span>Rewards</span>
                            </NavLink>
                        )}

                        {/* Records Submenu */}
                        {(permissions?.main_page?.includes("ageing_page") || permissions?.main_page?.includes("refund_page")) && (
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleSubmenu("records")}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[12px] font-medium transition-all duration-200 border ${openSubmenu === "records"
                                        ? "text-white bg-white/15 border-white/25"
                                        : "text-white/85 hover:text-white border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <IconFolder size={20} stroke={1.5} />
                                        <span>Reports</span>
                                    </div>
                                    <IconChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${openSubmenu === "records" ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {openSubmenu === "records" &&
                                    (permissions?.main_page?.includes("ageing_page") ||
                                        permissions?.main_page?.includes("refund_page")) && (
                                        <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                                            {permissions?.main_page?.includes("ageing_page") && (
                                                <NavLink to="/ageing-records" className={subItemClass}>
                                                    Sales Report
                                                </NavLink>
                                            )}

                                            {permissions?.main_page?.includes("refund_page") && (
                                                <NavLink to="/refund-records" className={subItemClass}>
                                                    Refund Report
                                                </NavLink>
                                            )}

                                            {permissions?.main_page?.includes("reward_records_page") && (
                                                <NavLink to="/reward-records" className={subItemClass}>
                                                    Reward Report
                                                </NavLink>
                                            )}
                                        </div>
                                    )}

                            </div>
                        )}

                        {permissions?.main_page?.includes("settings_page") && (
                            <NavLink to="/settings" className={navItemClass}>
                                <IconSettings size={20} stroke={1.5} />
                                <span>Settings</span>
                            </NavLink>
                        )}
                    </div>

                    {/* User Profile (Sidebar Footer) */}
                    <div className="p-3 border-t border-white/20">
                        <NavLink
                            to={`/single-employee-view/${employeeInfo?.id}`}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-2.5 rounded-md transition-all duration-200 border ${isActive
                                    ? "bg-white/20 border-white/30"
                                    : "bg-white/10 hover:bg-white/15 border-white/20"
                                }`
                            }
                        >
                            <img
                                src={employeeInfo?.profile_pic_url || './assets/dashboard/user.png'}
                                crossOrigin="anonymous"
                                alt="User"
                                className="w-9 h-9 rounded-full object-cover border border-white/30"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium text-white truncate">
                                    {employeeInfo?.name}
                                </p>
                                <p className="text-[11px] text-white/70 truncate">
                                    {employeeInfo?.role_name}
                                </p>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
