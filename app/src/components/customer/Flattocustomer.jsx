import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Flatapi from "../api/Flatapi";
import Settingsapi from "../api/Settingsapi";
import Customerapi from "../api/Customerapi";
import Errorpanel from "../shared/Errorpanel";
import noImageStaticImage from "../../../public/assets/no_image.png"
import { toast } from "react-toastify";
import { Loadingoverlay } from "@nayeshdaggula/tailify";
import CustomDateFilter from "../shared/CustomDateFilter";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Flattocustomer() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefilledCustomerUid = searchParams.get("customer");

    const closeFlatToCustomer = () => {
        navigate(-1);
    }
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const permissions = useEmployeeDetails((state) => state.permissions);
    const employeeId = employeeInfo?.id || null;
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerError, setSelectedCustomerError] = useState('');
    const [searchedCustomer, setSearchedCustomer] = useState("");
    const [customer, setCustomer] = useState([]);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [showDropdownCustomer, setShowDropdownCustomer] = useState(false);
    const [debounceTimerCustomer, setDebounceTimerCustomer] = useState(null);

    const [manjeeraConnectionCharge, setManjeeraConnectionCharge] = useState("50000");
    const [manjeeraConnectionChargeError, setManjeeraConnectionChargeError] = useState('');

    const [manjeeraMeterCharge, setManjeeraMeterCharge] = useState("15000");
    const [manjeeraMeterChargeError, setManjeeraMeterChargeError] = useState('');

    // console.log("selectedCustomer___uuid:", selectedCustomer);

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

    const updateSearchedCustomer = (e) => {
        const value = e.target.value;
        setSearchedCustomer(value);

        if (value.trim().length === 0) {
            setSelectedCustomer(null);
        }

        if (debounceTimerCustomer) clearTimeout(debounceTimerCustomer);

        const timer = setTimeout(() => {
            if (value.trim().length > 0) {
                getCustomerForFlatsData(value);
                setShowDropdownCustomer(true);
            } else {
                setCustomer([]);
                setShowDropdownCustomer(false);
            }
        }, 500);

        setDebounceTimerCustomer(timer);
    };

    const handleSelectCustomer = (customerValue) => {
        console.log("Selected Customer SET:", customerValue);
        setSearchedCustomer(customerValue?.label);
        setSelectedCustomer(customerValue);
        setShowDropdownCustomer(false);
        setSelectedCustomerError('')
    };

    // useEffect(() => {
    //     if (!searchedCustomer) {
    //         setSelectedCustomer(null);
    //     }
    // }, [searchedCustomer]);

    // Handle prefilled data
    useEffect(() => {
        if (prefilledCustomerUid) {
            // Fetch customer details
            const fetchCustomer = async () => {
                try {
                    const response = await Customerapi.get("get-single-customer-data", {
                        params: { customerUuid: prefilledCustomerUid },
                    });
                    if (response?.data?.status === "success" && response?.data?.data) {
                        const custData = response.data.data;
                        const customerObj = {
                            ...custData,
                            label: `${custData.first_name} ${custData.last_name} - ${custData.phone_number}`,
                            value: custData.uuid || custData.customer_uid || prefilledCustomerUid || custData.id,
                            uuid: custData.uuid || custData.customer_uid || prefilledCustomerUid,
                        };
                        handleSelectCustomer(customerObj);
                    }
                } catch (error) {
                    console.error("Error fetching prefilled customer:", error);
                }
            };
            fetchCustomer();
        }
    }, [prefilledCustomerUid, employeeId]);

    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');
    const [searchedFlat, setSearchedFlat] = useState("");
    const [flat, setFlat] = useState([]);
    const [flatLoading, setFlatLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);
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
                setProjectRates({ floor_rise: 0, east_facing: 0, corner: 0 });
            }
        };

        fetchAndSetData();

        if (!searchedFlat) {
            setSelectedFlat(null);
            setAmenties('');
            setSaleableAreaSqFt('');
            setFloorRise('0');
            setEastFacing('0');
            setCorner('0');
        }
    }, [searchedFlat, selectedFlat]);

    async function getFlatsData(flat) {
        try {
            setFlatLoading(true);

            const response = await Flatapi.get(`search-flats`, {
                params: {
                    flat_no: flat,
                    employeeId: employeeId,
                    project_id: selectedCustomer?.project_id || undefined,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;
            if (data?.status === "error") {
                // Removed local error setting to avoid UI clutter, or keep as is? 
                // The original code set error message. I'll keep it simple as in costSheetDrawer
                //  let finalresponse = {
                //      message: data.message,
                //      server_res: data,
                //  };
                //  setErrorMessage(finalresponse);
                setFlat([]);
                return false;
            }
            setFlat(data?.data || []);
            return true;
        } catch (error) {
            console.log(error);
            setFlat([]);
            return false;
        } finally {
            setFlatLoading(false);
        }

    }

    async function getCustomerForFlatsData(customerValue) {
        try {
            setFlatLoading(true);

            const response = await Customerapi.get(`search-customers-for-flat`, {
                params: {
                    searchQuery: customerValue,
                    project_id: selectedFlat?.project_id || undefined,
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
                setFlatLoading(false);
                setFlat([]);
                return false;
            }
            setCustomer(data?.data || []);
            return true;
        } catch (error) {
            console.log(error);
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
            setFlatLoading(false);
        }

    }

    const infoItems = [
        { label: 'Name', value: `${capitalize(selectedCustomer?.first_name) || ''} ${capitalize(selectedCustomer?.last_name) || ''}` },
        { label: 'Email', value: selectedCustomer?.email },
        { label: 'Phone Number', value: `+${selectedCustomer?.phone_code} ${selectedCustomer?.phone_number}` },
        { label: 'Date of Birth', value: dayjs(selectedCustomer?.date_of_birth).format('DD/MM/YYYY') },
        { label: 'Mother Tongue', value: selectedCustomer?.mother_tongue },
        { label: 'Pan Card No.', value: selectedCustomer?.pan_card_no },
        { label: 'Aadhar Card No.', value: selectedCustomer?.aadhar_card_no?.replace(/(\d{4})(?=\d)/g, "$1-") },
    ];

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

    const [applicationDate, setApplicationDate] = useState('')
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

    const [amenities, setAmenties] = useState('')
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

        if (amenities === '') {
            setAmentiesError("Enter amenities");
            setIsLoadingEffect(false);
            return false;
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

        if (manjeeraConnectionCharge === '') {
            setManjeeraConnectionChargeError("Manjeera Connection Charge is required");
            setIsLoadingEffect(false);
            return false;
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

            const customerIdToUse = selectedCustomer?.uuid || selectedCustomer?.value || selectedCustomer?.customer_uid;

            if (!customerIdToUse) {
                console.error("Selected Customer missing UUID/Value:", selectedCustomer);
                setErrorMessage({ message: "Please select a customer first." });
                setIsLoadingEffect(false);
                return false;
            }

            console.log("Selected____Customer:", customerIdToUse);
            const formatDateOnly = (date) => {
                if (!date) return null;
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            };

            const apiEndpoint = "add-customer-flat";

            const response = await Customerapi.post(apiEndpoint, {
                customerUuid: customerIdToUse,
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
                floor_rise_per_sq_ft: selectedFlat?.floor_no >= 6 ? parseFloat(floorRise) : null,
                total_floor_rise: parseFloat(floorRiseXPerSft),
                east_facing_per_sq_ft: selectedFlat?.facing === "East" ? parseFloat(eastFacing) : null,
                total_east_facing: parseFloat(eastFacingXPerSft),
                corner_per_sq_ft: selectedFlat?.corner === true ? parseFloat(corner) : null,
                total_corner: parseFloat(cornerXPerSft),
                grand_total: parseFloat(grandTotal),
                custom_note: customNote || null,
                employeeId: employeeId,
                manjeeraConnectionCharge: parseFloat(manjeeraConnectionCharge),
                manjeeraMeterCharge: parseFloat(manjeeraMeterCharge),
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
            toast.success("Flat assigned to customer successfully");

            if (selectedFlat?.uuid) {
                navigate(`/payments/addnew?flat=${selectedFlat.uuid}`);
            } else if (selectedFlat?.value) {
                navigate(`/payments/addnew?flat=${selectedFlat.value}`);
            } else {
                navigate(-1);
            }
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


    console.log("permissions", permissions);

    return (
        <div className="h-full flex flex-col gap-3 justify-start bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="font-semibold text-xl text-gray-800">Assign Flat to Customer</div>
            </div>
            <div className="w-full max-w-7xl bg-white overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()} >
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Side: Search & Info */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-6">

                            {/* Flat Search */}
                            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm space-y-4">
                                <Label className="text-sm font-medium text-gray-700">Search Flat</Label>
                                <div className="relative mb-1">
                                    <Input
                                        placeholder="Enter Flat No"
                                        value={searchedFlat}
                                        onChange={updateSearchedLocation}
                                        className="mt-1 bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {showDropdown && (
                                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                            {flatLoading ? (
                                                <div className="p-3 text-sm text-gray-500">Loading...</div>
                                            ) : flat.length > 0 ? (
                                                flat.map((item) => (
                                                    <div
                                                        key={item.value}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                        onClick={() => handleSelectFlat(item)}
                                                    >
                                                        {item.label}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-3 text-sm text-gray-500">No Flat found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {selectedFlatError && <p className="text-xs text-red-500">{selectedFlatError}</p>}

                                {selectedFlat && (
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md space-y-1 border border-gray-300">
                                        <div className="font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-2">
                                            Flat {selectedFlat.flat_no} Details
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                            <span>Type:</span> <span className="font-medium text-gray-900">{selectedFlat.type}</span>
                                            <span>Area:</span> <span className="font-medium text-gray-900">{selectedFlat.square_feet} sft</span>
                                            <span>Facing:</span> <span className="font-medium text-gray-900">{selectedFlat.facing}</span>
                                            <span>Floor:</span> <span className="font-medium text-gray-900">{selectedFlat.floor_no}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Customer Search */}
                            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm space-y-4">
                                <Label className="text-sm font-medium text-gray-700">Search Customer</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter Name, Phone or Email"
                                        value={searchedCustomer}
                                        onChange={updateSearchedCustomer}
                                        className="mt-1 bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {showDropdownCustomer && (
                                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                            {customerLoading ? (
                                                <div className="p-3 text-sm text-gray-500">Loading...</div>
                                            ) : customer.length > 0 ? (
                                                customer.map((item) => (
                                                    <div
                                                        key={item.value}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between group"
                                                        onClick={() => handleSelectCustomer(item)}
                                                    >
                                                        <span>{item.label}</span>
                                                        {item.isFlatBooked && (
                                                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-medium border border-red-100 uppercase tracking-wide">
                                                                Flat Booked
                                                            </span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-3 text-sm text-gray-500">No Result</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {selectedCustomerError && <p className="text-xs text-red-500">{selectedCustomerError}</p>}

                                {selectedCustomer && (
                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-center flex-col items-center gap-2">
                                            <img
                                                src={selectedCustomer?.profile_pic_url || noImageStaticImage}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                                            />
                                            {selectedCustomer?.isFlatBooked && (
                                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-medium border border-red-100 uppercase tracking-wide">
                                                    Flat Booked
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid gap-2 text-sm bg-gray-50 p-3 rounded-md border border-gray-300">
                                            {infoItems.map(({ label, value }) => (
                                                <div key={label} className="grid grid-cols-[100px_1fr] gap-2">
                                                    <span className="text-gray-500">{label}</span>
                                                    <span className="font-medium text-gray-900 break-all">{value || '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Custom Note</Label>
                                <textarea
                                    value={customNote}
                                    onChange={updateCustomNote}
                                    placeholder="Enter any additional requirements need for this flat..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-[4px] focus:outline-none focus:border-black resize-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Right Side: Cost Sheet Form */}
                        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg border border-gray-300 shadow-sm h-fit">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-300">Cost Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-2">
                                    <CustomDateFilter
                                        label="Booking Date"
                                        selected={applicationDate}
                                        error={applicationDateError}
                                        onChange={updateApplicationDate}
                                        className="bg-white -mt-2"
                                        maxDateToday={true}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Saleable Area (sq.ft) <span className="text-red-500">*</span></Label>
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
                                        min={0}
                                        value={ratePerSqFt}
                                        onChange={updateRatePerSqFt}
                                        onWheel={(e) => e.target.blur()}
                                        placeholder="Enter Rate"
                                        className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    {ratePerSqFtError && <p className="text-xs text-red-500">{ratePerSqFtError}</p>}
                                    {totalBaseCost > 0 && <p className="text-xs">Scaleable Area (sq.ft.) * Rate Per Sq.ft = <span className="font-semibold">₹ {totalBaseCost.toLocaleString('en-IN')}</span></p>}
                                </div>

                                {permissions?.assigning_settings?.includes("discount_assigning") &&
                                    <div className="space-y-2">
                                        <Label>Discount Per Sq.ft (₹)</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={discount}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={updateDiscount}
                                            placeholder="Enter Discount"
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                        {totalDiscount > 0 && <p className="text-xs">Scaleable Area (sq.ft.) * Discount Per Sq.ft = <span className="font-semibold">₹ {totalDiscount.toLocaleString('en-IN')}</span></p>}
                                    </div>
                                }

                                <div className={`space-y-2 ${permissions?.assigning_settings?.includes("discount_assigning") ? "md:col-span-2" : ""}`}>
                                    <Label>Base Cost of Unit (₹)</Label>
                                    <Input
                                        value={baseCostUnit ? parseFloat(baseCostUnit).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div>

                                {selectedFlat?.floor_no >= 6 && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Floor Rise (Per Sq.ft) (₹) <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                value={floorRise}
                                                readOnly
                                                onChange={updateFloorRise}
                                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            />
                                            {floorRiseError && <p className="text-xs text-red-500">{floorRiseError}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total Floor Rise Charge (₹)</Label>
                                            <Input
                                                value={floorRiseXPerSft ? parseFloat(floorRiseXPerSft).toLocaleString('en-IN') : ''}
                                                readOnly
                                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedFlat?.facing === "East" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>East Facing (Per Sq.ft) (₹) <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                value={eastFacing}
                                                readOnly
                                                onChange={updateEastFacing}
                                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            />
                                            {eastFacingError && <p className="text-xs text-red-500">{eastFacingError}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total East Facing Charge (₹)</Label>
                                            <Input
                                                value={eastFacingXPerSft ? parseFloat(eastFacingXPerSft).toLocaleString('en-IN') : ''}
                                                readOnly
                                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedFlat?.corner === true && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Corner (Per Sq.ft) (₹) <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                value={corner}
                                                readOnly
                                                onChange={updateCorner}
                                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            />
                                            {cornerError && <p className="text-xs text-red-500">{cornerError}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total Corner Charge (₹)</Label>
                                            <Input
                                                value={cornerXPerSft ? parseFloat(cornerXPerSft).toLocaleString('en-IN') : ''}
                                                readOnly
                                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <Label>Amenities (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={amenities ? parseFloat(amenities).toLocaleString('en-IN') : ''}
                                        onChange={updateAmenities}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Total Cost of Unit (₹)</Label>
                                    <Input
                                        value={totalCostofUnit ? parseFloat(totalCostofUnit).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 font-bold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>GST ({projectRates.gst_percentage || 5}%) (₹)</Label>
                                    <Input
                                        value={gst ? parseFloat(gst).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Cost with Tax (₹)</Label>
                                    <Input
                                        value={costofUnitWithTax ? parseFloat(costofUnitWithTax).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 font-semibold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
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
                                    <Label>Manjeera Connection Charges (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={manjeeraConnectionCharge}
                                        onChange={(e) => setManjeeraConnectionCharge(e.target.value)}
                                        placeholder="Enter Amount"
                                        className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                    {manjeeraConnectionChargeError && <p className="text-xs text-red-500">{manjeeraConnectionChargeError}</p>}
                                </div>

                                <div className="space-y-2">
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

                                <div className="space-y-2">
                                    <Label>Maintenance @{projectRates.maintenance_rate_per_sqft || 3}/- per sqft for {projectRates.maintenance_duration_months || 24} Months (₹)</Label>
                                    <Input
                                        value={maintenceCharge ? parseFloat(maintenceCharge).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Documentation Fee (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={documentationFee}
                                        onChange={updateDocumenationFee}
                                        className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Corpus Fund ({projectRates.corpus_fund || 50} * SFT) (₹)</Label>
                                    <Input
                                        value={corpusFund ? parseFloat(corpusFund).toLocaleString('en-IN') : ''}
                                        readOnly
                                        className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
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
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3 rounded-b-xl z-20">
                    <div
                        onClick={closeFlatToCustomer}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 cursor-pointer text-sm"
                    >
                        Cancel
                    </div>
                    <div
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition-colors cursor-pointer text-sm"
                    >
                        Assign Flat
                    </div>
                </div>
            </div>

            {isLoadingEffect && (
                <div className="absolute inset-0 bg-white/50 z-[60] flex items-center justify-center">
                    <Loadingoverlay visible={isLoadingEffect} className="translate-y-0" />
                </div>
            )}
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
    );
}

export default Flattocustomer;
