import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Group,
  Loadingoverlay,
} from "@nayeshdaggula/tailify";
import Settingsapi from "../../api/Settingsapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import { Input } from "@/components/ui/input";

function Updateinfomodal({
  closeGeneralInfoModal,
  companyInfo,
  reloadCompanyDetails,
}) {
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const updateCompanyName = (e) => {
    const value = e.target.value.toUpperCase(); // convert all to uppercase
    setCompanyName(value);
    setCompanyNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const updateEmail = (e) => {
    let value = e.target.value;
    const formattedEmail = value.toLowerCase();
    setEmail(formattedEmail);
    setEmailError("");
  };

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const upatePhone = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setPhone(value);
    setPhoneError("");
  };

  const [addressone, setAddressone] = useState("");
  const [addressoneError, setAddressoneError] = useState("");
  const updateAddressone = (e) => {
    setAddressone(e.target.value);
    setAddressoneError("");
  };

  const [addresstwo, setAddresstwo] = useState("");
  const [addresstwoError, setAddresstwoError] = useState("");
  const updateAddresstwo = (e) => {
    setAddresstwo(e.target.value);
    setAddresstwoError("");
  };

  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const updateCity = (e) => {
    setCity(e.target.value);
    setCityError("");
  };

  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const updateState = (e) => {
    setState(e.target.value);
    setStateError("");
  };

  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const updateCountry = (e) => {
    setCountry(e.target.value);
    setCountryError("");
  };

  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const updatePincode = (e) => {
    setPincode(e.target.value);
    setPincodeError("");
  };

  const handleSubmit = () => {
    setIsLoadingEffect(true);
    let isValid = true;

    // Reset errors? No need, states are managed independently.

    if (companyName === "") {
      setCompanyNameError("Enter company name");
      isValid = false;
    }

    if (email === "") {
      setEmailError("Enter email");
      isValid = false;
    } else {
      // Loose validation for "any thing" (including various TLDs)
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        setEmailError("Invalid email address");
        isValid = false;
      }
    }

    if (phone === "") {
      setPhoneError("Enter phone number");
      isValid = false;
    } else if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setPhoneError("Phone number must be 10 digits");
      isValid = false;
    }

    if (addressone === "") {
      setAddressoneError("Enter address");
      isValid = false;
    }

    if (city === "") {
      setCityError("Enter city");
      isValid = false;
    }

    if (state === "") {
      setStateError("Enter state");
      isValid = false;
    }

    if (country === "") {
      setCountryError("Enter country");
      isValid = false;
    }

    if (pincode === "") {
      setPincodeError("Enter pincode");
      isValid = false;
    }

    if (!isValid) {
      setIsLoadingEffect(false);
      return false;
    }

    Settingsapi.post("update-company-info", {
      company_name: companyName,
      email: email,
      phone_number: phone,
      addressone: addressone,
      addresstwo: addresstwo,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          toast.error(data.message);
          setIsLoadingEffect(false);
          return false;
        }
        toast.success("Company information Updated Successfully");
        setIsLoadingEffect(false);
        reloadCompanyDetails();
        closeGeneralInfoModal();
        return false;
      })
      .catch((error) => {
        setErrorMessage(error);
        setIsLoadingEffect(false);
        return false;
      });
  };

  useEffect(() => {
    if (companyInfo) {
      setCompanyName(companyInfo.name || "");
      setEmail(companyInfo.email || "");
      setPhone(companyInfo.phone_number || "");
      setAddressone(companyInfo.address_line1 || "");
      setAddresstwo(companyInfo.address_line2 || "");
      setCity(companyInfo.city || "");
      setState(companyInfo.state || "");
      setCountry(companyInfo.country || "");
      setPincode(companyInfo.zip_code || "");
    }
  }, [companyInfo]);

  return (
    <>
      {isLoadingEffect && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
          <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
        </div>
      )}

      <Card withBorder={false} className="!shadow-none" padding="0">
        <Card.Section padding="0">
          <Group
            justify="space-between"
            align="center"
            className="pb-3 items-center px-2"
          >
            <div
              className="font-semibold text-[18px] text-[#000000]"
            >
              Update Information
            </div>

            <Button
              onClick={closeGeneralInfoModal}
              size="sm"
              variant="default"
              className="!px-2 !py-1.5 !text-red-500 hover:!border-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1 13L7 7L13 13M13 1L6.99886 7L1 1"
                  stroke="#FF0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Group>
        </Card.Section>
        <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-600 mb-1">Company Name</label>
              <Input
                placeholder="Enter Company Name"
                value={companyName}
                onChange={updateCompanyName}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${companyNameError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {companyNameError && <p className="text-xs text-red-500">{companyNameError}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="w-[60px]">
                    <Input
                      value="+91"
                      readOnly
                      disabled
                      className="bg-gray-50 text-center px-2 py-2 border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Enter Phone Number"
                      value={phone}
                      onChange={upatePhone}
                      className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
                {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
                <Input
                  placeholder="Enter Email"
                  value={email}
                  onChange={updateEmail}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Address Line 1</label>
                <Input
                  placeholder="Enter Address"
                  value={addressone}
                  onChange={updateAddressone}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${addressoneError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {addressoneError && <p className="text-xs text-red-500">{addressoneError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                <Input
                  placeholder="Enter Address"
                  value={addresstwo}
                  onChange={updateAddresstwo}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${addresstwoError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {addresstwoError && <p className="text-xs text-red-500">{addresstwoError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">City</label>
                <Input
                  placeholder="Enter City"
                  value={city}
                  onChange={updateCity}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${cityError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {cityError && <p className="text-xs text-red-500">{cityError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">State</label>
                <Input
                  placeholder="Enter State"
                  value={state}
                  onChange={updateState}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${stateError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {stateError && <p className="text-xs text-red-500">{stateError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Country</label>
                <Input
                  placeholder="Enter Country"
                  value={country}
                  onChange={updateCountry}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${countryError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {countryError && <p className="text-xs text-red-500">{countryError}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Zip Code</label>
                <Input
                  type="number"
                  placeholder="Enter Zip Code"
                  value={pincode}
                  onChange={updatePincode}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${pincodeError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {pincodeError && <p className="text-xs text-red-500">{pincodeError}</p>}
              </div>
            </div>

          </div>
        </Card.Section>
        <Card.Section className="flex justify-end mt-4 !p-0">
          <button
            onClick={handleSubmit}
            disabled={isLoadingEffect}
            className="px-6 text-[14px] bg-[#0083bf] hover:bg-[#0083bf]/90 text-white py-2 rounded-md font-medium cursor-pointer transition-colors"
          >
            Submit
          </button>
        </Card.Section>
      </Card>
      {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
    </>
  );
}

export default Updateinfomodal;
