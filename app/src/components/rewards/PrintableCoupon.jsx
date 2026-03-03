import React from 'react';
import { IconScissors } from '@tabler/icons-react';

const PrintableCoupon = React.forwardRef(({ redemptionData, customerData, selectedFlat }, ref) => {
    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div ref={ref} className="p-8 pt-12 bg-white w-[210mm] min-h-[297mm] mx-auto text-gray-900 font-sans print:p-0 print:pt-16">
            {/* Top Section - Full Design */}
            <div className="border-[12px] border-[#0083bf] p-8 relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#0083bf] opacity-5 -mr-20 -mt-20 rounded-full" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#0083bf] opacity-5 -ml-30 -mb-30 rounded-full" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <h1 className="text-4xl font-black text-[#0083bf] leading-tight mb-2">CONGRATULATIONS!</h1>
                        <p className="text-lg font-bold text-gray-400">ECONEST REWARDS GIFT COUPON</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Date Issued</p>
                        <p className="text-lg font-black">{today}</p>
                    </div>
                </div>

                <div className="flex gap-8 mb-8 relative z-10">
                    <div className="w-48 h-48 bg-gray-50 rounded-[30px] flex items-center justify-center border-4 border-[#0083bf]/10 shadow-inner">
                        <img
                            src={redemptionData?.coupon_gift_pic_url}
                            alt="Gift"
                            crossOrigin='anonymous'
                            className="w-32 h-32 object-contain"
                            onError={(e) => e.target.src = "https://placehold.co/200x200?text=Gift"}
                        />
                    </div>

                    <div className="flex-1 py-2">
                        <div className="mb-6">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Gift Won</p>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">{redemptionData?.coupon_name}</h2>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Coupon ID</p>
                            <p className="text-2xl font-black text-[#0083bf] tracking-wider">{redemptionData?.coupon_gift_id}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-3xl p-6 border border-gray-100 relative z-10 mb-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Customer Name</p>
                        <p className="text-xl font-black text-gray-900">{customerData?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="text-xl font-black text-gray-900">{customerData?.phone || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Project</p>
                            <p className="text-lg font-black text-[#0083bf]">{selectedFlat?.project_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Flat No</p>
                            <p className="text-lg font-black text-[#0083bf]">{selectedFlat?.flat_no || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cut Line */}
            <div className="my-8 relative h-px border-t-4 border-dashed border-gray-300">
                <div className="absolute left-10 -top-4 bg-white px-2 text-gray-400 transform rotate-[-90deg]">
                    <IconScissors size={24} />
                </div>
                <div className="absolute right-10 -top-4 bg-white px-2 py-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    Cut along the line for records
                </div>
            </div>

            {/* Bottom Section - Essential Info */}
            <div className="border-4 border-gray-100 rounded-[24px] p-6 bg-gray-50/50 flex gap-6 items-center">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                    <img
                        src={redemptionData?.coupon_gift_pic_url}
                        alt="Gift"
                        crossOrigin='anonymous'
                        className="w-16 h-16 object-contain"
                        onError={(e) => e.target.src = "https://placehold.co/100x100?text=Gift"}
                    />
                </div>

                <div className="flex-1 grid grid-cols-2 gap-y-3">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Coupon ID</p>
                        <p className="text-base font-black text-[#0083bf]">{redemptionData?.coupon_gift_id}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                        <p className="text-base font-black">{today}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Customer</p>
                        <p className="text-base font-black truncate">{customerData?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone</p>
                        <p className="text-base font-black">{customerData?.phone || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 mt-1 pt-2 border-t border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Flat Details</p>
                        <p className="text-xs font-bold text-gray-600">
                            {selectedFlat?.project_name} | Flat: {selectedFlat?.flat_no}
                        </p>
                    </div>
                </div>

                <div className="w-24 text-center border-l-2 border-gray-100 pl-4">
                    <p className="text-[8px] font-black text-gray-300 uppercase leading-none mb-1">Office Copy</p>
                    <p className="text-[8px] font-black text-gray-300 uppercase leading-none">Record Section</p>
                </div>
            </div>

            <style>
                {`
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                        @page { size: A4; margin: 0; }
                    }
                `}
            </style>
        </div>
    );
});

PrintableCoupon.displayName = 'PrintableCoupon';

export default PrintableCoupon;
