import React, { useRef, useEffect, useState } from "react";
import Navbar from "../../components/header/Navbar.jsx";
import Customernavbar from "../../components/header/Customernavbar.jsx";
import Customersteptwo from "../../components/customer/Customersteptwo.jsx";
import Customerstepone from "../../components/customer/Customerstepone.jsx";
import { toast } from "react-toastify";
import { Button } from "@nayeshdaggula/tailify";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Onboarding() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);

  const customerStepOneRef = useRef();
  const [customerUuid, setCustomerUuid] = useState(null);

  const totalSteps = 2;

  useEffect(() => {
    const stepParam = parseInt(searchParams.get("step"));
    const uuidParam = searchParams.get("uuid");

    if (stepParam && stepParam >= 1 && stepParam <= totalSteps) {
      setCurrentStep(stepParam);
    } else {
      setCurrentStep(1); // fallback to default
    }

    if (uuidParam) {
      setCustomerUuid(uuidParam);
    }
  }, [searchParams]);

  const handleNext = async () => {
    if (currentStep === 1) {
      const result = await customerStepOneRef.current?.validateAndSubmit();

      if (!result?.success) return;

      setCustomerUuid(result.uuid);

      setCurrentStep(currentStep + 1);
      navigate(`/customers/onboarding?step=2&uuid=${result.uuid}`, { replace: true });
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      navigate(`/customers/onboarding?step=${currentStep + 1}&uuid=${customerUuid}`, { replace: true });
    }
  };

  const handleCreateCustomer = async () => {
    if (currentStep === 1) {
      const result = await customerStepOneRef.current?.validateAndSubmit();

      if (!result?.success) return;
      navigate(`/customers`, { replace: true });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      navigate(`/customers/onboarding?step=${currentStep - 1}&uuid=${customerUuid}`, {
        replace: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (currentStep === 2) {
      const result = await customerStepOneRef.current?.validateAndSubmit();

      if (!result) return;
      toast.success("Customer added successfully");
      navigate("/customers");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl text-center font-medium text-gray-800">Customer Information</h2>
            <Customerstepone ref={customerStepOneRef} />
          </>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl text-center font-medium text-gray-800">Flat Information.</h2>
            <Customersteptwo ref={customerStepOneRef} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className='flex justify-between items-center'>
        <h1 className="text-[20px] font-semibold">Customer Onboarding</h1>
        <Link
          to={"/customers"}
          className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-2 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
        >
          <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
          Back
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#ebecef] p-8">
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep ? "bg-[#0083bf] text-white" : step < currentStep ? "bg-[#0083bf] text-white" : "bg-gray-200 text-gray-600"}`}>{step}</div>
              {index < 1 && <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? "bg-[#0083bf]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="px-6 bg-transparent !text-[#0083bf]"
              >
                PREVIOUS
              </Button>
            )}
            <div className="ml-auto">
              {currentStep < totalSteps ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleCreateCustomer}
                    className="!bg-gray-200 hover:!bg-gray-300 !text-black px-8"
                  >
                    Just Create Customer
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="!bg-[#0083bf] hover:!bg-[#0083bf]/90  !text-white px-8"
                  >
                    Create Customer & Add Flat Details
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="!bg-[#0083bf] hover:!bg-[#0083bf]/90 text-white px-8"
                >
                  SUBMIT
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
