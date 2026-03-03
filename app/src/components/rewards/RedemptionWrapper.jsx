import React, { useState, useEffect } from 'react';
import DetailStep from './DetailStep';
import OTPVerifyStep from './OTPVerifyStep';
import GiftReveal from './GiftReveal';
import Generalapi from '../api/Generalapi';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';

const RedemptionWrapper = ({ selectedFlat, onReset, existingRewardData, onVerified }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Reveal
    const [employeeData, setEmployeeData] = useState({ name: '', phone: '', id: '' });
    const [customerData, setCustomerData] = useState({ name: '', phone: '', id: '' });
    const [redemptionData, setRedemptionData] = useState(null);
    const [debugOtps, setDebugOtps] = useState({ employee: '', customer: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedFlat) {
            setCustomerData({
                name: selectedFlat.customer_name,
                phone: selectedFlat.customer_phone || '',
                id: selectedFlat.customer_id
            });
            fetchEmployeeInfo();

            // If there's existing reward data with step >= 4, skip to GiftReveal
            if (existingRewardData?.rewards_step >= 4) {
                setRedemptionData(existingRewardData);
                setStep(3); // Go to GiftReveal screen
            }
        }
    }, [selectedFlat, existingRewardData]);

    const fetchEmployeeInfo = async () => {
        try {
            const response = await Generalapi.get('/get-logged-in-employee');
            if (response.data.status === "success") {
                setEmployeeData({
                    name: response.data.data.name,
                    phone: response.data.data.phone_number || '',
                    id: response.data.data.id
                });
            }
        } catch (error) {
            console.error("Error fetching employee info:", error);
        }
    };

    const handleGetOTP = async (updatedPhones) => {
        setIsLoading(true);
        try {
            const response = await Generalapi.post('/send-redemption-otp', {
                flat_id: selectedFlat.id,
                employee_id: employeeData.id,
                customer_id: customerData.id,
                employee_phone: updatedPhones.employeePhone,
                customer_phone: updatedPhones.customerPhone,
                project_id: selectedFlat.project_id
            });

            if (response.data.status === "success") {
                toast.success("OTPs sent successfully");
                if (response.data.debug) {
                    setDebugOtps({
                        employee: response.data.debug.employee_otp,
                        customer: response.data.debug.customer_otp
                    });
                }
                setStep(2);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Send OTP Error:", error);
            toast.error("Failed to send OTPs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (otps) => {
        setIsLoading(true);
        try {
            const response = await Generalapi.post('/verify-redemption-otp', {
                flat_id: selectedFlat.id,
                employee_id: employeeData.id,
                customer_id: customerData.id,
                employee_otp: otps.employeeOtp,
                customer_otp: otps.customerOtp
            });

            if (response.data.status === "success") {
                setRedemptionData(response.data.data);
                if (onVerified) onVerified(response.data.data);
                toast.success("OTPs Verified!");
                setStep(3);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Verify OTP Error:", error);
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <DetailStep
                            selectedFlat={selectedFlat}
                            employeeData={employeeData}
                            customerData={customerData}
                            onNext={handleGetOTP}
                            isLoading={isLoading}
                        />
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <OTPVerifyStep
                            employeeData={employeeData}
                            customerData={customerData}
                            flatId={selectedFlat.id}
                            onVerify={handleVerifyOTP}
                            isLoading={isLoading}
                            onBack={() => setStep(1)}
                            debugOtps={debugOtps}
                            setDebugOtps={setDebugOtps}
                        />
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        <GiftReveal
                            redemptionData={redemptionData}
                            onReset={onReset}
                            rewardId={redemptionData?.id}
                            customerData={customerData}
                            selectedFlat={selectedFlat}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RedemptionWrapper;
