import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { toast } from 'react-toastify';
import Generalapi from '../../api/Generalapi';
import { IconUpload, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import config from '../../../config.jsx';

const Updaterewardmodal = ({ closeUpdateRewardModal, rewardData, refreshRewards, projects, isDesktop }) => {
    const [name, setName] = useState(rewardData?.name || "");
    const [couponGiftId, setCouponGiftId] = useState(rewardData?.coupon_gift_id || "");
    const [selectedProject, setSelectedProject] = useState(String(rewardData?.project_id) || "");
    const [status, setStatus] = useState(rewardData?.coupon_gift_status || "Active");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(rewardData?.coupon_gift_pic_url ? `${rewardData.coupon_gift_pic_url}` : "");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Reward name is required");
        if (!couponGiftId.trim()) return toast.error("Coupon Gift ID is required");
        if (!selectedProject) return toast.error("Project is required");

        const formData = new FormData();
        formData.append("id", rewardData.id);
        formData.append("name", name);
        formData.append("coupon_gift_id", couponGiftId);
        formData.append("project_id", selectedProject);
        formData.append("coupon_gift_status", status);
        if (file) {
            formData.append("file", file);
        }

        setIsLoading(true);
        try {
            const response = await Generalapi.post("update-coupon-gift", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data.status === "success") {
                toast.success("Reward updated successfully");
                refreshRewards();
                closeUpdateRewardModal();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating reward:", error);
            toast.error("Failed to update reward");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full w-full overflow-hidden">
                <div className={`flex-1 overflow-y-auto ${isDesktop ? "p-6 pt-2" : "p-4 space-y-4"}`}>
                    <div className="flex flex-col gap-2 text-center items-center py-2">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-100 shadow-md bg-gray-50 flex items-center justify-center p-1">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    crossOrigin='anonymous'
                                    className="w-full h-full object-contain rounded-lg"
                                    onError={(e) => e.target.src = "https://placehold.co/128x128?text=Gift"}
                                />
                            </div>
                            <label
                                htmlFor="update-reward-file"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                            >
                                <IconUpload size={24} />
                            </label>
                            <input
                                type="file"
                                id="update-reward-file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Click image to change</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Project <span className="text-red-500">*</span></label>
                            <Select value={selectedProject} onValueChange={setSelectedProject}>
                                <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus:border-black">
                                    <SelectValue placeholder="Select Project" />
                                </SelectTrigger>
                                <SelectContent className="z-[10000]">
                                    {projects
                                        .filter(project =>
                                            project.project_rewards === true ||
                                            project.project_rewards === "true" ||
                                            String(project.id) === String(rewardData?.project_id) // Keep current project even if rewards is false now
                                        )
                                        .map((project) => (
                                            <SelectItem key={String(project.id)} value={String(project.id)}>
                                                {project.project_name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Reward ID <span className="text-red-500">*</span></label>
                            <Input
                                value={couponGiftId}
                                onChange={(e) => setCouponGiftId(e.target.value)}
                                placeholder="Ex: REWARD001"
                                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Reward Name <span className="text-red-500">*</span></label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter reward name"
                                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus:border-black">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="z-[10000]">
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className={`flex justify-end gap-3 p-4 shrink-0 ${isDesktop ? "border-t border-gray-100" : "bg-gray-50 border-t border-gray-200"}`}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeUpdateRewardModal}
                        className={`${isDesktop ? "px-6" : "flex-1"} border-gray-200`}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-[#0083bf] hover:bg-[#006e9f] text-white ${isDesktop ? "px-8" : "flex-1"}`}
                    >
                        {isLoading ? "Saving..." : <><IconDeviceFloppy size={18} className="mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default Updaterewardmodal;
