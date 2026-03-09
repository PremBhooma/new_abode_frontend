import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "../../ui/sheet";
import { Button } from "../../ui/button";

function Singleprojectdetails({ projectData, isOpen, onClose }) {
    if (!projectData) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[700px] overflow-y-auto w-full !p-4">
                <div className="w-full mx-auto p-2">
                    <SheetHeader className="px-0">
                        <SheetTitle className="text-2xl font-bold">{projectData.project_name}</SheetTitle>
                        {/* <SheetDescription>{projectData.project_address}</SheetDescription> */}
                    </SheetHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Pricing Section */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Base Pricing</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-gray-500">Corner Price:</span>
                                <span className="font-medium">₹{projectData.project_corner_price || "0"}</span>

                                <span className="text-gray-500">East Price:</span>
                                <span className="font-medium">₹{projectData.project_east_price || "0"}</span>

                                <span className="text-gray-500">6th Floor+ Price:</span>
                                <span className="font-medium">₹{projectData.project_six_floor_onwards_price || "0"}</span>
                            </div>
                        </div>

                        {/* Additional Charges Section */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Additional Charges</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-gray-500">GST Percentage:</span>
                                <span className="font-medium">{projectData.gst_percentage || "5"}%</span>

                                <span className="text-gray-500">Manjeera Conn.:</span>
                                <span className="font-medium">₹{projectData.manjeera_connection_charges || "0"}</span>

                                <span className="text-gray-500">Manjeera Meter:</span>
                                <span className="font-medium">₹{projectData.manjeera_meter_charges || "0"}</span>

                                <span className="text-gray-500">Documentation Fee:</span>
                                <span className="font-medium">₹{projectData.documentation_fee || "0"}</span>
                            </div>
                        </div>

                        {/* Registration & Maintenance Section */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="font-semibold text-lg border-b pb-2 text-slate-800">Registration, Maintenance & Corpus Fund</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                                {/* Card 1: Orange/Red Gradient */}
                                <div className="relative overflow-hidden flex flex-col gap-1 border-none p-5 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-white">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-[2px] pointer-events-none"></div>
                                    <div className="absolute -bottom-8 -right-4 w-24 h-24 rounded-full bg-white/10 blur-[2px] pointer-events-none"></div>
                                    <span className="text-white/90 text-xs uppercase tracking-wider font-semibold relative z-10 drop-shadow-sm">Reg. (%)</span>
                                    <span className="font-bold text-3xl relative z-10 drop-shadow-sm mt-1">{projectData.registration_percentage || "0"}%</span>
                                </div>

                                {/* Card 2: Cyan/Blue Gradient */}
                                <div className="relative overflow-hidden flex flex-col gap-1 border-none p-5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-white">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-[2px] pointer-events-none"></div>
                                    <div className="absolute -bottom-8 -right-4 w-24 h-24 rounded-full bg-white/10 blur-[2px] pointer-events-none"></div>
                                    <span className="text-white/90 text-xs uppercase tracking-wider font-semibold relative z-10 drop-shadow-sm">Reg. Base Charge</span>
                                    <span className="font-bold text-3xl relative z-10 drop-shadow-sm mt-1">₹{projectData.registration_base_charge || "0"}</span>
                                </div>

                                {/* Card 3: Emerald/Teal Gradient */}
                                <div className="relative overflow-hidden flex flex-col gap-1 border-none p-5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-white">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-[2px] pointer-events-none"></div>
                                    <div className="absolute -bottom-8 -right-4 w-24 h-24 rounded-full bg-white/10 blur-[2px] pointer-events-none"></div>
                                    <span className="text-white/90 text-xs uppercase tracking-wider font-semibold relative z-10 drop-shadow-sm">Maintenance</span>
                                    <span className="font-bold text-3xl relative z-10 drop-shadow-sm mt-1">
                                        ₹{projectData.maintenance_rate_per_sqft || "0"}
                                        <span className="text-sm font-medium text-white/80 block mt-1">/sq.ft ({projectData.maintenance_duration_months || "0"} mos)</span>
                                    </span>
                                </div>

                                {/* Card 4: Violet/Purple Gradient */}
                                <div className="relative overflow-hidden flex flex-col gap-1 border-none p-5 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-white">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-[2px] pointer-events-none"></div>
                                    <div className="absolute -bottom-8 -right-4 w-24 h-24 rounded-full bg-white/10 blur-[2px] pointer-events-none"></div>
                                    <span className="text-white/90 text-xs uppercase tracking-wider font-semibold relative z-10 drop-shadow-sm">Corpus Fund</span>
                                    <span className="font-bold text-3xl relative z-10 drop-shadow-sm mt-1">
                                        ₹{projectData.corpus_fund || "0"}
                                        <span className="text-sm font-medium text-white/80 block mt-1">* SFT</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="px-0 mt-8 mb-4">
                        <SheetClose asChild>
                            <Button variant="outline" className="w-full" onClick={() => onClose(false)}>Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default Singleprojectdetails;
