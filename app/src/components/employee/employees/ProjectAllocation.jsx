import React, { useState, useEffect } from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { IconDeviceFloppy } from "@tabler/icons-react";
import Projectapi from "../../api/Projectapi";
import Employeeapi from "../../api/Employeeapi";
import { toast } from "react-toastify";
import { useEmployeeDetails } from '@/components/zustand/useEmployeeDetails';

function ProjectAllocation({ singleUserid }) {
    const [allProjects, setAllProjects] = useState([]);
    const [allocatedProjects, setAllocatedProjects] = useState(new Set());
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const permissions = useEmployeeDetails((state) => state.permissions);

    useEffect(() => {
        if (singleUserid) {
            fetchInitialData();
        }
    }, [singleUserid]);

    const fetchInitialData = async () => {
        setIsFetching(true);
        try {
            // Fetch all available projects
            const allProjectsRes = await Projectapi.get('/get-all-projects', {
                headers: { "Content-Type": "application/json" }
            });

            if (allProjectsRes.data.status === "success") {
                setAllProjects(allProjectsRes.data.data);
            }

            // Fetch allocated projects for the user
            const allocatedRes = await Employeeapi.get(`/allocated-projects/${singleUserid}`, {
                headers: { "Content-Type": "application/json" }
            });

            if (allocatedRes.data.status === "success") {
                setAllocatedProjects(new Set(allocatedRes.data.project_ids));
            }
        } catch (error) {
            console.error("Error fetching projects", error);
            toast.error("Failed to load project allocation data");
        } finally {
            setIsFetching(false);
        }
    };

    const toggleProject = (projectId) => {
        const newAllocated = new Set(allocatedProjects);
        if (newAllocated.has(projectId)) {
            newAllocated.delete(projectId);
        } else {
            newAllocated.add(projectId);
        }
        setAllocatedProjects(newAllocated);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                employee_id: singleUserid,
                project_ids: Array.from(allocatedProjects)
            };

            const res = await Employeeapi.post('/allocate-projects', payload, {
                headers: { "Content-Type": "application/json" }
            });

            if (res.data.status === "success") {
                toast.success("Project allocations updated successfully!");
            } else {
                toast.error("Failed to update allocations.");
            }
        } catch (error) {
            console.error("Error updating allocations:", error);
            toast.error("Could not save the allocations. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isFetching) {
        return <div className="text-center py-4">Loading projects...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">
                    Allocated Projects
                </h3>
                {permissions?.project_allocation?.includes("save_project_allocation") && (
                    <ShadcnButton
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-white bg-[#0083bf] hover:bg-[#006a99] gap-2"
                    >
                        <IconDeviceFloppy size={16} />
                        {isSaving ? "Saving..." : "Save Allocations"}
                    </ShadcnButton>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProjects.map((project) => (
                    <div
                        key={project.id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ` +
                            (allocatedProjects.has(project.id) ? 'border-[#0083bf] bg-blue-50/20' : 'border-gray-200 hover:border-blue-300')}
                        onClick={() => toggleProject(project.id)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-800">{project.project_name}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.project_address}</p>
                            </div>
                            {permissions?.project_allocation?.includes("save_project_allocation") && (
                                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border ${allocatedProjects.has(project.id) ? 'bg-[#0083bf] border-[#0083bf]' : 'border-gray-300'} flex items-center justify-center transition-colors`}>
                                    {allocatedProjects.has(project.id) && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {allProjects.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                        No projects available to allocate.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectAllocation;
