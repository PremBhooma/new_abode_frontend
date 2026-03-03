import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { IconUser, IconPhone, IconHome, IconChevronRight } from '@tabler/icons-react';

const DetailStep = ({ selectedFlat, employeeData, customerData, onNext, isLoading }) => {
    const [empPhone, setEmpPhone] = useState(employeeData.phone || "");
    const [custPhone, setCustPhone] = useState(customerData.phone || "");

    useEffect(() => {
        if (employeeData?.phone) {
            setEmpPhone(employeeData.phone);
        }
    }, [employeeData?.phone]);

    useEffect(() => {
        if (customerData?.phone) {
            setCustPhone(customerData.phone);
        }
    }, [customerData?.phone]);

    const isValid = empPhone.length === 10 && custPhone.length === 10;

    const handleNext = () => {
        if (!isValid) return;

        if (empPhone === custPhone) {
            toast.error("Employee and Customer phone numbers cannot be the same");
            return;
        }

        onNext({ employeePhone: empPhone, customerPhone: custPhone });
    };

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0083bf] p-6 text-white">
                <div className="flex items-center gap-3 opacity-90 mb-2">
                    <IconHome size={20} />
                    <span className="text-sm font-medium uppercase tracking-wider">Redemption Details</span>
                </div>
                <h2 className="text-2xl font-bold">{selectedFlat.flat_no}</h2>
                <p className="text-blue-100 text-sm mt-1">{selectedFlat.project_name}</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Employee Section */}
                <div className="space-y-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-md group">
                    <div className="flex items-center gap-3 text-[#0083bf] border-b border-blue-100 pb-4">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <IconUser size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Employee</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Name</label>
                            <p className="font-semibold text-gray-800 py-1">{employeeData.name || "Loading..."}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Mobile Number</label>
                            <div className="relative group/input">
                                <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/input:text-[#0083bf]" />
                                <Input
                                    type="text"
                                    maxLength={10}
                                    value={empPhone}
                                    onChange={(e) => setEmpPhone(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Enter 10 digit number"
                                    className="pl-10 h-11 bg-white border-gray-200 focus:border-[#0083bf] focus:ring-[#0083bf]/10 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Section */}
                <div className="space-y-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-md group">
                    <div className="flex items-center gap-3 text-[#0083bf] border-b border-blue-100 pb-4">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <IconUser size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Customer</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Name</label>
                            <p className="font-semibold text-gray-800 py-1">{customerData.name}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Mobile Number</label>
                            <div className="relative group/input">
                                <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/input:text-[#0083bf]" />
                                <Input
                                    type="text"
                                    maxLength={10}
                                    value={custPhone}
                                    onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Enter 10 digit number"
                                    className="pl-10 h-11 bg-white border-gray-200 focus:border-[#0083bf] focus:ring-[#0083bf]/10 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 pt-0 flex justify-center">
                <Button
                    onClick={handleNext}
                    disabled={!isValid || isLoading}
                    className="h-14 px-12 bg-[#0083bf] hover:bg-[#006e9f] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 group"
                >
                    {isLoading ? "Sending OTP..." : (
                        <span className="flex items-center gap-2">
                            Get OTP to Verify <IconChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default DetailStep;
