import React, { useState } from 'react';
import Errorpanel from '../../components/shared/Errorpanel';
import { toast } from 'react-toastify';
import Customerapi from '../api/Customerapi';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Customertolead({ closeConvertModal, customerId, customerName, refreshCustomerList, open }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = () => {
        setIsLoadingEffect(true);

        Customerapi.post('convert-customer-to-lead', {
            customerId: customerId,
            employee_id: employeeInfo.id,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === "error") {
                    const finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success("Customer converted to lead successfully");
                setIsLoadingEffect(false);
                closeConvertModal();
                refreshCustomerList();
                return false;
            })
            .catch((error) => {
                console.log("error:", error);
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

    return (
        <Dialog open={open} onOpenChange={(val) => !val && closeConvertModal()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Convert to Lead</DialogTitle>
                    <DialogDescription className="pt-2 text-[15px] leading-relaxed text-blue-600">
                        Are you sure you want to convert <strong className="font-bold text-blue-800">{customerName}</strong> to a lead?
                        This will remove the customer record and create a new lead with their information.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6 flex flex-row justify-end space-x-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeConvertModal}
                        disabled={isLoadingEffect}
                        className="px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoadingEffect}
                        className="px-6 bg-[#0083bf] hover:bg-[#0083bf]/90 text-white font-medium"
                    >
                        {isLoadingEffect ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Converting...
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </Button>
                </DialogFooter>
                {errorMessage && (
                    <div className="mt-4">
                        <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default Customertolead;
