import React, { useEffect, useState } from "react";
import Backup from "./backup/Backup";
import Blocks from "./blocks/Blocks.jsx";
import Project from "./project/Project.jsx";
import Amenities from "./amenities/Amenities.jsx";
import Groupowner from "./groupowner/Groupowner.jsx";
import Companyinfo from "./companyinfo/Companyinfo.jsx";
import BulkUploads from "./bulkuploads/Bulkuploads.jsx";
import AssignProject from "../shared/AssignProject.jsx";
import { Modal, Group } from "@nayeshdaggula/tailify";
import { useProjectDetails } from "../zustand/useProjectDetails.jsx";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails.jsx";
import Leadstageswrapper from "./leadstages/Leadstageswrapper.jsx";
import Templates from "./templates/Templates.jsx"
import Bankstab from "./banks/Bankstab.jsx";
import Rewardstab from "./rewards/Rewardstab.jsx";
import { Link } from "react-router-dom";
import { ChevronRight, Settings, Blocks as BlocksIcon, Building2, Group as GroupIcon, NotepadText, SquareChartGantt, Landmark, Funnel, LayoutTemplate, Gift, Database } from "lucide-react";

function Settingswrapper() {

    const [activeTaskTab, setActiveTaskTab] = useState('company_info');
    const tabChange = (tab) => {
        setActiveTaskTab(tab);
    }

    const permissions = useEmployeeDetails((state) => state.permissions);

    const { projectData, hasFetched, fetchProjectData } = useProjectDetails();

    const [projectModel, setProjectModel] = useState(false);
    const openProjectModel = () => {
        setProjectModel(true);
    };
    const closeProjectModel = () => {
        setProjectModel(false);
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    useEffect(() => {
        if (hasFetched) {
            if (!projectData || (typeof projectData === 'object' && Object.keys(projectData).length === 0)) {
                openProjectModel();
            }
        }
    }, [hasFetched, projectData]);


    return (
        <>
            <div className='flex flex-col gap-3'>
                <div className="bg-white rounded-md shadow-sm border-b border-slate-100 px-4 py-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 mb-4">
                        <Link to="/dashboard" className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                            Dashboard
                        </Link>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-[#de4183] uppercase tracking-widest">
                            Settings
                        </span>
                    </div>

                    <div className="flex flex-col justify-between gap-4">
                        {/* Top Section */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl border border-blue-300 bg-blue-50 flex items-center justify-center shadow-sm transition hover:bg-blue-100">
                                <Settings size={18} className="text-blue-600" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                                    System Settings
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Configure company information, project details, and global preferences
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-slate-100 p-1.5 flex justify-start items-center gap-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {[
                        { id: 'company_info', label: 'Company Info', icon: Building2, permission: 'company_info_tab' },
                        { id: 'project', label: 'Project', icon: SquareChartGantt, permission: 'project_tab' },
                        { id: 'blocks', label: 'Blocks', icon: BlocksIcon, permission: 'blocks_tab' },
                        { id: 'banks', label: 'Banks', icon: Landmark, permission: 'project_tab' },
                        { id: 'amenities', label: 'Amenities Prices', icon: NotepadText, permission: 'amenities_tab' },
                        // { id: 'group_owner', label: 'Group/Owner', icon: GroupIcon, permission: 'group_owner_tab' },
                        { id: 'bulk_uploads_tab', label: 'Global Upload', icon: Database, permission: 'global_tab' },
                        // { id: 'backup', label: 'Backup', icon: IconRestore, permission: 'backup_tab' },
                        { id: 'lead_stages', label: 'Lead Stages', icon: Funnel, permission: 'lead_stage_tab' }, // Assuming no specific permission or always visible
                        // { id: 'templates', label: 'Templates', icon: LayoutTemplate, permission: 'templates_tab' },
                        { id: 'rewards', label: 'Rewards', icon: Gift, permission: 'reward_records_tab' }
                    ].map((tab) => {
                        // Check permission if it exists
                        if (tab.permission && !permissions?.settings_page?.includes(tab.permission)) return null;

                        const Icon = tab.icon;
                        const isActive = activeTaskTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => tabChange(tab.id)}
                                className={`flex items-center gap-2 px-3 py-2 text-[12px] font-medium transition-all duration-200 whitespace-nowrap border-b-2 cursor-pointer rounded-md
                                    ${isActive
                                        ? 'border-[#0083bf] text-[#0083bf]'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-900'
                                    }`}
                            >
                                <Icon size={18} strokeWidth={1.5} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="mt-3 full">
                {activeTaskTab === 'company_info' &&
                    <>
                        {permissions?.settings_page?.includes("company_info_tab") && (
                            <Companyinfo />
                        )}
                    </>
                }
                {activeTaskTab === 'banks' &&
                    <>
                        {permissions?.settings_page?.includes("project_tab") && (
                            <Bankstab />
                        )}
                    </>
                }
                {activeTaskTab === 'project' &&
                    <>
                        {permissions?.settings_page?.includes("project_tab") && (
                            <Project />
                        )}
                    </>
                }
                {activeTaskTab === 'blocks' &&
                    <>
                        {permissions?.settings_page?.includes("blocks_tab") && (
                            <Blocks />
                        )}
                    </>
                }
                {activeTaskTab === 'amenities' &&
                    <>
                        {permissions?.settings_page?.includes("amenities_tab") && (
                            <Amenities />
                        )}
                    </>
                }
                {activeTaskTab === 'group_owner' &&
                    <>
                        {permissions?.settings_page?.includes("group_owner_tab") && (
                            <Groupowner />
                        )}
                    </>
                }
                {activeTaskTab === 'backup' &&
                    <>
                        {permissions?.settings_page?.includes("backup_tab") && (
                            <Backup />
                        )}
                    </>
                }
                {activeTaskTab === 'bulk_uploads_tab' &&
                    <>
                        {permissions?.settings_page?.includes("global_tab") && (
                            <BulkUploads />
                        )}
                    </>
                }
                {activeTaskTab === 'lead_stages' &&
                    <>
                        <Leadstageswrapper />
                    </>
                }
                {activeTaskTab === 'templates' &&
                    <>
                        <Templates />
                    </>
                }
                {activeTaskTab === 'rewards' &&
                    <>
                        {permissions?.settings_page?.includes("project_tab") && (
                            <Rewardstab />
                        )}
                    </>
                }
            </div>

            <Modal
                open={projectModel}
                onClose={closeProjectModel}
                size="lg"
                zIndex={9999}
                withCloseButton={false}
            >
                {projectModel === true && (
                    <AssignProject
                        closeProjectModel={closeProjectModel}
                    />
                )}
            </Modal>
        </>
    );
}

export default Settingswrapper;
