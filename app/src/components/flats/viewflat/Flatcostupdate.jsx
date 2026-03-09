import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import Flatapi from "../../api/Flatapi";
import Customerapi from "../../api/Customerapi";
import Errorpanel from "../../shared/Errorpanel";
import Updateactivities from "./Updateactivities";
import noImageStaticImage from "../../../../public/assets/no_image.png"
import { toast } from "react-toastify";
import { Loadingoverlay } from "@nayeshdaggula/tailify";
import CustomDateFilter from "../../shared/CustomDateFilter";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Flatcostupdate({ closeFlatCostUpdate, flatNo, refreshUserDetails, customerFlatDetails, flatDetails }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const permissions = useEmployeeDetails((state) => state.permissions);

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerError, setSelectedCustomerError] = useState('');
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');

    const [saleableAreaSqFt, setSaleableAreaSqFt] = useState("");
    const [saleableAreaSqFtError, setSaleableAreaSqFtError] = useState("");

    const [ratePerSqFt, setRatePerSqFt] = useState("");
    const [ratePerSqFtError, setRatePerSqFtError] = useState("");

    const [discount, setDiscount] = useState('');
    const [discountError, setDiscountError] = useState("");

    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalBaseCost, setTotalBaseCost] = useState(0);

    const [baseCostUnit, setBaseCostUnit] = useState("");
    const [baseCostUnitError, setBaseCostUnitError] = useState("");
    const updateBaseCostUnit = (e) => {
        setBaseCostUnit(e.target.value);
        setBaseCostUnitError("");
    };

    const [applicationDate, setApplicationDate] = useState('')
    const [applicationDateError, setApplicationDateError] = useState('')
    const updateApplicationDate = (value) => {
        setApplicationDate(value)
        setApplicationDateError('')
    }

    const [floorRise, setFloorRise] = useState('25')
    const [floorRiseError, setFloorRiseError] = useState('')
    // const updateFloorRise = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setFloorRise(value)
    //     setFloorRiseError('')
    // }

    const [floorRiseXPerSft, setFloorRiseXPerSft] = useState('')
    const [floorRiseXPerSftError, setFloorRiseXPerSftError] = useState('')
    const updateFloorRiseXPerSft = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setFloorRiseXPerSft(value)
        setFloorRiseXPerSftError('')
    }

    const [eastFacing, setEastFacing] = useState('100')
    const [eastFacingError, setEastFacingError] = useState('')
    // const updateEastFacing = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setEastFacing(value)
    //     setEastFacingError('')
    // }

    const [eastFacingXPerSft, setEastFacingXPerSft] = useState('')
    const [eastFacingXPerSftError, setEastFacingXPerSftError] = useState('')
    const updateEastFacingXPerSft = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setEastFacingXPerSft(value)
        setEastFacingXPerSftError('')
    }

    const [corner, setCorner] = useState('100')
    const [cornerError, setCornerError] = useState('')
    // const updateCorner = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setCorner(value)
    //     setCornerError('')
    // }

    const [cornerXPerSft, setCornerXPerSft] = useState('')
    const [cornerXPerSftError, setCornerXPerSftError] = useState('')
    const updateCornerXPerSft = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCornerXPerSft(value)
        setCornerXPerSftError('')
    }

    const [amenities, setAmenties] = useState('')
    const [amenitiesError, setAmentiesError] = useState('')

    const [totalCostofUnit, setTotalCostofUnit] = useState('')
    const [totalCostofUnitError, setTotalCostofUnitError] = useState('')

    const [gst, setGst] = useState('')
    const [gstError, setGstError] = useState('')
    const updateGst = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setGst(value)
        setGstError('')
    }

    const [costofUnitWithTax, setCostofUnitWithTax] = useState('')
    const [costofUnitWithTaxError, setCostofUnitWithTaxtError] = useState('')
    const updateCostofUnitWithTax = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCostofUnitWithTax(value)
        setCostofUnitWithTaxtError('')
    }

    const [registartionCharge, setRegistrationCharge] = useState('')
    const [registrationChargeError, setRegistrationChargeError] = useState('')
    const updateRegistrationCharge = (e) => {
        let value = e.target.value
        if (isNaN(value)) {
            return false
        }
        setRegistrationCharge(value)
        setRegistrationChargeError('')
    }

    const [manjeeraConnectionCharge, setManjeeraConnectionCharge] = useState('50000')
    const [manjeeraConnectionChargeError, setManjeeraConnectionChargeError] = useState('')
    const updateManjeeraConnectionCharge = (e) => {
        let value = e.target.value
        if (isNaN(value)) {
            return false
        }
        setManjeeraConnectionCharge(value)
        setManjeeraConnectionChargeError('')
        // Pass preserveManualTotal=true to keep the manually entered total cost intact
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, value, undefined, true);
    }

    const [manjeeraMeterCharge, setManjeeraMeterCharge] = useState('15000')
    const [manjeeraMeterChargeError, setManjeeraMeterChargeError] = useState('')
    const updateManjeeraMeterCharge = (e) => {
        let value = e.target.value
        if (isNaN(value)) {
            return false
        }
        setManjeeraMeterCharge(value)
        setManjeeraMeterChargeError('')
        // Pass preserveManualTotal=true to keep the manually entered total cost intact
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, value, true);
    }

    const [maintenceCharge, setMaintenceCharge] = useState('')
    const [maintenceChargeError, setMaintenceChargeError] = useState('')
    const updateMaintenceCharge = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setMaintenceCharge(value)
        setMaintenceChargeError('')
    }

    const [documentationFee, setDocumentationFee] = useState('20000')
    const [documenationFeeError, setDocumenationFeeError] = useState('')
    // const updateDocumenationFee = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setDocumentationFee(value)
    //     setDocumenationFeeError('')
    // }

    const [corpusFund, setCorpusFund] = useState('')
    const [corpusFundError, setCorpusFundError] = useState('')
    const updateCorpusFund = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCorpusFund(value)
        setCorpusFundError('')
    }

    const [grandTotal, setGrandTotal] = useState('')
    const [grandTotalError, setGrandTotalError] = useState('')
    const updateGrandTotal = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setGrandTotal(value)
        setGrandTotalError('')
    }

    const [customNote, setCustomNote] = useState('')
    const updateCustomNote = (e) => {
        setCustomNote(e.target.value)
    }

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

    const getProjectCharges = async (projectId) => {
        if (!projectId) return;
        try {
            const response = await Flatapi.get('get-project-charges', {
                params: { project_id: projectId }
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
        const fetchProjectRates = async () => {
            if (flatDetails?.project_id) {
                const charges = await getProjectCharges(flatDetails.project_id);
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
                }
            }
        }
        fetchProjectRates();
    }, [flatDetails?.project_id]);



    // 1️⃣ Load API data ONLY - no calculations

    const calculateAllValues = (
        newSaleableArea,
        newRatePerSqFt,
        newAmenities,
        newTotalCost,
        newFloorRise,
        newEastFacing,
        newCorner,
        newDiscount,
        newDocumentationFee,
        newManjeeraConnectionCharge,
        newManjeeraMeterCharge,
        preserveManualTotal = false
    ) => {
        let saleableArea = newSaleableArea !== undefined ? newSaleableArea : saleableAreaSqFt;
        let rate = newRatePerSqFt !== undefined ? newRatePerSqFt : ratePerSqFt;
        let amenitiesCost = newAmenities !== undefined ? newAmenities : amenities;
        let floorRiseVal = newFloorRise !== undefined ? newFloorRise : floorRise;
        let eastFacingVal = newEastFacing !== undefined ? newEastFacing : eastFacing;
        let cornerVal = newCorner !== undefined ? newCorner : corner;
        let discountVal = newDiscount !== undefined ? newDiscount : discount;
        let documentationFeeVal = newDocumentationFee !== undefined ? newDocumentationFee : documentationFee;
        let manjeeraConnectionChargeVal = newManjeeraConnectionCharge !== undefined ? newManjeeraConnectionCharge : manjeeraConnectionCharge;
        let manjeeraMeterChargeVal = newManjeeraMeterCharge !== undefined ? newManjeeraMeterCharge : manjeeraMeterCharge;

        // FIXED: Use existing totalCostofUnit if newTotalCost is not provided
        let totalCost = newTotalCost !== undefined ? newTotalCost : totalCostofUnit;

        let parseNum = (val) => (val && !isNaN(val) ? parseFloat(val) : 0);

        let gstValue = 0;
        let registerCharge = 0;

        if (saleableArea && rate) {
            // Base cost
            const newBaseCost = parseNum(saleableArea) * parseNum(rate);
            setTotalBaseCost(newBaseCost);

            // Discount (per sq.ft * area)
            const totalDiscountPrice = parseNum(saleableArea) * parseNum(discountVal);
            setTotalDiscount(totalDiscountPrice);

            // Final base cost after discount
            const finalBaseCost = newBaseCost - totalDiscountPrice;
            setBaseCostUnit(finalBaseCost);

            // Floor Rise (per sq.ft * area)
            let floorRiseTotal = 0;
            if (floorRiseVal !== "" && floorRiseVal !== undefined) {
                floorRiseTotal = parseNum(floorRiseVal) * parseNum(saleableArea);
                setFloorRiseXPerSft(floorRiseTotal);
            } else {
                setFloorRiseXPerSft("");
            }

            // East Facing (per sq.ft * area)
            let eastFacingTotal = 0;
            if (eastFacingVal !== "" && eastFacingVal !== undefined) {
                eastFacingTotal = parseNum(eastFacingVal) * parseNum(saleableArea);
                setEastFacingXPerSft(eastFacingTotal);
            } else {
                setEastFacingXPerSft("");
            }

            // Corner (per sq.ft * area)
            let cornerTotal = 0;
            if (cornerVal !== "" && cornerVal !== undefined) {
                cornerTotal = parseNum(cornerVal) * parseNum(saleableArea);
                setCornerXPerSft(cornerTotal);
            } else {
                setCornerXPerSft("");
            }

            // FIXED: Handle total cost calculation based on context
            if (newTotalCost !== undefined) {
                // Explicit total cost provided - use it
                totalCost = newTotalCost;
            } else if (preserveManualTotal && totalCostofUnit) {
                // Preserve manually entered total cost
                totalCost = totalCostofUnit;
            } else {
                // Calculate from base components
                if (amenitiesCost && amenitiesCost !== "") {
                    totalCost = finalBaseCost + floorRiseTotal + eastFacingTotal + cornerTotal + parseNum(amenitiesCost);
                } else {
                    totalCost = finalBaseCost + floorRiseTotal + eastFacingTotal + cornerTotal;
                }
            }

            // Set total cost
            setTotalCostofUnit(totalCost);

            // Calculate dependent values if we have a valid totalCost
            if (totalCost && totalCost !== "") {
                // Dynamic GST
                gstValue = (parseNum(totalCost) * (projectRates.gst_percentage / 100)).toFixed(2);
                setGst(gstValue);

                // Registration Charge
                registerCharge = ((parseNum(totalCost) * (parseFloat(projectRates.registration_percentage) / 100 || 0.076)) + (parseFloat(projectRates.registration_base_charge) || 1050)).toFixed(2);
                setRegistrationCharge(parseFloat(registerCharge));

                // Cost with GST
                setCostofUnitWithTax(parseNum(totalCost) + parseNum(gstValue));

            } else {
                setGst("");
                setCostofUnitWithTax("");
                setRegistrationCharge("");
            }

            // Maintenance & Corpus
            if (saleableArea) {
                let maintainCharge = ((parseFloat(saleableArea) * projectRates.maintenance_rate_per_sqft) * projectRates.maintenance_duration_months).toFixed(2);
                setMaintenceCharge(parseFloat(maintainCharge));
                let corpusFundVal = (parseFloat(saleableArea) * projectRates.corpus_fund).toFixed(2);
                setCorpusFund(parseFloat(corpusFundVal));

                // FIXED: Calculate grand total with current values
                const currentGstValue = parseNum(gstValue);
                const currentMaintainCharge = parseNum(maintainCharge);
                const currentCorpusFund = parseNum(corpusFundVal);
                const currentDocFee = parseNum(documentationFeeVal);
                const currentManjeeraConnectionCharge = parseNum(manjeeraConnectionChargeVal);
                const currentManjeeraMeterCharge = parseNum(manjeeraMeterChargeVal);

                setGrandTotal(parseNum(totalCost) + currentGstValue + parseNum(registerCharge) + currentManjeeraConnectionCharge + currentManjeeraMeterCharge + currentMaintainCharge + currentCorpusFund + currentDocFee);
            }
        } else {
            // Reset all if no base values
            setBaseCostUnit("");
            // setAmenties(""); 
            setFloorRiseXPerSft("");
            setEastFacingXPerSft("");
            setCornerXPerSft("");
            setTotalCostofUnit("");
            setGst("");
            setCostofUnitWithTax("");
            setRegistrationCharge("");
            setMaintenceCharge("");
            setCorpusFund("");
            setDiscount("");
            setTotalDiscount(0);
            setTotalBaseCost(0);
            setGrandTotal("");
        }
    };

    const updateSaleableAreaSqFt = (e) => {
        const value = e.target.value;
        setSaleableAreaSqFt(value);
        setSaleableAreaSqFtError("");
        calculateAllValues(value, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateRatePerSqFt = (e) => {
        const value = e.target.value;
        setRatePerSqFt(value);
        setRatePerSqFtError("");
        calculateAllValues(undefined, value, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateAmenities = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setAmenties(value);
        setAmentiesError("");
        calculateAllValues(undefined, undefined, value, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateTotalCostofUnit = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setTotalCostofUnit(value);
        setTotalCostofUnitError("");
        calculateAllValues(undefined, undefined, undefined, value, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateFloorRise = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setFloorRise(value);
        setFloorRiseError("");
        calculateAllValues(undefined, undefined, undefined, undefined, value, undefined, undefined, undefined, undefined, undefined);
    };

    const updateEastFacing = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setEastFacing(value);
        setEastFacingError("");
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, value, undefined, undefined, undefined, undefined);
    };

    const updateCorner = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setCorner(value);
        setCornerError("");
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, value, undefined, undefined, undefined);
    };

    const updateDiscount = (e) => {
        const value = e.target.value;
        setDiscount(value);
        setDiscountError("");
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, undefined, value, undefined, undefined);
    };

    const updateDocumenationFee = (e) => {
        let value = e.target.value;
        setDocumentationFee(value);
        setDocumenationFeeError('');
        // Pass preserveManualTotal=true to keep the manually entered total cost intact
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, value, undefined, undefined, true);
    };

    useEffect(() => {
        if (customerFlatDetails) {
            setSelectedCustomer(customerFlatDetails?.customer?.uuid || null);
            setSelectedFlat(customerFlatDetails?.flat_id || null);
            setApplicationDate(new Date(customerFlatDetails?.application_date) || '');
            setSaleableAreaSqFt(customerFlatDetails?.saleable_area_sq_ft || "");
            setRatePerSqFt(customerFlatDetails?.rate_per_sq_ft || '');
            setDiscount(customerFlatDetails?.discount || '');
            setBaseCostUnit(customerFlatDetails?.base_cost_unit || '');
            setAmenties(customerFlatDetails?.amenities || '');
            setTotalCostofUnit(customerFlatDetails?.toatlcostofuint || '');
            setGst(customerFlatDetails?.gst || '');
            setCostofUnitWithTax(customerFlatDetails?.costofunitwithtax || '');
            setRegistrationCharge(customerFlatDetails?.registrationcharge || '');
            setMaintenceCharge(customerFlatDetails?.maintenancecharge || '');
            setDocumentationFee(customerFlatDetails?.documentaionfee ?? projectRates.documentation_fee);
            setCorpusFund(customerFlatDetails?.corpusfund || '');
            setManjeeraConnectionCharge(customerFlatDetails?.manjeera_connection_charge ?? projectRates.manjeera_connection_charges);
            setManjeeraMeterCharge(customerFlatDetails?.manjeera_meter_charge ?? projectRates.manjeera_meter_charges);

            // Logic to prioritize customerFlatDetails, fallback to projectRates if new booking/calc
            // Note: For existing bookings, we usually want to keep the saved values.
            // But if they are missing or 0, we *might* want defaults. 
            // However, sticking to the "update" nature, we primarily trust `customerFlatDetails`.
            // The "logic" part is ensuring the *conditions* (floor >= 6) are correct.

            // Calculate effective project floor rise rate (Base * Multiplier)
            let effectiveProjectFloorRise = 0;
            let effectiveTotalFloorRise = 0;
            const saleableArea = customerFlatDetails?.saleable_area_sq_ft ? parseFloat(customerFlatDetails.saleable_area_sq_ft) : 0;

            if (flatDetails?.floor_no >= 6) {
                const floorsToCharge = flatDetails.floor_no - 6 + 1;
                effectiveProjectFloorRise = floorsToCharge * projectRates.floor_rise;
                effectiveTotalFloorRise = effectiveProjectFloorRise * saleableArea;
            }

            setFloorRise(flatDetails?.floor_no >= 6 ? (customerFlatDetails?.floor_rise_per_sq_ft ?? effectiveProjectFloorRise) : '');
            setFloorRiseXPerSft(flatDetails?.floor_no >= 6 ? (customerFlatDetails?.total_floor_rise ?? effectiveTotalFloorRise) : '');

            const effectiveEastFacing = projectRates.east_facing;
            const effectiveTotalEastFacing = effectiveEastFacing * saleableArea;

            setEastFacing(flatDetails?.facing === "East" ? (customerFlatDetails?.east_facing_per_sq_ft ?? effectiveEastFacing) : '');
            setEastFacingXPerSft(flatDetails?.facing === "East" ? (customerFlatDetails?.total_east_facing ?? effectiveTotalEastFacing) : '');

            const effectiveCorner = projectRates.corner;
            const effectiveTotalCorner = effectiveCorner * saleableArea;

            setCorner(flatDetails?.corner === true ? (customerFlatDetails?.corner_per_sq_ft ?? effectiveCorner) : '');
            setCornerXPerSft(flatDetails?.corner === true ? (customerFlatDetails?.total_corner ?? effectiveTotalCorner) : '');

            setGrandTotal(customerFlatDetails?.grand_total || '');
            setCustomNote(customerFlatDetails?.custom_note || '');
        }
    }, [customerFlatDetails, flatDetails, projectRates]);


    const handleSubmit = async () => {
        setIsLoadingEffect(true);

        if (selectedFlat === null) {
            setSelectedFlatError("Please select the flat");
            setIsLoadingEffect(false);
            return false;
        }

        if (selectedCustomer === null) {
            setSelectedCustomerError("Please select the customer");
            setIsLoadingEffect(false);
            return false;
        }

        if (applicationDate === '') {
            setApplicationDateError('Select application date')
            setIsLoadingEffect(false)
            return false
        }

        if (saleableAreaSqFt === '') {
            setSaleableAreaSqFtError("Saleable Area (sq.ft.) is required");
            setIsLoadingEffect(false);
            return false;
        }

        if (ratePerSqFt === '') {
            setRatePerSqFtError("Rate Per (sq.ft.) is required");
            setIsLoadingEffect(false);
            return false;
        }

        if (baseCostUnit === '') {
            setBaseCostUnitError("Base Cost Unit is required");
            setIsLoadingEffect(false);
            return false;
        }
        if (amenities === "") {
            setAmentiesError("Enter amenities")
            setIsLoadingEffect(false)
            return false
        }
        if (totalCostofUnit === '') {
            setTotalCostofUnitError('Enter Total cost of unit')
            setIsLoadingEffect(false)
            return false
        }
        if (gst === '') {
            setGstError('Enter GST')
            setIsLoadingEffect(false)
            return false
        }
        if (costofUnitWithTax === "") {
            setCostofUnitWithTaxtError('Enter cost of unit with tax')
            setIsLoadingEffect(false)
            return false
        }
        if (manjeeraConnectionCharge === "") {
            setManjeeraConnectionChargeError('Enter Manjeera Connection Charge')
            setIsLoadingEffect(false)
            return false
        }

        if (manjeeraMeterCharge === "") {
            setManjeeraMeterChargeError('Enter Manjeera Meter Charge')
            setIsLoadingEffect(false)
            return false
        }
        if (maintenceCharge === "") {
            setMaintenceChargeError('Enter Maintence Charge')
            setIsLoadingEffect(false)
            return false
        }
        if (documentationFee === "") {
            setDocumenationFeeError('Enter documenation Fee')
            setIsLoadingEffect(false)
            return false
        }
        if (corpusFund === "") {
            setCorpusFundError('Enter corpus fund')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.floor_no >= 6 && floorRise === "") {
            setFloorRiseError('Enter floor rise charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.floor_no >= 6 && floorRiseXPerSft === "") {
            setFloorRiseXPerSftError('Total floor rise is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.facing === "East" && eastFacing === "") {
            setEastFacingError('Enter east facing charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.facing === "East" && eastFacingXPerSft === "") {
            setEastFacingXPerSftError('Total east facing is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.corner === true && corner === "") {
            setCornerError('Enter corner charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.corner === true && cornerXPerSft === "") {
            setCornerXPerSftError('Total corner is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (grandTotal === "") {
            setGrandTotalError('Grand total is required')
            setIsLoadingEffect(false)
            return false
        }

        try {
            const formatDateOnly = (date) => {
                if (!date) return null;
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            };

            const apiEndpoint = selectedCustomer && "update-customer-flat";

            const response = await Customerapi.post(apiEndpoint, {
                customerFlatId: customerFlatDetails?.id,
                customerUuid: selectedCustomer,
                flat_id: selectedFlat,
                applicationdate: formatDateOnly(applicationDate),
                saleable_area_sq_ft: Number(saleableAreaSqFt),
                rate_per_sq_ft: Number(ratePerSqFt),
                discount: discount ? parseFloat(discount) : 0,
                base_cost_unit: Number(baseCostUnit),
                amenities: parseFloat(amenities),
                toatlcostofuint: parseFloat(totalCostofUnit),
                gst: parseFloat(gst),
                costofunitwithtax: parseFloat(costofUnitWithTax),
                registrationcharge: parseFloat(registartionCharge) || 0,
                manjeeraConnectionCharge: parseFloat(manjeeraConnectionCharge),
                manjeeraMeterCharge: parseFloat(manjeeraMeterCharge),
                maintenancecharge: parseFloat(maintenceCharge),
                documentaionfee: parseFloat(documentationFee),
                corpusfund: parseFloat(corpusFund),
                floor_rise_per_sq_ft: flatDetails?.floor_no >= 6 ? parseFloat(floorRise) : null,
                total_floor_rise: parseFloat(floorRiseXPerSft),
                east_facing_per_sq_ft: flatDetails?.facing === "East" ? parseFloat(eastFacing) : null,
                total_east_facing: parseFloat(eastFacingXPerSft),
                corner_per_sq_ft: flatDetails?.corner === true ? parseFloat(corner) : null,
                total_corner: parseFloat(cornerXPerSft),
                grand_total: parseFloat(grandTotal),
                custom_note: customNote || null,
                employeeId: employeeId
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;

            if (data?.status === "error") {
                setErrorMessage({
                    message: data?.message,
                    server_res: data,
                });
                setIsLoadingEffect(false);
                return false;
            }

            setIsLoadingEffect(false);
            toast.success("Flat values updated to customer successfully");
            refreshUserDetails()
            closeFlatCostUpdate()
            return true;
        } catch (error) {
            let finalresponse;
            if (error.response !== undefined) {
                finalresponse = {
                    message: error.message,
                    server_res: error.response.data,
                };
            } else {
                finalresponse = {
                    message: error?.message,
                    server_res: null,
                };
            }
            setErrorMessage(finalresponse);
            setIsLoadingEffect(false);
            return false;
        }
    };


    return (
        <div className="w-full">
            <div className="flex justify-between items-center px-4 py-2">
                <div className="font-semibold text-lg">Flat Cost Update</div>
                <div onClick={closeFlatCostUpdate} className="cursor-pointer py-1.5 px-3 rounded-sm bg-red-300 text-black font-semibold">Close</div>
            </div>

            <hr className="border border-[#ebecef]" />

            <div className="px-4 py-2 flex flex-col gap-2">
                <div className="border border-[#ced4da] p-3 rounded-md">
                    <div className="grid grid-cols-3 gap-4">
                        {permissions?.assigning_settings?.includes("booking_date_assigning") && (
                            <CustomDateFilter
                                label={<span>Booking Date <span className="text-red-500">*</span></span>}
                                selected={applicationDate}
                                error={applicationDateError}
                                onChange={updateApplicationDate}
                                className="bg-white -mt-2"
                                maxDateToday={true}
                            />
                        )}
                        <div className="space-y-2">
                            <Label>Saleable Area (sq.ft.) (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={saleableAreaSqFt}
                                readOnly
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {saleableAreaSqFtError && <p className="text-xs text-red-500">{saleableAreaSqFtError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Rate Per Sq.ft (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                value={ratePerSqFt}
                                min={0}
                                onChange={updateRatePerSqFt}
                                onWheel={(e) => e.target.blur()}
                                placeholder="Enter Rate"
                                className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            {ratePerSqFtError && <p className="text-xs text-red-500">{ratePerSqFtError}</p>}
                            {totalBaseCost > 0 && <p className="text-xs">Saleable Area (sq.ft.) * Rate Per Sq.ft = <span className="font-semibold">₹ {totalBaseCost ? parseFloat(totalBaseCost).toLocaleString('en-IN') : ''}</span></p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Discount Rate Per Sq.ft (₹)</Label>
                            <Input
                                type="number"
                                value={discount}
                                min={0}
                                readOnly={!permissions?.assigning_settings?.includes("discount_assigning")}
                                onChange={updateDiscount}
                                onWheel={(e) => e.target.blur()}
                                placeholder="Enter Discount Sq.ft (₹)"
                                className={`${!permissions?.assigning_settings?.includes("discount_assigning") ? "bg-gray-50 cursor-not-allowed" : "bg-white"} border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                            />
                            {discountError && <p className="text-xs text-red-500">{discountError}</p>}
                            {totalDiscount > 0 && <p className="text-xs">Saleable Area (sq.ft.) * Discount Sq.ft = <span className="font-semibold">₹ {totalDiscount ? parseFloat(totalDiscount).toLocaleString('en-IN') : ''}</span></p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Base Cost of the Unit (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={baseCostUnit ? parseFloat(baseCostUnit).toLocaleString('en-IN') : ''}
                                readOnly
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {baseCostUnitError && <p className="text-xs text-red-500">{baseCostUnitError}</p>}
                        </div>
                        {flatDetails?.floor_no >= 6 && (
                            <>
                                <div className="space-y-2">
                                    <Label>Floor Rise Charge Per Sq.ft (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={floorRise ? parseFloat(floorRise).toLocaleString('en-IN') : ''}
                                        readOnly
                                        onChange={updateFloorRise}
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {floorRiseError && <p className="text-xs text-red-500">{floorRiseError}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Charge of Floor Rise (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={floorRiseXPerSft ? parseFloat(floorRiseXPerSft).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {floorRiseXPerSftError && <p className="text-xs text-red-500">{floorRiseXPerSftError}</p>}
                                </div>
                            </>
                        )}
                        {flatDetails?.facing === "East" && (
                            <>
                                <div className="space-y-2">
                                    <Label>East Facing Charge Per Sq.ft (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={eastFacing ? parseFloat(eastFacing).toLocaleString('en-IN') : ''}
                                        readOnly
                                        onChange={updateEastFacing}
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {eastFacingError && <p className="text-xs text-red-500">{eastFacingError}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Charge of East Facing (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={eastFacingXPerSft ? parseFloat(eastFacingXPerSft).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {eastFacingXPerSftError && <p className="text-xs text-red-500">{eastFacingXPerSftError}</p>}
                                </div>
                            </>
                        )}

                        {flatDetails?.corner === true && (
                            <>
                                <div className="space-y-2">
                                    <Label>Corner Charge Per Sq.ft (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={corner ? parseFloat(corner).toLocaleString('en-IN') : ''}
                                        readOnly
                                        onChange={updateCorner}
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {cornerError && <p className="text-xs text-red-500">{cornerError}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Charge of Corner (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={cornerXPerSft ? parseFloat(cornerXPerSft).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {cornerXPerSftError && <p className="text-xs text-red-500">{cornerXPerSftError}</p>}
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <Label>Amenities (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={amenities ? parseFloat(amenities).toLocaleString('en-IN') : ''}
                                readOnly
                                onChange={updateAmenities}
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {amenitiesError && <p className="text-xs text-red-500">{amenitiesError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Total Cost of Flat (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={totalCostofUnit ? parseFloat(totalCostofUnit).toLocaleString('en-IN') : ''}
                                readOnly
                                className="bg-gray-50 font-bold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {totalCostofUnitError && <p className="text-xs text-red-500">{totalCostofUnitError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>GST ({projectRates.gst_percentage || 5}%) (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={gst ? parseFloat(gst).toLocaleString('en-IN') : ''}
                                readOnly
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {gstError && <p className="text-xs text-red-500">{gstError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Cost of Unit with Tax (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={costofUnitWithTax ? parseFloat(costofUnitWithTax).toLocaleString('en-IN') : ''}
                                readOnly
                                className="bg-gray-50 font-semibold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {costofUnitWithTaxError && <p className="text-xs text-red-500">{costofUnitWithTaxError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Registration Charges (₹)</Label>
                            <Input
                                value={registartionCharge ? parseFloat(registartionCharge).toLocaleString('en-IN') : ''}
                                readOnly
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {registrationChargeError && <p className="text-xs text-red-500">{registrationChargeError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Manjeera Connection Charge (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                value={manjeeraConnectionCharge}
                                onChange={updateManjeeraConnectionCharge}
                                className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {manjeeraConnectionChargeError && <p className="text-xs text-red-500">{manjeeraConnectionChargeError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Manjeera Meter Charge (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                value={manjeeraMeterCharge}
                                onChange={updateManjeeraMeterCharge}
                                className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {manjeeraMeterChargeError && <p className="text-xs text-red-500">{manjeeraMeterChargeError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Maintenance @{projectRates.maintenance_rate_per_sqft || 3}/- per sqft for {projectRates.maintenance_duration_months || 24} Months (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={maintenceCharge ? parseFloat(maintenceCharge).toLocaleString('en-IN') : ''}
                                readOnly
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {maintenceChargeError && <p className="text-xs text-red-500">{maintenceChargeError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Documentation Fee (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                value={documentationFee}
                                onChange={updateDocumenationFee}
                                className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {documenationFeeError && <p className="text-xs text-red-500">{documenationFeeError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Corpus Fund ({projectRates.corpus_fund || 50} * SFT) (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={corpusFund ? parseFloat(corpusFund).toLocaleString('en-IN') : ''}
                                readOnly
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {corpusFundError && <p className="text-xs text-red-500">{corpusFundError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Grand Total (₹) <span className="text-red-500">*</span></Label>
                            <Input
                                value={grandTotal ? parseFloat(grandTotal).toLocaleString('en-IN') : ''}
                                readOnly
                                className="text-lg font-bold bg-green-50 border-green-200 text-green-700 h-14 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                            {grandTotalError && <p className="text-xs text-red-500">{grandTotalError}</p>}
                        </div>
                        <div className="col-span-3">
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Custom Note</label>
                            <textarea
                                value={customNote}
                                onChange={updateCustomNote}
                                placeholder="Enter any additional requirements need for this flat..."
                                rows={3}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 resize-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                {isLoadingEffect ?
                    isLoadingEffect && (
                        <div className='absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded'>
                            <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                        </div>
                    )
                    :
                    <div className="flex justify-end">
                        <div onClick={handleSubmit} className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-[#0083bf]">
                            Submit
                        </div>
                    </div>
                }
                <Updateactivities customerflat_id={customerFlatDetails?.id} />
            </div>

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
    );
}

export default Flatcostupdate;
