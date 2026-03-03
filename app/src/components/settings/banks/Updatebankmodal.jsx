import React, { useState, useEffect } from 'react';
import { DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { toast } from 'react-toastify';
import Generalapi from '../../api/Generalapi';

const Updatebankmodal = ({ closeUpdateBankModal, bankData, refreshBanks }) => {
    const [bankName, setBankName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (bankData) {
            setBankName(bankData.name);
        }
    }, [bankData]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!bankName.trim()) {
            toast.error("Bank name is required");
            return;
        }

        setIsLoading(true);
        try {
            const response = await Generalapi.post("update-bank", {
                id: bankData.id,
                name: bankName
            });
            if (response.data.status === "success") {
                toast.success("Bank updated successfully");
                refreshBanks();
                closeUpdateBankModal();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating bank:", error);
            toast.error("Failed to update bank");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <DialogHeader>
                <DialogTitle>Update Bank</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Bank Name</label>
                    <Input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter bank name"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeUpdateBankModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#0083bf] hover:bg-[#006e9f] text-white"
                    >
                        {isLoading ? "Updating..." : "Update Bank"}
                    </Button>
                </DialogFooter>
            </form>
        </div>
    );
};

export default Updatebankmodal;
