import React, { useEffect, useState } from 'react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Flatapi from "../api/Flatapi";
import Settingsapi from "../api/Settingsapi";
import Customerapi from "../api/Customerapi";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { toast } from "react-toastify";
import Errorpanel from "../shared/Errorpanel";
import { Datepicker } from '@nayeshdaggula/tailify';
import CustomDateFilter from "../shared/CustomDateFilter";
import { useReactToPrint } from "react-to-print";
import { CostSheetPrint } from "./CostSheetPrint";

const CostSheetDrawer = ({ open, onOpenChange, leadData, refreshLeadDetails }) => {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    // Reset Form when Drawer Closes
    useEffect(() => {
        if (!open) {
            setErrorMessage("");
            setSelectedFlat(null);
            setSearchedFlat("");
            setFlat([]);
            setSaleableAreaSqFt("");
            setRatePerSqFt("");
            setDiscount("");
            setTotalDiscount(0);
            setTotalBaseCost(0);
            setBaseCostUnit("");
            setApplicationDate(""); // Or keep default if needed
            setFloorRise('25');
            setFloorRiseXPerSft("");
            setEastFacing('100');
            setEastFacingXPerSft("");
            setCorner('100');
            setCornerXPerSft("");
            setAmenities("");
            setStatus("");
            setDescription("");
            setTotalCostofUnit("");
            setGst("");
            setCostofUnitWithTax("");
            setRegistrationCharge("");
            setManjeeraConnectionCharge("50000");
            setManjeeraMeterCharge("15000");
            setMaintenceCharge("");
            setDocumentationFee("20000");
            setCorpusFund("");
            setGrandTotal("");

            // Clear Errors
            setSelectedFlatError("");
            setSaleableAreaSqFtError("");
            setRatePerSqFtError("");
            setBaseCostUnitError("");
            setApplicationDateError("");
            setFloorRiseError("");
            setFloorRiseXPerSftError("");
            setEastFacingError("");
            setEastFacingXPerSftError("");
            setCornerError("");
            setCornerXPerSftError("");
            setAmenitiesError("");
            setStatusError("");
            setDescriptionError("");
            setTotalCostofUnitError("");
            setGstError("");
            setCostofUnitWithTaxError("");
            setRegistrationChargeError("");
            setManjeeraConnectionChargeError("");
            setManjeeraMeterChargeError("");
            setMaintenceChargeError("");
            setDocumentationFeeError("");
            setCorpusFundError("");
            setGrandTotalError("");
        }
    }, [open]);

    // Flat Search State
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');
    const [searchedFlat, setSearchedFlat] = useState("");
    const [flat, setFlat] = useState([]);
    const [flatLoading, setFlatLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Cost States
    const [saleableAreaSqFt, setSaleableAreaSqFt] = useState("");
    const [saleableAreaSqFtError, setSaleableAreaSqFtError] = useState("");
    const [ratePerSqFt, setRatePerSqFt] = useState("");
    const [ratePerSqFtError, setRatePerSqFtError] = useState("");
    const [discount, setDiscount] = useState('');
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalBaseCost, setTotalBaseCost] = useState(0);
    const [baseCostUnit, setBaseCostUnit] = useState("");
    const [baseCostUnitError, setBaseCostUnitError] = useState("");

    // Application Date
    const [applicationDate, setApplicationDate] = useState("");
    const [applicationDateError, setApplicationDateError] = useState('');

    const updateApplicationDate = (value) => {
        setApplicationDate(value);
        setApplicationDateError("");
    };

    // Charges
    const [floorRise, setFloorRise] = useState('0');
    const [floorRiseError, setFloorRiseError] = useState('');
    const [floorRiseXPerSft, setFloorRiseXPerSft] = useState('');
    const [floorRiseXPerSftError, setFloorRiseXPerSftError] = useState('');

    const [eastFacing, setEastFacing] = useState('0');
    const [eastFacingError, setEastFacingError] = useState('');
    const [eastFacingXPerSft, setEastFacingXPerSft] = useState('');
    const [eastFacingXPerSftError, setEastFacingXPerSftError] = useState('');

    const [corner, setCorner] = useState('0');
    const [cornerError, setCornerError] = useState('');
    const [cornerXPerSft, setCornerXPerSft] = useState('');
    const [cornerXPerSftError, setCornerXPerSftError] = useState('');

    const [amenities, setAmenities] = useState("");
    const [amenitiesError, setAmenitiesError] = useState('');

    const [status, setStatus] = useState("");
    const [statusError, setStatusError] = useState('');

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState('');

    const [totalCostofUnit, setTotalCostofUnit] = useState("");
    const [totalCostofUnitError, setTotalCostofUnitError] = useState('');

    const [gst, setGst] = useState("");
    const [gstError, setGstError] = useState('');

    const [costofUnitWithTax, setCostofUnitWithTax] = useState("");
    const [costofUnitWithTaxError, setCostofUnitWithTaxError] = useState('');

    const [registartionCharge, setRegistrationCharge] = useState("");
    const [registrationChargeError, setRegistrationChargeError] = useState('');

    const [manjeeraConnectionCharge, setManjeeraConnectionCharge] = useState("50000");
    const [manjeeraConnectionChargeError, setManjeeraConnectionChargeError] = useState('');

    const [manjeeraMeterCharge, setManjeeraMeterCharge] = useState("15000");
    const [manjeeraMeterChargeError, setManjeeraMeterChargeError] = useState('');

    const [maintenceCharge, setMaintenceCharge] = useState("");
    const [maintenceChargeError, setMaintenceChargeError] = useState('');

    const [documentationFee, setDocumentationFee] = useState("20000");
    const [documentationFeeError, setDocumentationFeeError] = useState('');

    const [corpusFund, setCorpusFund] = useState("");
    const [corpusFundError, setCorpusFundError] = useState('');

    const [grandTotal, setGrandTotal] = useState('');
    const [grandTotalError, setGrandTotalError] = useState('');

    const [projectRates, setProjectRates] = useState({
        floor_rise: 0,
        east_facing: 0,
        corner: 0,
        gst_percentage: 5,
        manjeera_connection_charges: 50000,
        manjeera_meter_charges: 15000,
        documentation_fee: 20000,
        registration_percentage: 0,
        registration_base_charge: 0,
        maintenance_rate_per_sqft: 3,
        maintenance_duration_months: 24,
        corpus_fund: 50
    });

    // Update form when closed/opened
    useEffect(() => {
        if (!open) {
            // Reset logic could go here
        }
    }, [open]);

    // Flat Seach Logic
    const updateSearchedLocation = (e) => {
        const value = e.target.value;
        setSearchedFlat(value);

        if (debounceTimer) clearTimeout(debounceTimer);

        const timer = setTimeout(() => {
            if (value.trim().length > 0) {
                getFlatsData(value);
                setShowDropdown(true);
            } else {
                setFlat([]);
                setShowDropdown(false);
            }
        }, 500);

        setDebounceTimer(timer);
    };

    const handleSelectFlat = (flat) => {
        console.log("FLAT____DETAILS:", flat)
        setSearchedFlat(flat?.label);
        setSelectedFlat(flat);
        setSaleableAreaSqFt(flat?.square_feet);
        setShowDropdown(false);
        setSelectedFlatError('');
    };

    const getFlatsData = async (flatQuery) => {
        try {
            setFlatLoading(true);
            const response = await Flatapi.get(`search-flats`, {
                params: {
                    flat_no: flatQuery,
                    employeeId: employeeId,
                },
            });
            const data = response?.data;
            if (data?.status === "error") {
                setFlat([]);
                return;
            }
            setFlat(data?.data || []);
        } catch (error) {
            console.log(error);
            setFlat([]);
        } finally {
            setFlatLoading(false);
        }
    };

    async function getAmenitiesData(flatType) {
        try {
            setIsLoadingEffect(true);
            const response = await Settingsapi.get(`get-list-amenities`, {
                params: { flatType: flatType }
            });
            const data = response?.data;
            if (data?.status === "error") {
                setAmenities("");
                return;
            }
            setAmenities(data?.amenities || "");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingEffect(false);
        }
    }

    const getProjectCharges = async (projectId) => {
        if (!projectId) return;
        try {
            const response = await Flatapi.get('get-project-charges', {
                params: { project_id: projectId } // Use project_id
            });
            const data = response?.data;
            if (data?.status === 'success') {
                return data.charges;
            }
        } catch (error) {
            console.error("Error fetching project charges:", error);
        }
        return null;
    };


    useEffect(() => {
        const fetchAndSetData = async () => {
            if (selectedFlat) {
                // Fetch Amenities
                getAmenitiesData(selectedFlat?.type);

                // Fetch Project Charges
                if (selectedFlat?.project_id) {
                    const charges = await getProjectCharges(selectedFlat.project_id);
                    if (charges) {
                        setProjectRates({
                            floor_rise: charges.floor_rise_price || 0,
                            east_facing: charges.east_price || 0,
                            corner: charges.corner_price || 0,
                            gst_percentage: charges.gst_percentage ?? 5,
                            manjeera_connection_charges: charges.manjeera_connection_charges ?? 50000,
                            manjeera_meter_charges: charges.manjeera_meter_charges ?? 15000,
                            documentation_fee: charges.documentation_fee ?? 20000,
                            registration_percentage: charges.registration_percentage ?? 0,
                            registration_base_charge: charges.registration_base_charge ?? 0,
                            maintenance_rate_per_sqft: charges.maintenance_rate_per_sqft ?? 3,
                            maintenance_duration_months: charges.maintenance_duration_months ?? 24,
                            corpus_fund: charges.corpus_fund ?? 50
                        });

                        // Set Static Charges directly from project
                        setEastFacing(charges.east_price?.toString() || '0');
                        setCorner(charges.corner_price?.toString() || '0');
                        setManjeeraConnectionCharge(charges.manjeera_connection_charges?.toString() || '50000');
                        setManjeeraMeterCharge(charges.manjeera_meter_charges?.toString() || '15000');
                        setDocumentationFee(charges.documentation_fee?.toString() || '20000');

                        // Calculate Floor Rise based on new rates
                        if (selectedFlat?.floor_no && selectedFlat?.floor_no >= 6) {
                            const floorsToCharge = selectedFlat.floor_no - 6 + 1;
                            setFloorRise((floorsToCharge * (charges.floor_rise_price || 0)).toString());
                        } else {
                            setFloorRise('0');
                        }
                    }
                }
            } else {
                setProjectRates({
                    floor_rise: 0,
                    east_facing: 0,
                    corner: 0,
                    gst_percentage: 5,
                    manjeera_connection_charges: 50000,
                    manjeera_meter_charges: 15000,
                    documentation_fee: 20000,
                    registration_percentage: 0,
                    registration_base_charge: 0,
                    maintenance_rate_per_sqft: 3,
                    maintenance_duration_months: 24,
                    corpus_fund: 50
                });
            }
        };

        fetchAndSetData();

        if (!searchedFlat) {
            setSelectedFlat(null);
            setAmenities('');
            setSaleableAreaSqFt('');
            setFloorRise('0');
            setEastFacing('0');
            setCorner('0');
        }

        // This part is now handled inside fetchAndSetData to ensure we have rates first
        // But for when floor_no exists but we might not refetch project data if selectedFlat object updates without id change (unlikely but safe to keep logic consistent)
        // We rely on fetchAndSetData for the main updates.

    }, [searchedFlat, selectedFlat]);

    // Calculation Logic
    useEffect(() => {
        const parseNum = (val) => (val ? parseFloat(val) : 0);

        const area = parseNum(saleableAreaSqFt);
        const rate = parseNum(ratePerSqFt);
        const disc = parseNum(discount);
        const amenity = parseNum(amenities);
        const flRise = parseNum(floorRise);
        const east = parseNum(eastFacing);
        const crnr = parseNum(corner);

        if (rate === '') {
            setDiscount('')
            setBaseCostUnit('')
        }

        // Base cost before discount
        const baseCost = area * rate;

        // Discount (reset to 0 if empty)
        const totalDiscountPrice = area && disc ? area * disc : 0;
        setTotalDiscount(totalDiscountPrice);

        // Final base cost after discount
        const finalBaseCost = baseCost - totalDiscountPrice;
        setTotalBaseCost(baseCost);
        setBaseCostUnit(finalBaseCost);

        // Floor Rise
        let floorRiseCost = 0;
        if (selectedFlat?.floor_no >= 6 && area && flRise) {
            floorRiseCost = flRise * area;
            setFloorRiseXPerSft(floorRiseCost);
        } else {
            setFloorRiseXPerSft("");
        }

        // East Facing
        let eastFacingCost = 0;
        if (selectedFlat?.facing === "East" && area && east) {
            eastFacingCost = east * area;
            setEastFacingXPerSft(eastFacingCost);
        } else {
            setEastFacingXPerSft("");
        }

        // Corner
        let cornerCost = 0;
        if (selectedFlat?.corner && area && crnr) {
            cornerCost = crnr * area;
            setCornerXPerSft(cornerCost);
        } else {
            setCornerXPerSft("");
        }

        // Total Cost of Unit (includes discount now!)
        if (area && rate) {
            const totalCost =
                finalBaseCost + floorRiseCost + eastFacingCost + cornerCost + amenity;

            setTotalCostofUnit(totalCost);
        } else {
            setTotalCostofUnit("");
        }
    }, [discount, selectedFlat, saleableAreaSqFt, ratePerSqFt, floorRise, eastFacing, corner, amenities]);


    // 2️⃣ Recalculate dependent states whenever totalCostofUnit changes
    useEffect(() => {
        if (totalCostofUnit) {
            const gstValue = (totalCostofUnit * (projectRates.gst_percentage / 100)).toFixed(2);
            setGst(gstValue);

            setCostofUnitWithTax(parseFloat(totalCostofUnit) + parseFloat(gstValue));

            let registerCharge = ((parseFloat(totalCostofUnit) * (parseFloat(projectRates.registration_percentage) / 100 || 0.076)) + (parseFloat(projectRates.registration_base_charge) || 1050)).toFixed(2);
            setRegistrationCharge(parseFloat(registerCharge));

            if (saleableAreaSqFt) {
                let maintainCharge = ((parseFloat(saleableAreaSqFt) * projectRates.maintenance_rate_per_sqft) * projectRates.maintenance_duration_months).toFixed(2);
                setMaintenceCharge(parseFloat(maintainCharge));
                let corpusFund = (parseFloat(saleableAreaSqFt) * projectRates.corpus_fund).toFixed(2);
                setCorpusFund(parseFloat(corpusFund));

                setGrandTotal(parseFloat(totalCostofUnit) + parseFloat(gstValue) + parseFloat(registerCharge) + parseFloat(manjeeraConnectionCharge) + parseFloat(manjeeraMeterCharge) + parseFloat(maintainCharge) + parseFloat(corpusFund) + parseFloat(documentationFee))
            }
        } else {
            setGst("");
            setCostofUnitWithTax("");
            setRegistrationCharge("");
            setMaintenceCharge("");
            setCorpusFund("");
            setGrandTotal("");
        }
    }, [totalCostofUnit, saleableAreaSqFt, documentationFee, manjeeraConnectionCharge, manjeeraMeterCharge, projectRates]);


    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        copyStyles: false,
        documentTitle: "",
        // removeAfterPrint: true,
        onBeforePrint: async () => {
            await document.fonts.ready;
        },
    });

    const handleGenerate = () => {
        setErrorMessage("");

        if (!selectedFlat) {
            setSelectedFlatError("Please select a flat");
            return;
        }
        if (!leadData) {
            toast.error("Lead data missing");
            return;
        }
        if (!applicationDate) {
            setApplicationDateError('Select application date');
            return;
        }
        if (!saleableAreaSqFt) {
            setSaleableAreaSqFtError("Saleable Area is required");
            return;
        }
        if (!ratePerSqFt) {
            setRatePerSqFtError("Rate Per sq.ft is required");
            return;
        }
        // if (!status) {
        //     setStatusError('Status is required');
        //     return;
        // }
        if (!grandTotal) {
            setGrandTotalError('Grand total calculation failed');
            return;
        }

        handlePrint();
    };

    // Prepare data object for print
    const printData = {
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
        registartionCharge,
        manjeeraConnectionCharge,
        manjeeraMeterCharge,
        maintenceCharge,
        documentationFee,
        corpusFund,
        grandTotal,
        // status,
        description
    };

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Hidden Print Component - Use a more robust way to hide while keeping styles available */}
            <div className="hidden">
                <CostSheetPrint
                    ref={componentRef}
                    data={printData}
                    leadData={leadData}
                    selectedFlat={selectedFlat}
                />
            </div>

            {/* Drawer Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-[80%] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Cost Sheet</h2>
                            <p className="text-sm text-gray-500">
                                Generate cost sheet for {leadData?.full_name}
                            </p>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors group"
                        >
                            <IconX size={24} className="text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pt-0 scrollbar-hide">

                        {/* Customer Details Section */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-300 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Lead Name</p>
                                    <p className="font-medium text-sm">{leadData?.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="font-medium text-sm">{leadData?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                    <p className="font-medium text-sm">{leadData?.phone_code && leadData?.phone_number ? `+${leadData.phone_code} ${leadData.phone_number}` : '-'} </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Assigned Employee</p>
                                    <p className="font-medium text-sm">{leadData?.assigned_to || 'No Assigned'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6">
                            {/* Loading Overlay */}
                            {isLoadingEffect && (
                                <div className="absolute inset-0 z-50 bg-white/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}

                            {/* Flat Selection */}
                            <div className="mb-3 relative">
                                <Label>Select Flat *</Label>
                                <Input
                                    value={searchedFlat}
                                    onChange={updateSearchedLocation}
                                    placeholder="Enter Flat No"
                                    className="mt-1 bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {showDropdown && (
                                    <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                        {flat.length > 0 ? (
                                            flat.map((item) => (
                                                <li
                                                    key={item.value}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                    onClick={() => handleSelectFlat(item)}
                                                >
                                                    {item.label}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-4 py-2 text-sm text-gray-500 cursor-default">
                                                No flat found
                                            </li>
                                        )}
                                    </ul>
                                )}
                                {selectedFlatError && <p className="text-red-500 text-xs mt-1">{selectedFlatError}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">

                                    <CustomDateFilter
                                        label="Enquirey Date"
                                        selected={applicationDate}
                                        onChange={updateApplicationDate}
                                        error={applicationDateError}
                                        className="-mt-2"
                                        maxDateToday={true}
                                    />

                                    <div>
                                        <Label>Saleable Area (sq.ft) *</Label>
                                        <Input
                                            type="number"
                                            readOnly
                                            value={saleableAreaSqFt}
                                            onChange={(e) => {
                                                setSaleableAreaSqFt(e.target.value);
                                                setSaleableAreaSqFtError('');
                                            }}
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {saleableAreaSqFtError && <p className="text-red-500 text-xs mt-1">{saleableAreaSqFtError}</p>}
                                    </div>

                                    <div>
                                        <Label>Rate Per sq.ft *</Label>
                                        <Input
                                            type="number"
                                            value={ratePerSqFt}
                                            onChange={(e) => {
                                                setRatePerSqFt(e.target.value);
                                                setRatePerSqFtError('');
                                            }}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {ratePerSqFtError && <p className="text-red-500 text-xs mt-1">{ratePerSqFtError}</p>}
                                    </div>

                                    <div>
                                        <Label>Discount Per sq.ft</Label>
                                        <Input
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Base Cost</Label>
                                        <Input
                                            value={baseCostUnit ? parseFloat(baseCostUnit).toLocaleString('en-IN') : ''}
                                            readOnly
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    {selectedFlat?.floor_no >= 6 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label>Floor Rise (Per sq.ft)</Label>
                                                <Input
                                                    value={floorRise ? parseFloat(floorRise).toLocaleString('en-IN') : ''}
                                                    readOnly
                                                    onChange={(e) => setFloorRise(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <Label>Total Floor Rise</Label>
                                                <Input value={floorRiseXPerSft ? parseFloat(floorRiseXPerSft).toLocaleString('en-IN') : ''} readOnly className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black" />
                                            </div>
                                        </div>
                                    )}

                                    {selectedFlat?.facing === "East" && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label>East Facing (Per sq.ft)</Label>
                                                <Input
                                                    value={eastFacing ? parseFloat(eastFacing).toLocaleString('en-IN') : ''}
                                                    readOnly
                                                    onChange={(e) => setEastFacing(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <Label>Total East Facing</Label>
                                                <Input value={eastFacingXPerSft ? parseFloat(eastFacingXPerSft).toLocaleString('en-IN') : ''} readOnly className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black" />
                                            </div>
                                        </div>
                                    )}

                                    {selectedFlat?.corner && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label>Corner (Per sq.ft)</Label>
                                                <Input
                                                    value={corner ? parseFloat(corner).toLocaleString('en-IN') : ''}
                                                    readOnly
                                                    onChange={(e) => setCorner(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <Label>Total Corner</Label>
                                                <Input value={cornerXPerSft ? parseFloat(cornerXPerSft).toLocaleString('en-IN') : ''} readOnly className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black" />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label>Amenities</Label>
                                        <Input
                                            value={amenities ? parseFloat(amenities).toLocaleString('en-IN') : ''}
                                            readOnly
                                            onChange={(e) => setAmenities(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {amenitiesError && <p className="text-red-500 text-xs mt-1">{amenitiesError}</p>}
                                    </div>

                                    {/* <div>
                                        <Label>Status</Label>
                                        <Select value={status} onValueChange={(value) => {
                                            setStatus(value);
                                            setStatusError("");
                                        }}>
                                            <SelectTrigger className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-black">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-black">
                                                <SelectItem value="Under Construction">Under Construction</SelectItem>
                                                <SelectItem value="Constructed">Constructed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {statusError && <p className="text-red-500 text-xs mt-1">{statusError}</p>}
                                    </div> */}

                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {descriptionError && <p className="text-red-500 text-xs mt-1">{descriptionError}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Total Cost of Unit</Label>
                                        <Input
                                            value={totalCostofUnit ? parseFloat(totalCostofUnit).toLocaleString('en-IN') : ''}
                                            readOnly
                                            className="bg-gray-50 font-bold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>GST ({projectRates.gst_percentage || 5}%)</Label>
                                        <Input
                                            value={gst ? parseFloat(gst).toLocaleString('en-IN') : ''}
                                            readOnly
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Cost of Unit with Tax</Label>
                                        <Input
                                            value={costofUnitWithTax ? parseFloat(costofUnitWithTax).toLocaleString('en-IN') : ''}
                                            readOnly
                                            className="bg-gray-50 font-semibold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Registration Charges (₹)</Label>
                                        <Input
                                            value={registartionCharge ? parseFloat(registartionCharge).toLocaleString('en-IN') : ''}
                                            readOnly
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Manjeera Connection Charges (₹)</Label>
                                        <Input
                                            type="number"
                                            value={manjeeraConnectionCharge}
                                            onChange={(e) => setManjeeraConnectionCharge(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <Label>Manjeera Meter Charges (₹)</Label>
                                        <Input
                                            type="number"
                                            value={manjeeraMeterCharge}
                                            onChange={(e) => setManjeeraMeterCharge(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Maintenance @{projectRates.maintenance_rate_per_sqft || 3}/- per sqft for {projectRates.maintenance_duration_months || 24} Months (₹)</Label>
                                        <Input
                                            value={maintenceCharge ? parseFloat(maintenceCharge).toLocaleString('en-IN') : ''}
                                            readOnly
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Documentation Fee (₹)</Label>
                                        <Input
                                            type="number"
                                            value={documentationFee}
                                            onChange={(e) => setDocumentationFee(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Corpus Fund ({projectRates.corpus_fund || 50} * SFT) (₹)</Label>
                                        <Input
                                            value={corpusFund ? parseFloat(corpusFund).toLocaleString('en-IN') : ''}
                                            readOnly
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Label className="text-lg text-primary">Grand Total</Label>
                                        <Input
                                            value={grandTotal ? parseFloat(grandTotal).toLocaleString('en-IN') : ''}
                                            readOnly
                                            onChange={(e) => setGrandTotal(e.target.value)}
                                            className="text-lg font-bold bg-green-50 border-green-200 text-green-700 h-14 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-white p-4 items-center border-t border-gray-300">
                            <div className="flex-1">
                                {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
                            </div>
                            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
                            <Button onClick={handleGenerate} className="bg-[#931f42] hover:bg-[#a6234b] cursor-pointer">Generate Cost Sheet</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostSheetDrawer;
