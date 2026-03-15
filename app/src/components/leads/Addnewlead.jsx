import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import Generalapi from "../api/Generalapi";
import Leadapi from "../api/Leadapi";
import Settingsapi from "../api/Settingsapi";
import Projectapi from "../api/Projectapi";
import Employeeapi from "../api/Employeeapi";
import Errorpanel from "../../components/shared/Errorpanel.jsx";
import { toast } from "react-toastify";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Textinput, Loadingoverlay, Datepicker, Button as TailifyButton } from "@nayeshdaggula/tailify";
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

const Addnewlead = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const [searchParams, setSearchParams] = useSearchParams();
  const customerId = searchParams.get("id");

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
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
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
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
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
  const [countryOfCitizenshipError, setCountryOfCitizenshipError] = useState("");
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
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setNameOfPoa(formatted);
    setNameOfPoaError("");
  };

  const [holderPoa, setHolderPoa] = useState("");
  const [holderPoaError, setHolderPoaError] = useState("");
  const updateHolderPoa = (value) => {
    setHolderPoa(value);
    setHolderPoaError("");
  };

  const [noOfYearsCorrespondenceAddress, setNoOfYearsCorrespondenceAddress] = useState("");
  const [noOfYearsCorrespondenceAddressError, setNoOfYearsCorrespondenceAddressError] = useState("");
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

  // New Lead Schema Fields
  const [leadStatus, setLeadStatus] = useState("");
  const [leadStatusError, setLeadStatusError] = useState("");
  const updateLeadStatus = (value) => {
    setLeadStatus(value);
    setLeadStatusError("");
  };

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

  const [leadStageId, setLeadStageId] = useState("");
  const [leadStageError, setLeadStageError] = useState("");
  const [leadStagesData, setLeadStagesData] = useState([]);
  const [selectedLeadStageName, setSelectedLeadStageName] = useState("");

  const updateLeadStage = (value) => {
    setLeadStageId(value);
    setLeadStageError("");
    const selectedStage = leadStagesData.find(stage => stage.id.toString() === value);
    const stageName = selectedStage ? selectedStage.name : "";
    setSelectedLeadStageName(stageName);

    // Clear lead status if stage changes to one that doesn't show status
    if (!["Interested", "New Lead"].includes(stageName)) {
      setLeadStatus("");
      setLeadStatusError("");
    }
  };

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectError, setProjectError] = useState("");

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

  const [stateData, setStateData] = useState([]);
  const [correspondenceCityData, setCorrespondenceCityData] = useState([]);
  const [permanentCityData, setPermanentCityData] = useState([]);

  const [correspondenceCountry, setCorrespondenceCountry] = useState("");
  const [correspondenceCountryError, setCorrespondenceCountryError] = useState("");
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
    setCorrespondenceStateError("");
  };

  const [correspondenceCity, setCorrespondenceCity] = useState("");
  const [correspondenceCityError, setCorrespondenceCityError] = useState("");
  const updateCorrespondenceCity = (value) => {
    setCorrespondenceCity(value);
    setCorrespondenceCityError("");
  };

  const [correspondencePincode, setCorrespondencePincode] = useState("");
  const [correspondencePincodeError, setCorrespondencePincodeError] = useState("");
  const updateCorrespondencePincode = (e) => {
    setCorrespondencePincode(e.target.value);
    setCorrespondencePincodeError("");
  };

  const [correspondenceAddress, setCorrespondenceAddress] = useState("");
  const [correspondenceAddressError, setCorrespondenceAddressError] = useState("");
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

  async function getStates(country) {
    if (!country) return;
    await Settingsapi.get("/get-states", {
      params: {
        country_id: country,
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
          return;
        }
        setStateData(data?.data || []);
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
      });
  }

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
      setEmployee(""); // Reset selected employee
      getEmployees(selectedProjectId);
    } else {
      getEmployees();
    }
  }, [selectedProjectId]);


  async function getLeadStages() {
    try {
      const response = await Settingsapi.get("/get-lead-stages", {
        params: { limit: 100 }
      });
      if (response?.data?.status === "success") {
        setLeadStagesData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching lead stages:", error);
    }
  }

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
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          fetchCountryCodes(),
          fetchCountryNames(),
          getLeadStages(),
          getProjects(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Set India as default country and fetch states once countryNames are loaded
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

  // Fetch states when correspondence country changes
  useEffect(() => {
    if (correspondenceCountry) {
      getStates(correspondenceCountry);
    } else {
      setStateData([]);
    }
  }, [correspondenceCountry]);

  const handleSubmit = async () => {
    setIsLoadingEffect(true);
    let isValid = true;

    if (prefixes === "") {
      setPrefixError("Prefix is required");
      isValid = false;
    }

    if (fullName === "") {
      setFullNameError("Full name is required");
      isValid = false;
    }


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

    if (selectedProjectId === "") {
      setProjectError("Project is required");
      isValid = false;
    }

    // if (employee === "") {
    //   setEmployeeError("Employee is required");
    //   isValid = false;
    // }

    if (leadStageId === "") {
      setLeadStageError("Lead Stage is required");
      isValid = false;
    }

    if (["Interested", "New Lead"].includes(selectedLeadStageName) && leadStatus === "") {
      setLeadStatusError("Lead Status is required");
      isValid = false;
    }

    if (!isValid) {
      setIsLoadingEffect(false);
      return false;
    }

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

    // if (haveYouOwnedAbode === "true" && ifOwnedProjectName === "") {
    //   setIfOwnedProjectNameError("Project Name is required");
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

    try {
      const response = await Leadapi.post("add-lead", {
        prefixes: prefixes,
        full_name: fullName,
        email: email && email.trim() !== "" ? email : null,
        email_2: email2 && email2.trim() !== "" ? email2 : null,
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
        number_of_children: numberOfChildren ? Number(numberOfChildren) : null,
        wedding_aniversary: weddingAniversary,
        spouse_dob: spouseDob,
        pan_card_no: panCardNo,
        aadhar_card_no: aadharCardNo,
        country_of_citizenship: countryOfCitizenship || null,
        country_of_residence: countryOfResidence || null,
        mother_tongue: motherTongue,
        name_of_poa: nameOfPoa,
        holder_poa: holderPoa,
        no_of_years_correspondence_address: noOfYearsCorrespondenceAddress ? Number(noOfYearsCorrespondenceAddress) : null,
        no_of_years_city: noOfYearsCity ? Number(noOfYearsCity) : null,
        have_you_owned_abode: haveYouOwnedAbode,
        if_owned_project_name: ifOwnedProjectName,
        correspondence_country: correspondenceCountry || null,
        correspondence_state: correspondenceState || null,
        correspondence_city: correspondenceCity,
        correspondence_address: correspondenceAddress,
        correspondence_pincode: correspondencePincode,
        permanent_country: permanentCountry || null,
        permanent_state: permanentState || null,
        permanent_city: permanentCity,
        permanent_address: permanentAddress,
        permanent_pincode: permanentPincode,
        employeeId: employeeId,
        current_designation: currentDesignation,
        name_of_current_organization: currentOrganization,
        address_of_current_organization: organizationAddress,
        no_of_years_work_experience: workExperience ? parseFloat(workExperience) : null,
        current_annual_income: annualIncome ? parseFloat(annualIncome) : null,
        // New Lead Fields
        lead_status: leadStatus || null,
        min_budget: minBudget ? parseFloat(minBudget) : null,
        max_budget: maxBudget ? parseFloat(maxBudget) : null,
        bedroom: bedroom || null,
        purpose: purpose || null,
        funding: funding || null,

        lead_age: leadAge ? parseInt(leadAge) : null,
        lead_stage_id: leadStageId || null,
        project_id: selectedProjectId || null,
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
      navigate("/leads");
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

  const [openAddressCorrespondence, setOpenAddressCorrespondence] = useState(false);
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Add Lead</h1>
        <div onClick={() => navigate(-1)} className="text-[#0083bf] px-3 gap-1 flex items-center justify-center py-1.5 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200 cursor-pointer">
          <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
          Back
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full bg-white rounded-lg shadow-sm border border-[#ebecef] p-8">
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
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
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
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${fullNameError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {fullNameError && <p className="text-red-500 text-xs">{fullNameError}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Email Address</Label>
                  <Input
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={updateEmail}
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                </div>

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
                        className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${phoneNumberError ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                  </div>
                  {(phoneCodeError || phoneNumberError) && (
                    <p className="text-red-500 text-xs">{phoneCodeError || phoneNumberError}</p>
                  )}
                </div>

                {/* Project Selection */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Project <span className="text-red-500">*</span></Label>
                  <Select
                    value={selectedProjectId}
                    onValueChange={(value) => {
                      setSelectedProjectId(value);
                      setProjectError("");
                    }}
                  >
                    <SelectTrigger className={projectError ? "border-red-500" : ""}>
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
                  {projectError && <p className="text-red-500 text-xs">{projectError}</p>}
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
                  <Label className="text-neutral-700 font-medium">Source of Lead </Label>
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
                  <Label className="text-neutral-700 font-medium">Lead Stage <span className="text-red-500">*</span></Label>
                  <Select value={leadStageId} onValueChange={updateLeadStage}>
                    <SelectTrigger className={leadStageError ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadStagesData.map((stage) => (
                        <SelectItem key={stage.id} value={String(stage.id)}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {leadStageError && <p className="text-red-500 text-xs">{leadStageError}</p>}
                </div>

                {["Interested", "New Lead"].includes(selectedLeadStageName) && (
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-neutral-700 font-medium">Lead Status <span className="text-red-500">*</span></Label>
                    <Select value={leadStatus} onValueChange={updateLeadStatus}>
                      <SelectTrigger className={leadStatusError ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hot">Hot</SelectItem>
                        <SelectItem value="Cold">Cold</SelectItem>
                      </SelectContent>
                    </Select>
                    {leadStatusError && <p className="text-red-500 text-xs">{leadStatusError}</p>}
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
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 border-gray-300`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-700 font-medium">Maximum Budget</Label>
                  <Input
                    type="number"
                    placeholder="Enter max budget"
                    value={maxBudget}
                    onChange={updateMaxBudget}
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 border-gray-300`}
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
                    className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 border-gray-300`}
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
            </div> */}

                {/* <div className="flex flex-col gap-1.5">
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
            </div> */}
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
                          {stateData.map((s) => (
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
                        className="min-h-[80px] shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-neutral-700 font-medium">Pin Code</Label>
                      <Input
                        placeholder="Enter pin code"
                        value={correspondencePincode}
                        onChange={updateCorrespondencePincode}
                        className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 border-gray-300`}
                      />
                    </div>
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
                            {stateData.map((s) => (
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
                          className="min-h-[80px] shadow-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-neutral-700 font-medium">Pin Code</Label>
                        <Input
                          placeholder="Enter pin code"
                          value={permanentPincode}
                          onChange={updatePermanentPincode}
                          className={`w-full px-3 py-2 shadow-sm border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 border-gray-300`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-700 font-medium">Years at Correspondence Address</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={noOfYearsCorrespondenceAddress}
                  onChange={updateNoOfYearsCorrespondenceAddress}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-700 font-medium">Years in Current City</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={noOfYearsCity}
                  onChange={updateNoOfYearsCity}
                />
              </div>
            </div> */}
              </div>
            </div>

            {/* <Textinput
          placeholder="Enter Pan Card No"
          label="Pan Card No (e.g., XXXXX1234X)"
          value={panCardNo}
          error={panCardNoError}
          onChange={updatePanCardNo}
          labelClassName="text-sm font-medium text-gray-600 mb-1"
          inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
        />
        <Textinput
          placeholder="Enter Aadhar Card No"
          label="Aadhar Card No (e.g., XXXX XXXX XXXX)"
          value={aadharCardNo}
          error={aadharCardNoError}
          onChange={updateAadharCardNo}
          type="number"
          labelClassName="text-sm font-medium text-gray-600 mb-1"
          inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
        />
        <Select
          data={countryNames}
          label="Country of Citizenship"
          searchable
          value={countryOfCitizenship}
          error={countryOfCitizenshipError}
          onChange={updateCountryOfCitizenship}
          selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
          labelClass="text-sm font-medium text-gray-600 mb-1"
          dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
        />
        <Select
          data={countryNames}
          label="Country of Residence"
          searchable
          value={countryOfResidence}
          error={countryOfResidenceError}
          onChange={updateCountryOfResidence}
          selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
          labelClass="text-sm font-medium text-gray-600 mb-1"
          dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
        />
        <Textinput
          placeholder="Enter Mother Tongue"
          label="Mother Tongue"
          value={motherTongue}
          error={motherTongueError}
          onChange={updateMotherTongue}
          labelClassName="text-sm font-medium text-gray-600 mb-1"
          inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
        />
        <Textinput
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
          </>
        )}
      </div>
      {/* <hr className="border border-[#ebecef]" />
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-[16px] text-gray-700">
                Professional Details
              </p>
              <div className="grid grid-cols-3 gap-4">
                <Textinput
                  placeholder="Enter Current Designation"
                  label="Current Designation"
                  value={currentDesignation}
                  error={currentDesignationError}
                  onChange={updateCurrentDesignation}
                  labelClassName="text-sm font-medium text-gray-600 mb-1"
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
                <Textinput
                  placeholder="Enter Current Organization"
                  label="Current Organization"
                  value={currentOrganization}
                  error={currentOrganizationError}
                  onChange={updateCurrentOrganization}
                  labelClassName="text-sm font-medium text-gray-600 mb-1"
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
                <Textinput
                  placeholder="Enter Organization Address"
                  label="Organization Address"
                  value={organizationAddress}
                  error={organizationAddressError}
                  onChange={updateOrganizationAddress}
                  labelClassName="text-sm font-medium text-gray-600 mb-1"
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
                <Textinput
                  placeholder="Enter Work Experience"
                  label="Work Experience"
                  type="number"
                  value={workExperience}
                  error={workExperienceError}
                  onChange={updateWorkExperience}
                  labelClassName="text-sm font-medium text-gray-600 mb-1"
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
                <Textinput
                  placeholder="Enter Annual Income"
                  label="Annual Income"
                  type="number"
                  value={annualIncome}
                  error={annualIncomeError}
                  onChange={updateAnnualIncome}
                  labelClassName="text-sm font-medium text-gray-600 mb-1"
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>
      */}
      {/* <hr className="border border-[#ebecef]" />
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
                    <Select
                      label="Country"
                      placeholder="Select Country"
                      labelClass="text-sm font-medium text-gray-600 mb-1"
                      dropDownClass="overflow-y-hidden"
                      selectWrapperClass="bg-white"
                      searchable={true}
                      data={[{ label: "India", value: "101" }]}
                      value={correspondenceCountry}
                      onChange={updateCorrespondenceCountry}
                      error={correspondenceCountryError}
                    />
                    <Select
                      label="State"
                      placeholder="Select State"
                      labelClass="text-sm font-medium text-gray-600 mb-1"
                      dropDownClass="overflow-y-hidden"
                      selectWrapperClass="bg-white"
                      searchable={true}
                      data={stateData}
                      value={correspondenceState}
                      onChange={updateCorrespondenceState}
                      error={correspondenceStateError}
                    />
                    {correspondenceState && (
                      <Select
                        label="City"
                        placeholder="Select City"
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        dropDownClass="overflow-y-hidden"
                        selectWrapperClass="bg-white"
                        searchable={true}
                        data={correspondenceCityData}
                        value={correspondenceCity}
                        onChange={updateCorrespondenceCity}
                        error={correspondenceCityError}
                      />
                    )}
                    {correspondenceCity && (
                      <Textinput
                        label="Address"
                        placeholder="Enter your Address"
                        labelClassName="text-sm font-medium text-gray-600 !mb-1"
                        inputClassName="shadow-sm !bg-white"
                        value={correspondenceAddress}
                        onChange={updateCorrespondenceAddress}
                        error={correspondenceAddressError}
                      />
                    )}
                    {correspondenceAddress && (
                      <Textinput
                        label="Pin Code"
                        labelClassName="text-sm font-medium text-gray-600 !mb-1"
                        inputClassName="shadow-sm bg-white"
                        placeholder="Enter your pincode"
                        value={correspondencePincode}
                        onChange={updateCorrespondencePincode}
                        error={correspondencePincodeError}
                      />
                    )}
                   
                  </>
                )}
              </div>
      */}
      {/* <div className="flex flex-col gap-2">
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
                    <Select
                      label="Country"
                      placeholder="Select Country"
                      labelClass="text-sm font-medium text-gray-600 mb-1"
                      dropDownClass="overflow-y-hidden"
                      selectWrapperClass="bg-white"
                      searchable={true}
                      data={[{ label: "India", value: "101" }]}
                      value={permanentCountry}
                      onChange={updatePermanentCountry}
                      error={permanentCountryError}
                    />
                    <Select
                      label="State"
                      placeholder="Select State"
                      labelClass="text-sm font-medium text-gray-600 mb-1"
                      dropDownClass="overflow-y-hidden"
                      selectWrapperClass="bg-white"
                      searchable={true}
                      data={stateData}
                      value={permanentState}
                      onChange={updatePermanentState}
                      error={permanentStateError}
                    />
                    {permanentState && (
                      <Select
                        label="City"
                        placeholder="Select City"
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        dropDownClass="overflow-y-hidden"
                        selectWrapperClass="bg-white"
                        searchable={true}
                        data={permanentCityData}
                        value={permanentCity}
                        onChange={updatePermanentCity}
                        error={permanentCityError}
                      />
                    )}
                    {permanentCity && (
                      <Textinput
                        label="Address"
                        placeholder="Enter your Address"
                        labelClassName="text-sm font-medium text-gray-600 !mb-1"
                        inputClassName="shadow-sm !bg-white"
                        value={permanentAddress}
                        onChange={updatePermanentAddress}
                        error={permanentAddressError}
                      />
                    )}
                    {permanentAddress && (
                      <Textinput
                        label="Pin Code"
                        labelClassName="text-sm font-medium text-gray-600 !mb-1"
                        inputClassName="shadow-sm bg-white"
                        placeholder="Enter your pincode"
                        value={permanentPincode}
                        onChange={updatePermanentPincode}
                        error={permanentPincodeError}
                      />
                    )}
                  </>
                )}
              </div>
        */}

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isLoadingEffect}
          className="bg-[#0083bf] hover:bg-[#0090bf] text-white px-8 cursor-pointer"
        >
          {isLoadingEffect ? (
            <>
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
      {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
    </div >
  );
};

export default Addnewlead;
