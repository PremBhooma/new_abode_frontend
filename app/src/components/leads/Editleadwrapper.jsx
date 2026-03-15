import React, { useEffect, useState } from "react";
import Settingsapi from "../api/Settingsapi";
import Projectapi from "../api/Projectapi";
import Generalapi from "@/components/api/Generalapi";
import Leadapi from "@/components/api/Leadapi";
import Employeeapi from "../api/Employeeapi";

import Errorpanel from "@/components/shared/Errorpanel";
import { IconArrowLeft } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Datepicker } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { IconLoader2 } from "@tabler/icons-react";

function Editleadwrapper() {
  const navigate = useNavigate();

  const params = useParams();
  const leadId = params?.single_lead_id;

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const updateFullName = (e) => {
    const value = e.target.value;
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setFullName(formatted);
    setFullNameError("");
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


  const [employee, setEmployee] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const updateEmployee = (value) => {
    setEmployee(value);
    setEmployeeError("");
  }

  const [sourseOfLead, setSourseOfLead] = useState("");
  const [sourseOfLeadError, setSourseOfLeadError] = useState("");
  const updateSourseOfLead = (value) => {
    setSourseOfLead(value);
    setSourseOfLeadError("");
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
  }

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
    // setPanCardNo(e.target.value);
    // setPanCardNoError("");

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

  const [motherTongue, setMotherTongue] = useState("");
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
  };


  const [ifOwnedProjectName, setIfOwnedProjectName] = useState("");
  const [ifOwnedProjectNameError, setIfOwnedProjectNameError] = useState("");
  const updateIfOwnedProjectName = (e) => {
    setIfOwnedProjectName(e.target.value);
    setIfOwnedProjectNameError("");
  };

  // Lead Stage State
  const [leadStageId, setLeadStageId] = useState("");
  const [leadStagesData, setLeadStagesData] = useState([]);
  const [selectedLeadStageName, setSelectedLeadStageName] = useState("");

  const updateLeadStage = (value) => {
    setLeadStageId(value);
    const selectedStage = leadStagesData.find((stage) => String(stage.id) === String(value));
    if (selectedStage) {
      setSelectedLeadStageName(selectedStage.name);
    }
  };

  async function getLeadStages() {
    try {
      const response = await Settingsapi.get("/get-lead-stages", {
        params: { limit: 100 }
      });
      if (response?.data?.status === "success") {
        const uniqueStages = Array.from(new Map((response.data.data || []).map(item => [item.id, item])).values());
        setLeadStagesData(uniqueStages);
      }
    } catch (error) {
      console.error("Error fetching lead stages:", error);
    }
  }

  useEffect(() => {
    getLeadStages();
    getProjects();
  }, []);


  // New Lead Schema Fields
  const [leadStatus, setLeadStatus] = useState("");
  const updateLeadStatus = (value) => setLeadStatus(value);

  const [minBudget, setMinBudget] = useState("");
  const updateMinBudget = (e) => setMinBudget(e.target.value);

  const [maxBudget, setMaxBudget] = useState("");
  const updateMaxBudget = (e) => setMaxBudget(e.target.value);

  const [bedroom, setBedroom] = useState("");
  const updateBedroom = (e) => setBedroom(e.target.value);

  const [purpose, setPurpose] = useState("");
  const updatePurpose = (value) => setPurpose(value);

  const [funding, setFunding] = useState("");
  const updateFunding = (value) => setFunding(value);

  const [leadAge, setLeadAge] = useState("");
  const updateLeadAge = (e) => setLeadAge(e.target.value);

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

  const [correspondenceStateData, setCorrespondenceStateData] = useState([]);
  const [permanentStateData, setPermanentStateData] = useState([]);
  const [correspondenceCityData, setCorrespondenceCityData] = useState([]);
  const [permanentCityData, setPermanentCityData] = useState([]);

  const [correspondenceCountry, setCorrespondenceCountry] = useState("");
  const [correspondenceCountryError, setCorrespondenceCountryError] =
    useState("");
  const updateCorrespondenceCountry = (value) => {
    setCorrespondenceCountry(value);
    setCorrespondenceState("");
    setCorrespondenceCity("");
    setCorrespondenceCountryError("");
  };

  const [correspondenceState, setCorrespondenceState] = useState("");
  const [correspondenceStateError, setCorrespondenceStateError] = useState("");
  const updateCorrespondenceState = (value) => {
    setCorrespondenceState(value);
    setCorrespondenceCity("");
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
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setCorrespondencePincode(value);
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
    setPermanentState("");
    setPermanentCity("");
    setPermanentCountryError("");
  };

  const [permanentState, setPermanentState] = useState("");
  const [permanentStateError, setPermanentStateError] = useState("");
  const updatePermanentState = (value) => {
    setPermanentState(value);
    setPermanentCity("");
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

    if (checked) {
      setPermanentCountry(correspondenceCountry);
      setPermanentState(correspondenceState);
      setPermanentCity(correspondenceCity);
      setPermanentAddress(correspondenceAddress);
      setPermanentPincode(correspondencePincode);
    }
    if (!checked) {
      setPermanentCountry("");
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


  async function getStates(country, type) {
    if (!country) return;
    try {
      const response = await Settingsapi.get("/get-states", {
        params: { country_id: country },
      });
      const data = response?.data;
      if (data?.status === "error") {
        setErrorMessage({ message: data?.message, server_res: data });
        return;
      }
      const uniqueStates = Array.from(new Map((data?.data || []).map(item => [item.value, item])).values());
      if (type === "correspondence") setCorrespondenceStateData(uniqueStates);
      if (type === "permanent") setPermanentStateData(uniqueStates);
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage({
        message: error.message,
        server_res: error?.response?.data || null,
      });
    }
  }

  useEffect(() => {
    if (correspondenceCountry) getStates(correspondenceCountry, "correspondence");
    else setCorrespondenceStateData([]);
  }, [correspondenceCountry]);

  useEffect(() => {
    if (permanentCountry) getStates(permanentCountry, "permanent");
    else setPermanentStateData([]);
  }, [permanentCountry]);

  async function getCities(stateId) {
    return await Settingsapi.get("/get-cities", {
      params: {
        state_id: stateId,
      },
    });
  }

  const [employeeData, setEmployeeData] = useState([]);

  async function getEmployees(projectId) {
    const params = { employee_id: employeeId };
    if (projectId) {
      params.project_id = projectId;
    }
    await Leadapi.get("/getallsubordinates", { params })
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
        setEmployeeData(data?.subordinates || []);
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

  // Re-fetch employees when selected project changes
  useEffect(() => {
    if (selectedProjectId) {
      getEmployees(selectedProjectId);
    } else {
      getEmployees();
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (correspondenceState) {
      getCities(correspondenceState)
        .then((res) => {
          if (res?.data?.status === "error") {
            setErrorMessage(res?.data?.message || "");
          }

          const uniqueCities = Array.from(new Map((res?.data?.data || []).map(item => [item.value, item])).values());
          setCorrespondenceCityData(uniqueCities);
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
          const uniqueCities = Array.from(new Map((res?.data?.data || []).map(item => [item.value, item])).values());
          setPermanentCityData(uniqueCities);
        })
        .catch((err) => setErrorMessage(err.message));
    } else {
      setPermanentCityData([]);
    }
  }, [permanentState]);



  const [countryCodes, setCountryCodes] = useState([]);
  const [countryNames, setCountryNames] = useState([]);

  // Set India as default country once countryNames are loaded
  useEffect(() => {
    if (countryNames && countryNames.length > 0) {
      const indiaCountry = countryNames.find((c) => c.label === "India");
      if (indiaCountry) {
        if (!countryOfCitizenship) setCountryOfCitizenship(indiaCountry.value);
        if (!countryOfResidence) setCountryOfResidence(indiaCountry.value);
        if (!correspondenceCountry) setCorrespondenceCountry(indiaCountry.value);
        if (!permanentCountry) setPermanentCountry(indiaCountry.value);
      }
    }
  }, [countryNames]);

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
      const uniqueCountryCodes = Array.from(new Map((data.countrydata || []).map(item => [item.value, item])).values());
      setCountryCodes(uniqueCountryCodes);
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
      const uniqueCountryNames = Array.from(new Map((data?.countryNames || []).map(item => [item.value, item])).values());
      setCountryNames(uniqueCountryNames);
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

  async function getSingleLeadData(leadId) {
    if (leadId === null) {
      setErrorMessage({
        message: "Customer ID is missing wowo",
        server_res: null,
      });
      setIsLoadingEffect(false);
      return false;
    }

    setIsLoadingEffect(true);
    await Leadapi.get("get-single-lead", {
      params: {
        leadId: leadId,
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
        console.log("Data single", data)
        if (data !== null) {
          setPrefixes(data?.data?.prefixes || "");
          setFullName(data?.data?.full_name || "");
          setEmail(data?.data?.email || "");
          setEmail2(data?.data?.email_2 || "");
          setPhoneCode(`${data?.data?.phone_code || "91"}`);
          setPhoneNumber(data?.data?.phone_number || "");
          setEmployee(data?.data?.assigned_to_employee_id || "");
          setSourseOfLead(data?.data?.source_of_lead || "");
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
          setHaveYouOwnedAbode(data?.data?.have_you_owned_abode || "");
          setIfOwnedProjectName(data?.data?.if_owned_project_name || "");
          setCorrespondenceCountry(
            data?.data?.correspondenceCountryId || ""
          );
          setCorrespondenceState(data?.data?.correspondenceStateId || "");
          setCorrespondenceCity(data?.data?.correspondenceCityId || "");
          setCorrespondenceAddress(data?.data?.correspondenceAddress || "");
          setCorrespondencePincode(data?.data?.correspondencePincode || "");
          setPermanentCountry(data?.data?.permanentCountryId || "");
          setPermanentState(data?.data?.permanentStateId || "");
          setPermanentCity(data?.data?.permanentCityId || "");
          setPermanentAddress(data?.data?.permanentAddress || "");
          setPermanentPincode(data?.data?.permanentPincode || "");
          setCurrentDesignation(data?.data?.current_designation || "");
          setCurrentOrganization(data?.data?.name_of_current_organization || "");
          setOrganizationAddress(data?.data?.address_of_current_organization || "");
          setWorkExperience(data?.data?.no_of_years_work_experience || "");
          setAnnualIncome(data?.data?.current_annual_income || "");
          // New Lead Fields
          setLeadStatus(data?.data?.lead_status || "");
          setMinBudget(data?.data?.min_budget !== null ? String(data?.data?.min_budget) : "");
          setMaxBudget(data?.data?.max_budget !== null ? String(data?.data?.max_budget) : "");
          setBedroom(data?.data?.bedroom || "");
          setPurpose(data?.data?.purpose || "");
          setFunding(data?.data?.funding || "");
          setLeadAge(data?.data?.lead_age !== null ? String(data?.data?.lead_age) : "");
          setSelectedProjectId(data?.data?.project_id ? String(data?.data?.project_id) : "");

          if (data?.data?.lead_stage_id) {
            setLeadStageId(String(data?.data?.lead_stage_id));
            // We need to set the name based on the ID, but leadStagesData might not be loaded yet or we need to find it from the list. 
            // Better to rely on the effect that runs when leadStagesData changes or just find it if available.
            // Alternatively, if the API returns the stage name, we can use that too.
            // Assuming data.data.lead_stage_name exists from the joined query, similar to Leadview.
            if (data?.data?.lead_stage_name) {
              setSelectedLeadStageName(data?.data?.lead_stage_name);
            } else {
              // Fallback: try to find in loaded stages if available immediately (unlikely due to async)
              // or let the user select it.
              // Actually, we can update the name in an effect if needed, or just finding it when rendering if critical logic depends on it.
              // The logic depends on selectedLeadStageName.
            }
          }
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

  const handleSubmit = async () => {
    setIsLoadingEffect(true);

    if (prefixes === "") {
      setPrefixError("Prefix is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (fullName === "") {
      setFullNameError("Full name is required");
      setIsLoadingEffect(false);
      return false;
    }

    // if (email === "") {
    //   setEmailError("Email is required");
    //   setIsLoadingEffect(false);
    //   return false;
    // }
    if (email !== "" && email !== null) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(email)) {
        setEmailError("Invalid email address");
        setIsLoadingEffect(false);
        return false;
      }
    }

    // if (!emailPattern.test(email2)) {
    //     setEmailError2("Invalid email address 2");
    //     setIsLoadingEffect(false);
    //     return false;
    // }

    if (phoneCode === "") {
      setPhoneCodeError("Phone code is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (phoneNumber === "") {
      setPhoneNumberError("Phone number is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Please enter a valid 10-digit phone number");
      setIsLoadingEffect(false);
      return false;
    }

    // if (dateOfBirth === "") {
    //   setDateOfBirthError("Date of Birth is required");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (gender === "") {
    //   setGenderError("Gender is required");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (prefixes === "Mr" && gender === "Female") {
    //   setGenderError("Gender does not match selected prefix");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if ((prefixes === "Mrs" || prefixes === "Miss") && gender === "Male") {
    //   setGenderError("Gender does not match selected prefix");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (aadharCardNo && aadharCardNo.toString().length !== 12) {
    //   setAadharCardNoError("Aadhar Card is invalid");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (panCardNo) {
    //   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    //   if (!panRegex.test(panCardNo)) {
    //     setPanCardNoError("PAN Card is invalid");
    //     setIsLoadingEffect(false);
    //     return false;
    //   }
    // }

    const payload = {
      leadUuid: leadId,
      prefixes: prefixes,
      full_name: fullName,
      email: email && email.trim() !== "" ? email : "",
      email_2: email2 && email2.trim() !== "" ? email2 : "",
      phone_code: phoneCode,
      phone_number: phoneNumber,
      employee_id: employee,
      sourse_of_lead: sourseOfLead,
      gender: gender,
      landline_country_code: landlineCountryCode,
      landline_city_code: landlineCityCode,
      landline_number: landlineNumber,
      date_of_birth: dateOfBirth,
      father_name: fatherName,
      spouse_prefixes: spousePrefix,
      spouse_name: spouseName,
      marital_status: maritalStatus,
      number_of_children: String(numberOfChildren),
      wedding_aniversary: weddingAniversary,
      spouse_dob: spouseDob,
      pan_card_no: panCardNo,
      aadhar_card_no: aadharCardNo,
      country_of_citizenship: countryOfCitizenship,
      country_of_residence: countryOfResidence,
      mother_tongue: motherTongue,
      name_of_poa: nameOfPoa,
      holder_poa: holderPoa,
      no_of_years_correspondence_address: String(noOfYearsCorrespondenceAddress),
      no_of_years_city: String(noOfYearsCity),
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
      no_of_years_work_experience: String(parseFloat(workExperience)),
      current_annual_income: String(parseFloat(annualIncome)),
      lead_status: leadStatus || "",
      min_budget: minBudget ? String(parseFloat(minBudget)) : "",
      max_budget: maxBudget ? String(parseFloat(maxBudget)) : "",
      bedroom: bedroom || "",
      purpose: purpose,
      funding: funding,
      lead_age: leadAge,
      ...(selectedProjectId && { project_id: selectedProjectId }),
      ...(leadStageId && { lead_stage_id: leadStageId })
    };

    await Leadapi.post("/edit-lead", payload)
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
        toast.success("Lead updated successfully");
        navigate("/leads");

        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log("Update lead error:", error);
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
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          fetchCountryCodes(),
          fetchCountryNames(),
          ...(leadId ? [getSingleLeadData(leadId)] : [])
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadInitialData();
  }, [leadId]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-semibold">Update Lead</h1>
        <div onClick={() => navigate(-1)} className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-2 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200 cursor-pointer">
          <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
          Back
        </div>
      </div>

      <div className="flex flex-col gap-8 bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm relative">
        {isInitialLoading ? (
          <div className="flex flex-col gap-6">
            {/* Lead Basic Info Skeleton */}
            <div className="flex flex-col gap-4">
              <Skeleton className="h-7 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
            {/* Lead Preferences Skeleton */}
            <div className="flex flex-col gap-4 pt-4 border-t">
              <Skeleton className="h-7 w-44" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
            {/* Lead Address Skeleton */}
            <div className="flex flex-col gap-4 pt-4 border-t">
              <Skeleton className="h-7 w-36" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
            {/* Submit Button Skeleton */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <>
            {/* Lead Basic Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lead Basic Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Prefix <span className="text-red-500">*</span></Label>
                  <Select value={prefixes} onValueChange={updatePrefix}>
                    <SelectTrigger className={prefixError ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Prefix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Mx">Mx</SelectItem>
                    </SelectContent>
                  </Select>
                  {prefixError && <p className="text-red-500 text-xs">{prefixError}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={updateFullName}
                    className={fullNameError ? "border-red-500" : ""}
                  />
                  {fullNameError && <p className="text-red-500 text-xs">{fullNameError}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={updateEmail}
                    className={emailError ? "border-red-500" : ""}
                  />
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                </div>
                {/* <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Alternate Email Address</Label>
              <Input
                type="email"
                placeholder="Enter Alternate Email Address"
                value={email2}
                onChange={updateEmail2}
                className={emailError2 ? "border-red-500" : ""}
              />
              {emailError2 && <p className="text-red-500 text-xs">{emailError2}</p>}
            </div> */}

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Phone Number <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <div className="w-[100px]">
                      <Select value={phoneCode} onValueChange={updatePhoneCode}>
                        <SelectTrigger className={phoneCodeError ? "border-red-500" : ""}>
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((c) => (
                            <SelectItem key={c.value} value={String(c.value)}>+{c.value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Enter Phone Number"
                        value={phoneNumber}
                        onChange={updatePhoneNumber}
                        className={phoneNumberError ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  {(phoneCodeError || phoneNumberError) && (
                    <p className="text-red-500 text-xs">{phoneCodeError || phoneNumberError}</p>
                  )}
                </div>

                {/* Project Selection */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Project</Label>
                  <Select
                    value={selectedProjectId}
                    onValueChange={(value) => setSelectedProjectId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.length > 0 ? projects.map((project) => (
                        <SelectItem key={project.id} value={String(project.id)}>
                          {project.project_name}
                        </SelectItem>
                      )) : (
                        <p className="text-sm text-gray-500 px-2 py-1.5">No data found</p>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Assign to Employee</Label>
                  <Select value={employee} onValueChange={updateEmployee} disabled={!selectedProjectId}>
                    <SelectTrigger className={employeeError ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeData.length > 0 ? employeeData.map((e) => (
                        <SelectItem key={e.value} value={String(e.value)}>{e.label}</SelectItem>
                      )) : (
                        <p className="text-sm text-gray-500 px-2 py-1.5">No data found</p>
                      )}
                    </SelectContent>
                  </Select>
                  {employeeError && <p className="text-red-500 text-xs">{employeeError}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Source of Lead</Label>
                  <Select value={sourseOfLead} onValueChange={updateSourseOfLead}>
                    <SelectTrigger className={sourseOfLeadError ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Walk-In">Walk-In</SelectItem>
                      {/* <SelectItem value="Already own flat">Already own flat</SelectItem> */}
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {sourseOfLeadError && <p className="text-red-500 text-xs">{sourseOfLeadError}</p>}
                </div>

                {/* <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Gender</Label>
              <Select value={gender} onValueChange={updateGender}>
                <SelectTrigger className={genderError ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              {genderError && <p className="text-red-500 text-xs">{genderError}</p>}
            </div> */}

                {/* <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Date of Birth</Label>
              <Datepicker
                value={dateOfBirth}
                onChange={updateDateOfBirth}
                inputClassName={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${dateOfBirthError ? "border-red-500" : "border-gray-200"}`}
              />
              {dateOfBirthError && <p className="text-red-500 text-xs">{dateOfBirthError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Father Name</Label>
              <Input
                placeholder="Enter Father Name"
                value={fatherName}
                onChange={updateFatherName}
                className={fatherNameError ? "border-red-500" : ""}
              />
              {fatherNameError && <p className="text-red-500 text-xs">{fatherNameError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Marital Status</Label>
              <Select value={maritalStatus} onValueChange={updateMaritalStatus}>
                <SelectTrigger className={maritalStatusError ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                </SelectContent>
              </Select>
              {maritalStatusError && <p className="text-red-500 text-xs">{maritalStatusError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Mother Tongue</Label>
              <Input
                placeholder="Enter Mother Tongue"
                value={motherTongue}
                onChange={updateMotherTongue}
                className={motherTongueError ? "border-red-500" : ""}
              />
              {motherTongueError && <p className="text-red-500 text-xs">{motherTongueError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Pan Card No</Label>
              <Input
                placeholder="Enter Pan Card No"
                value={panCardNo}
                onChange={updatePanCardNo}
                className={panCardNoError ? "border-red-500" : ""}
              />
              {panCardNoError && <p className="text-red-500 text-xs">{panCardNoError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Aadhar Card No</Label>
              <Input
                placeholder="Enter Aadhar Card No"
                value={aadharCardNo}
                onChange={updateAadharCardNo}
                className={aadharCardNoError ? "border-red-500" : ""}
              />
              {aadharCardNoError && <p className="text-red-500 text-xs">{aadharCardNoError}</p>}
            </div> */}
              </div>

              {/* {maritalStatus === "Married" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md border border-gray-100">
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-700 font-medium">Spouse Prefix</Label>
                <Select value={spousePrefix} onValueChange={updateSpousePrefix}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prefix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Mx">Mx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-700 font-medium">Spouse Name</Label>
                <Input
                  placeholder="Enter Spouse Name"
                  value={spouseName}
                  onChange={updateSpouseName}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-700 font-medium">Spouse DOB</Label>
                <Datepicker
                  value={spouseDob}
                  onChange={updateSpouseDob}
                  inputClassName="w-full px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-700 font-medium">Number of Children</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={numberOfChildren}
                  onChange={updateNumberOfChildren}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-700 font-medium">Wedding Anniversary</Label>
                <Datepicker
                  value={weddingAniversary}
                  onChange={updateWeddingAniversary}
                  inputClassName="w-full px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            </div>
          )} */}
            </div>
            {/* Lead Preferences */}
            <div className="flex flex-col gap-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lead Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Lead Stage</Label>
                  <Select value={leadStageId} onValueChange={updateLeadStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadStagesData.map((stage) => (
                        <SelectItem key={stage.id} value={String(stage.id)}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {["Interested", "New Lead"].includes(selectedLeadStageName) && (
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-neutral-700 font-medium">Lead Status</Label>
                    <Select value={leadStatus} onValueChange={updateLeadStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hot">Hot</SelectItem>
                        <SelectItem value="Cold">Cold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Bedroom Preference</Label>
                  <Select value={bedroom} onValueChange={(val) => setBedroom(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bedroom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Minimum Budget</Label>
                  <Input
                    type="number"
                    placeholder="Enter min budget"
                    value={minBudget}
                    onChange={updateMinBudget}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Maximum Budget</Label>
                  <Input
                    type="number"
                    placeholder="Enter max budget"
                    value={maxBudget}
                    onChange={updateMaxBudget}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Purpose</Label>
                  <Select value={purpose} onValueChange={updatePurpose}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enduse">End Use</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Funding</Label>
                  <Select value={funding} onValueChange={updateFunding}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Funding Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Selfloan">Self Loan</SelectItem>
                      <SelectItem value="Bankloan">Bank Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Lead Age (Days)</Label>
                  <Input
                    type="number"
                    placeholder="Enter lead age in days"
                    value={leadAge}
                    onChange={updateLeadAge}
                  />
                </div>

                {/* <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Country of Citizenship</Label>
              <Select value={countryOfCitizenship} onValueChange={updateCountryOfCitizenship}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countryNames.map((c) => (
                    <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Country of Residence</Label>
              <Select value={countryOfResidence} onValueChange={updateCountryOfResidence}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countryNames.map((c) => (
                    <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">POA Holder Status</Label>
              <Select value={holderPoa} onValueChange={updateHolderPoa}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resident">Resident</SelectItem>
                  <SelectItem value="NRI">NRI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Name of POA Holder</Label>
              <Input
                placeholder="Enter POA Holder Name"
                value={nameOfPoa}
                onChange={updateNameOfPoa}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-700 font-medium">Have you owned Abode home?</Label>
              <Select value={haveYouOwnedAbode} onValueChange={updateHaveYouOwnedAbode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

                {haveYouOwnedAbode === "true" && (
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-neutral-700 font-medium">Project Name</Label>
                    <Input
                      placeholder="Enter Project Name"
                      value={ifOwnedProjectName}
                      onChange={updateIfOwnedProjectName}
                    />
                  </div>
                )}
              </div>
            </div>


            {/* Lead Address */}
            <div className="flex flex-col gap-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lead Address</h3>

              <div className="flex flex-col gap-6">
                {/* Correspondence Address */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Correspondence Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-neutral-700 font-medium">Country</Label>
                      <Select value={correspondenceCountry} onValueChange={updateCorrespondenceCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryNames.map((c) => (
                            <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-neutral-700 font-medium">State</Label>
                      <Select value={correspondenceState} onValueChange={updateCorrespondenceState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {correspondenceStateData.map((s) => (
                            <SelectItem key={s.value} value={String(s.value)}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-neutral-700 font-medium">City</Label>
                      <Select value={correspondenceCity} onValueChange={updateCorrespondenceCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {correspondenceCityData.map((c) => (
                            <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <Label className="text-neutral-700 font-medium">Address</Label>
                      <Textarea
                        placeholder="Enter correspondence address"
                        value={correspondenceAddress}
                        onChange={updateCorrespondenceAddress}
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-neutral-700 font-medium">Pin Code</Label>
                      <Input
                        placeholder="Enter pin code"
                        value={correspondencePincode}
                        onChange={updateCorrespondencePincode}
                      />
                    </div>
                    {/* <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Years at Address</Label>
                  <Input
                    type="number"
                    placeholder="Years at address"
                    value={noOfYearsCorrespondenceAddress}
                    onChange={updateNoOfYearsCorrespondenceAddress}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Years in City</Label>
                  <Input
                    type="number"
                    placeholder="Years in city"
                    value={noOfYearsCity}
                    onChange={updateNoOfYearsCity}
                  />
                </div> */}
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="isSameAddress"
                    checked={isSameAddress}
                    onChange={(e) => handleIsSameAddress(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor="isSameAddress" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Permanent Address same as Correspondence Address
                  </Label>
                </div>

                {/* Permanent Address */}
                {!isSameAddress && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-neutral-700 font-medium">Country</Label>
                        <Select value={permanentCountry} onValueChange={updatePermanentCountry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryNames.map((c) => (
                              <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-neutral-700 font-medium">State</Label>
                        <Select value={permanentState} onValueChange={updatePermanentState}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {permanentStateData.map((s) => (
                              <SelectItem key={s.value} value={String(s.value)}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-neutral-700 font-medium">City</Label>
                        <Select value={permanentCity} onValueChange={updatePermanentCity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent>
                            {permanentCityData.map((c) => (
                              <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <Label className="text-neutral-700 font-medium">Address</Label>
                        <Textarea
                          placeholder="Enter permanent address"
                          value={permanentAddress}
                          onChange={updatePermanentAddress}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-neutral-700 font-medium">Pin Code</Label>
                        <Input
                          placeholder="Enter pin code"
                          value={permanentPincode}
                          onChange={updatePermanentPincode}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => navigate("/leads")}
                type="button"
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoadingEffect}
                className="bg-[#0083bf] hover:bg-[#0090bf] text-white px-8 cursor-pointer"
              >
                {isLoadingEffect ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Lead"
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
    </div>
  );
}

export default Editleadwrapper;
