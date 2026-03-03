import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { IconGift, IconConfetti, IconArrowRight, IconPrinter } from '@tabler/icons-react';
import Generalapi from '../api/Generalapi';
import { useReactToPrint } from 'react-to-print';
import PrintableCoupon from './PrintableCoupon';
import { useRef } from 'react';

const GiftReveal = ({ redemptionData, onReset, rewardId, customerData, selectedFlat }) => {
    // If rewards_step is 5, the gift was already revealed - show revealed state directly
    const [revealed, setRevealed] = useState(redemptionData?.rewards_step === 5);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [showConfetti, setShowConfetti] = useState(false);

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Reward_Flat_${selectedFlat?.flat_no || 'N/A'}`,
    });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleReveal = async () => {
        setRevealed(true);
        setShowConfetti(true);

        // Update rewards_step to 5 in the backend
        if (rewardId) {
            try {
                await Generalapi.post('/update-reward-step', {
                    reward_id: rewardId,
                    step: 5
                });
            } catch (error) {
                console.error("Error updating reward step:", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] relative">
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} colors={['#0083bf', '#60a5fa', '#3b82f6', '#1e40af']} />}

            <AnimatePresence mode="wait">
                {!revealed ? (
                    <motion.div
                        key="box"
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="cursor-pointer group flex flex-col items-center gap-8"
                        onClick={handleReveal}
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-48 h-48 bg-[#0083bf] rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,131,191,0.5)] flex items-center justify-center"
                            >
                                <IconGift size={80} className="text-white group-hover:scale-110 transition-transform" />
                            </motion.div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-4 border-dashed border-blue-200 rounded-[45px] scale-110 -z-10 group-hover:animate-spin-slow" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Verification Complete!</h2>
                            <p className="text-gray-500 font-medium max-w-xs mx-auto">Click the box to reveal your amazing gift</p>
                        </div>

                        <Button className="bg-[#0083bf] hover:bg-[#006e9f] text-white px-10 h-14 rounded-2xl font-bold text-lg animate-bounce mt-4 shadow-xl shadow-blue-200">
                            Reveal Your Gift 🎁
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed"
                        initial={{ opacity: 0, scale: 0.5, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 15, stiffness: 100 }}
                        className="bg-white rounded-[40px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden w-full max-w-md"
                    >
                        <div className="h-4 w-full bg-[#0083bf]" />
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-6 ring-8 ring-blue-50/50">
                                <img
                                    src={redemptionData?.coupon_gift_pic_url}
                                    alt="Gift"
                                    crossOrigin='anonymous'
                                    className="w-24 h-24 object-contain rounded-2xl"
                                    onError={(e) => e.target.src = "https://placehold.co/100x100?text=Gift"}
                                />
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 text-[#0083bf] text-xs font-black uppercase tracking-widest mb-4">
                                    CONGRATULATIONS!
                                </span>
                                <h3 className="text-4xl font-black text-gray-900 mb-2 drop-shadow-sm">
                                    {redemptionData?.coupon_name}
                                </h3>
                                <p className="text-gray-400 font-bold tracking-tight">
                                    ID: <span className="text-gray-600 font-black">{redemptionData?.coupon_gift_id}</span>
                                </p>
                            </motion.div>

                            {/* Customer Details */}
                            <div className="w-full bg-gray-50 rounded-2xl p-4 mt-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Redeemed By</p>
                                <p className="text-base font-black text-gray-900">{customerData?.name || 'N/A'}</p>
                                <p className="text-sm font-medium text-gray-500">{customerData?.phone || 'N/A'}</p>
                            </div>

                            <div className="w-full flex flex-col gap-3 mt-8">
                                <Button
                                    onClick={handlePrint}
                                    className="w-full h-14 bg-[#0083bf] hover:bg-[#006e9f] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    <IconPrinter size={22} /> Print Gift Coupon
                                </Button>

                                <Button
                                    onClick={onReset}
                                    variant="outline"
                                    className="w-full h-14 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:text-gray-900 hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    Redeem Another <IconArrowRight size={18} />
                                </Button>
                            </div>

                            <div className="w-full h-px bg-gray-100 my-8 flex items-center justify-center">
                                <div className="bg-white px-4 text-[10px] font-bold text-gray-300 tracking-[4px] uppercase">Abode Developers Rewards</div>
                            </div>

                            {/* <Button
                                onClick={onReset}
                                variant="outline"
                                className="w-full h-14 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:text-gray-900 hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                Redeem Another <IconArrowRight size={18} />
                            </Button> */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden printable component */}
            <div className="hidden">
                <PrintableCoupon
                    ref={componentRef}
                    redemptionData={redemptionData}
                    customerData={customerData}
                    selectedFlat={selectedFlat}
                />
            </div>
        </div>
    );
};

export default GiftReveal;
