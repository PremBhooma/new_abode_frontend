import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Projectapi from '../../api/Projectapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";

function Addproject({ refreshProject }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectNameError, setProjectNameError] = useState('');

    const [projectAddress, setProjectAddress] = useState('');
    const [projectAddressError, setProjectAddressError] = useState('');

    const [projectCornerPrice, setProjectCornerPrice] = useState('');
    const [projectEastPrice, setProjectEastPrice] = useState('');
    const [projectSixFloorPrice, setProjectSixFloorPrice] = useState('');
    const [projectRewards, setProjectRewards] = useState(false);


    const handleSubmit = async () => {
        let hasError = false;
        if (!projectName) {
            setProjectNameError("Enter project name");
            hasError = true;
        }
        // if (!projectAddress) {
        //     setProjectAddressError("Enter project address");
        //     hasError = true;
        // }
        if (hasError) return;

        setIsLoading(true);
        Projectapi.post('/add-project', {
            project_name: projectName,
            project_address: projectAddress,
            project_corner_price: projectCornerPrice,
            project_east_price: projectEastPrice,
            project_six_floor_onwards_price: projectSixFloorPrice,
            project_rewards: projectRewards
        })
            .then((res) => {
                let data = res.data;
                if (data.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                } else {
                    toast.success("Project created successfully");
                    setProjectName('');
                    setProjectAddress('');
                    setProjectCornerPrice('');
                    setProjectEastPrice('');
                    setProjectSixFloorPrice('');
                    setProjectRewards(false);
                    refreshProject();
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error adding project:", error);
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null
                });
                setIsLoading(false);
            });
    }

    return (
        <div className="px-3 rounded-md bg-transparent border border-[#ebecef] relative">
            <div className="py-2">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">Add Project</Label>
                        <Input
                            id="projectName"
                            placeholder="Enter Project Name"
                            className={`bg-white border-gray-300 focus:border-black rounded-[4px] focus-visible:ring-0 ${projectNameError ? 'border-red-500' : ''}`}
                            value={projectName}
                            onChange={(e) => {
                                setProjectName(e.target.value);
                                setProjectNameError('');
                            }}
                        />
                        {projectNameError && <p className="text-xs text-red-500">{projectNameError}</p>}
                    </div>

                    {/* <div className="flex flex-col gap-2">
                        <Label htmlFor="projectAddress" className="text-sm font-medium text-gray-700">Project Address</Label>
                        <Input
                            id="projectAddress"
                            placeholder="Enter Project Address"
                            className={`bg-white border-gray-300 focus:border-black rounded-[4px] focus-visible:ring-0 ${projectAddressError ? 'border-red-500' : ''}`}
                            value={projectAddress}
                            onChange={(e) => {
                                setProjectAddress(e.target.value);
                                setProjectAddressError('');
                            }}
                        />
                        {projectAddressError && <p className="text-xs text-red-500">{projectAddressError}</p>}
                    </div> */}

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="projectCornerPrice" className="text-sm font-medium text-gray-700">Project Corner Price</Label>
                        <Input
                            id="projectCornerPrice"
                            type="number"
                            placeholder="Enter Corner Price"
                            className="bg-white border-gray-300 focus:border-black rounded-[4px] focus-visible:ring-0"
                            value={projectCornerPrice}
                            onChange={(e) => setProjectCornerPrice(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="projectEastPrice" className="text-sm font-medium text-gray-700">Project East Price</Label>
                        <Input
                            id="projectEastPrice"
                            type="number"
                            placeholder="Enter East Price"
                            className="bg-white border-gray-300 focus:border-black rounded-[4px] focus-visible:ring-0"
                            value={projectEastPrice}
                            onChange={(e) => setProjectEastPrice(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="projectSixFloorPrice" className="text-sm font-medium text-gray-700">Six Floor Onwards Price</Label>
                        <Input
                            id="projectSixFloorPrice"
                            type="number"
                            placeholder="Enter Six Floor Onwards Price"
                            className="bg-white border-gray-300 focus:border-black rounded-[4px] focus-visible:ring-0"
                            value={projectSixFloorPrice}
                            onChange={(e) => setProjectSixFloorPrice(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            id="projectRewards"
                            type="checkbox"
                            className="w-4 h-4 text-[#0083bf] border-gray-300 rounded focus:ring-[#0083bf] cursor-pointer"
                            checked={projectRewards}
                            onChange={(e) => setProjectRewards(e.target.checked)}
                        />
                        <Label htmlFor="projectRewards" className="text-sm font-medium text-gray-700 cursor-pointer">Project Rewards</Label>
                    </div>
                </div>
            </div>

            <div className="py-2 mt-2">
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-[#0083bf] hover:bg-[#0083bf]/90 text-white"
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
                </Button>
            </div>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

        </div>
    );
}

export default Addproject;