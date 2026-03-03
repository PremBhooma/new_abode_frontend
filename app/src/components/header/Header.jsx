import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconSearch, IconMenu2, IconLogout } from "@tabler/icons-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { employeeInfo, resetEmployeeAuthdetails, isLogged } = useEmployeeDetails();

    // Search state removed as it's now handled in the dedicated Search page logic
    const isSearchPage = location.pathname.startsWith("/search");

    const handleLogout = () => {
        resetEmployeeAuthdetails();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 h-16 px-4 md:px-6 flex items-center justify-between">
            {/* Left: Sidebar Toggle & Title (Mobile) */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                    <IconMenu2 size={24} />
                </button>

                {/* On mobile, we might want to show title if sidebar logo is hidden */}
                <div className="lg:hidden font-semibold text-lg text-neutral-900">
                    Econest
                </div>
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">

                {/* Search Icon */}
                {!isSearchPage && (
                    <Link
                        to="/search"
                        className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                        title="Search"
                    >
                        <IconSearch size={22} stroke={1.5} />
                    </Link>
                )}

                {/* Global Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                >
                    <IconLogout size={20} />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
