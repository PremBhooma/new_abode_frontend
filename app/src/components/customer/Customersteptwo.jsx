import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import Flatapi from "../api/Flatapi";
import Customerapi from "../api/Customerapi";
import Settingsapi from "../api/Settingsapi";
import Errorpanel from "@/components/shared/Errorpanel.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loadingoverlay } from "@nayeshdaggula/tailify";
import CustomDateFilter from "../shared/CustomDateFilter";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "../ui/textarea";

const Customersteptwo = forwardRef((props, ref) => {

    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const permissions = useEmployeeDetails((state) => state.permissions);

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const customerId = searchParams.get("id")
    const projectIdParam = searchParams.get("project_id")

    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');
    const [searchedFlat, setSearchedFlat] = useState("");
    const [flat, setFlat] = useState([]);
    const [flatLoading, setFlatLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);
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

    const updateSearchedLocation = (e) => {
        const value = e.target.value;
        setSearchedFlat(value);

        // Clear previous timeout
        if (debounceTimer) clearTimeout(debounceTimer);

        // Set new timeout for debounced search
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

    const handleSelectCity = (flat) => {
        setSearchedFlat(flat?.label);
        setSelectedFlat(flat);
        setSaleableAreaSqFt(flat?.square_feet)
        setShowDropdown(false);
        setSelectedFlatError('')
    };

    useEffect(() => {
        const fetchAndSetData = async () => {
            if (selectedFlat) {
                getAmenitiesData(selectedFlat?.type, selectedFlat?.project_id);

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
                setAmenties('');
                setSaleableAreaSqFt('');
                setFloorRise('0');
                setEastFacing('0');
                setCorner('0');
            }
        };

        fetchAndSetData();

        if (!searchedFlat) {
            setSelectedFlat(null);
        }
    }, [searchedFlat, selectedFlat]);

    async function getFlatsData(flat) {
        try {
            setFlatLoading(true);

            const response = await Flatapi.get(`search-flats`, {
                params: {
                    flat_no: flat,
                    employeeId: employeeId,
                    project_id: projectIdParam || undefined,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;
            if (data?.status === "error") {
                let finalresponse = {
                    message: data.message,
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                setFlat([]);
                return false;
            }
            setFlat(data?.data || []);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setFlatLoading(false);
        }

    }

    const [saleableAreaSqFt, setSaleableAreaSqFt] = useState("");
    const [saleableAreaSqFtError, setSaleableAreaSqFtError] = useState("");
    const updateSaleableAreaSqFt = (e) => {
        setSaleableAreaSqFt(e.target.value);
        setSaleableAreaSqFtError("");
    };

    const [ratePerSqFt, setRatePerSqFt] = useState("");
    const [ratePerSqFtError, setRatePerSqFtError] = useState("");
    const updateRatePerSqFt = (e) => {
        setRatePerSqFt(e.target.value);
        setRatePerSqFtError("");
    };

    const [discount, setDiscount] = useState('');
    const [discountError, setDiscountError] = useState("");
    const updateDiscount = (e) => {
        setDiscount(e.target.value);
        setDiscountError("");
    };

    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalBaseCost, setTotalBaseCost] = useState(0);

    const [baseCostUnit, setBaseCostUnit] = useState("");
    const [baseCostUnitError, setBaseCostUnitError] = useState("");
    const updateBaseCostUnit = (e) => {
        setBaseCostUnit(e.target.value);
        setBaseCostUnitError("");
    };

    const [applicationDate, setApplicationDate] = useState("")
    const [applicationDateError, setApplicationDateError] = useState('')
    const updateApplicationDate = (value) => {
        setApplicationDate(value)
        setApplicationDateError('')
    }

    const [floorRise, setFloorRise] = useState('25')
    const [floorRiseError, setFloorRiseError] = useState('')
    const updateFloorRise = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setFloorRise(value)
        setFloorRiseError('')
    }

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
    const updateEastFacing = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setEastFacing(value)
        setEastFacingError('')
    }

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
    const updateCorner = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCorner(value)
        setCornerError('')
    }

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

    const [amenities, setAmenties] = useState(null)
    const [amenitiesError, setAmentiesError] = useState('')
    const updateAmenities = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setAmenties(value)
        setAmentiesError('')
    }

    const [totalCostofUnit, setTotalCostofUnit] = useState('')
    const [totalCostofUnitError, setTotalCostofUnitError] = useState('')
    const updateTotalCostofUnit = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setTotalCostofUnit(value)
        setTotalCostofUnitError('')
    }

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
    const updateDocumenationFee = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setDocumentationFee(value)
        setDocumenationFeeError('')
    }

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

    const [manjeeraConnectionCharge, setManjeeraConnectionCharge] = useState('50000')
    const [manjeeraConnectionChargeError, setManjeeraConnectionChargeError] = useState('')

    const [manjeeraMeterCharge, setManjeeraMeterCharge] = useState("15000");
    const [manjeeraMeterChargeError, setManjeeraMeterChargeError] = useState('');

    async function getAmenitiesData(flatType, projectId) {
        try {
            setIsLoadingEffect(true);

            const response = await Settingsapi.get(`get-list-amenities`, {
                params: {
                    flatType: flatType,
                    project_id: projectId
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;
            if (data?.status === "error") {
                let finalresponse = {
                    message: data.message,
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                setAmenties('');
                return false;
            }
            setAmenties(data?.amenities || '');
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
                    message: error.message,
                    server_res: null,
                };
            }
            setErrorMessage(finalresponse);
            return false;
        } finally {
            setIsLoadingEffect(false);
        }

    }


    // 1️⃣ Calculate base cost + total cost
    // useEffect(() => {
    //     const parseNum = (val) => (val ? parseFloat(val) : 0);

    //     // Base Cost Unit
    //     if (saleableAreaSqFt && ratePerSqFt) {
    //         setBaseCostUnit(parseNum(saleableAreaSqFt) * parseNum(ratePerSqFt));
    //     } else {
    //         setBaseCostUnit("");
    //     }

    //     // Floor Rise
    //     if (!floorRise) {
    //         setFloorRise("");
    //         setFloorRiseXPerSft("");
    //     } else if (selectedFlat?.floor_no >= 5 && ratePerSqFt) {
    //         setFloorRiseXPerSft(parseNum(floorRise) * parseNum(ratePerSqFt));
    //     }

    //     // East Facing
    //     if (!eastFacing) {
    //         setEastFacing("");
    //         setEastFacingXPerSft("");
    //     } else if (selectedFlat?.facing === "East" && ratePerSqFt) {
    //         setEastFacingXPerSft(parseNum(eastFacing) * parseNum(ratePerSqFt));
    //     }

    //     // Corner
    //     if (!corner) {
    //         setCorner("");
    //         setCornerXPerSft("");
    //     } else if (selectedFlat?.corner && ratePerSqFt) {
    //         setCornerXPerSft(parseNum(corner) * parseNum(ratePerSqFt));
    //     }

    //     // Reset extras if no rate
    //     if (!ratePerSqFt) {
    //         setFloorRiseXPerSft("");
    //         setEastFacingXPerSft("");
    //         setCornerXPerSft("");
    //     }

    //     // Total Cost
    //     if (!amenities) {
    //         setTotalCostofUnit("");
    //     } else if (saleableAreaSqFt && ratePerSqFt) {
    //         const baseCost = parseNum(saleableAreaSqFt) * parseNum(ratePerSqFt);

    //         const totalCost =
    //             baseCost +
    //             parseNum(floorRiseXPerSft) +
    //             parseNum(eastFacingXPerSft) +
    //             parseNum(cornerXPerSft) +
    //             parseNum(amenities);

    //         console.log("baseCost:", baseCost);
    //         console.log("totalCost:", totalCost);

    //         setTotalCostofUnit(totalCost);
    //     } else {
    //         setTotalCostofUnit("");
    //     }
    // }, [selectedFlat, saleableAreaSqFt, ratePerSqFt, floorRise, eastFacing, corner, floorRiseXPerSft, eastFacingXPerSft, cornerXPerSft, amenities]);

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

            // let registerCharge = ((parseFloat(totalCostofUnit) * 0.076) + 1050).toFixed(2);
            // setRegistrationCharge(parseFloat(registerCharge));
            let registerCharge = ((parseFloat(totalCostofUnit) * (parseFloat(projectRates.registration_percentage) / 100 || 0.076)) + (parseFloat(projectRates.registration_base_charge) || 1050)).toFixed(2);
            setRegistrationCharge(parseFloat(registerCharge));

            if (saleableAreaSqFt) {
                let maintainCharge = ((parseFloat(saleableAreaSqFt) * projectRates.maintenance_rate_per_sqft) * projectRates.maintenance_duration_months).toFixed(2);
                setMaintenceCharge(parseFloat(maintainCharge));
                let corpusFund = (parseFloat(saleableAreaSqFt) * projectRates.corpus_fund).toFixed(2);
                setCorpusFund(parseFloat(corpusFund));

                setGrandTotal(parseFloat(totalCostofUnit) + parseFloat(gstValue) + parseFloat(registerCharge) + parseFloat(maintainCharge) + parseFloat(corpusFund) + parseFloat(documentationFee) + parseFloat(manjeeraConnectionCharge) + parseFloat(manjeeraMeterCharge))
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


    const validateAndSubmit = async () => {
        setIsLoadingEffect(true);

        if (selectedFlat === null) {
            setSelectedFlatError("Please select the flat");
            setIsLoadingEffect(false);
            return false;
        }

        if (!applicationDate) {
            setApplicationDateError('Select booking date')
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
        if (registartionCharge === "") {
            setRegistrationChargeError('Enter Registartion Charge')
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

        if (manjeeraConnectionCharge === "") {
            setManjeeraConnectionChargeError('Enter Manjeera Connection Charge')
            setIsLoadingEffect(false)
            return false
        }

        if (manjeeraMeterCharge === '') {
            setManjeeraMeterChargeError("Manjeera Meter Charge is required");
            setIsLoadingEffect(false);
            return false;
        }

        if (selectedFlat?.floor_no >= 6 && floorRise === "") {
            setFloorRiseError('Enter floor rise charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.floor_no >= 6 && floorRiseXPerSft === "") {
            setFloorRiseXPerSftError('Total floor rise is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.facing === "East" && eastFacing === "") {
            setEastFacingError('Enter east facing charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.facing === "East" && eastFacingXPerSft === "") {
            setEastFacingXPerSftError('Total east facing is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.corner === true && corner === "") {
            setCornerError('Enter corner charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.corner === true && cornerXPerSft === "") {
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

            const apiEndpoint = customerId && "add-customer-flat";

            const response = await Customerapi.post(apiEndpoint, {
                customerId: customerId,
                flat_id: selectedFlat?.value,
                applicationdate: formatDateOnly(applicationDate),
                saleable_area_sq_ft: Number(saleableAreaSqFt),
                rate_per_sq_ft: Number(ratePerSqFt),
                discount: discount ? parseFloat(discount) : null,
                base_cost_unit: Number(baseCostUnit),
                amenities: parseFloat(amenities),
                flatType: selectedFlat?.type,
                toatlcostofuint: parseFloat(totalCostofUnit),
                gst: parseFloat(gst),
                costofunitwithtax: parseFloat(costofUnitWithTax),
                registrationcharge: parseFloat(registartionCharge),
                maintenancecharge: parseFloat(maintenceCharge),
                documentaionfee: parseFloat(documentationFee),
                corpusfund: parseFloat(corpusFund),
                manjeeraConnectionCharge: parseFloat(manjeeraConnectionCharge),
                manjeeraMeterCharge: parseFloat(manjeeraMeterCharge),
                floor_rise_per_sq_ft: selectedFlat?.floor_no >= 6 ? parseFloat(floorRise) : null,
                total_floor_rise: parseFloat(floorRiseXPerSft),
                east_facing_per_sq_ft: selectedFlat?.facing === "East" ? parseFloat(eastFacing) : null,
                total_east_facing: parseFloat(eastFacingXPerSft),
                corner_per_sq_ft: selectedFlat?.corner === true ? parseFloat(corner) : null,
                total_corner: parseFloat(cornerXPerSft),
                grand_total: Number(grandTotal),
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
                    message: error.message,
                    server_res: null,
                };
            }
            setErrorMessage(finalresponse);
            setIsLoadingEffect(false);
            return false;
        }
    };

    useImperativeHandle(ref, () => ({
        validateAndSubmit,
    }));


    return (
        <>
            {isLoadingEffect ? (
                <div className="grid grid-cols-[1fr_2fr] gap-3 w-full">
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-10 w-full" />
                        <div className="border border-gray-300 rounded-md p-3 pb-8 h-[calc(100vh-190px)] space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border border-gray-300 p-3 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="space-y-1">
                                    <Skeleton className="h-4 w-1/2 mb-1" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                            <div className="space-y-1 col-span-2 mt-2">
                                <Skeleton className="h-5 w-1/4 mb-1" />
                                <Skeleton className="h-14 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-[1fr_2fr] gap-3 w-full relative">
                    <div className="flex flex-col gap-3">
                        <div className="relative w-full">
                            <Input
                                placeholder="Search with Flats No"
                                value={searchedFlat}
                                onChange={updateSearchedLocation}
                                className="w-full bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />

                            {showDropdown && (
                                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                    <div className="">
                                        {flatLoading ? (
                                            <div className="p-3 text-sm text-gray-500">Loading...</div>
                                        ) : flat.length > 0 ? (
                                            <ul>
                                                {flat.map((flat) => (
                                                    <li
                                                        key={flat?.value}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                        onClick={() => handleSelectCity(flat)}
                                                    >
                                                        {flat?.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-3 text-sm text-gray-500">No Result</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedFlat && (
                            <div className="bg-white border border-gray-300 rounded-md max-h-96 overflow-y-auto w-full">
                                <div className="p-4 border-b last:border-none hover:bg-gray-50 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-md font-semibold text-gray-800">
                                            {selectedFlat?.project_name}
                                        </div>
                                        <div className="text-md font-semibold text-gray-800">Flat No: {selectedFlat?.flat_no}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                        <div><span className="font-medium">Facing:</span> {selectedFlat?.facing}</div>
                                        <div><span className="font-medium">Floor:</span> {selectedFlat?.floor_no}</div>
                                        <div><span className="font-medium">Area:</span> {selectedFlat?.square_feet} sqft</div>
                                        <div><span className="font-medium">Type:</span> {selectedFlat?.type}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedFlat !== '' && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{selectedFlatError}</p>
                        )}

                        <div className="space-y-2 md:col-span-2">
                            <Label>Custom Note</Label>
                            <Textarea
                                value={customNote}
                                onChange={updateCustomNote}
                                placeholder="Enter any additional requirements need for this flat..."
                                rows={4}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-[4px] focus:outline-none focus:border-black resize-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="border border-gray-300 p-3 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                            <CustomDateFilter
                                label={<span>Booking Date <span className="text-red-500">*</span></span>}
                                selected={applicationDate}
                                error={applicationDateError}
                                onChange={updateApplicationDate}
                                className="bg-white -mt-2"
                                maxDateToday={true}
                            />

                            <div className="space-y-2">
                                <Label>Saleable Area (sq.ft.) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Enter Saleable Area (sq.ft.)"
                                    value={saleableAreaSqFt}
                                    onChange={updateSaleableAreaSqFt}
                                    type="number"
                                    readOnly
                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {saleableAreaSqFtError && <p className="text-xs text-red-500">{saleableAreaSqFtError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Rate Per Sq.ft (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Enter Rate Per Sq.ft"
                                    value={ratePerSqFt}
                                    min={0}
                                    onChange={updateRatePerSqFt}
                                    onWheel={(e) => e.target.blur()}
                                    type="number"
                                    className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                {ratePerSqFtError && <p className="text-xs text-red-500">{ratePerSqFtError}</p>}
                                {totalBaseCost > 0 && <p className="text-xs text-muted-foreground">Saleable Area * Rate = <span className="font-medium">₹ {parseFloat(totalBaseCost).toLocaleString('en-IN')}</span></p>}
                            </div>

                            {permissions?.assigning_settings?.includes("discount_assigning") && (
                                <div className="space-y-1">
                                    <Label>Discount (₹)</Label>
                                    <Input
                                        placeholder="Enter Discount"
                                        value={discount}
                                        min={0}
                                        onChange={updateDiscount}
                                        onWheel={(e) => e.target.blur()}
                                        type="number"
                                        className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    {totalDiscount > 0 && <p className="text-xs text-green-600">Discount Applied: ₹ {parseFloat(totalDiscount).toLocaleString('en-IN')}</p>}
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label>Base Cost Unit (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Enter Base Cost Unit"
                                    value={baseCostUnit ? parseFloat(baseCostUnit).toLocaleString('en-IN') : ''}
                                    onChange={updateBaseCostUnit}
                                    readOnly
                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {baseCostUnitError && <p className="text-xs text-red-500">{baseCostUnitError}</p>}
                            </div>

                            {selectedFlat?.floor_no >= 6 && (
                                <div className="space-y-1">
                                    <Label>Floor Rise (₹)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Per Sq.ft"
                                            value={floorRise ? parseFloat(floorRise).toLocaleString('en-IN') : ''}
                                            onChange={updateFloorRise}
                                            className="w-1/3 bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            readOnly
                                        />
                                        <Input
                                            placeholder="Total Floor Rise"
                                            value={floorRiseXPerSft ? parseFloat(floorRiseXPerSft).toLocaleString('en-IN') : ''}
                                            onChange={updateFloorRiseXPerSft}
                                            className="w-2/3 bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            readOnly
                                        />
                                    </div>
                                    {floorRiseError && <p className="text-xs text-red-500">{floorRiseError}</p>}
                                </div>
                            )}
                            {selectedFlat?.facing === "East" && (
                                <div className="space-y-1">
                                    <Label>East Facing (₹)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Per Sq.ft"
                                            value={eastFacing ? parseFloat(eastFacing).toLocaleString('en-IN') : ''}
                                            onChange={updateEastFacing}
                                            className="w-1/3 bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            readOnly
                                        />
                                        <Input
                                            placeholder="Total East Facing"
                                            value={eastFacingXPerSft ? parseFloat(eastFacingXPerSft).toLocaleString('en-IN') : ''}
                                            onChange={updateEastFacingXPerSft}
                                            className="w-2/3 bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            readOnly
                                        />
                                    </div>
                                    {eastFacingError && <p className="text-xs text-red-500">{eastFacingError}</p>}
                                </div>
                            )}

                            {selectedFlat?.corner === true && (
                                <div className="space-y-1">
                                    <Label>Corner (₹)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Per Sq.ft"
                                            value={corner ? parseFloat(corner).toLocaleString('en-IN') : ''}
                                            onChange={updateCorner}
                                            className="w-1/3 bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            readOnly
                                        />
                                        <Input
                                            placeholder="Total Corner"
                                            value={cornerXPerSft ? parseFloat(cornerXPerSft).toLocaleString('en-IN') : ''}
                                            onChange={updateCornerXPerSft}
                                            className="w-2/3 bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            readOnly
                                        />
                                    </div>
                                    {cornerError && <p className="text-xs text-red-500">{cornerError}</p>}
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label>Ammenities (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Enter Amenities"
                                    value={amenities ? parseFloat(amenities).toLocaleString('en-IN') : ''}
                                    onChange={updateAmenities}
                                    readOnly
                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {amenitiesError && <p className="text-xs text-red-500">{amenitiesError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Total Cost of Unit (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Enter Total Cost of Unit"
                                    value={totalCostofUnit ? parseFloat(totalCostofUnit).toLocaleString('en-IN') : ''}
                                    onChange={updateTotalCostofUnit}
                                    readOnly
                                    className="bg-gray-50 font-bold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {totalCostofUnitError && <p className="text-xs text-red-500">{totalCostofUnitError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>GST ({projectRates.gst_percentage || 5}%) (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Enter GST"
                                    value={gst ? parseFloat(gst).toLocaleString('en-IN') : ''}
                                    onChange={updateGst}
                                    readOnly
                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {gstError && <p className="text-xs text-red-500">{gstError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Cost of Unit with Tax (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Enter Cost of Unit with Tax"
                                    value={costofUnitWithTax ? parseFloat(costofUnitWithTax).toLocaleString('en-IN') : ''}
                                    onChange={updateCostofUnitWithTax}
                                    readOnly
                                    className="bg-gray-50 font-semibold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {costofUnitWithTaxError && <p className="text-xs text-red-500">{costofUnitWithTaxError}</p>}
                            </div>

                            {/* Registration Charge */}
                            <div className="space-y-1">
                                <Label>Registration Charges (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    value={registartionCharge ? parseFloat(registartionCharge).toLocaleString('en-IN') : ''}
                                    onChange={updateRegistrationCharge}
                                    readOnly
                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {registrationChargeError && <p className="text-xs text-red-500">{registrationChargeError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Maintence Charges (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    value={maintenceCharge ? parseFloat(maintenceCharge).toLocaleString('en-IN') : ''}
                                    onChange={updateMaintenceCharge}
                                    readOnly
                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {maintenceChargeError && <p className="text-xs text-red-500">{maintenceChargeError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Manjeera Connection Charges (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    value={manjeeraConnectionCharge}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!isNaN(val)) {
                                            setManjeeraConnectionCharge(val);
                                            setManjeeraConnectionChargeError('');
                                        }
                                    }}
                                    placeholder="Enter Amount"
                                    className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {manjeeraConnectionChargeError && <p className="text-xs text-red-500">{manjeeraConnectionChargeError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Manjeera Meter Charges (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    value={manjeeraMeterCharge}
                                    onChange={(e) => setManjeeraMeterCharge(e.target.value)}
                                    placeholder="Enter Amount"
                                    className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {manjeeraMeterChargeError && <p className="text-xs text-red-500">{manjeeraMeterChargeError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Documentation Charges (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    value={documentationFee}
                                    onChange={updateDocumenationFee}
                                    className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {documenationFeeError && <p className="text-xs text-red-500">{documenationFeeError}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label>Corpus Fund ({projectRates.corpus_fund || 50} * SFT) (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    value={corpusFund ? parseFloat(corpusFund).toLocaleString('en-IN') : ''}
                                    onChange={updateCorpusFund}
                                    readOnly
                                    className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {corpusFundError && <p className="text-xs text-red-500">{corpusFundError}</p>}
                            </div>

                            <div className="space-y-1 col-span-2">
                                <Label className="text-base font-bold">Grand Total (₹)</Label>
                                <Input
                                    value={grandTotal ? parseFloat(grandTotal).toLocaleString('en-IN') : ''}
                                    readOnly
                                    className="text-lg font-bold bg-green-50 border-green-200 text-green-700 h-14 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
            }
        </>
    );
})

export default Customersteptwo;
