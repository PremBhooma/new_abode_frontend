import React, { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import {
    IconLayoutDashboard,
    IconUsers,
    IconBuildingSkyscraper,
    IconUserDollar,
    IconSettings,
    IconUsersGroup,
    IconChevronDown,
    IconX,
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
        if (location.pathname.startsWith("/employees") || location.pathname.startsWith("/roles")) {
            setOpenSubmenu("employee");
        } else if (location.pathname.startsWith("/ageing-records") || location.pathname.startsWith("/refund-records")) {
            setOpenSubmenu("records");
        } else {
            setOpenSubmenu(null);
        }
    }, [location.pathname]);

    const toggleSubmenu = (key) => {
        setOpenSubmenu(prev => prev === key ? null : key);
    };

    const navItemClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-[#0083bf]/10 text-[#0083bf]"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        }`;

    const subItemClass = ({ isActive }) =>
        `block pl-10 pr-3 py-2 text-sm transition-colors duration-200 ${isActive
            ? "text-[#0083bf] font-medium"
            : "text-neutral-500 hover:text-neutral-900"
        }`;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed lg:static top-0 left-0 h-full w-[220px] bg-white border-r border-neutral-200 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <img
                                crossOrigin="anonymous"
                                src="./assets/dashboard/logo.png"
                                alt="Logo"
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-1 text-neutral-500 hover:bg-neutral-100 rounded-md"
                        >
                            <IconX size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
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
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${openSubmenu === "employee"
                                        ? "text-neutral-900 bg-neutral-50"
                                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
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
                            <NavLink to="/leads" className={navItemClass}>
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
                            <NavLink to="/payments" className={navItemClass}>
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
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${openSubmenu === "records"
                                        ? "text-neutral-900 bg-neutral-50"
                                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
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
                    <div className="p-4 border-t border-neutral-100">
                        <NavLink
                            to={`/single-employee-view/${employeeInfo?.id}`}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-[#0083bf]/10 ring-1 ring-[#0083bf]/20"
                                    : "bg-neutral-50 hover:bg-neutral-100"
                                }`
                            }
                        >
                            <img
                                src={employeeInfo?.profile_pic_url || './assets/dashboard/user.png'}
                                crossOrigin="anonymous"
                                alt="User"
                                className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">
                                    {employeeInfo?.name}
                                </p>
                                <p className="text-xs text-neutral-500 truncate">
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
