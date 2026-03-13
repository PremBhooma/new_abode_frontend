import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import profileStatic from "@/assets/dashboard/user.png";

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { employeeInfo, resetEmployeeAuthdetails } = useEmployeeDetails();

    // Search state removed as it's now handled in the dedicated Search page logic
    const pageName =
        location.pathname === "/dashboard"
            ? "Dashboard"
            : location.pathname
                .split("/")
                .filter(Boolean)[0]
                ?.replace(/-/g, " ")
                ?.replace(/\b\w/g, (m) => m.toUpperCase()) || "Overview";

    // Logic moved to Sidebar

    return (
        <header className="mt-3 w-[98%] mx-auto shrink-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 h-16 px-4 md:px-5 flex items-center justify-between shadow-sm rounded-md">
            {/* Left: Sidebar Toggle & Title (Mobile) */}
            <div className="flex items-center gap-3">
                <div className="h-16 flex items-center justify-between border-b border-slate-200">
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
                </div>

                {/* <div>
                    <p className="text-[13px] font-semibold text-slate-900">
                        {pageName}
                    </p>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                        Welcome back, {employeeInfo?.name || "User"}
                    </p>
                </div> */}
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">

                {/* Search Icon */}
                {/* {!isSearchPage && (
                    <Link
                        to="/search"
                        className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                        title="Search"
                    >
                        <IconSearch size={22} stroke={1.5} />
                    </Link>
                )} */}

                {/* User Profile */}
                <Link
                    to={`/single-employee-view/${employeeInfo?.id}`}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-all duration-200 group"
                >
                    <div className="flex flex-col items-end min-w-0">
                        <p className="text-[12px] font-bold text-slate-900 truncate max-w-[150px] leading-tight group-hover:text-[#0083bf] transition-colors">
                            {employeeInfo?.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[150px] leading-tight">
                            {employeeInfo?.role_name}
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src={employeeInfo?.profile_pic_url || profileStatic}
                            crossOrigin="anonymous"
                            alt="User"
                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Header;
