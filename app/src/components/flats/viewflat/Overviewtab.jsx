import React from "react";

function Overviewtab({ customerFlatDetails, paymentSummary }) {
    if (!customerFlatDetails) return null;

    const formatPrice = (price) => {
        if (price === null || price === undefined || price === "") return "---";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(price);
    };

    // Safe fetch from paymentsList
    const calculatePaid = (towardsCategories) => {
        if (!paymentsList || paymentsList.length === 0) return 0;
        return paymentsList
            .filter((p) => towardsCategories.includes(p?.payment_towards))
            .reduce((sum, p) => sum + (parseFloat(p?.amount) || 0), 0);
    };

    const saleableAreaSqFt = customerFlatDetails?.saleable_area_sq_ft || 0;
    const basicRate = customerFlatDetails?.base_cost_unit || 0;
    const ratePerSqFt = customerFlatDetails?.rate_per_sq_ft || 0;
    const discount = customerFlatDetails?.discount || 0;

    const discountedRate = Number(ratePerSqFt) - Number(discount);

    const floorRise = customerFlatDetails?.floor_rise_per_sq_ft || 0;
    const totalFloorRiseCost = customerFlatDetails?.total_floor_rise || 0;

    const corner = customerFlatDetails?.corner_per_sq_ft || 0;
    const totalCornerCost = customerFlatDetails?.total_corner || 0;

    const eastFacing = customerFlatDetails?.east_facing_per_sq_ft || 0;
    const totalEastFacingCost = customerFlatDetails?.total_east_facing || 0;

    const amenitiesCost = customerFlatDetails?.amenities || 0;

    const basePrice = (Number(saleableAreaSqFt) * discountedRate) + Number(totalFloorRiseCost) + Number(totalCornerCost) + Number(totalEastFacingCost) + Number(amenitiesCost);

    const totalCostofUnit = customerFlatDetails?.toatlcostofuint || 0;
    const gst = customerFlatDetails?.gst || 0;
    const costOfUnitWithTax = customerFlatDetails?.costofunitwithtax || 0;

    const registrationCharge = customerFlatDetails?.registrationcharge || 0;
    const manjeeraConnectionCharge = customerFlatDetails?.manjeera_connection_charge || 0;
    const manjeeraMeterCharge = customerFlatDetails?.manjeera_meter_charge || 0;
    const maintenanceCharge = customerFlatDetails?.maintenancecharge || 0;
    const documentationFee = customerFlatDetails?.documentaionfee || 0;
    const corpusFund = customerFlatDetails?.corpusfund || 0;

    const grandTotal = customerFlatDetails?.grand_total || 0;

    const totalAmountPaid = paymentsList ? paymentsList.reduce((sum, p) => sum + (parseFloat(p?.amount) || 0), 0) : 0;


    console.log("customerFlatDetails_overview_tab:", customerFlatDetails)
    console.log("paymentsList:", paymentsList)

    return (
        <div className="w-full bg-white rounded-lg shadow-md mt-4 overflow-x-auto text-sm">
            <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-200 font-bold text-gray-700">
                    <div className="col-span-4 p-3 border-r border-gray-200">Description</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200">Rate / Unit</div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200">Total Cost (₹)</div>
                    <div className="col-span-3 p-3 text-right text-[#0083bf]">Amount Paid (₹)</div>
                </div>

                {/* Rows */}
                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Saleable Area (sq.ft)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{saleableAreaSqFt}</div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800"></div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 bg-yellow-50/50 hover:bg-yellow-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-red-600">Rate Per Sq.ft (₹)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-red-600">{formatPrice(discountedRate)}</div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800"></div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Base Cost of Unit (₹)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(basicRate)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                </div>

                {Number(totalFloorRiseCost) > 0 && (
                    <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                        <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Floor Rise Charges (₹ {floorRise} per sq.ft)</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(totalFloorRiseCost)}</div>
                        <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(totalFloorRiseCost)}</div>
                        <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                    </div>
                )}

                {Number(totalCornerCost) > 0 && (
                    <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                        <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Corner Facing Premium (₹ {corner} per sq.ft)</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(totalCornerCost)}</div>
                        <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(totalCornerCost)}</div>
                        <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                    </div>
                )}

                {Number(totalEastFacingCost) > 0 && (
                    <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                        <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">East Facing Premium (₹ {eastFacing} per sq.ft)</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(totalEastFacingCost)}</div>
                        <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(totalEastFacingCost)}</div>
                        <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                    </div>
                )}

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Amenities Charges</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(amenitiesCost)}</div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(amenitiesCost)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                </div>

                {/* Base Price Summary */}
                <div className="grid grid-cols-12 border-b-2 border-gray-300 bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-bold text-gray-900">Total Cost of Unit</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-bold text-gray-900">{formatPrice(basePrice)}</div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-bold text-gray-900">{formatPrice(totalCostofUnit)}</div>
                    <div className="col-span-3 p-3 text-right font-bold text-[#0083bf] bg-blue-50/30">
                        {formatPrice(calculatePaid(["Flat Cost", "Flat Cost (Base Price)", "Base Price"]))}
                    </div>
                </div>

                {/* Taxes & Additional Charges */}
                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 mt-1">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">GST (5%)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(gst)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(calculatePaid(["GST"]))}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b-2 border-gray-300 bg-gray-50 hover:bg-gray-100">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-bold text-gray-900">Cost of Unit with Tax</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-bold text-gray-900">{formatPrice(costOfUnitWithTax)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30"></div>
                </div>

                {/* Other Fees */}
                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Corpus Fund</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(corpusFund)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(calculatePaid(["Corpus Fund"]))}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Maintenance Charges</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(maintenanceCharge)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(calculatePaid(["Maintenance", "Maintenance Charges"]))}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Documentation Fee</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(documentationFee)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(calculatePaid(["Documentation", "Documentation Fee", "Documentation Charges"]))}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 mt-1">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Manjeera Connection Charge</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(manjeeraConnectionCharge)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(calculatePaid(["Manjeera Connection", "Manjeera Connection Charge"]))}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 mt-1">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Manjeera Connection Meter</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-3 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(manjeeraMeterCharge)}</div>
                    <div className="col-span-3 p-3 text-right text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(calculatePaid(["Manjeera Connection Meter", "Manjeera Meter", "Manjeera Meter Charge"]))}
                    </div>
                </div>

                {/* Grand Total */}
                <div className="grid grid-cols-12 bg-gray-100 border-t-2 border-gray-400">
                    <div className="col-span-6 p-4 border-r border-gray-300 font-bold text-gray-900 text-base uppercase">Grand Total</div>
                    <div className="col-span-3 p-4 text-right border-r border-gray-300 font-bold text-gray-900 text-base">{formatPrice(grandTotal)}</div>
                    <div className="col-span-3 p-4 text-right border-r border-gray-300 font-bold text-[#0083bf] text-base bg-blue-100/50">{formatPrice(totalAmountPaid)}</div>
                </div>

                {/* Balance Amount */}
                <div className="grid grid-cols-12 bg-red-50/50 border-t border-gray-200">
                    <div className="col-span-9 p-3 border-r border-gray-200 font-bold text-red-600 text-right">Balance Due</div>
                    <div className="col-span-3 p-3 text-right font-bold text-red-600 text-base">
                        {formatPrice(grandTotal - totalAmountPaid)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overviewtab;
