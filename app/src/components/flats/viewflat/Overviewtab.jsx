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

    // Calculate total amount paid from the provided payment summary mapping
    const totalAmountPaid = paymentSummary ? Object.values(paymentSummary).reduce((sum, item) => sum + (Number(item?.paid) || 0), 0) : 0;

    return (
        <div className="w-full bg-white rounded-lg shadow-md mt-4 overflow-x-auto text-sm">
            <div className="min-w-[900px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-200 font-bold text-gray-700">
                    <div className="col-span-4 p-3 border-r border-gray-200">Description</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200">Rate / Unit</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200">Total Cost (₹)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-[#0083bf]">Amount Paid (₹)</div>
                    <div className="col-span-2 p-3 text-right text-orange-600">Remaining (₹)</div>
                </div>

                {/* Rows */}
                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Saleable Area (sq.ft)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{saleableAreaSqFt}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 bg-yellow-50/50 hover:bg-yellow-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-red-600">Rate Per Sq.ft (₹)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-red-600">{formatPrice(discountedRate)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Base Cost of Unit (₹)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(basicRate)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                </div>

                {Number(totalFloorRiseCost) > 0 && (
                    <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                        <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Floor Rise Charges (₹ {floorRise} per sq.ft)</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(totalFloorRiseCost)}</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(totalFloorRiseCost)}</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                        <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                    </div>
                )}

                {Number(totalCornerCost) > 0 && (
                    <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                        <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Corner Facing Premium (₹ {corner} per sq.ft)</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(totalCornerCost)}</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(totalCornerCost)}</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                        <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                    </div>
                )}

                {Number(totalEastFacingCost) > 0 && (
                    <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                        <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">East Facing Premium (₹ {eastFacing} per sq.ft)</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(totalEastFacingCost)}</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(totalEastFacingCost)}</div>
                        <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                        <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                    </div>
                )}

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Amenities Charges</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600">{formatPrice(amenitiesCost)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(amenitiesCost)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                </div>

                {/* Base Price Summary */}
                <div className="grid grid-cols-12 border-b-2 border-gray-300 bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-bold text-gray-900">Total Cost of Unit</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-bold text-gray-900">{formatPrice(basePrice)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-bold text-gray-900">{formatPrice(totalCostofUnit)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-bold text-[#0083bf] bg-blue-50/30">
                        {formatPrice(paymentSummary?.flat?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right font-bold text-orange-600 bg-orange-50/30">
                        {formatPrice(paymentSummary?.flat?.remaining)}
                    </div>
                </div>

                {/* Taxes & Additional Charges */}
                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 mt-1">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">GST (5%)</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(gst)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(paymentSummary?.gst?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30">
                        {formatPrice(paymentSummary?.gst?.remaining)}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b-2 border-gray-300 bg-gray-50 hover:bg-gray-100">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-bold text-gray-900">Cost of Unit with Tax</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-bold text-gray-900">{formatPrice(costOfUnitWithTax)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30"></div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30"></div>
                </div>

                {/* Other Fees */}
                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Corpus Fund</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(corpusFund)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(paymentSummary?.corpusFund?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30">
                        {formatPrice(paymentSummary?.corpusFund?.remaining)}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Maintenance Charges</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(maintenanceCharge)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(paymentSummary?.maintenanceCharges?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30">
                        {formatPrice(paymentSummary?.maintenanceCharges?.remaining)}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Documentation Fee</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(documentationFee)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(paymentSummary?.documentationFee?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30">
                        {formatPrice(paymentSummary?.documentationFee?.remaining)}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 mt-1">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Manjeera Connection Charge</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(manjeeraConnectionCharge)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(paymentSummary?.manjeeraConnectionCharge?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30">
                        {formatPrice(paymentSummary?.manjeeraConnectionCharge?.remaining)}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 mt-1">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Manjeera Meter Connection</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(manjeeraMeterCharge)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(paymentSummary?.manjeeraMeterCharge?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30">
                        {formatPrice(paymentSummary?.manjeeraMeterCharge?.remaining)}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 mt-1">
                    <div className="col-span-4 p-3 border-r border-gray-200 font-medium text-gray-800">Registration</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-gray-600"></div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 font-medium text-gray-800">{formatPrice(registrationCharge)}</div>
                    <div className="col-span-2 p-3 text-right border-r border-gray-200 text-green-600 font-semibold bg-green-50/30">
                        {formatPrice(paymentSummary?.registration?.paid)}
                    </div>
                    <div className="col-span-2 p-3 text-right text-orange-600 font-semibold bg-orange-50/30">
                        {formatPrice(paymentSummary?.registration?.remaining)}
                    </div>
                </div>

                {/* Grand Total */}
                <div className="grid grid-cols-12 bg-gray-100 border-t-2 border-gray-400">
                    <div className="col-span-6 p-4 border-r border-gray-300 font-bold text-gray-900 text-base uppercase">Grand Total</div>
                    <div className="col-span-2 p-4 text-right border-r border-gray-300 font-bold text-gray-900 text-base">{formatPrice(grandTotal)}</div>
                    <div className="col-span-2 p-4 text-right border-r border-gray-300 font-bold text-[#0083bf] text-base bg-blue-100/50">{formatPrice(totalAmountPaid)}</div>
                    <div className="col-span-2 p-4 text-right font-bold text-orange-600 text-base bg-orange-100/50">{formatPrice(grandTotal - totalAmountPaid)}</div>
                </div>

            </div>
        </div>
    );
}

export default Overviewtab;
