import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import Generalapi from "../api/Generalapi";
import Customerapi from "../api/Customerapi";
import Settingsapi from "../api/Settingsapi";
import Projectapi from "../api/Projectapi";
import Errorpanel from "@/components/shared/Errorpanel.jsx";
import { toast } from "react-toastify";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Loadingoverlay,
  Button,
} from "@nayeshdaggula/tailify";
import CustomDateFilter from "@/components/shared/CustomDateFilter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Skeleton } from "@/components/ui/skeleton";

const Customerstepone = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const [searchParams, setSearchParams] = useSearchParams();
  const customerId = searchParams.get("id");

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  async function getProjects() {
    try {
      const response = await Projectapi.get("/get-all-projects");
      if (response?.data?.status === "success") {
        setProjects(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);



  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const updateFirstName = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setFirstName(formatted);
    setFirstNameError("");
  };

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const updateLastName = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setLastName(formatted);
    setLastNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const updateEmail = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail(value);
    setEmailError("");
  };

  const [email2, setEmail2] = useState("");
  const [emailError2, setEmailError2] = useState("");
  const updateEmail2 = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail2(value);
    setEmailError2("");
  };

  const [phoneCode, setPhoneCode] = useState("91");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const updatePhoneCode = (value) => {
    setPhoneCode(value);
    setPhoneCodeError("");
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const updatePhoneNumber = (e) => {
    let value = e.target.value;

    // remove non-digit characters
    value = value.replace(/\D/g, "");

    // if phoneCode is India (+91), restrict to 10 digits
    if (phoneCode === "91") {
      value = value.slice(0, 10);
    }
    setPhoneNumber(value);
    setPhoneNumberError("");
  };

  const [gender, setGender] = useState("Male");
  const [genderError, setGenderError] = useState("");
  const updateGender = (value) => {
    setGender(value);
    setGenderError("");
  };

  const [prefixes, setPrefixes] = useState("");
  const [prefixError, setPrefixError] = useState("");
  const updatePrefix = (value) => {
    setPrefixes(value);
    setPrefixError("");

    if (value === "Mr") {
      setGender("Male");
    } else if (["Mrs", "Miss"].includes(value)) {
      setGender("Female");
    } else {
      setGender("");
    }
  };


  const [landlineCountryCode, setLandlineCountryCode] = useState("91");
  const [landlineCountryCodeError, setLandlineCountryCodeError] = useState("");
  const updateLandlineCountryCode = (value) => {
    setLandlineCountryCode(value);
    setLandlineCountryCodeError("");
  };

  const [landlineCityCode, setLandlineCityCode] = useState("");
  const [landlineCityCodeError, setLandlineCityCodeError] = useState("");
  const updateLandlineCityCode = (e) => {
    setLandlineCityCode(e.target.value);
    setLandlineCityCodeError("");
  };

  const [landlineNumber, setLandlineNumber] = useState("");
  const [landlineNumberError, setLandlineNumberError] = useState("");
  const updateLandlineNumber = (e) => {
    setLandlineNumber(e.target.value);
    setLandlineNumberError("");
  };

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const updateDateOfBirth = (value) => {
    setDateOfBirth(value);
    setDateOfBirthError("");
  };

  const [fatherName, setFatherName] = useState("");
  const [fatherNameError, setFatherNameError] = useState("");
  const updateFatherName = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setFatherName(formatted);
    setFatherNameError("");
  };

  const [maritalStatus, setMaritalStatus] = useState("");
  const [maritalStatusError, setMaritalStatusError] = useState("");
  const updateMaritalStatus = (value) => {
    // Prevent changing to "Single" if spouse name exists
    if (value === "Single" && spouseName.trim() !== "") {
      setMaritalStatusError("Cannot set to Single when spouse name exists");
      return;
    }

    setMaritalStatus(value);
    setMaritalStatusError("");
  };

  const [spousePrefix, setSpousePrefix] = useState("");
  const [spousePrefixError, setSpousePrefixError] = useState("");
  const updateSpousePrefix = (value) => {
    setSpousePrefix(value);
    setSpousePrefixError("");
  };

  const [spouseName, setSpouseName] = useState("");
  const [spouseNameError, setSpouseNameError] = useState("");
  const updateSpouseName = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setSpouseName(formatted);
    setSpouseNameError("");
  };

  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [numberOfChildrenError, setNumberOfChildrenError] = useState("");
  const updateNumberOfChildren = (e) => {
    setNumberOfChildren(e.target.value);
    setNumberOfChildrenError("");
  };

  const [weddingAniversary, setWeddingAniversary] = useState("");
  const [weddingAniversaryError, setWeddingAniversaryError] = useState("");
  const updateWeddingAniversary = (value) => {
    setWeddingAniversary(value);
    setWeddingAniversaryError("");
  };

  const [spouseDob, setSpouseDob] = useState("");
  const [spouseDobError, setSpouseDobError] = useState("");
  const updateSpouseDob = (value) => {
    setSpouseDob(value);
    setSpouseDobError("");
  };

  const [panCardNo, setPanCardNo] = useState("");
  const [panCardNoError, setPanCardNoError] = useState("");
  const updatePanCardNo = (e) => {
    const value = e.target.value.toUpperCase();
    setPanCardNo(value);
    setPanCardNoError("");
  };

  const [aadharCardNo, setAadharCardNo] = useState("");
  const [aadharCardNoError, setAadharCardNoError] = useState("");
  const updateAadharCardNo = (e) => {
    setAadharCardNo(e.target.value);
    setAadharCardNoError("");
  };

  const [countryOfCitizenship, setCountryOfCitizenship] = useState("");
  const [countryOfCitizenshipError, setCountryOfCitizenshipError] =
    useState("");
  const updateCountryOfCitizenship = (value) => {
    setCountryOfCitizenship(value);
    setCountryOfCitizenshipError("");
  };

  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [countryOfResidenceError, setCountryOfResidenceError] = useState("");
  const updateCountryOfResidence = (value) => {
    setCountryOfResidence(value);
    setCountryOfResidenceError("");
  };

  const [motherTongue, setMotherTongue] = useState("Telugu");
  const [motherTongueError, setMotherTongueError] = useState("");
  const updateMotherTongue = (e) => {
    setMotherTongue(e.target.value);
    setMotherTongueError("");
  };

  const [nameOfPoa, setNameOfPoa] = useState("");
  const [nameOfPoaError, setNameOfPoaError] = useState("");
  const updateNameOfPoa = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setNameOfPoa(formatted);
    setNameOfPoaError("");
  };

  const [holderPoa, setHolderPoa] = useState("");
  const [holderPoaError, setHolderPoaError] = useState("");
  const updateHolderPoa = (value) => {
    setHolderPoa(value);
    setHolderPoaError("");
  };

  const [noOfYearsCorrespondenceAddress, setNoOfYearsCorrespondenceAddress] =
    useState("");
  const [
    noOfYearsCorrespondenceAddressError,
    setNoOfYearsCorrespondenceAddressError,
  ] = useState("");
  const updateNoOfYearsCorrespondenceAddress = (e) => {
    setNoOfYearsCorrespondenceAddress(e.target.value);
    setNoOfYearsCorrespondenceAddressError("");
  };

  const [noOfYearsCity, setNoOfYearsCity] = useState("");
  const [noOfYearsCityError, setNoOfYearsCityError] = useState("");
  const updateNoOfYearsCity = (e) => {
    setNoOfYearsCity(e.target.value);
    setNoOfYearsCityError("");
  };

  const [haveYouOwnedAbode, setHaveYouOwnedAbode] = useState("");
  const [haveYouOwnedAbodeError, setHaveYouOwnedAbodeError] = useState("");
  const updateHaveYouOwnedAbode = (value) => {
    setHaveYouOwnedAbode(value);
    setHaveYouOwnedAbodeError("");
    setIfOwnedProjectName("");
  };

  const [ifOwnedProjectName, setIfOwnedProjectName] = useState("");
  const [ifOwnedProjectNameError, setIfOwnedProjectNameError] = useState("");
  const updateIfOwnedProjectName = (e) => {
    setIfOwnedProjectName(e.target.value);
    setIfOwnedProjectNameError("");
  };

  const [correspondenceStateData, setCorrespondenceStateData] = useState([]);
  const [permanentStateData, setPermanentStateData] = useState([]);
  const [correspondenceCityData, setCorrespondenceCityData] = useState([]);
  const [permanentCityData, setPermanentCityData] = useState([]);

  const [correspondenceCountry, setCorrespondenceCountry] = useState("");
  const [correspondenceCountryError, setCorrespondenceCountryError] =
    useState("");
  const updateCorrespondenceCountry = (value) => {
    setCorrespondenceCountry(value);
    setCorrespondenceCountryError("");
  };

  const [correspondenceState, setCorrespondenceState] = useState("");
  const [correspondenceStateError, setCorrespondenceStateError] = useState("");
  const updateCorrespondenceState = (value) => {
    setCorrespondenceState(value);
    setCorrespondenceStateError("");
  };

  const [correspondenceCity, setCorrespondenceCity] = useState("");
  const [correspondenceCityError, setCorrespondenceCityError] = useState("");
  const updateCorrespondenceCity = (value) => {
    setCorrespondenceCity(value);
    setCorrespondenceCityError("");
  };

  const [correspondencePincode, setCorrespondencePincode] = useState("");
  const [correspondencePincodeError, setCorrespondencePincodeError] =
    useState("");
  const updateCorrespondencePincode = (e) => {
    setCorrespondencePincode(e.target.value);
    setCorrespondencePincodeError("");
  };

  const [correspondenceAddress, setCorrespondenceAddress] = useState("");
  const [correspondenceAddressError, setCorrespondenceAddressError] =
    useState("");
  const updateCorrespondenceAddress = (e) => {
    setCorrespondenceAddress(e.target.value);
    setCorrespondenceAddressError("");
  };

  const [permanentCountry, setPermanentCountry] = useState("");
  const [permanentCountryError, setPermanentCountryError] = useState("");
  const updatePermanentCountry = (value) => {
    setPermanentCountry(value);
    setPermanentCountryError("");
  };

  const [permanentState, setPermanentState] = useState("");
  const [permanentStateError, setPermanentStateError] = useState("");
  const updatePermanentState = (value) => {
    setPermanentState(value);
    setPermanentStateError("");
  };

  const [permanentCity, setPermanentCity] = useState("");
  const [permanentCityError, setPermanentCityError] = useState("");
  const updatePermanentCity = (value) => {
    setPermanentCity(value);
    setPermanentCityError("");
  };

  const [permanentPincode, setPermanentPincode] = useState("");
  const [permanentPincodeError, setPermanentPincodeError] = useState("");
  const updatePermanentPincode = (e) => {
    setPermanentPincode(e.target.value);
    setPermanentPincodeError("");
  };

  const [permanentAddress, setPermanentAddress] = useState("");
  const [permanentAddressError, setPermanentAddressError] = useState("");
  const updatePermanentAddress = (e) => {
    setPermanentAddress(e.target.value);
    setPermanentAddressError("");
  };

  const [isSameAddress, setIsSameAddress] = useState(false);

  const handleIsSameAddress = (checked) => {
    setIsSameAddress(checked);
    // handleToggleAddressPremanent()

    if (checked) {
      // setPermanentCountry(correspondenceCountry);
      setPermanentState(correspondenceState);
      setPermanentCity(correspondenceCity);
      setPermanentAddress(correspondenceAddress);
      setPermanentPincode(correspondencePincode);
    }
    if (!checked) {
      // setPermanentCountry("");
      setPermanentState("");
      setPermanentCity("");
      setPermanentAddress("");
      setPermanentPincode("");
    }
  };

  const [currentDesignation, setCurrentDesignation] = useState("");
  const [currentDesignationError, setCurrentDesignationError] = useState("");
  const updateCurrentDesignation = (e) => {
    const value = e.target.value;
    const formatted = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    setCurrentDesignation(formatted);
    setCurrentDesignationError("");
  };

  const [currentOrganization, setCurrentOrganization] = useState("");
  const [currentOrganizationError, setCurrentOrganizationError] = useState("");
  const updateCurrentOrganization = (e) => {
    const value = e.target.value;
    const formatted = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    setCurrentOrganization(formatted);
    setCurrentOrganizationError("");
  };

  const [organizationAddress, setOrganizationAddress] = useState("");
  const [organizationAddressError, setOrganizationAddressError] = useState("");
  const updateOrganizationAddress = (e) => {
    const value = e.target.value;
    const formatted = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    setOrganizationAddress(formatted);
    setOrganizationAddressError("");
  };

  const [workExperience, setWorkExperience] = useState("");
  const [workExperienceError, setWorkExperienceError] = useState("");
  const updateWorkExperience = (e) => {
    setWorkExperience(e.target.value);
    setWorkExperienceError("");
  };

  const [annualIncome, setAnnualIncome] = useState("");
  const [annualIncomeError, setAnnualIncomeError] = useState("");
  const updateAnnualIncome = (e) => {
    setAnnualIncome(e.target.value);
    setAnnualIncomeError("");
  };

  const [countryCodes, setCountryCodes] = useState([]);
  const [countryNames, setCountryNames] = useState([]);

  async function fetchCountryCodes() {
    setIsLoadingEffect(true);
    try {
      const response = await Generalapi.get("/getcountries");
      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return false;
      }
      setCountryCodes(data.countrydata || []);
      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.error("fetchCountryCodes error:", error);
      const finalresponse = {
        message: error.message || "Failed to fetch country codes",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return false;
    }
  }

  async function fetchCountryNames() {
    setIsLoadingEffect(true);
    try {
      const response = await Generalapi.get("/getcountriesnames");
      const data = response?.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return false;
      }
      setCountryNames(data?.countryNames || []);
      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.error("fetchCountryNames error:", error);
      const finalresponse = {
        message: error.message || "Failed to fetch country codes",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return false;
    }
  }

  async function getStates(countryId, isCorrespondence = false) {
    if (!countryId) return;
    await Settingsapi.get("/get-states", {
      params: {
        country_id: countryId,
      },
    })
      .then((response) => {
        const data = response?.data;
        if (data?.status === "error") {
          let finalResponse;
          finalResponse = {
            message: data?.message,
            server_res: data,
          };
          setErrorMessage(finalResponse);
          setIsLoadingEffect(false);
          return;
        }
        if (isCorrespondence) {
          setCorrespondenceStateData(data?.data || []);
        } else {
          setPermanentStateData(data?.data || []);
        }
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        let finalresponse;
        if (error?.response !== undefined) {
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
      });
  }

  async function getCities(stateId) {
    return await Settingsapi.get("/get-cities", {
      params: {
        state_id: stateId,
      },
    });
  }

  useEffect(() => {
    if (correspondenceCountry) {
      getStates(correspondenceCountry, true);
    } else {
      setCorrespondenceStateData([]);
    }
  }, [correspondenceCountry]);

  useEffect(() => {
    if (permanentCountry) {
      getStates(permanentCountry, false);
    } else {
      setPermanentStateData([]);
    }
  }, [permanentCountry]);

  useEffect(() => {
    if (correspondenceState) {
      getCities(correspondenceState)
        .then((res) => {
          if (res?.data?.status === "error") {
            setErrorMessage(res?.data?.message || "");
          }

          setCorrespondenceCityData(res?.data?.data || []);
        })
        .catch((err) => setErrorMessage(err.message));
    } else {
      setCorrespondenceCityData([]);
    }
  }, [correspondenceState]);

  useEffect(() => {
    if (permanentState) {
      getCities(permanentState)
        .then((res) => {
          if (res?.data?.status === "error") {
            setErrorMessage(res?.data?.message || "");
          }
          setPermanentCityData(res?.data?.data || []);
        })
        .catch((err) => setErrorMessage(err.message));
    } else {
      setPermanentCityData([]);
    }
  }, [permanentState]);

  useEffect(() => {
    fetchCountryCodes();
    fetchCountryNames();
  }, []);

  useEffect(() => {
    if (!customerId && countryNames && countryNames.length > 0) {
      const indiaFeature = countryNames.find((c) => c.label === "India");
      if (indiaFeature) {
        if (!countryOfCitizenship) setCountryOfCitizenship(indiaFeature.value);
        if (!countryOfResidence) setCountryOfResidence(indiaFeature.value);
        if (!correspondenceCountry) setCorrespondenceCountry(indiaFeature.value);
        if (!permanentCountry) setPermanentCountry(indiaFeature.value);
      }
    }
  }, [countryNames, customerId]);

  async function getSingleCustomerData(customerId) {
    if (customerId === null) {
      setErrorMessage({
        message: "Customer ID is missing wowo",
        server_res: null,
      });
      setIsLoadingEffect(false);
      return false;
    }

    setIsLoadingEffect(true);
    await Customerapi.get("get-single-customer-data", {
      params: {
        customerId: customerId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        if (data !== null) {
          setPrefixes(data?.data?.prefixes || "");
          setFirstName(data?.data?.first_name || "");
          setLastName(data?.data?.last_name || "");
          setEmail(data?.data?.email || "");
          setEmail2(data?.data?.email_2 || "");
          setPhoneCode(`${data?.data?.phone_code || "91"}`);
          setPhoneNumber(data?.data?.phone_number || "");
          setGender(data?.data?.gender || "");
          setLandlineCountryCode(data?.data?.landline_country_code || "91");
          setLandlineCityCode(data?.data?.landline_city_code || "");
          setLandlineNumber(data?.data?.landline_number || "");
          setDateOfBirth(new Date(data?.data?.date_of_birth) || "");
          setFatherName(data?.data?.father_name || "");
          setSpousePrefix(data?.data?.spouse_prefixes || "");
          setSpouseName(data?.data?.spouse_name || "");
          setMaritalStatus(data?.data?.marital_status || "");
          setNumberOfChildren(data?.data?.number_of_children || "");
          setWeddingAniversary(
            data?.data?.wedding_aniversary !== null
              ? new Date(data?.data?.wedding_aniversary)
              : ""
          );
          setSpouseDob(
            data?.data?.spouse_dob !== null
              ? new Date(data?.data?.spouse_dob)
              : ""
          );
          setPanCardNo(data?.data?.pan_card_no || "");
          setAadharCardNo(data?.data?.aadhar_card_no || "");
          setCountryOfCitizenship(data?.data?.country_of_citizenship || "");
          setCountryOfResidence(data?.data?.country_of_residence || "");
          setMotherTongue(data?.data?.mother_tongue || "");
          setNameOfPoa(data?.data?.name_of_poa || "");
          setHolderPoa(data?.data?.holder_poa || "");
          setNoOfYearsCorrespondenceAddress(
            data?.data?.no_of_years_correspondence_address || ""
          );
          setNoOfYearsCity(data?.data?.no_of_years_city || "");
          setHaveYouOwnedAbode(data?.data?.have_you_owned_abode);
          setIfOwnedProjectName(data?.data?.if_owned_project_name || "");
          setCorrespondenceCountry(
            data?.data?.correspondenceCountryId || countryNames?.find(c => c.label === "India")?.value || ""
          );
          setCorrespondenceState(data?.data?.correspondenceStateId || "");
          setCorrespondenceCity(data?.data?.correspondenceCityId || "");
          setCorrespondenceAddress(data?.data?.correspondenceAddress || "");
          setCorrespondencePincode(data?.data?.correspondencePincode || "");
          setPermanentCountry(data?.data?.permanentCountryId || countryNames?.find(c => c.label === "India")?.value || "");
          setPermanentState(data?.data?.permanentStateId || "");
          setPermanentCity(data?.data?.permanentCityId || "");
          setPermanentAddress(data?.data?.permanentAddress || "");
          setPermanentPincode(data?.data?.permanentPincode || "");
          setCurrentDesignation(data?.data?.current_designation || "");
          setCurrentOrganization(data?.data?.name_of_current_organization || "");
          setOrganizationAddress(data?.data?.address_of_current_organization || "");
          setWorkExperience(data?.data?.no_of_years_work_experience || "");
          setAnnualIncome(data?.data?.current_annual_income || "");
          setSelectedProjectId(data?.data?.project_id ? String(data?.data?.project_id) : "");
        }
        if (data?.data?.correspondenceStateId) {
          setOpenAddressCorrespondence(true);
        }
        if (data?.data?.permanentStateId) {
          setOpenAddressPremanent(true);
        }
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log("Fetch customer error:", error);
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
      });
  }

  useEffect(() => {
    setIsLoadingEffect(true);
    if (customerId) getSingleCustomerData(customerId);
  }, [customerId]);

  const validateAndSubmit = async () => {
    setIsLoadingEffect(true);
    let isValid = true;

    if (prefixes === "") {
      setPrefixError("Prefix is required");
      isValid = false;
    }

    if (firstName === "") {
      setFirstNameError("First name is required");
      isValid = false;
    }

    // if (lastName === "") {
    //   setLastNameError("Last name is required");
    //   isValid = false;
    // }

    if (email !== "" && email !== null) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(email)) {
        setEmailError("Invalid email address");
        isValid = false;
      }
    }

    if (phoneCode === "") {
      setPhoneCodeError("Phone code is required");
      isValid = false;
    }

    if (phoneNumber === "") {
      setPhoneNumberError("Phone number is required");
      isValid = false;
    } else if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Please enter a valid 10-digit phone number");
      isValid = false;
    }

    if (gender === "") {
      setGenderError("Gender is required");
      isValid = false;
    } else {
      if (prefixes === "Mr" && gender === "Female") {
        setGenderError("Gender does not match selected prefix");
        isValid = false;
      }
      if ((prefixes === "Mrs" || prefixes === "Miss") && gender === "Male") {
        setGenderError("Gender does not match selected prefix");
        isValid = false;
      }
    }

    if (dateOfBirth !== "" && dateOfBirth !== null) {
      // Validate age is 18 or above
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        setDateOfBirthError("Age should be above 18");
        isValid = false;
      }
    }

    // Validate Spouse DOB if married
    if (maritalStatus === "Married" && spouseDob) {
      const spouseBirthDate = new Date(spouseDob);
      const today = new Date();
      let spouseAge = today.getFullYear() - spouseBirthDate.getFullYear();
      const monthDiff = today.getMonth() - spouseBirthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < spouseBirthDate.getDate())) {
        spouseAge--;
      }
      if (spouseAge < 18) {
        setSpouseDobError("Spouse age should be above 18");
        isValid = false;
      }
    }

    if (haveYouOwnedAbode === "true" && ifOwnedProjectName === "") {
      setIfOwnedProjectNameError("Project Name is required");
      isValid = false;
    }

    if (aadharCardNo && aadharCardNo.toString().length !== 12) {
      setAadharCardNoError("Aadhar Card is invalid");
      isValid = false;
    }

    if (panCardNo) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(panCardNo)) {
        setPanCardNoError("PAN Card is invalid");
        isValid = false;
      }
    }

    if (!isValid) {
      setIsLoadingEffect(false);
      return false;
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

      const apiEndpoint = customerId ? "update-customer" : "add-customer";

      const response = await Customerapi.post(apiEndpoint, {
        customerId: customerId,
        prefixes: prefixes,
        first_name: firstName,
        last_name: lastName,
        email: email,
        email_2: email2,
        phone_code: phoneCode,
        phone_number: phoneNumber,
        gender: gender,
        landline_country_code: landlineCountryCode,
        landline_city_code: landlineCityCode,
        landline_number: landlineNumber,
        date_of_birth: formatDateOnly(dateOfBirth),
        father_name: fatherName,
        spouse_prefixes: spousePrefix,
        spouse_name: spouseName,
        marital_status: maritalStatus,
        number_of_children: Number(numberOfChildren),
        wedding_aniversary: formatDateOnly(weddingAniversary),
        spouse_dob: formatDateOnly(spouseDob),
        pan_card_no: panCardNo,
        aadhar_card_no: aadharCardNo,
        country_of_citizenship: countryOfCitizenship,
        country_of_residence: countryOfResidence,
        mother_tongue: motherTongue,
        name_of_poa: nameOfPoa,
        holder_poa: holderPoa,
        no_of_years_correspondence_address: Number(noOfYearsCorrespondenceAddress),
        no_of_years_city: Number(noOfYearsCity),
        have_you_owned_abode: haveYouOwnedAbode,
        if_owned_project_name: ifOwnedProjectName,
        correspondence_country: correspondenceCountry,
        correspondence_state: correspondenceState,
        correspondence_city: correspondenceCity,
        correspondence_address: correspondenceAddress,
        correspondence_pincode: correspondencePincode,
        permanent_country: permanentCountry,
        permanent_state: permanentState,
        permanent_city: permanentCity,
        permanent_address: permanentAddress,
        permanent_pincode: permanentPincode,
        employeeId: employeeId,
        current_designation: currentDesignation,
        name_of_current_organization: currentOrganization,
        address_of_current_organization: organizationAddress,
        no_of_years_work_experience: parseFloat(workExperience),
        no_of_years_work_experience: parseFloat(workExperience),
        current_annual_income: parseFloat(annualIncome),
        project_id: selectedProjectId,
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
      return { success: true, id: data?.id, project_id: selectedProjectId };
    } catch (error) {
      console.error("Add customer error:", error);
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

  const [openAddressCorrespondence, setOpenAddressCorrespondence] =
    useState(false);
  const [openAddressPremanent, setOpenAddressPremanent] = useState(false);

  const handleToggleAddressCorrespondence = () => {
    if (openAddressCorrespondence) {
      setCorrespondenceState("");
      setCorrespondenceCity("");
      setCorrespondenceAddress("");
      setCorrespondencePincode("");
      // handleIsSameAddress(false);
    }

    setOpenAddressCorrespondence(!openAddressCorrespondence);
  };

  const handleToggleAddressPremanent = () => {
    if (openAddressPremanent) {
      setPermanentState("");
      setPermanentCity("");
      setPermanentAddress("");
      setPermanentPincode("");
    }

    setOpenAddressPremanent(!openAddressPremanent);
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {isLoadingEffect ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            <hr className="border border-[#ebecef]" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-48 mb-1" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
            <hr className="border border-[#ebecef]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-56 mb-1" />
                <div className="flex items-center space-x-3 mt-1">
                  <Skeleton className="h-6 w-11 rounded-full" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-56 mb-1" />
                <div className="flex items-center space-x-3 mt-1">
                  <Skeleton className="h-6 w-11 rounded-full" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Project</label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="w-full h-9 border border-gray-300 rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none placeholder-gray-400">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        {project.project_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Prefix <span className="text-red-500">*</span></label>
                <Select value={prefixes || undefined} onValueChange={updatePrefix}>
                  <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!prefixes ? 'text-gray-400' : ''} ${prefixError ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200">
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Mx">Mx</SelectItem>
                  </SelectContent>
                </Select>
                {prefixError && <p className="text-xs text-red-500">{prefixError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={updateFirstName}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${firstNameError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {firstNameError && <p className="text-xs text-red-500">{firstNameError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <Input
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={updateLastName}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${lastNameError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {lastNameError && <p className="text-xs text-red-500">{lastNameError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <Input
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={updateEmail}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Alternate Email Address</label>
                <Input
                  placeholder="Enter Alternate Email Address"
                  value={email2}
                  onChange={updateEmail2}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${emailError2 ? 'border-red-500' : 'border-gray-300'}`}
                />
                {emailError2 && <p className="text-xs text-red-500">{emailError2}</p>}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-row gap-x-4 w-full">
                  <div className="w-20">
                    <Select value={phoneCode || undefined} onValueChange={updatePhoneCode}>
                      <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!phoneCode ? 'text-gray-400' : ''} border-gray-300`}>
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent className="border border-gray-200 max-h-[200px]">
                        {countryCodes.map((item, index) => (
                          <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Enter Phone Number"
                      value={phoneNumber}
                      onChange={updatePhoneNumber}
                      className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${phoneNumberError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
                {phoneCodeError !== "" && (
                  <p className="mt-1 text-xs text-red-500">
                    {phoneCodeError}
                  </p>
                )}
                {phoneNumberError !== "" && (
                  <p className="mt-1 text-xs text-red-500">
                    {phoneNumberError}
                  </p>
                )}
              </div>
              {/* <div className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Landline Number
              </label>
              <div className="flex flex-row gap-x-4 w-full">
                <div className="w-20">
                  <Select
                    data={countryCodes}
                    placeholder="Code"
                    searchable
                    value={landlineCountryCode}
                    // error={landlineCountryCodeError}
                    onChange={updateLandlineCountryCode}
                    selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
                    className="w-full"
                    dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                  />
                </div>
                <div className="w-30">
                  <Textinput
                    placeholder="Enter City Code"
                    type="number"
                    value={landlineCityCode}
                    // error={landlineCityCodeError}
                    onChange={updateLandlineCityCode}
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                  />
                </div>
                <div className="flex-1">
                  <Textinput
                    placeholder="Enter Phone Number"
                    type="text"
                    value={landlineNumber}
                    // error={landlineNumberError}
                    onChange={updateLandlineNumber}
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                  />
                </div>
              </div>
              {landlineCountryCodeError !== "" && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {landlineCountryCodeError}
                </p>
              )}
              {landlineCityCodeError !== "" && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {landlineCityCodeError}
                </p>
              )}
              {landlineNumberError !== "" && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {landlineNumberError}
                </p>
              )}
            </div> */}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Gender <span className="text-red-500">*</span></label>
                <Select value={gender || undefined} onValueChange={updateGender}>
                  <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!gender ? 'text-gray-400' : ''} ${genderError ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {genderError && <p className="text-xs text-red-500">{genderError}</p>}
              </div>

              <CustomDateFilter
                label="Date of Birth"
                selected={dateOfBirth}
                error={dateOfBirthError}
                onChange={updateDateOfBirth}
                maxDateToday={true}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Father Name</label>
                <Input
                  placeholder="Enter Father Name"
                  value={fatherName}
                  onChange={updateFatherName}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${fatherNameError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {fatherNameError && <p className="text-xs text-red-500">{fatherNameError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Marital Status</label>
                <Select value={maritalStatus || undefined} onValueChange={updateMaritalStatus}>
                  <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!maritalStatus ? 'text-gray-400' : ''} ${maritalStatusError ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200">
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                  </SelectContent>
                </Select>
                {maritalStatusError && <p className="text-xs text-red-500">{maritalStatusError}</p>}
              </div>

              {maritalStatus === "Married" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600 mb-1">Spouse Prefix</label>
                    <Select value={spousePrefix || undefined} onValueChange={updateSpousePrefix}>
                      <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!spousePrefix ? 'text-gray-400' : ''} ${spousePrefixError ? 'border-red-500' : 'border-gray-300'}`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="border border-gray-200">
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Mx">Mx</SelectItem>
                      </SelectContent>
                    </Select>
                    {spousePrefixError && <p className="text-xs text-red-500">{spousePrefixError}</p>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600 mb-1">Spouse Name</label>
                    <Input
                      placeholder="Enter Spouse Name"
                      value={spouseName}
                      onChange={updateSpouseName}
                      className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${spouseNameError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {spouseNameError && <p className="text-xs text-red-500">{spouseNameError}</p>}
                  </div>

                  <CustomDateFilter
                    label="Spouse DOB"
                    selected={spouseDob}
                    error={spouseDobError}
                    onChange={updateSpouseDob}
                    maxDateToday={true}
                  />

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600 mb-1">Number of Children</label>
                    <Input
                      placeholder="Enter No of Children"
                      type="number"
                      value={numberOfChildren}
                      onChange={updateNumberOfChildren}
                      className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${numberOfChildrenError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {numberOfChildrenError && <p className="text-xs text-red-500">{numberOfChildrenError}</p>}
                  </div>

                  <CustomDateFilter
                    label="Wedding Anniversary"
                    selected={weddingAniversary}
                    error={weddingAniversaryError}
                    onChange={updateWeddingAniversary}
                    maxDateToday={true}
                  />
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Pan Card No (e.g., XXXXX1234X)</label>
                <Input
                  placeholder="Enter Pan Card No"
                  value={panCardNo}
                  onChange={updatePanCardNo}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${panCardNoError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {panCardNoError && <p className="text-xs text-red-500">{panCardNoError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Aadhar Card No (e.g., XXXX XXXX XXXX)</label>
                <Input
                  placeholder="Enter Aadhar Card No"
                  type="number"
                  value={aadharCardNo}
                  onChange={updateAadharCardNo}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${aadharCardNoError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {aadharCardNoError && <p className="text-xs text-red-500">{aadharCardNoError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Country of Citizenship</label>
                <Select value={countryOfCitizenship || undefined} onValueChange={updateCountryOfCitizenship}>
                  <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!countryOfCitizenship ? 'text-gray-400' : ''} ${countryOfCitizenshipError ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 max-h-[200px]">
                    {countryNames.map((item, index) => (
                      <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {countryOfCitizenshipError && <p className="text-xs text-red-500">{countryOfCitizenshipError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Country of Residence</label>
                <Select value={countryOfResidence || undefined} onValueChange={updateCountryOfResidence}>
                  <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!countryOfResidence ? 'text-gray-400' : ''} ${countryOfResidenceError ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 max-h-[200px]">
                    {countryNames.map((item, index) => (
                      <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {countryOfResidenceError && <p className="text-xs text-red-500">{countryOfResidenceError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Mother Tongue</label>
                <Input
                  placeholder="Enter Mother Tongue"
                  value={motherTongue}
                  onChange={updateMotherTongue}
                  className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${motherTongueError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {motherTongueError && <p className="text-xs text-red-500">{motherTongueError}</p>}
              </div>
              {/* <Textinput
              placeholder="Enter Name of Power of Attorney"
              label="Name of Power of Attorney (POA) Holder"
              value={nameOfPoa}
              error={nameOfPoaError}
              onChange={updateNameOfPoa}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Select
              data={[
                { label: "Resident", value: "Resident" },
                { label: "NRI", value: "NRI" },
              ]}
              label="If POA Holder is Indian, specify status"
              value={holderPoa}
              error={holderPoaError}
              onChange={updateHolderPoa}
              selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
              labelClass="text-sm font-medium text-gray-600 mb-1"
              dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
            />
            <Textinput
              placeholder="Enter Number of Years of Residing at Correspondence Address"
              label="Number of years residing at correspondence address"
              value={noOfYearsCorrespondenceAddress}
              error={noOfYearsCorrespondenceAddressError}
              onChange={updateNoOfYearsCorrespondenceAddress}
              type="number"
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Textinput
              placeholder="Enter Number of Years of Residing at City"
              label="Number of years residing at city"
              value={noOfYearsCity}
              error={noOfYearsCityError}
              onChange={updateNoOfYearsCity}
              type="number"
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Select
              data={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              label="Have you ever owned a Abode home / property?"
              value={haveYouOwnedAbode}
              error={haveYouOwnedAbodeError}
              onChange={updateHaveYouOwnedAbode}
              selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
              labelClass="text-sm font-medium text-gray-600 mb-1"
              dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
            />
            {haveYouOwnedAbode === "true" && (
              <Textinput
                placeholder="Enter Project Name"
                label="If Yes, Project Name"
                value={ifOwnedProjectName}
                error={ifOwnedProjectNameError}
                onChange={updateIfOwnedProjectName}
                labelClassName="text-sm font-medium text-gray-600 mb-1"
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              />
            )} */}
            </div>
            <hr className="border border-[#ebecef]" />
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-[16px] text-gray-700">
                Professional Details
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 mb-1">Current Designation</label>
                  <Input
                    placeholder="Enter Current Designation"
                    value={currentDesignation}
                    onChange={updateCurrentDesignation}
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${currentDesignationError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {currentDesignationError && <p className="text-xs text-red-500">{currentDesignationError}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 mb-1">Current Organization</label>
                  <Input
                    placeholder="Enter Current Organization"
                    value={currentOrganization}
                    onChange={updateCurrentOrganization}
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${currentOrganizationError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {currentOrganizationError && <p className="text-xs text-red-500">{currentOrganizationError}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 mb-1">Organization Address</label>
                  <Input
                    placeholder="Enter Organization Address"
                    value={organizationAddress}
                    onChange={updateOrganizationAddress}
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${organizationAddressError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {organizationAddressError && <p className="text-xs text-red-500">{organizationAddressError}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 mb-1">Work Experience</label>
                  <Input
                    placeholder="Enter Work Experience"
                    type="number"
                    value={workExperience}
                    onChange={updateWorkExperience}
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${workExperienceError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {workExperienceError && <p className="text-xs text-red-500">{workExperienceError}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 mb-1">Annual Income</label>
                  <Input
                    placeholder="Enter Annual Income"
                    type="number"
                    value={annualIncome}
                    onChange={updateAnnualIncome}
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${annualIncomeError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {annualIncomeError && <p className="text-xs text-red-500">{annualIncomeError}</p>}
                </div>
              </div>
            </div>
            <hr className="border border-[#ebecef]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[16px] text-gray-700">
                  Address of Correspondence
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleToggleAddressCorrespondence}
                    type="button"
                    role="switch"
                    aria-checked={openAddressCorrespondence}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${openAddressCorrespondence ? "bg-[#0083bf]" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${openAddressCorrespondence
                        ? "translate-x-6"
                        : "translate-x-1"
                        }`}
                    />
                  </button>
                  <span className="text-[15px] font-medium text-gray-400">
                    Please switch the toggle to add the address.
                  </span>
                </div>

                {openAddressCorrespondence && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600 mb-1">Country</label>
                      <Select value={correspondenceCountry || undefined} onValueChange={updateCorrespondenceCountry}>
                        <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!correspondenceCountry ? 'text-gray-400' : ''} ${correspondenceCountryError ? 'border-red-500' : 'border-gray-300'}`}>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200\">
                          {countryNames.map((item, index) => (
                            <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {correspondenceCountryError && <p className="text-xs text-red-500">{correspondenceCountryError}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600 mb-1">State</label>
                      <Select value={correspondenceState || undefined} onValueChange={updateCorrespondenceState}>
                        <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!correspondenceState ? 'text-gray-400' : ''} ${correspondenceStateError ? 'border-red-500' : 'border-gray-300'}`}>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200 max-h-[200px]">
                          {correspondenceStateData.map((item, index) => (
                            <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {correspondenceStateError && <p className="text-xs text-red-500">{correspondenceStateError}</p>}
                    </div>

                    {correspondenceState && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 mb-1">City</label>
                        <Select value={correspondenceCity || undefined} onValueChange={updateCorrespondenceCity}>
                          <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!correspondenceCity ? 'text-gray-400' : ''} ${correspondenceCityError ? 'border-red-500' : 'border-gray-300'}`}>
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent className="border border-gray-200 max-h-[200px]">
                            {correspondenceCityData.map((item, index) => (
                              <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {correspondenceCityError && <p className="text-xs text-red-500">{correspondenceCityError}</p>}
                      </div>
                    )}

                    {correspondenceCity && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 mb-1">Address</label>
                        <Input
                          placeholder="Enter your Address"
                          value={correspondenceAddress}
                          onChange={updateCorrespondenceAddress}
                          className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${correspondenceAddressError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {correspondenceAddressError && <p className="text-xs text-red-500">{correspondenceAddressError}</p>}
                      </div>
                    )}

                    {correspondenceAddress && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 mb-1">Pin Code</label>
                        <Input
                          placeholder="Enter your pincode"
                          value={correspondencePincode}
                          onChange={updateCorrespondencePincode}
                          className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${correspondencePincodeError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {correspondencePincodeError && <p className="text-xs text-red-500">{correspondencePincodeError}</p>}
                      </div>
                    )}
                    {/* <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      className="w-4 h-4"
                      checked={isSameAddress}
                      onChange={(e) => handleIsSameAddress(e.target.checked)}
                    />
                    <label htmlFor="sameAddress" className="text-sm text-gray-700">
                      Is your present address also your permanent address?
                    </label>
                  </div> */}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[16px] text-gray-700">
                  Permanent Address
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleToggleAddressPremanent}
                    type="button"
                    role="switch"
                    aria-checked={openAddressPremanent}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${openAddressPremanent ? "bg-[#0083bf]" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${openAddressPremanent ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                  <span className="text-[15px] font-medium text-gray-400">
                    Please switch the toggle to add the address.
                  </span>
                </div>
                {openAddressPremanent && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600 mb-1">Country</label>
                      <Select value={permanentCountry || undefined} onValueChange={updatePermanentCountry}>
                        <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!permanentCountry ? 'text-gray-400' : ''} ${permanentCountryError ? 'border-red-500' : 'border-gray-300'}`}>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200">
                          {countryNames.map((item, index) => (
                            <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {permanentCountryError && <p className="text-xs text-red-500">{permanentCountryError}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600 mb-1">State</label>
                      <Select value={permanentState || undefined} onValueChange={updatePermanentState}>
                        <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!permanentState ? 'text-gray-400' : ''} ${permanentStateError ? 'border-red-500' : 'border-gray-300'}`}>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200 max-h-[200px]">
                          {permanentStateData.map((item, index) => (
                            <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {permanentStateError && <p className="text-xs text-red-500">{permanentStateError}</p>}
                    </div>

                    {permanentState && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 mb-1">City</label>
                        <Select value={permanentCity || undefined} onValueChange={updatePermanentCity}>
                          <SelectTrigger className={`w-full h-9 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!permanentCity ? 'text-gray-400' : ''} ${permanentCityError ? 'border-red-500' : 'border-gray-300'}`}>
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent className="border border-gray-200 max-h-[200px]">
                            {permanentCityData.map((item, index) => (
                              <SelectItem key={`${item.value}-${index}`} value={item.value}>{item.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {permanentCityError && <p className="text-xs text-red-500">{permanentCityError}</p>}
                      </div>
                    )}

                    {permanentCity && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 mb-1">Address</label>
                        <Input
                          placeholder="Enter your Address"
                          value={permanentAddress}
                          onChange={updatePermanentAddress}
                          className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${permanentAddressError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {permanentAddressError && <p className="text-xs text-red-500">{permanentAddressError}</p>}
                      </div>
                    )}

                    {permanentAddress && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 mb-1">Pin Code</label>
                        <Input
                          placeholder="Enter your pincode"
                          value={permanentPincode}
                          onChange={updatePermanentPincode}
                          className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${permanentPincodeError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {permanentPincodeError && <p className="text-xs text-red-500">{permanentPincodeError}</p>}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <Errorpanel
            errorMessages={errorMessage}
            setErrorMessages={setErrorMessage}
          />
        )}
      </div>

    </>
  );
});

export default Customerstepone;
