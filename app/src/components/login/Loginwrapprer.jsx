import React, { useEffect } from 'react'
import Authapi from '../api/Authapi';
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import { useEmployeeDetails } from "../zustand/useEmployeeDetails"
import { Button, Loadingoverlay, Passwordinput, Textinput } from "@nayeshdaggula/tailify";
import Errorpanel from '../shared/Errorpanel'
function Loginwrapprer() {
  const updateEmployeeAuthDetails = useEmployeeDetails((state) => state.updateEmployeeAuthDetails);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);


  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const updateEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  }

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const updatePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  }

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }


  const Loginaccess = async (e) => {
    e.preventDefault();
    setIsLoadingEffect(true);
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      setIsLoadingEffect(false);
      return;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setIsLoadingEffect(false);
      return;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      setIsLoadingEffect(false);
      return;
    }

    await Authapi.post("admin/login", {
      email: email.trim(),
      password: password.trim(),
    })
      .then((response) => {
        let data = response?.data;

        if (data?.status === "error") {
          setErrorMessage({
            message: data?.message,
          });
          setIsLoadingEffect(false);
          return false;
        }

        setErrorMessage('');
        setIsLoadingEffect(false);

        const responseData = response?.data;
        updateEmployeeAuthDetails(responseData?.employeeData, responseData?.access_token, responseData?.permissions);
        navigate("/dashboard");
        toast.success("Login Successfully")
      })
  }

  return (
    <div className="bg-white min-h-screen flex w-full">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="mb-10">
            <img
              crossOrigin="anonymous"
              src="./assets/logo.png"
              alt="Econest Logo"
              className="h-12 w-auto mb-4"
            />

            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Login To Your Account
            </h1>
            <p className="text-gray-500 text-base">
              Welcome! Please enter your details.
            </p>
          </div>

          <form className="space-y-6" onSubmit={Loginaccess}>
            <div className="space-y-5">
              <Textinput
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={updateEmail}
                inputClassName="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0083bf] focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-200 bg-white"
                labelClassName="text-sm font-semibold text-gray-700 mb-1.5 block"
                error={emailError}
              />

              <div className="space-y-1.5">
                <Passwordinput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={updatePassword}
                  inputClassName="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0083bf] focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-200 bg-white"
                  labelClassName="text-sm font-semibold text-gray-700 mb-1.5 block"
                  error={passwordError}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#0083bf] focus:ring-[#0083bf] border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                    Forgot password
                  </a>
                </div> */}
              </div>

              <Button
                type="submit"
                onClick={Loginaccess}
                className={`w-full bg-[#0083bf] hover:bg-[#006e9e] text-white py-3 rounded-lg text-base font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${isLoadingEffect ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                disabled={isLoadingEffect}
              >
                {isLoadingEffect ? "Signing In..." : "Log In"}
              </Button>
            </div>

            {/* <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-bold text-blue-600 hover:text-blue-500">
                Register
              </a>
            </div> */}

            {/* Footer Links */}
            {/* <div className="mt-8 pt-6 flex items-center justify-center space-x-6 text-xs text-gray-400">
              <span>Econest 2024</span>
              <span>•</span>
              <a href="#" className="hover:text-gray-600">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-600">Terms</a>
            </div> */}
          </form>

          {errorMessage && (
            <div className="mt-4">
              <Errorpanel
                errorMessages={errorMessage}
                setErrorMessages={setErrorMessage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image & Overlay */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply z-10" />
        <img
          src="/assets/auth_build.jpg"
          alt="Modern Architecture"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-start p-16 pt-32">
          <div className="max-w-xl">
            <h2 className="text-5xl font-extrabold text-white leading-[1.15] mb-6">
              Your Property, In Motion.<br />
              Your Reach, Expanded.
            </h2>
            <p className="text-xl text-blue-100 font-medium">
              The Real Estate Management Platform
            </p>
          </div>
        </div>
      </div>

      {isLoadingEffect && (
        <div className='fixed inset-0 w-full h-full bg-[#00000080] flex justify-center items-center z-[100]'>
          <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
        </div>
      )}
    </div>
  )
}

export default Loginwrapprer