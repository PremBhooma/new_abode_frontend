import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { toast } from 'react-toastify';
import Generalapi from '../../api/Generalapi';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import Projectapi from '../../api/Projectapi';

const Addreward = ({ refreshRewards }) => {
    const [name, setName] = useState("");
    const [couponGiftId, setCouponGiftId] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [status, setStatus] = useState("Active");
    const [file, setFile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

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
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Reward name is required");
        if (!couponGiftId.trim()) return toast.error("Coupon Gift ID is required");
        if (!selectedProject) return toast.error("Project is required");
        if (!file) return toast.error("Image is required");

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
        <div className="bg-white p-6 rounded-md border border-[#ebecef] flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Add Reward</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Project <span className="text-red-500">*</span></label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
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
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Reward ID <span className="text-red-500">*</span></label>
                    <Input
                        value={couponGiftId}
                        onChange={(e) => setCouponGiftId(e.target.value)}
                        placeholder="Ex: REWARD001"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Reward Name <span className="text-red-500">*</span></label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter reward name"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Status <span className="text-red-500">*</span></label>
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

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Reward Image <span className="text-red-500">*</span></label>
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
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#0083bf] hover:bg-[#006e9f] text-white mt-2"
                >
                    {isLoading ? "Adding..." : <><IconPlus size={18} className="mr-2" /> Add Reward</>}
                </Button>
            </form>
        </div>
    );
};

export default Addreward;
