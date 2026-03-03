// import Employeeapi from '@/components/api/Employeeapi';
// import Errorpanel from '@/components/shared/Errorpanel';
// import { useEmployeDetails } from '../../zustand/useEmployeeDetails';
import {
  Button,
  Card,
} from "@nayeshdaggula/tailify";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { IconX } from "@tabler/icons-react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import Generalapi from "../../api/Generalapi";
import Employeeapi from "../../api/Employeeapi";
import { toast } from "react-toastify";
import Errorpanel from "../../shared/Errorpanel";

function AddnewEmployee({ closeAddnewmodal, refreshUserData }) {
  // const access_token = useEmployeDetails(state => state.access_token);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const upateName = (e) => {
    const value = e.target.value;
    const formattedName =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setName(formattedName);
    setNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const upateEmail = (e) => {
    const value = e.target.value;
    const formattedEmail = value.toLowerCase();
    setEmail(formattedEmail);
    setEmailError("");
  };

  const [phoneCode, setPhoneCode] = useState("91");
  const updatePhoneCode = (value) => {
    setPhoneCode(value);
    setPhoneError("");
  };

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const upatePhone = (e) => {
    let value = e.target.value;
    if (isNaN(value)) {
      return false;
    }

    // remove non-digit characters
    value = value.replace(/\D/g, "");

    // if phoneCode is India (+91), restrict to 10 digits
    if (phoneCode === "91") {
      value = value.slice(0, 10);
    }
    setPhone(value);
    setPhoneError("");
  };

  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const updateRole = (value) => {
    setRole(value);
    setRoleError("");
  };

  const [reportinghead, setReportinghead] = useState("");
  const [reportingheadError, setReportingheadError] = useState("");
  const updateReportinghead = (value) => {
    setReportinghead(value);
    setReportingheadError("");
  };

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const upatePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const [showRepassword, setShowRepassword] = useState(false);
  const upateRepassword = (e) => {
    setRepassword(e.target.value);
    setRepasswordError("");
  };

  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const updateGender = (value) => {
    setGender(value);
    setGenderError("");
  };

  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [countryCodes, setCountryCodes] = useState([]);
  async function fetchCountryCodes() {
    // setIsLoadingEffect(true);
    return Generalapi.get("/getcountries")
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          // setIsLoadingEffect(false);
          return false;
        }
        setCountryCodes(data.countrydata);
        // setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
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
        // setIsLoadingEffect(false);
        return false;
      });
  }

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     setIsLoadingEffect(true);

  //     setTimeout(() => {
  //         setIsLoadingEffect(false);
  //     }, 5000);
  // };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (name === "") {
      setNameError("Name is required");
      setIsSubmitting(false);
      return false;
    }

    if (email === "") {
      setEmailError("Email is required");
      setIsSubmitting(false);
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
      setIsSubmitting(false);
      return false;
    }

    if (phoneCode === "") {
      setPhoneError("Phone code is required");
      setIsSubmitting(false);
      return false;
    }
    if (phone === "") {
      setPhoneError("Phone number is required");
      setIsSubmitting(false);
      return false;
    }
    // Validate phone number
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    if (gender === "") {
      setGenderError("Gender is required");
      setIsSubmitting(false);
      return false;
    }

    if (role === "") {
      setRoleError("Role is required");
      setIsSubmitting(false);
      return false;
    }

    if (reportinghead === "") {
      setReportingheadError("Reporting Head is required");
      setIsSubmitting(false);
      return false;
    }

    if (password === "") {
      setPasswordError("Password is required");
      setIsSubmitting(false);
      return false;
    }

    if (repassword === "") {
      setRepasswordError("Re-enter password is required");
      setIsSubmitting(false);
      return false;
    } else if (password !== repassword) {
      setRepasswordError("Password does not match");
      setIsSubmitting(false);
      return false;
    }

    Employeeapi.post(
      "add-employee",
      {
        name: name,
        email: email,
        gender: gender,
        phone_code: phoneCode,
        phone_number: phone,
        role_id: role,
        reporting_head: reportinghead,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${access_token}`
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsSubmitting(false);
          return false;
        }
        toast.success("Successfully Employee added", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsSubmitting(false);
        closeAddnewmodal();
        refreshUserData();
        return false;
      })
      .catch((error) => {
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
        setIsSubmitting(false);
        return false;
      });
  };

  const [roleData, setRoleData] = useState([]);
  async function fetchRoleData() {
    return Employeeapi.get("get-roles", {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${access_token}`
      },
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          return false;
        }
        setRoleData(data?.roledata || []);
        return false;
      })
      .catch((error) => {
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
      });
  }

  useEffect(() => {
    async function loadData() {
      setIsFetching(true);
      try {
        await Promise.all([fetchRoleData(), fetchCountryCodes(), fetchReportingData()]);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, []);

  const [reportingData, setReportingData] = useState([]);
  async function fetchReportingData() {
    return Employeeapi.get("get-reporting-heads", {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${access_token}`
      },
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          return false;
        }
        setReportingData(data?.reporting_heads || []);
        return false;
      })
      .catch((error) => {
        console.log("Error:", error);
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
        return false;
      });
  }

  return (
    <div className="relative">
      <Card
        padding="0"
        margin="0"
        className="w-[100%] max-sm:w-[100%] max-sm:rounded-none max-sm:!border-0 max-sm:shadow-none"
      >
        <Card.Section className="!px-4">
          <div className="flex justify-between items-center">
            <p className="text-[#0083bf] text-xl md:text-xl max-sm:text-[17px]">
              Add Employee
            </p>
            {/* <Button
              variant="default"
              onClick={closeAddnewmodal}
              className="!px-0 focus:outline-none border-none "
            >
              <IconX size={20} color="#0083bf" />
            </Button> */}
          </div>
        </Card.Section>
        <Card.Section className="!px-4 !border-b-1 ">
          {isFetching ? (
            <div className="grid grid-cols-2 gap-4 w-full py-2">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[25%]" />
                  <Skeleton className="h-10 w-[75%]" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full py-2">
              <div className="flex flex-col gap-1">
                <label className="mb-[6px] text-sm font-medium font-sans">Name</label>
                <Input
                  placeholder="Enter Name"
                  value={name}
                  onChange={upateName}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {nameError && <p className="text-xs text-red-600">{nameError}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="mb-[6px] text-sm font-medium font-sans">Email Address</label>
                <Input
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={upateEmail}
                  className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {emailError && <p className="text-xs text-red-600">{emailError}</p>}
              </div>
              <div className="w-[100%]">
                <label className="block  text-sm font-medium font-sans pb-1">
                  Phone Number
                </label>
                <div className="flex flex-row gap-x-2 w-full mt-1">
                  <div className="w-[25%]">
                    <Select value={phoneCode} onValueChange={updatePhoneCode}>
                      <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {countryCodes.map((item, index) => (
                          <SelectItem key={index} value={item.value || item.dial_code || item}>
                            {item.label || item.dial_code || item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-[75%]">
                    <Input
                      placeholder="Enter Phone Number"
                      value={phone}
                      onChange={upatePhone}
                      className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
                {phoneError !== "" && (
                  <p className="mt-2 text-xs text-red-600">{phoneError}</p>
                )}
              </div>
              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <label className="mb-[6px] font-medium font-sans text-[#000] text-sm">Gender</label>
                  <Select value={gender} onValueChange={updateGender}>
                    <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!gender ? 'text-gray-400' : ''} ${genderError ? 'border-red-500' : 'border-gray-300'}`}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {genderError && <p className="text-xs text-red-600">{genderError}</p>}
                </div>
              </div>
              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <label className="mb-[6px] text-sm font-medium font-sans">Role</label>
                  <Select value={role} onValueChange={updateRole}>
                    <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!role ? 'text-gray-400' : ''} ${roleError ? 'border-red-500' : 'border-gray-300'}`}>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {roleData.map((item, index) => (
                        <SelectItem key={index} value={item.value || item.id?.toString() || item}>
                          {item.label || item.name || item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {roleError && <p className="text-xs text-red-600">{roleError}</p>}
                </div>
              </div>
              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <label className="mb-[6px] font-medium font-sans text-[#000] text-sm">Reporting Head</label>
                  <Select value={reportinghead} onValueChange={updateReportinghead}>
                    <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!reportinghead ? 'text-gray-400' : ''} ${reportingheadError ? 'border-red-500' : 'border-gray-300'}`}>
                      <SelectValue placeholder="Select Reporting Head" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {reportingData.map((item, index) => (
                        <SelectItem key={index} value={item.value || item.id?.toString() || item}>
                          {item.label || item.name || item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {reportingheadError && <p className="text-xs text-red-600">{reportingheadError}</p>}
                </div>
              </div>

              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium font-sans">Password</label>
                  <div className="relative">
                    <Input
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={upatePassword}
                      className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${passwordError ? 'border-red-500 pr-10' : 'border-gray-300 pr-10'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
                </div>
              </div>
              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium font-sans">Re-enter Password</label>
                  <div className="relative">
                    <Input
                      placeholder="Re-enter Password"
                      type={showRepassword ? "text" : "password"}
                      value={repassword}
                      onChange={upateRepassword}
                      className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${repasswordError ? 'border-red-500 pr-10' : 'border-gray-300 pr-10'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepassword(!showRepassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRepassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {repasswordError && <p className="text-xs text-red-600">{repasswordError}</p>}
                </div>
              </div>
            </div>
          )}
          {/* {isLoadingEffect && (
            <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
              <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
            </div>
          )} */}
          {errorMessage !== null && (
            <Errorpanel
              errorMessages={errorMessage}
              setErrorMessages={setErrorMessage}
            />
          )}
        </Card.Section>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isFetching}
          className="cursor-pointer !flex justify-end !p-4 !m-4 !ml-auto !text-[14px] !bg-[#0083bf] !text-white !py-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : "Submit"}
        </Button>
      </Card>
    </div>
  );
}

export default AddnewEmployee;
