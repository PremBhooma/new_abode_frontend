import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import { toast } from "react-toastify";

function Changepassword({ singleUserid }) {
    const [newpassword, setNewPassword] = useState("");
    const [newpassworderror, setNewpassworderror] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);

    const updateNewPassword = (e) => {
        setNewPassword(e.target.value);
        setNewpassworderror("");
    };

    const [confirmpassword, setConfirmpassword] = useState("");
    const [confirmpassworderror, setConfirmpassworderror] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const updateConfirmPassword = (e) => {
        setConfirmpassword(e.target.value);
        setConfirmpassworderror("");
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitpassword = () => {
        setIsSubmitting(true);

        if (!newpassword) {
            setNewpassworderror("New Password is required");
            setIsSubmitting(false);
            return;
        }

        if (newpassword !== confirmpassword) {
            setConfirmpassworderror("Password does not match");
            setIsSubmitting(false);
            return;
        }

        Employeeapi.post(
            "/update-user-password",
            {
                singleuser_password: newpassword,
                singleuser_id: singleUserid,
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
                    setErrorMessage(data.message);
                    setIsSubmitting(false);
                    return;
                }
                setConfirmpassword("");
                setNewPassword("");
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                toast.success("Updated password successfully");
                setIsSubmitting(false);
            })
            .catch((error) => {
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
            });
    };

    return (
        <div className="p-4 space-y-6 relative">
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                    <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                        value={newpassword}
                        onChange={updateNewPassword}
                        className={newpassworderror ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {newpassworderror && <p className="text-xs text-red-500 font-medium">{newpassworderror}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                    <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={confirmpassword}
                        onChange={updateConfirmPassword}
                        className={confirmpassworderror ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {confirmpassworderror && <p className="text-xs text-red-500 font-medium">{confirmpassworderror}</p>}
            </div>

            <div className="flex justify-end pt-2">
                <Button
                    onClick={submitpassword}
                    disabled={isSubmitting}
                    className="bg-[#0083bf] hover:bg-[#0083bf]/90 text-white min-w-[140px]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Change Password"
                    )}
                </Button>
            </div>

            {errorMessage !== "" && (
                <div className="mt-4">
                    <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
                </div>
            )}
        </div>
    );
}

export default Changepassword;
