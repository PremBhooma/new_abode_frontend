import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { toast } from 'react-toastify';
import Generalapi from '../../api/Generalapi';
import { IconPlus } from '@tabler/icons-react';

const Addbank = ({ refreshBanks }) => {
    const [bankName, setBankName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bankName.trim()) {
            toast.error("Bank name is required");
            return;
        }

        setIsLoading(true);
        try {
            const response = await Generalapi.post("add-bank", { name: bankName });
            if (response.data.status === "success") {
                toast.success("Bank added successfully");
                setBankName("");
                refreshBanks();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding bank:", error);
            toast.error("Failed to add bank");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-md border border-[#ebecef] flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Add Bank</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Bank Name</label>
                    <Input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter bank name"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#0083bf] hover:bg-[#006e9f] text-white"
                >
                    {isLoading ? "Adding..." : <><IconPlus size={18} className="mr-2" /> Add Bank</>}
                </Button>
            </form>
        </div>
    );
};

export default Addbank;
