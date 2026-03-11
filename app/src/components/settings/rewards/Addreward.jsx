import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { toast } from 'react-toastify';
import Generalapi from '../../api/Generalapi';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import Projectapi from '../../api/Projectapi';

const Addreward = ({ refreshRewards, closeAddRewardModal, isDesktop = true }) => {
    const [name, setName] = useState("");
    const [couponGiftId, setCouponGiftId] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedProjectError, setSelectedProjectError] = useState("");
    const [status, setStatus] = useState("Active");
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [nameError, setNameError] = useState("");
    const [couponGiftIdError, setCouponGiftIdError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await Projectapi.get("get-all-projects");
            if (response.data.status === "success") {
                const projectOptions = response.data.data
                    .filter(p => p.project_rewards === true || p.project_rewards === "true")
                    .map(p => ({
                        value: String(p.id),
                        label: p.project_name
                    }));
                setProjects(projectOptions);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileError('');
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;

        if (!selectedProject) {
            setSelectedProjectError("Project is required");
            hasError = true;
        }
        if (!couponGiftId.trim()) {
            setCouponGiftIdError("Reward ID is required");
            hasError = true;
        }
        if (!name.trim()) {
            setNameError("Reward name is required");
            hasError = true;
        }
        if (!file) {
            setFileError("Image is required");
            hasError = true;
        }

        if (hasError) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("coupon_gift_id", couponGiftId);
        formData.append("project_id", selectedProject);
        formData.append("coupon_gift_status", status);
        formData.append("file", file);

        setIsLoading(true);
        try {
            const response = await Generalapi.post("add-coupon-gift", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data.status === "success") {
                toast.success("Reward added successfully");
                setName("");
                setCouponGiftId("");
                setSelectedProject("");
                setStatus("Active");
                setFile(null);
                setPreviewUrl(null);
                refreshRewards();
                if (closeAddRewardModal) closeAddRewardModal();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding reward:", error);
            toast.error("Failed to add reward");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full w-full overflow-hidden">
                <div className={`flex-1 overflow-y-auto ${isDesktop ? "p-6 pt-2" : "p-4 space-y-4"}`}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Project <span className="text-red-500">*</span></label>
                            <Select value={selectedProject} onValueChange={(val) => {
                                setSelectedProject(val);
                                setSelectedProjectError('');
                            }}>
                                <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus:border-black">
                                    <SelectValue placeholder="Select Project" />
                                </SelectTrigger>
                                <SelectContent className="z-[9999]">
                                    {projects.map((project) => (
                                        <SelectItem key={project.value} value={project.value}>
                                            {project.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedProjectError && <p className="text-xs text-red-500">{selectedProjectError}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Reward ID <span className="text-red-500">*</span></label>
                            <Input
                                value={couponGiftId}
                                onChange={(e) => {
                                    setCouponGiftId(e.target.value);
                                    setCouponGiftIdError('');
                                }}
                                placeholder="Ex: REWARD001"
                                className={`focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black ${couponGiftIdError ? 'border-red-500' : ''}`}
                            />
                            {couponGiftIdError && <p className="text-xs text-red-500">{couponGiftIdError}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Reward Name <span className="text-red-500">*</span></label>
                            <Input
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError('');
                                }}
                                placeholder="Enter reward name"
                                className={`focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black ${nameError ? 'border-red-500' : ''}`}
                            />
                            {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="focus-ring-0 focus:ring-offset-0 focus:border-black">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="z-[9999]">
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Reward Image <span className="text-red-500">*</span></label>
                            <div className="flex flex-col gap-3">
                                {previewUrl && (
                                    <div className="relative w-full h-40 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-full w-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setFile(null); setPreviewUrl(null); }}
                                            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white shadow-sm transition-all"
                                        >
                                            <IconPlus size={16} className="rotate-45 text-red-500" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                        id="reward-image-upload"
                                    />
                                    <label
                                        htmlFor="reward-image-upload"
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed rounded-md cursor-pointer transition-all text-sm ${previewUrl ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-[#0083bf] hover:bg-blue-50 text-gray-600'}`}
                                    >
                                        <IconUpload size={18} />
                                        {file ? file.name : "Choose Image"}
                                    </label>
                                </div>
                                {fileError && <p className="text-xs text-red-500">{fileError}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`flex justify-end gap-3 p-4 shrink-0 mt-4 ${isDesktop ? "border-t border-gray-100" : "bg-gray-50 border-t border-gray-200"}`}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeAddRewardModal}
                        className={`${isDesktop ? "px-6" : "flex-1"} border-gray-200`}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-[#0083bf] hover:bg-[#006e9f] text-white ${isDesktop ? "px-8" : "flex-1"}`}
                    >
                        {isLoading ? "Adding..." : <><IconPlus size={18} className="mr-2" /> Add Reward</>}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Addreward;
