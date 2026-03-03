import React, { useState } from "react";
import Employeeapi from "../../api/Employeeapi";
import { toast } from "react-toastify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";

function Addnewform({ reloadGetroledata }) {
  const userInfo = useEmployeeDetails((state) => state.employeeInfo);
  const access_token = useEmployeeDetails((state) => state.access_token);
  let user_id = userInfo?.user_id || "";

  const [roleName, setRoleName] = useState("");
  const [roleNameError, setRoleNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateRoleName = (e) => {
    let value = e.target.value;
    // Split by space, capitalize each word
    const formatted = value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    setRoleName(formatted);
    setRoleNameError("");
  };

  const submiteRoleName = async () => {
    setIsLoading(true);

    if (!roleName.trim()) {
      setRoleNameError("Role Name is required");
      setIsLoading(false);
      return;
    }

    if (["super admin", "superadmin"].includes(roleName.toLowerCase())) {
      setRoleNameError("Role Name is already taken");
      setIsLoading(false);
      return;
    }

    if (roleName === "") {
      setRoleNameError("Role is required");
      setIsLoading(false);
      return false;
    }

    await Employeeapi.post(
      "addnewrole",
      {
        role_name: roleName,
        user_id: user_id,
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => {
        let data = response?.data;
        if (data.status === "error") {
          setIsLoading(false);
          return false;
        }
        if (data?.status === "success") {
          toast.success(data?.message);
          setRoleName("");
          setIsLoading(false);
          reloadGetroledata();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col gap-5 border border-neutral-200 rounded-md bg-white p-4">
      <div className="flex items-center gap-2">
        {/* Optional Icon if needed, but keeping it clean for now */}
        <p className="text-neutral-900 text-lg font-semibold">
          Add Role
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Role Name</label>
        <input
          type="text"
          placeholder="Enter Role Name"
          name="rolename"
          value={roleName}
          onChange={updateRoleName}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 outline-none
            ${roleNameError
              ? "border-red-500 focus:ring-red-100 placeholder-red-300"
              : "border-neutral-300 focus:border-[#0083bf] placeholder-neutral-400"
            }`}
        />
        {roleNameError && (
          <p className="text-red-500 text-xs font-medium mt-1">{roleNameError}</p>
        )}
      </div>

      <button
        onClick={submiteRoleName}
        disabled={isLoading}
        className="cursor-pointer flex justify-center w-full items-center gap-2 px-4 py-2 rounded-md bg-white border border-[#0083bf] text-[#0083bf] hover:bg-[#0083bf] hover:text-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
      >
        <p className="text-sm font-semibold">{isLoading ? 'Adding...' : 'Submit'}</p>
      </button>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-md z-10">
          <div className="w-6 h-6 border-2 border-[#0083bf] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default Addnewform;
