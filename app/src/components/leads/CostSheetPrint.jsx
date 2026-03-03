import React from "react";
import { format } from "date-fns";

export const CostSheetPrint = React.forwardRef(({ data, leadData, selectedFlat }, ref) => {
    if (!data || !selectedFlat) return null;

    console.log("sheet:", selectedFlat)
    console.log("sheet_data:", data)

    const {
        saleableAreaSqFt,
        ratePerSqFt,
        discount,
        floorRise,
        floorRiseXPerSft,
        eastFacing,
        eastFacingXPerSft,
        corner,
        cornerXPerSft,
        amenities,
        baseCostUnit,
        totalCostofUnit,
        gst,
        costofUnitWithTax,
        manjeeraConnectionCharge,
        manjeeraMeterCharge,
        maintenceCharge,
        documentationFee,
        corpusFund,
        grandTotal,
        status,
        description
    } = data;

    const formatCurrency = (val) => {
        const num = Number(val);
        return isNaN(num) ? "0" : num.toLocaleString('en-IN');
    };

    const basicRate = Number(ratePerSqFt);
    const discountVal = Number(discount) || 0;
    const discountedRate = basicRate - discountVal;

    const floorNo = Number(selectedFlat.floor_no);
    const showFloorRise = floorNo >= 6;
    const isEastFacing = selectedFlat.facing === "East";
    const isCorner = selectedFlat.corner === true; // Assuming boolean true based on code

    // Calculations for display
    const totalFloorRiseCost = Number(floorRiseXPerSft) || 0;
    const totalEastFacingCost = Number(eastFacingXPerSft) || 0;
    const totalCornerCost = Number(cornerXPerSft) || 0;
    const amenitiesCost = Number(amenities) || 0;

    // Base Price Calculation for the table (Sum of all per-sft/fixed components before tax)
    // Formula based on screenshot seems to be: (Area * Rate) + FloorRise + Corner + EastFacing + Amenities
    // Wait, screenshot shows "Base Price" at the bottom of the first section.
    const basePrice = (Number(saleableAreaSqFt) * discountedRate) + totalFloorRiseCost + totalCornerCost + totalEastFacingCost + amenitiesCost;

    return (
        <div ref={ref} className="bg-white text-black text-sm font-sans w-[210mm] min-h-[297mm] mx-auto print:p-8 cost-sheet-container">
            <style>
                {`
                    @media print {
                        body { 
                            -webkit-print-color-adjust: exact !important; 
                            print-color-adjust: exact !important; 
                        }
                        @page { 
                            size: A4; 
                            margin: 0; 
                        }
                    }
                    
                    /* Explicit Reset & CSS for layout when Tailwind fails on server */
                    .cost-sheet-container * {
                        box-sizing: border-box !important;
                    }

                    .cost-sheet-container {
                        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                        color: #000 !important;
                        background-color: #fff !important;
                    }

                    .flex { display: flex !important; }
                    .justify-between { justify-content: space-between !important; }
                    .items-center { align-items: center !important; }

                    .grid { display: grid !important; }
                    .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
                    .col-span-12 { grid-column: span 12 / span 12 !important; }
                    .col-span-6 { grid-column: span 6 / span 6 !important; }
                    .col-span-3 { grid-column: span 3 / span 3 !important; }
                    
                    /* Use physical pixels for borders to avoid thick lines on some print drivers */
                    .border { border: 1px solid #000 !important; }
                    .border-2 { border: 1.5px solid #000 !important; }
                    .border-black { border-color: #000 !important; }
                    .border-b { border-bottom: 1px solid #000 !important; }
                    .border-r { border-right: 1px solid #000 !important; }
                    .border-t { border-top: 1px solid #000 !important; }
                    .border-gray-400 { border-color: #9ca3af !important; }
                    
                    .bg-yellow-300 { background-color: #fde047 !important; }
                    .bg-yellow-100 { background-color: #fef9c3 !important; }
                    .bg-green-400 { background-color: #4ade80 !important; }
                    .bg-white { background-color: #fff !important; }
                    .bg-gray-50 { background-color: #f9fafb !important; }
                    
                    .text-center { text-align: center !important; }
                    .text-right { text-align: right !important; }
                    .font-bold { font-weight: 700 !important; }
                    .font-black { font-weight: 900 !important; }
                    .uppercase { text-transform: uppercase !important; }
                    
                    .text-red-600 { color: #dc2626 !important; }
                    .text-gray-500 { color: #6b7280 !important; }
                    .text-gray-400 { color: #9ca3af !important; }
                    
                    /* Absolute font sizes and spacing in PX */
                    .text-sm { font-size: 13px !important; }
                    .text-xl { font-size: 18px !important; }
                    .text-[10px] { font-size: 10px !important; }
                    
                    .p-1 { padding: 4px !important; }
                    .p-2 { padding: 8px !important; }
                    .p-3 { padding: 12px !important; }
                    .p-8 { padding: 30px !important; }
                    .py-2 { padding-top: 8px !important; padding-bottom: 8px !important; }
                    .pt-2 { padding-top: 8px !important; }
                    .pl-2 { padding-left: 8px !important; }
                    .pr-2 { padding-right: 8px !important; }
                    
                    .mt-4 { margin-top: 16px !important; }
                    .mb-2 { margin-bottom: 8px !important; }

                    .h-6 { height: 24px !important; }
                    .min-h-[60px] { min-height: 60px !important; }

                    .invisible { visibility: hidden !important; }

                    .print-exact {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                `}
            </style>

            <div className="border-2 border-black">
                {/* Header */}
                <div className="bg-yellow-300 border-b border-black text-center py-2 font-bold text-xl uppercase print-exact">
                    {selectedFlat?.project_name}
                </div>

                {/* Table Grid */}
                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Unit ID</div>
                    <div className="col-span-6 p-1 text-center font-bold text-red-600 bg-yellow-100 print-exact">
                        {selectedFlat?.project_name} flat No {selectedFlat.flat_no}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Configuration</div>
                    <div className="col-span-6 p-1 text-center font-bold">{selectedFlat.type}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Floor</div>
                    <div className="col-span-6 p-1 text-center font-bold">{selectedFlat.floor_no}th Floor</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Orientation</div>
                    <div className="col-span-6 p-1 text-center font-bold text-red-600">{selectedFlat.facing} Facing {isCorner ? "+ Corner" : ""}</div>
                </div>

                {/* <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Status</div>
                    <div className="col-span-6 p-1 text-center font-bold">{status}</div>
                </div> */}

                {/* Column Headers */}
                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Description</div>
                    <div className="col-span-3 border-r border-black p-1 text-center">Discounted Value</div>
                    <div className="col-span-3 p-1 text-center">Actual Value</div>
                </div>

                {/* Rows */}
                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Super Built-up Area (in sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{saleableAreaSqFt}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{saleableAreaSqFt}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Basic Rate (per sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2"></div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(basicRate)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black bg-yellow-300 font-bold print-exact">
                    <div className="col-span-6 border-r border-black p-1 pl-2 text-red-600">Discounted Basic Rate (per sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2 text-red-600">{formatCurrency(discountedRate)}</div>
                    <div className="col-span-3 p-1 text-right pr-2"></div>
                </div>

                {showFloorRise && (
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-6 border-r border-black p-1 pl-2">Floor Rise Charges (₹ {floorRise} per sft)</div>
                        <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(totalFloorRiseCost)}</div>
                        <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(totalFloorRiseCost)}</div>
                    </div>
                )}

                {isCorner && (
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-6 border-r border-black p-1 pl-2">Corner Facing Premium (₹ {corner} per sft)</div>
                        <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(totalCornerCost)}</div>
                        <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(totalCornerCost)}</div>
                    </div>
                )}

                {isEastFacing && (
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-6 border-r border-black p-1 pl-2">East Facing Premium (₹ {eastFacing} per sft)</div>
                        <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(totalEastFacingCost)}</div>
                        <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(totalEastFacingCost)}</div>
                    </div>
                )}

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Amenities Charges</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(amenitiesCost)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(amenitiesCost)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Base Price</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(basePrice)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(Number(totalCostofUnit) + (Number(discount) * Number(saleableAreaSqFt)))}</div>
                    {/* Note: Actual Value Base Price logic might differ, using derived calculation */}
                </div>

                {/* Spacer Row */}
                <div className="grid grid-cols-12 border-b border-black h-6">
                    <div className="col-span-6 border-r border-black"></div>
                    <div className="col-span-3 border-r border-black"></div>
                    <div className="col-span-3"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2"></div>
                    <div className="col-span-3 border-r border-black p-1 text-center">Amount</div>
                    <div className="col-span-3 p-1 text-center">Amount</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Total Cost (A)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(basePrice)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(Number(totalCostofUnit) + (Number(discount) * Number(saleableAreaSqFt)))}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">GST 5% (A)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(gst)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency((Number(totalCostofUnit) + (Number(discount) * Number(saleableAreaSqFt))) * 0.05)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Corpus Fund (₹ 50 per sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(corpusFund)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(corpusFund)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Maintenance Charges (₹ 3 for 24 months)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(maintenceCharge)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(maintenceCharge)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Documentation Fee</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(documentationFee)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(documentationFee)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Manjeera connection</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(manjeeraConnectionCharge)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(manjeeraConnectionCharge)}</div>
                </div>

                {/* Notes / Description from Form if available */}


                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Manjeera connection Meter</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(manjeeraMeterCharge)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(manjeeraMeterCharge)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black h-6">
                    <div className="col-span-6 border-r border-black p-1 pl-2 font-bold">Total Cost (B)</div>
                    <div className="col-span-3 border-r border-black"></div>
                    <div className="col-span-3"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Final Summary</div>
                    <div className="col-span-6 p-1 text-center">Amount</div>
                </div>

                {/* Grand Totals */}
                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Grand Total</div>
                    <div className="col-span-6 p-1 text-right bg-green-400 pr-2 print-exact">{formatCurrency(Number(grandTotal) + (Number(discount) * Number(saleableAreaSqFt) * 1.05))}</div> {/* Approximating Actual Grand Total */}
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold bg-yellow-300 print-exact">
                    <div className="col-span-6 border-r border-black p-1 pl-2 text-red-600">Discounted Grand Total</div>
                    <div className="col-span-6 p-1 text-right pr-2 text-red-600">{formatCurrency(grandTotal)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold bg-yellow-300">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Discount Amount</div>
                    {/* Discount calculation is (Area * Discount) + (Area * Discount * 0.05 GST) approx? or just Area * Discount. Based on structure, it's difference between Actual and Discounted */}
                    <div className="col-span-6 p-1 text-right pr-2 text-red-600 font-bold">{formatCurrency((Number(grandTotal) + (Number(discount) * Number(saleableAreaSqFt) * 1.05)) - Number(grandTotal))}</div>
                </div>

            </div>

            {/* Notes Section - Outside main box for manual writing */}
            <div className="mt-4 border-2 border-black p-3">
                <div className="font-bold text-sm mb-2">Notes / Remarks:</div>
                {description && (
                    <div className="text-sm mb-2 text-red-600">{description}</div>
                )}
                <div className="border-t border-gray-400 pt-2 min-h-[60px]"></div>
            </div>
        </div>
    );
});

CostSheetPrint.displayName = "CostSheetPrint";
