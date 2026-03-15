import React, { useEffect, useState } from "react";
import Projectapi from "../../api/Projectapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import Updateprojectmodal from "./Updateprojectmodal";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
import { toast } from "react-toastify";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import Singleprojectdetails from "./Singleprojectdetails";

const Project = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [updateProjectModal, setUpdateProjectModal] = useState(false);
    const [viewProjectDrawer, setViewProjectDrawer] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const openUpdateProjectModal = (project) => {
        setSelectedProject(project);
        setIsEditMode(true);
        setUpdateProjectModal(true);
    };

    const openViewProjectDrawer = (project) => {
        setSelectedProject(project);
        setViewProjectDrawer(true);
    };

    const openAddProjectModal = () => {
        setSelectedProject(null);
        setIsEditMode(false);
        setUpdateProjectModal(true);
    };

    const closeUpdateProjectModal = () => setUpdateProjectModal(false);

    const permissions = useEmployeeDetails((state) => state.permissions);

    async function getProjectData() {
        setIsLoading(true);

        Projectapi.get("get-all-projects", {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setProjectList([]);
                } else {
                    setProjectList(data?.data || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching project info:", error);
                const finalResponse = {
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                };
                setErrorMessage(finalResponse);
                setProjectList([]);
                setIsLoading(false);
            });
    }

    const confirmDeleteProject = (id) => {
        setProjectToDelete(id);
        setDeleteModalOpen(true);
    };

    const executeDeleteProject = async () => {
        if (!projectToDelete) return;

        setIsLoading(true);
        setDeleteModalOpen(false);

        Projectapi.post("delete-project", { id: projectToDelete })
            .then((response) => {
                const data = response.data;
                if (data.status === "success") {
                    toast.success("Project deleted successfully");
                    getProjectData();
                } else {
                    toast.error(data.message);
                }
                setIsLoading(false);
                setProjectToDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting project:", error);
                toast.error("Failed to delete project");
                setIsLoading(false);
                setProjectToDelete(null);
            });
    };

    useEffect(() => {
        getProjectData();
    }, []);

    const refreshProject = () => {
        getProjectData();
    };

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8 min-h-[65vh]">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Projects</p>
                    {permissions?.settings_page?.includes("create_project") && (
                        <Button onClick={openAddProjectModal} className="bg-[#0083bf] hover:bg-[#0083bf]/90 text-white">
                            Add Project
                        </Button>
                    )}
                </div>
                <hr className="text-[#ebecef]" />

                <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[80px] border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">S.No</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Project</TableHead>
                                {/* <TableHead>Address</TableHead> */}
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Corner Price</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">East Price</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">6th Floor+ Price</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">GST (%)</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Manjeera Conn.</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Manjeera Meter</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Doc. Fee</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Reg. (%)</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Reg. Base</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Maint. /sqft</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Maint. Months</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Corpus Fund</TableHead>
                                <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50 text-nowrap">Rewards</TableHead>
                                <TableHead className="sticky right-0 z-20 w-[120px] text-center border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableLoadingEffect colspan={16} tr={4} />
                            ) : (
                                projectList.length > 0 ? (
                                    projectList.map((project, index) => (
                                        <TableRow key={project.id} className="hover:bg-neutral-50">
                                            <TableCell className="font-medium border border-neutral-200 px-3 py-2">{index + 1}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2 text-nowrap">{project.project_name}</TableCell>
                                            {/* <TableCell>{project.project_address || "-"}</TableCell> */}
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.project_corner_price || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.project_east_price || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.project_six_floor_onwards_price || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.gst_percentage || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.manjeera_connection_charges || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.manjeera_meter_charges || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.documentation_fee || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.registration_percentage || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.registration_base_charge || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.maintenance_rate_per_sqft || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.maintenance_duration_months || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2">{project.corpus_fund || "-"}</TableCell>
                                            <TableCell className="border border-neutral-200 px-3 py-2 text-center">
                                                {project.project_rewards ? (
                                                    <Badge variant="success">Yes</Badge>
                                                ) : (
                                                    <Badge variant="secondary">No</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200 px-3 py-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div
                                                        onClick={() => openViewProjectDrawer(project)}
                                                        className="p-1 hover:bg-green-50 rounded-md transition-colors text-neutral-500 hover:text-green-600 cursor-pointer"
                                                        title="View Project Details"
                                                    >
                                                        <IconEye size={18} />
                                                    </div>
                                                    {permissions?.settings_page?.includes("update_project_info") && (
                                                        <div
                                                            onClick={() => openUpdateProjectModal(project)}
                                                            className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                                            title="Edit Project"
                                                        >
                                                            <IconEdit size={18} />
                                                        </div>
                                                    )}
                                                    {permissions?.settings_page?.includes("delete_project") && (
                                                        <div
                                                            onClick={() => confirmDeleteProject(project.id)}
                                                            className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                                                            title="Delete Project"
                                                        >
                                                            <IconTrash size={18} />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={16} className="text-center py-8 text-neutral-500">No projects found</TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            <Dialog open={updateProjectModal} onOpenChange={setUpdateProjectModal}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                    {
                        updateProjectModal &&
                        <Updateprojectmodal
                            closeUpdateProjectModal={closeUpdateProjectModal}
                            projectData={selectedProject}
                            refreshProject={refreshProject}
                            isEdit={isEditMode}
                        />
                    }
                </DialogContent>
            </Dialog>

            <Singleprojectdetails
                projectData={selectedProject}
                isOpen={viewProjectDrawer}
                onClose={setViewProjectDrawer}
            />

            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription className="mt-2 text-sm text-neutral-500">
                            Are you sure you want to delete this project? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 mt-4 pt-4 border-t border-neutral-100">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={executeDeleteProject}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Project;
