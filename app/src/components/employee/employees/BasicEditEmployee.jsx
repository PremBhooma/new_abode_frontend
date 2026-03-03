import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import Generalapi from "../../api/Generalapi";
// import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import { toast } from "react-toastify";

function BasicEditEmployee({
  closeEditEmployeemodal,
  singleuserId,
  userRole,
  refreshUserData,
  setRefreshStatus,
}) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const updateName = (e) => {
    const value = e.target.value;
    const formattedName = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setName(formattedName);
    setNameError("");
  };

  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("91");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const updatePhoneCode = (value) => {
    setPhoneCode(value);
    setPhoneError("");
  };

  const updatePhone = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (phoneCode === "91") {
      value = value.slice(0, 10);
    }
    setPhone(value);
    setPhoneError("");
  };

  const [gender, setGender] = useState("");
  const updateGender = (value) => {
    setGender(value);
  };
  const [role, setRole] = useState(null);
  const [reportinghead, setReportinghead] = useState(null);

  const [rolesdata, setRolesdata] = useState([]);
  const [reportingData, setreportingData] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (name === "") {
      setNameError("Name is required");
      setIsSubmitting(false);
      return false;
    }

    if (phone === "") {
      setPhoneError("Phone number is required");
      setIsSubmitting(false);
      return false;
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }

    if (!gender) {
      toast.error("Please select a gender");
      setIsSubmitting(false);
      return;
    }

    Employeeapi.post(
      "update-employee",
      {
        name: name,
        phone_code: phoneCode,
        phone_number: phone,
        gender: gender,
        email: email,
        role_id: role,
        reporting_head_id: reportinghead,
        singleuser_id: singleuserId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          setErrorMessage({ message: data.message, server_res: data });
          setIsSubmitting(false);
          return false;
        }
        toast.success("Employee details updated successfully");
        setIsSubmitting(false);
        closeEditEmployeemodal();
        if (refreshUserData) refreshUserData();
        if (setRefreshStatus) setRefreshStatus(true);
      })
      .catch((error) => {
        setErrorMessage({
          message: error.message,
          server_res: error.response?.data || null,
        });
        setIsSubmitting(false);
      });
  };

  async function fetchData() {
    setIsFetching(true);
    try {
      const [rolesRes, reportingRes, countryRes, singleRes] = await Promise.all([
        Employeeapi.get("get-roles"),
        Employeeapi.get("get-reporting-heads"),
        Generalapi.get("/getcountries"),
        Employeeapi.get("get-single-employee-data", {
          params: { single_user_id: singleuserId },
        }),
      ]);

      setRolesdata(rolesRes.data?.roledata || []);
      setreportingData(reportingRes.data?.reporting_heads || []);
      setCountryCodes(countryRes.data?.countrydata || []);

      const emp = singleRes.data?.employee_data;
      if (emp) {
        setName(emp.name || "");
        setEmail(emp.email || "");
        setPhoneCode(`${emp.phone_code || "91"}`);
        setPhone(emp.phone || "");
        setGender(emp.gender || "");
        setRole(emp.role_id?.toString() || "");
        setReportinghead(emp.reporting_head_id?.toString() || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage({ message: "Failed to load employee data", server_res: null });
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    if (singleuserId) fetchData();
  }, [singleuserId]);

  return (
    <div className="space-y-6 pt-2">
      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name - Editable */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter Name"
              value={name}
              onChange={updateName}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-xs text-red-500 font-medium">{nameError}</p>}
          </div>

          {/* Email - Disabled */}
          <div className="space-y-2">
            <Label htmlFor="email" className="opacity-70">Email Address (Read-only)</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Phone Number - Editable */}
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="flex gap-2">
              <div className="w-[100px]">
                <Select value={phoneCode} onValueChange={updatePhoneCode}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {countryCodes.map((country, index) => (
                      <SelectItem key={`${country.value}-${index}`} value={country.value.toString()}>
                        +{country.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={updatePhone}
                  className={phoneError ? "border-red-500" : ""}
                />
              </div>
            </div>
            {phoneError && <p className="text-xs text-red-500 font-medium">{phoneError}</p>}
          </div>

          {/* Gender - Editable */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={updateGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role - Disabled */}
          <div className="space-y-2">
            <Label className="opacity-70">Role (Read-only)</Label>
            <Select value={role} disabled>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {rolesdata.map((r, index) => (
                  <SelectItem key={`${r.value}-${index}`} value={r.value.toString()}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reporting Head - Disabled */}
          <div className="space-y-2">
            <Label className="opacity-70">Reporting Manager (Read-only)</Label>
            <Select value={reportinghead} disabled>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent>
                {reportingData.map((h, index) => (
                  <SelectItem key={`${h.value}-${index}`} value={h.value.toString()}>
                    {h.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={closeEditEmployeemodal}
          disabled={isSubmitting || isFetching}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isFetching}
          className="bg-[#0083bf] hover:bg-[#0083bf]/90 text-white min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {errorMessage !== "" && (
        <div className="mt-4">
          <Errorpanel
            errorMessages={errorMessage}
            setErrorMessages={setErrorMessage}
          />
        </div>
      )}
    </div>
  );
}

export default BasicEditEmployee;
