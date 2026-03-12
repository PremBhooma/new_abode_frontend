import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconMenu2, IconLogout } from "@tabler/icons-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";

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

    const handleLogout = () => {
        resetEmployeeAuthdetails();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 h-16 px-4 md:px-5 flex items-center justify-between">
            {/* Left: Sidebar Toggle & Title (Mobile) */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                    <IconMenu2 size={20} />
                </button>

                <div>
                    <p className="text-[13px] font-semibold text-slate-900">
                        {pageName}
                    </p>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                        Welcome back, {employeeInfo?.name || "User"}
                    </p>
                </div>
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

                {/* Global Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-100 transition-colors"
                    title="Logout"
                >
                    <IconLogout size={16} />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
