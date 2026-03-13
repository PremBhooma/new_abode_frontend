import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconX, IconClock } from "@tabler/icons-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import profileStatic from "@/assets/dashboard/user.png";

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { employeeInfo, resetEmployeeAuthdetails } = useEmployeeDetails();
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = `${dateTime.getDate()} ${dateTime.toLocaleDateString('en-US', { weekday: 'long' })} ${dateTime.getFullYear()}`;
    const formattedTime = dateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).toUpperCase();

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
            </div>

            {/* Right: Date, Time & Profile */}
            <div className="flex items-center gap-3 md:gap-6 ml-auto">
                {/* Real-time Clock Section */}
                <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-slate-50/50 border border-slate-100 rounded-full">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-[#0083bf]/10 rounded-full">
                            <IconClock size={16} className="text-[#0083bf]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-700 leading-tight">
                                {formattedTime}
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 leading-tight">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>

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
