import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { IconShieldCheck, IconRefresh, IconArrowLeft, IconCheck } from '@tabler/icons-react';
import Generalapi from '../api/Generalapi';
import { toast } from 'react-toastify';

const OTPVerifyStep = ({ employeeData, customerData, flatId, onVerify, isLoading, onBack, debugOtps, setDebugOtps }) => {
    const [empOtp, setEmpOtp] = useState('');
    const [custOtp, setCustOtp] = useState('');
    const [resending, setResending] = useState(null);

    const handleResend = async (target) => {
        setResending(target);
        try {
            const response = await Generalapi.post('/resend-redemption-otp', {
                flat_id: flatId,
                employee_id: employeeData.id,
                customer_id: customerData.id,
                target: target
            });
            if (response.data.status === "success") {
                toast.success(`OTP resent to ${target}`);
                if (response.data.otp) {
                    setDebugOtps(prev => ({
                        ...prev,
                        [target]: response.data.otp
                    }));
                }
            }
        } catch (error) {
            toast.error("Failed to resend OTP");
        } finally {
            setResending(null);
        }
    };

    const isComplete = empOtp.length === 6 && custOtp.length === 6;

    return (
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8 flex flex-col items-center text-center space-y-2 border-b border-gray-50">
                <div className="bg-blue-50 p-3 rounded-2xl text-[#0083bf] mb-2">
                    <IconShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Security Verification</h2>
                <p className="text-gray-500 max-w-sm">Enter the 6-digit codes sent to the registered mobile numbers</p>
            </div>

            <div className="p-8 space-y-8">
                {/* Employee OTP */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-sm font-bold text-gray-700">Employee OTP</label>
                        <button
                            onClick={() => handleResend('employee')}
                            disabled={resending === 'employee'}
                            className="text-xs font-bold text-[#0083bf] hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                            <IconRefresh size={14} className={resending === 'employee' ? "animate-spin" : ""} /> Resend
                        </button>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Input
                            type="text"
                            maxLength={6}
                            value={empOtp}
                            onChange={(e) => setEmpOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="······"
                            className="text-center text-2xl font-bold tracking-[10px] h-14 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-[#0083bf] rounded-2xl transition-all"
                        />
                    </div>
                </div>

                {/* Customer OTP */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-sm font-bold text-gray-700">Customer OTP</label>
                        <button
                            onClick={() => handleResend('customer')}
                            disabled={resending === 'customer'}
                            className="text-xs font-bold text-[#0083bf] hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                            <IconRefresh size={14} className={resending === 'customer' ? "animate-spin" : ""} /> Resend
                        </button>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Input
                            type="text"
                            maxLength={6}
                            value={custOtp}
                            onChange={(e) => setCustOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="······"
                            className="text-center text-2xl font-bold tracking-[10px] h-14 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-[#0083bf] rounded-2xl transition-all"
                        />
                    </div>
                </div>

                {/* Debug / Test Mode Display */}
                {debugOtps && (debugOtps.employee || debugOtps.customer) && (
                    <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-[24px] space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[2px]">Testing Information</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 p-3 rounded-xl border border-amber-200/50">
                                <p className="text-[9px] font-bold text-amber-500 uppercase mb-1">Emp OTP</p>
                                <p className="text-lg font-black text-amber-900 tracking-widest">{debugOtps.employee || '------'}</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-xl border border-amber-200/50">
                                <p className="text-[9px] font-bold text-amber-500 uppercase mb-1">Cust OTP</p>
                                <p className="text-lg font-black text-amber-900 tracking-widest">{debugOtps.customer || '------'}</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-amber-600/70 font-medium italic">This panel is only visible during testing phase.</p>
                    </div>
                )}
            </div>

            <div className="p-8 bg-gray-50 flex flex-col gap-4">
                <Button
                    onClick={() => onVerify({ employeeOtp: empOtp, customerOtp: custOtp })}
                    disabled={!isComplete || isLoading}
                    className="h-14 bg-[#0083bf] hover:bg-[#006e9f] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 active:scale-[0.98] transition-all"
                >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                </Button>
                <button
                    onClick={onBack}
                    className="text-gray-400 font-medium text-sm flex items-center justify-center gap-2 hover:text-gray-600 transition-colors"
                >
                    <IconArrowLeft size={16} /> Back to details
                </button>
            </div>
        </div>
    );
};

export default OTPVerifyStep;
