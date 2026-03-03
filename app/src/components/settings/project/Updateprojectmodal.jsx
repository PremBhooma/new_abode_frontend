import React, { useEffect, useState } from 'react'
import Projectapi from '../../api/Projectapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';
import { toast } from 'react-toastify';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Loader2 } from "lucide-react";
import {
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../ui/dialog";

function Updateprojectmodal({ closeUpdateProjectModal, projectData, refreshProject, isEdit }) {

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectNameError, setProjectNameError] = useState('')

    const [projectAddress, setProjectAddress] = useState('');
    const [projectAddressError, setProjectAddressError] = useState('')

    const [projectCornerPrice, setProjectCornerPrice] = useState('');
    const [projectEastPrice, setProjectEastPrice] = useState('');
    const [projectSixFloorPrice, setProjectSixFloorPrice] = useState('');
    const [projectRewards, setProjectRewards] = useState(false);


    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (projectName === '') {
            setIsLoadingEffect(false);
            setProjectNameError('Enter project name');
            return false;
        }
        // if (projectAddress === '') {
        //     setIsLoadingEffect(false);
        //     setProjectAddressError('Enter project address');
        //     return false;
        // }

        const apiEndpoint = isEdit ? 'update-project' : 'add-project';
        const payload = {
            project_name: projectName,
            project_address: projectAddress,
            project_corner_price: projectCornerPrice,
            project_east_price: projectEastPrice,
            project_six_floor_onwards_price: projectSixFloorPrice,
            project_rewards: projectRewards,
            ...(isEdit && { uuid: projectData?.uuid }),
        };

        Projectapi.post(apiEndpoint, payload)
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    toast.error(data.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success(isEdit ? "Project information Updated Successfully" : "Project Created Successfully");
                setIsLoadingEffect(false);
                refreshProject();
                closeUpdateProjectModal();
                return false;
            })
            .catch((error) => {
                setErrorMessage(error);
                setIsLoadingEffect(false);
                return false;
            });
    }

    useEffect(() => {
        if (isEdit && projectData) {
            setProjectName(projectData.project_name || '');
            setProjectAddress(projectData.project_address || '');
            setProjectCornerPrice(projectData.project_corner_price || '');
            setProjectEastPrice(projectData.project_east_price || '');
            setProjectSixFloorPrice(projectData.project_six_floor_onwards_price || '');
            setProjectRewards(projectData.project_rewards || false);
        } else {
            setProjectName('');
            setProjectAddress('');
            setProjectCornerPrice('');
            setProjectEastPrice('');
            setProjectSixFloorPrice('');
            setProjectRewards(false);
        }
    }, [projectData, isEdit])

    return (
        <div className="w-full h-full flex flex-col">
            <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle>
                    {isEdit ? "Update Information" : "Add New Project"}
                </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="projectName" className="font-semibold">Project Name</Label>
                    <Input
                        id="projectName"
                        placeholder="Enter Project Name"
                        value={projectName}
                        onChange={(e) => {
                            setProjectName(e.target.value);
                            setProjectNameError('');
                        }}
                        className={`bg-white ${projectNameError ? 'border-red-500' : ''}`}
                    />
                    {projectNameError && <p className="text-sm text-red-500">{projectNameError}</p>}
                </div>

                {/* <div className="grid gap-2">
                    <Label htmlFor="projectAddress" className="font-semibold">Project Address</Label>
                    <Input
                        id="projectAddress"
                        placeholder="Enter project address"
                        value={projectAddress}
                        onChange={(e) => {
                            setProjectAddress(e.target.value);
                            setProjectAddressError('');
                        }}
                        className={`bg-white ${projectAddressError ? 'border-red-500' : ''}`}
                    />
                    {projectAddressError && <p className="text-sm text-red-500">{projectAddressError}</p>}
                </div> */}

                <div className="grid gap-2">
                    <Label htmlFor="projectCornerPrice" className="font-semibold">Project Corner Price</Label>
                    <Input
                        id="projectCornerPrice"
                        type="number"
                        placeholder="Enter Corner Price"
                        value={projectCornerPrice}
                        onChange={(e) => setProjectCornerPrice(e.target.value)}
                        className="bg-white"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="projectEastPrice" className="font-semibold">Project East Price</Label>
                    <Input
                        id="projectEastPrice"
                        type="number"
                        placeholder="Enter East Price"
                        value={projectEastPrice}
                        onChange={(e) => setProjectEastPrice(e.target.value)}
                        className="bg-white"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="projectSixFloorPrice" className="font-semibold">Six Floor Onwards Price</Label>
                    <Input
                        id="projectSixFloorPrice"
                        type="number"
                        placeholder="Enter Six Floor Onwards Price"
                        value={projectSixFloorPrice}
                        onChange={(e) => setProjectSixFloorPrice(e.target.value)}
                        className="bg-white"
                    />
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <input
                        id="projectRewardsUpdate"
                        type="checkbox"
                        className="w-4 h-4 text-[#0083bf] border-gray-300 rounded focus:ring-[#0083bf] cursor-pointer"
                        checked={projectRewards}
                        onChange={(e) => setProjectRewards(e.target.checked)}
                    />
                    <Label htmlFor="projectRewardsUpdate" className="font-semibold cursor-pointer">Project Rewards</Label>
                </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t mt-auto">
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" onClick={closeUpdateProjectModal}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoadingEffect}
                        className="bg-[#0083bf] hover:bg-[#0083bf]/90 text-white min-w-[100px]"
                    >
                        {isLoadingEffect ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
                    </Button>
                </div>
            </DialogFooter>

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
    )
}

export default Updateprojectmodal