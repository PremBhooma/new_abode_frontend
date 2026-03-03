// import { useUserDetails } from '@/components/zustand/useUserDetails';
import {
  Button,
  Card,
  Loader,
} from "@nayeshdaggula/tailify";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import Generalapi from "../../api/Generalapi";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import { toast } from "react-toastify";

// import { toast } from 'react-toastify';

function EditEmployee({
  closeEditEmployeemodal,
  singleuserId,
  userRole,
  refreshUserData,
  setRefreshStatus,
}) {
  const userInfo = useEmployeeDetails((state) => state.user_info);
  const access_token = useEmployeeDetails((state) => state.access_token);
  // let user_id = userInfo?.user_id || null;

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const upateName = (e) => {
    const value = e.target.value;
    const formattedName = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setName(formattedName);
    setNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const upateEmail = (e) => {
    let value = e.target.value;
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

    // remove non-digit characters
    value = value.replace(/\D/g, "");

    // if phoneCode is India (+91), restrict to 10 digits
    if (phoneCode === "91") {
      value = value.slice(0, 10);
    }
    setPhone(value);
    setPhoneError("");
  };

  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const updateGender = (value) => {
    setGender(value);
    setGenderError("");
  };

  const [role, setRole] = useState(null);
  const [roleError, setRoleError] = useState("");
  const updateRole = (value) => {
    setRole(value);
    setRoleError("");
  };

  const [reportinghead, setReportinghead] = useState(null);
  const [reportingheadError, setReportingheadError] = useState("");
  const updateReportinghead = (value) => {
    setReportinghead(value);
    setReportingheadError("");
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const handleSubmit = () => {
    setIsSubmitting(true);
    if (name === "") {
      setName("First Name is required");
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

    Employeeapi.post(
      "update-employee",
      {
        name: name,
        email: email,
        phone_code: phoneCode,
        phone_number: phone,
        gender: gender,
        role_id: role,
        reporting_head_id: reportinghead,
        // user_id: user_id,
        singleuser_id: singleuserId,
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
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsSubmitting(false);
        closeEditEmployeemodal();
        refreshUserData();
        setRefreshStatus(true);
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

  const [rolesdata, setRolesdata] = useState([]);
  async function getRoles() {
    return Employeeapi.get("get-roles", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          return false;
        }
        setRolesdata(data?.roledata || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [reportingData, setreportingData] = useState([]);
  async function getReportinghead() {
    return Employeeapi.get("get-reporting-heads", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          return false;
        }
        setreportingData(data?.reporting_heads || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [countryCodes, setCountryCodes] = useState([]);
  async function fetchCountryCodes() {
    return Generalapi.get("/getcountries")
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          return false;
        }

        setCountryCodes(data.countrydata);
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

  async function getSingleEmployeeData(singleUserid) {
    return Employeeapi.get("get-single-employee-data", {
      params: {
        // user_id: user_id,
        single_user_id: singleUserid,
      },
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${access_token}`
      },
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          return false;
        }
        if (data !== null) {
          setName(data?.employee_data?.name || "");
          setEmail(data?.employee_data?.email || "");
          setPhoneCode(`${data?.employee_data?.phone_code || "91"}`);
          setPhone(data?.employee_data?.phone || "");
          setGender(`${data?.employee_data?.gender || ""}`);
          setRole(`${data?.employee_data?.role_id || ""}`);
          if (data?.employee_data?.reporting_head_id === null) {
            setReportinghead("");
          } else {
            setReportinghead(`${data?.employee_data?.reporting_head_id || ""}`);
          }
        }
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
        setErrorMessage(finalresponse);
        return false;
      });
  }

  useEffect(() => {
    async function loadData() {
      setIsFetching(true);
      try {
        await Promise.all([getRoles(), getReportinghead(), fetchCountryCodes()]);
        if (singleuserId) await getSingleEmployeeData(singleuserId);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, [singleuserId]);

  return (
    <div className="relative">
      <Card
        padding="0"
        margin="0"
        className="w-[100%] max-sm:w-[100%] max-sm:rounded-none max-sm:!border-0 max-sm:shadow-none"
      >
        <Card.Section className="!px-4">
          <div className="flex justify-between items-center">
            <p className="text-[#0083bf] text-[17px] max-sm:text-[17px] md:text-xl">
              Update Employee
            </p>
          </div>
        </Card.Section>
        <Card.Section className="!px-4 !border-b-1 ">
          {isFetching ? (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="w-[100%]">
                <Skeleton className="h-4 w-20 mb-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="w-[100%]">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium font-sans">Name</label>
                  <Input
                    placeholder="Enter Name"
                    value={name}
                    onChange={upateName}
                    className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {nameError && <p className="text-xs text-red-600">{nameError}</p>}
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium font-sans">Email Address</label>
                  <Input
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={upateEmail}
                    className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {emailError && <p className="text-xs text-red-600">{emailError}</p>}
                </div>
              </div>
              <div className="w-[100%]">
                <label className="block  text-sm font-medium font-sans pb-1">
                  Phone Number
                </label>
                <div className="flex flex-row gap-x-2 w-full mt-1">
                  <div className="w-[100px]">
                    <Select value={phoneCode || "91"} onValueChange={updatePhoneCode}>
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
                  <div className="w-full">
                    <Input
                      placeholder="Enter Phone Number"
                      type="number"
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
                  <label className="text-sm font-medium font-sans">Gender</label>
                  <Select value={gender || undefined} onValueChange={updateGender}>
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
              {userRole !== "Super Admin" && (
                <>
                  <div className="w-[100%]">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium font-sans">Role</label>
                      <Select value={role || undefined} onValueChange={updateRole}>
                        <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!role ? 'text-gray-400' : ''} ${roleError ? 'border-red-500' : 'border-gray-300'}`}>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {rolesdata.map((item, index) => (
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
                      <label className="text-sm font-medium font-sans">Reporting Head</label>
                      <Select value={reportinghead || undefined} onValueChange={updateReportinghead}>
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
                </>
              )}
            </div>
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
      {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
    </div>
  );
}

export default EditEmployee;
