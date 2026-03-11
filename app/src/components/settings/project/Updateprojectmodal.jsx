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
    const [projectCornerPriceError, setProjectCornerPriceError] = useState('');
    const [projectEastPrice, setProjectEastPrice] = useState('');
    const [projectEastPriceError, setProjectEastPriceError] = useState('');
    const [projectSixFloorPrice, setProjectSixFloorPrice] = useState('');
    const [projectSixFloorPriceError, setProjectSixFloorPriceError] = useState('');
    const [projectRewards, setProjectRewards] = useState(false);

    const [gstPercentage, setGstPercentage] = useState('');
    const [gstPercentageError, setGstPercentageError] = useState('');
    const [manjeeraConnectionCharges, setManjeeraConnectionCharges] = useState('');
    const [manjeeraConnectionChargesError, setManjeeraConnectionChargesError] = useState('');
    const [manjeeraMeterCharges, setManjeeraMeterCharges] = useState('');
    const [manjeeraMeterChargesError, setManjeeraMeterChargesError] = useState('');
    const [documentationFee, setDocumentationFee] = useState('');
    const [documentationFeeError, setDocumentationFeeError] = useState('');
    const [registrationPercentage, setRegistrationPercentage] = useState('');
    const [registrationPercentageError, setRegistrationPercentageError] = useState('');
    const [registrationBaseCharge, setRegistrationBaseCharge] = useState('');
    const [registrationBaseChargeError, setRegistrationBaseChargeError] = useState('');
    const [maintenanceRatePerSqft, setMaintenanceRatePerSqft] = useState('');
    const [maintenanceRatePerSqftError, setMaintenanceRatePerSqftError] = useState('');
    const [maintenanceDurationMonths, setMaintenanceDurationMonths] = useState('');
    const [maintenanceDurationMonthsError, setMaintenanceDurationMonthsError] = useState('');
    const [corpusFund, setCorpusFund] = useState('');
    const [corpusFundError, setCorpusFundError] = useState('');

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        let hasError = false;

        if (projectName === '') {
            setProjectNameError('Project is required');
            hasError = true;
        }
        if (projectCornerPrice === '') {
            setProjectCornerPriceError('Corner Price is required');
            hasError = true;
        }
        if (projectEastPrice === '') {
            setProjectEastPriceError('East Price is required');
            hasError = true;
        }
        if (projectSixFloorPrice === '') {
            setProjectSixFloorPriceError('6th Floor+ Price is required');
            hasError = true;
        }
        if (gstPercentage === '') {
            setGstPercentageError('GST (%) is required');
            hasError = true;
        }
        if (manjeeraConnectionCharges === '') {
            setManjeeraConnectionChargesError('Manjeera Conn. Charges are required');
            hasError = true;
        }
        if (manjeeraMeterCharges === '') {
            setManjeeraMeterChargesError('Manjeera Meter Charges are required');
            hasError = true;
        }
        if (documentationFee === '') {
            setDocumentationFeeError('Doc. Fee is required');
            hasError = true;
        }
        if (registrationPercentage === '') {
            setRegistrationPercentageError('Reg. (%) is required');
            hasError = true;
        }
        if (registrationBaseCharge === '') {
            setRegistrationBaseChargeError('Reg. Base Charge is required');
            hasError = true;
        }
        if (maintenanceRatePerSqft === '') {
            setMaintenanceRatePerSqftError('Maint. /sqft is required');
            hasError = true;
        }
        if (maintenanceDurationMonths === '') {
            setMaintenanceDurationMonthsError('Maint. Month(s) is required');
            hasError = true;
        }
        if (corpusFund === '') {
            setCorpusFundError('Corpus Fund is required');
            hasError = true;
        }

        if (hasError) {
            setIsLoadingEffect(false);
            return false;
        }

        const apiEndpoint = isEdit ? 'update-project' : 'add-project';
        const payload = {
            project_name: projectName,
            project_address: projectAddress,
            project_corner_price: projectCornerPrice,
            project_east_price: projectEastPrice,
            project_six_floor_onwards_price: projectSixFloorPrice,
            project_rewards: projectRewards,
            gst_percentage: gstPercentage,
            manjeera_connection_charges: manjeeraConnectionCharges,
            manjeera_meter_charges: manjeeraMeterCharges,
            documentation_fee: documentationFee,
            registration_percentage: registrationPercentage,
            registration_base_charge: registrationBaseCharge,
            maintenance_rate_per_sqft: maintenanceRatePerSqft,
            maintenance_duration_months: maintenanceDurationMonths,
            corpus_fund: corpusFund,
            ...(isEdit && { id: projectData?.id }),
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
            setGstPercentage(projectData.gst_percentage || '');
            setManjeeraConnectionCharges(projectData.manjeera_connection_charges || '');
            setManjeeraMeterCharges(projectData.manjeera_meter_charges || '');
            setDocumentationFee(projectData.documentation_fee || '');
            setRegistrationPercentage(projectData.registration_percentage || '');
            setRegistrationBaseCharge(projectData.registration_base_charge || '');
            setMaintenanceRatePerSqft(projectData.maintenance_rate_per_sqft || '');
            setMaintenanceDurationMonths(projectData.maintenance_duration_months || '');
            setCorpusFund(projectData.corpus_fund || '');
        } else {
            setProjectName('');
            setProjectAddress('');
            setProjectCornerPrice('');
            setProjectEastPrice('');
            setProjectSixFloorPrice('');
            setProjectRewards(false);
            setGstPercentage('');
            setManjeeraConnectionCharges('');
            setManjeeraMeterCharges('');
            setDocumentationFee('');
            setRegistrationPercentage('');
            setRegistrationBaseCharge('');
            setMaintenanceRatePerSqft('');
            setMaintenanceDurationMonths('');
            setCorpusFund('');
        }
    }, [projectData, isEdit])

    return (
        <div className="w-full h-full flex flex-col">
            <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle>
                    {isEdit ? "Update Information" : "Add New Project"}
                </DialogTitle>
            </DialogHeader>

            <div className="flex-1 max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
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
                    {projectNameError && <p className="text-xs text-red-500">{projectNameError}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="projectCornerPrice" className="font-semibold">Corner Price</Label>
                        <Input
                            id="projectCornerPrice"
                            type="number"
                            placeholder="Price"
                            value={projectCornerPrice}
                            onChange={(e) => {
                                setProjectCornerPrice(e.target.value);
                                setProjectCornerPriceError('');
                            }}
                            className={`bg-white ${projectCornerPriceError ? 'border-red-500' : ''}`}
                        />
                        {projectCornerPriceError && <p className="text-xs text-red-500">{projectCornerPriceError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="projectEastPrice" className="font-semibold">East Price</Label>
                        <Input
                            id="projectEastPrice"
                            type="number"
                            placeholder="Price"
                            value={projectEastPrice}
                            onChange={(e) => {
                                setProjectEastPrice(e.target.value);
                                setProjectEastPriceError('');
                            }}
                            className={`bg-white ${projectEastPriceError ? 'border-red-500' : ''}`}
                        />
                        {projectEastPriceError && <p className="text-xs text-red-500">{projectEastPriceError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="projectSixFloorPrice" className="font-semibold">6th Floor+ Price</Label>
                        <Input
                            id="projectSixFloorPrice"
                            type="number"
                            placeholder="Price"
                            value={projectSixFloorPrice}
                            onChange={(e) => {
                                setProjectSixFloorPrice(e.target.value);
                                setProjectSixFloorPriceError('');
                            }}
                            className={`bg-white ${projectSixFloorPriceError ? 'border-red-500' : ''}`}
                        />
                        {projectSixFloorPriceError && <p className="text-xs text-red-500">{projectSixFloorPriceError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="gstPercentage" className="font-semibold">GST (%)</Label>
                        <Input
                            id="gstPercentage"
                            type="number"
                            placeholder="e.g. 5"
                            value={gstPercentage}
                            onChange={(e) => {
                                setGstPercentage(e.target.value);
                                setGstPercentageError('');
                            }}
                            className={`bg-white ${gstPercentageError ? 'border-red-500' : ''}`}
                        />
                        {gstPercentageError && <p className="text-xs text-red-500">{gstPercentageError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="manjeeraConnection" className="font-semibold">Manjeera Conn.</Label>
                        <Input
                            id="manjeeraConnection"
                            type="number"
                            placeholder="Charges"
                            value={manjeeraConnectionCharges}
                            onChange={(e) => {
                                setManjeeraConnectionCharges(e.target.value);
                                setManjeeraConnectionChargesError('');
                            }}
                            className={`bg-white ${manjeeraConnectionChargesError ? 'border-red-500' : ''}`}
                        />
                        {manjeeraConnectionChargesError && <p className="text-xs text-red-500">{manjeeraConnectionChargesError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="manjeeraMeter" className="font-semibold">Manjeera Meter</Label>
                        <Input
                            id="manjeeraMeter"
                            type="number"
                            placeholder="Charges"
                            value={manjeeraMeterCharges}
                            onChange={(e) => {
                                setManjeeraMeterCharges(e.target.value);
                                setManjeeraMeterChargesError('');
                            }}
                            className={`bg-white ${manjeeraMeterChargesError ? 'border-red-500' : ''}`}
                        />
                        {manjeeraMeterChargesError && <p className="text-xs text-red-500">{manjeeraMeterChargesError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="documentationFee" className="font-semibold">Doc. Fee</Label>
                        <Input
                            id="documentationFee"
                            type="number"
                            placeholder="Fee"
                            value={documentationFee}
                            onChange={(e) => {
                                setDocumentationFee(e.target.value);
                                setDocumentationFeeError('');
                            }}
                            className={`bg-white ${documentationFeeError ? 'border-red-500' : ''}`}
                        />
                        {documentationFeeError && <p className="text-xs text-red-500">{documentationFeeError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="registrationPercentage" className="font-semibold">Reg. (%)</Label>
                        <Input
                            id="registrationPercentage"
                            type="number"
                            placeholder="Percentage"
                            value={registrationPercentage}
                            onChange={(e) => {
                                setRegistrationPercentage(e.target.value);
                                setRegistrationPercentageError('');
                            }}
                            className={`bg-white ${registrationPercentageError ? 'border-red-500' : ''}`}
                        />
                        {registrationPercentageError && <p className="text-xs text-red-500">{registrationPercentageError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="registrationBase" className="font-semibold">Reg. Base Charge</Label>
                        <Input
                            id="registrationBase"
                            type="number"
                            placeholder="Charge"
                            value={registrationBaseCharge}
                            onChange={(e) => {
                                setRegistrationBaseCharge(e.target.value);
                                setRegistrationBaseChargeError('');
                            }}
                            className={`bg-white ${registrationBaseChargeError ? 'border-red-500' : ''}`}
                        />
                        {registrationBaseChargeError && <p className="text-xs text-red-500">{registrationBaseChargeError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="maintenanceRate" className="font-semibold">Maint. /sqft</Label>
                        <Input
                            id="maintenanceRate"
                            type="number"
                            placeholder="Rate"
                            value={maintenanceRatePerSqft}
                            onChange={(e) => {
                                setMaintenanceRatePerSqft(e.target.value);
                                setMaintenanceRatePerSqftError('');
                            }}
                            className={`bg-white ${maintenanceRatePerSqftError ? 'border-red-500' : ''}`}
                        />
                        {maintenanceRatePerSqftError && <p className="text-xs text-red-500">{maintenanceRatePerSqftError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="maintenanceDuration" className="font-semibold">Maint. Month(s)</Label>
                        <Input
                            id="maintenanceDuration"
                            type="number"
                            placeholder="Months"
                            value={maintenanceDurationMonths}
                            onChange={(e) => {
                                setMaintenanceDurationMonths(e.target.value);
                                setMaintenanceDurationMonthsError('');
                            }}
                            className={`bg-white ${maintenanceDurationMonthsError ? 'border-red-500' : ''}`}
                        />
                        {maintenanceDurationMonthsError && <p className="text-xs text-red-500">{maintenanceDurationMonthsError}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="corpusFund" className="font-semibold">Corpus Fund</Label>
                        <Input
                            id="corpusFund"
                            type="number"
                            placeholder="Amount/Rate"
                            value={corpusFund}
                            onChange={(e) => {
                                setCorpusFund(e.target.value);
                                setCorpusFundError('');
                            }}
                            className={`bg-white ${corpusFundError ? 'border-red-500' : ''}`}
                        />
                        {corpusFundError && <p className="text-xs text-red-500">{corpusFundError}</p>}
                    </div>
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
