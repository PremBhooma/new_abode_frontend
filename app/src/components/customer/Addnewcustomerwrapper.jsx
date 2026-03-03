import React, { useEffect, useState } from "react";
import Generalapi from "../api/Generalapi";
import Settingsapi from "../api/Settingsapi";
import Customerapi from "../api/Customerapi";
import Errorpanel from "@/components/shared/Errorpanel.jsx";
import { toast } from "react-toastify";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Textinput,
  Select,
  Loadingoverlay,
  Datepicker,
} from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";

function Addnewcustomerwrapper() {
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;


  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  const [prefixes, setPrefixes] = useState("");
  const [prefixError, setPrefixError] = useState("");
  const updatePrefix = (e) => {
    setPrefixes(e.target.value);
    setPrefixError("");
  }

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const updateFirstName = (e) => {
    setFirstName(e.target.value);
    setFirstNameError("");
  };

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const updateLastName = (e) => {
    setLastName(e.target.value);
    setLastNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const updateEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const [email2, setEmail2] = useState("");
  const [emailError2, setEmailError2] = useState("");
  const updateEmail2 = (e) => {
    setEmail2(e.target.value);
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
    setPhoneNumber(e.target.value);
    setPhoneNumberError("");
  };

  const [gender, setGender] = useState("Male");
  const [genderError, setGenderError] = useState("");
  const updateGender = (value) => {
    setGender(value);
    setGenderError("");
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
    setFatherName(e.target.value);
    setFatherNameError("");
  };

  const [spousePrefix, setSpousePrefix] = useState("");
  const [spousePrefixError, setSpousePrefixError] = useState("");
  const updateSpousePrefix = (e) => {
    setSpousePrefix(e.target.value);
    setSpousePrefixError("");
  };

  const [spouseName, setSpouseName] = useState("");
  const [spouseNameError, setSpouseNameError] = useState("");
  const updateSpouseName = (e) => {
    const value = e.target.value;
    setSpouseName(value);
    setSpouseNameError("");

    // Automatically set marital status to "Married" if spouse name is filled
    if (value.trim() !== "") {
      setMaritalStatus("Married");
    } else {
      setMaritalStatus("");
    }
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
    setPanCardNo(e.target.value);
    setPanCardNoError("");
  };

  const [aadharCardNo, setAadharCardNo] = useState("");
  const [aadharCardNoError, setAadharCardNoError] = useState("");
  const updateAadharCardNo = (e) => {
    setAadharCardNo(e.target.value);
    setAadharCardNoError("");
  };

  const [countryOfCitizenship, setCountryOfCitizenship] = useState("101");
  const [countryOfCitizenshipError, setCountryOfCitizenshipError] =
    useState("");
  const updateCountryOfCitizenship = (value) => {
    setCountryOfCitizenship(value);
    setCountryOfCitizenshipError("");
  };

  const [countryOfResidence, setCountryOfResidence] = useState("101");
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
    setNameOfPoa(e.target.value);
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

  const [stateData, setStateData] = useState([]);
  const [correspondenceCityData, setCorrespondenceCityData] = useState([]);
  const [permanentCityData, setPermanentCityData] = useState([]);

  const [correspondenceCountry, setCorrespondenceCountry] = useState("101");
  const [correspondenceCountryError, setCorrespondenceCountryError] = useState("");
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

  const [permanentCountry, setPermanentCountry] = useState("101");
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

  async function getStates() {
    await Settingsapi.get("/get-states")
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
        setStateData(data?.data || []);
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
    getStates();
    fetchCountryCodes();
    fetchCountryNames();
  }, []);

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

  const handleSubmit = async () => {
    setIsLoadingEffect(true);

    if (prefixes === "") {
      setPrefixError("Prefix is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (firstName === "") {
      setFirstNameError("First name is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (lastName === "") {
      setLastNameError("First name is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (email === "") {
      setEmailError("Email is required");
      setIsLoadingEffect(false);
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
      setIsLoadingEffect(false);
      return false;
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

    if (gender === "") {
      setGenderError("Gender is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (dateOfBirth === "") {
      setDateOfBirthError("Date of Birth is required");
      setIsLoadingEffect(false);
      return false;
    }

    const response = await Customerapi.post(
      "add-customer",
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        email_2: email2,
        phone_code: phoneCode,
        phone_number: phoneNumber,
        landline_country_code: landlineCountryCode,
        landline_city_code: landlineCityCode,
        landline_number: landlineNumber,
        date_of_birth: dateOfBirth,
        father_name: fatherName,
        spouse_name: spouseName,
        marital_status: maritalStatus,
        number_of_children: Number(numberOfChildren),
        wedding_aniversary: weddingAniversary,
        spouse_dob: spouseDob,
        pan_card_no: panCardNo,
        aadhar_card_no: aadharCardNo,
        country_of_citizenship: countryOfCitizenship,
        country_of_residence: countryOfResidence,
        mother_tongue: motherTongue,
        name_of_poa: nameOfPoa,
        holder_poa: holderPoa,
        no_of_years_correspondence_address: Number(
          noOfYearsCorrespondenceAddress
        ),
        no_of_years_city: Number(noOfYearsCity),
        have_you_owned_abode: Boolean(haveYouOwnedAbode),
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
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        const data = response?.data;
        if (data?.status === "error") {
          setErrorMessage({
            message: data?.message,
            server_res: data,
          });
          setIsLoadingEffect(false);
          return false;
        }

        toast.success("Customer added successfully", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => {
            navigate("/customers");
          },
        });
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
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
      });
  };

  useEffect(() => {
    // If spouse name is empty and marital status is "Married", clear marital status
    if (spouseName.trim() === "" && maritalStatus === "Married") {
      setMaritalStatus("");
    }
  }, [spouseName, maritalStatus]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] font-semibold">Add Customer</h1>
        <Link
          to={"/customers"}
          className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
        >
          <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
          Back
        </Link>
      </div>
      <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8">
        <div className="grid grid-cols-2 gap-4">



          <Textinput
            placeholder="Enter First Name"
            label="First Name"
            withAsterisk
            value={firstName}
            error={firstNameError}
            onChange={updateFirstName}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Last Name"
            label="Last Name"
            withAsterisk
            value={lastName}
            error={lastNameError}
            onChange={updateLastName}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Email Address 1"
            label="Email Address 1"
            withAsterisk
            value={email}
            error={emailError}
            onChange={updateEmail}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Email Address 2"
            label="Email Address 2"
            value={email2}
            error={emailError2}
            onChange={updateEmail2}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row gap-x-4 w-full">
              <div className="w-20">
                <Select
                  data={countryCodes}
                  placeholder="Code"
                  searchable
                  value={phoneCode}
                  // error={phoneCodeError}
                  onChange={updatePhoneCode}
                  selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
                  className="w-full"
                  dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                />
              </div>
              <div className="flex-1">
                <Textinput
                  placeholder="Enter Phone Number"
                  type="text"
                  value={phoneNumber}
                  // error={phoneNumberError}
                  onChange={updatePhoneNumber}
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>
            {phoneCodeError !== "" && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {phoneCodeError}
              </p>
            )}
            {phoneNumberError !== "" && (
              <p className="mt-1 text-xs text-red-600 font-medium">
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
                  type="text"
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
          <Datepicker
            label="Date of Birth"
            withAsterisk
            value={dateOfBirth}
            error={dateOfBirthError}
            onChange={updateDateOfBirth}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Father Name"
            label="Father Name"
            value={fatherName}
            error={fatherNameError}
            onChange={updateFatherName}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Spouse Name"
            label="Spouse Name"
            value={spouseName}
            error={spouseNameError}
            onChange={updateSpouseName}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Select
            data={[
              { label: "Single", value: "Single" },
              { label: "Married", value: "Married" },
            ]}
            label="Marital Status"
            value={maritalStatus}
            error={maritalStatusError}
            onChange={updateMaritalStatus}
            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
          />
          <Textinput
            placeholder="Enter No of Children"
            label="Number of Children"
            value={numberOfChildren}
            error={numberOfChildrenError}
            onChange={updateNumberOfChildren}
            type="number"
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Datepicker
            label="Wedding Aniversary"
            value={weddingAniversary}
            error={weddingAniversaryError}
            onChange={updateWeddingAniversary}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Datepicker
            label="Spouse DOB"
            value={spouseDob}
            error={spouseDobError}
            onChange={updateSpouseDob}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Pan Card No"
            label="Pan Card No"
            value={panCardNo}
            error={panCardNoError}
            onChange={updatePanCardNo}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Aadhar Card No"
            label="Aadhar Card No"
            value={aadharCardNo}
            error={aadharCardNoError}
            onChange={updateAadharCardNo}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] text-gray-700">
              Address of Correspondence
            </p>
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
            <Textinput
              label="Address"
              placeholder="Enter your Address"
              labelClassName="text-sm font-medium text-gray-600 !mb-1"
              inputClassName="shadow-sm !bg-white"
              value={correspondenceAddress}
              onChange={updateCorrespondenceAddress}
              error={correspondenceAddressError}
            />
            <Textinput
              label="Pin Code"
              labelClassName="text-sm font-medium text-gray-600 !mb-1"
              inputClassName="shadow-sm bg-white"
              placeholder="Enter your pincode"
              value={correspondencePincode}
              onChange={updateCorrespondencePincode}
              error={correspondencePincodeError}
            />

            <div className="mt-2 flex items-center gap-2">
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
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] text-gray-700">
              Permanent Address
            </p>
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
            <Textinput
              label="Address"
              placeholder="Enter your Address"
              labelClassName="text-sm font-medium text-gray-600 !mb-1"
              inputClassName="shadow-sm !bg-white"
              value={permanentAddress}
              onChange={updatePermanentAddress}
              error={permanentAddressError}
            />
            <Textinput
              label="Pin Code"
              labelClassName="text-sm font-medium text-gray-600 !mb-1"
              inputClassName="shadow-sm bg-white"
              placeholder="Enter your pincode"
              value={permanentPincode}
              onChange={updatePermanentPincode}
              error={permanentPincodeError}
            />
          </div>
        </div>
        <div className="flex justify-end mt-auto">
          <Link
            onClick={handleSubmit}
            disabled={isLoadingEffect}
            className="cursor-pointer ml-[10px] text-xs text-left text-white flex justify-center items-center relative px-4 py-2 rounded bg-[#0083bf]"
          >
            + Add Customer
          </Link>
        </div>
      </div>
      {isLoadingEffect && (
        <div className="fixed inset-0 bg-[#f5f5f6] flex justify-center items-center z-50">
          <Loadingoverlay
            visible={isLoadingEffect}
            overlayBg="bg-transparent"
          />
        </div>
      )}
      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
    </div>
  );
}

export default Addnewcustomerwrapper;
