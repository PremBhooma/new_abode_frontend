import React, { useEffect, useState, useCallback } from "react";
import { Pagination } from "@nayeshdaggula/tailify";
import { useMediaQuery } from "../../../hooks/use-media-query";
import Generalapi from "../../api/Generalapi.jsx";
import Addreward from "./Addreward";
import Updaterewardmodal from "./Updaterewardmodal";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
import { toast } from "react-toastify";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "../../ui/drawerCostSheet";
import { Input } from "../../ui/input";
import Projectapi from "../../api/Projectapi";
import config from "../../../config.jsx";
import { Button } from "@/components/ui/button";

const Rewardstab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [rewardList, setRewardList] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
    const [addRewardModal, setAddRewardModal] = useState(false);
    const [updateRewardModal, setUpdateRewardModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [projects, setProjects] = useState([]);

    const [limit] = useState(5);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await Projectapi.get("get-all-projects");
            if (response.data.status === "success") {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const openAddRewardModal = () => setAddRewardModal(true);
    const closeAddRewardModal = () => setAddRewardModal(false);

    const openUpdateRewardModal = (reward) => {
        setSelectedReward(reward);
        setUpdateRewardModal(true);
    };

    const closeUpdateRewardModal = () => setUpdateRewardModal(false);

    const getRewardsData = async (newPage = page) => {
        setIsLoading(true);
        try {
            const response = await Generalapi.get(`get-all-coupon-gifts-list?page=${newPage}&limit=${limit}&searchQuery=${searchQuery}`);
            const data = response.data;
            if (data.status === "success") {
                setRewardList(data.data || []);
                setTotalPages(data.totalPages);
            } else {
                setRewardList([]);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching rewards:", error);
            toast.error("Failed to fetch rewards");
            setRewardList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getRewardsData();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getRewardsData(1);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const refreshRewards = () => {
        getRewardsData();
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = useCallback((value) => {
        setPage(value);
        getRewardsData(value);
    }, [searchQuery]);

    console.log("rewardList:", rewardList)

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8 min-h-[65vh]">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Rewards (Coupon Gifts)</p>
                    <div className="flex items-center gap-4">
                        <div className="w-[300px]">
                            <Input
                                placeholder="Search Rewards..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                            />
                        </div>
                        <Button
                            onClick={openAddRewardModal}
                            className="bg-[#0083bf] hover:bg-[#006e9f] text-white flex gap-2"
                        >
                            <IconPlus size={18} />
                            Add Reward
                        </Button>
                    </div>
                </div>
                <hr className="text-[#ebecef]" />

                <div className="bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
                    <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[80px] border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">S.No</TableHead>
                                    <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Image</TableHead>
                                    <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Coupon ID</TableHead>
                                    <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Reward Name</TableHead>
                                    <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Project</TableHead>
                                    <TableHead className="border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Status</TableHead>
                                    <TableHead className="w-[120px] text-center border border-neutral-200 px-3 py-2 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] bg-gray-50">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableLoadingEffect colspan={7} tr={4} />
                                ) : (
                                    rewardList.length > 0 ? (
                                        rewardList.map((reward, index) => (
                                            <TableRow key={reward.id} className="hover:bg-neutral-50">
                                                <TableCell className="font-medium border border-neutral-200 px-3 py-2">{(page - 1) * limit + index + 1}</TableCell>
                                                <TableCell className="border border-neutral-200 px-3 py-2">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center p-0.5">
                                                        <img
                                                            src={`${reward.coupon_gift_pic_url}`}
                                                            alt={reward.name}
                                                            crossOrigin="anonymous"
                                                            className="w-full h-full object-contain rounded-md"
                                                            onError={(e) => {
                                                                e.target.src = "https://placehold.co/56x56?text=Gift";
                                                            }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="border border-neutral-200 px-3 py-2">{reward.coupon_gift_id || 'N/A'}</TableCell>
                                                <TableCell className="border border-neutral-200 px-3 py-2">{reward.name}</TableCell>
                                                <TableCell className="border border-neutral-200 px-3 py-2">
                                                    {projects.find(p => String(p.id) === String(reward.project_id))?.project_name || 'Loading...'}
                                                </TableCell>
                                                <TableCell className="border border-neutral-200 px-3 py-2">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${reward.coupon_gift_status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                                                        }`}>
                                                        {reward.coupon_gift_status || 'Active'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="border border-neutral-200 px-3 py-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div
                                                            onClick={() => openUpdateRewardModal(reward)}
                                                            className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                                        >
                                                            <IconEdit size={18} />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-neutral-500">No rewards found</TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 0 && (
                        <div className="flex justify-end items-end mt-4">
                            <Pagination
                                totalpages={totalPages}
                                value={page}
                                onChange={handlePageChange}
                                color="#0083bf"
                                activePageClass='!bg-[#0083bf] text-white prem'
                            />
                        </div>
                    )}
                </div>
            </div>

            {isDesktop ? (
                <>
                    <Dialog open={addRewardModal} onOpenChange={setAddRewardModal}>
                        <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle className="text-xl font-semibold text-gray-800">Add Reward</DialogTitle>
                            </DialogHeader>
                            {addRewardModal && (
                                <Addreward
                                    closeAddRewardModal={closeAddRewardModal}
                                    refreshRewards={refreshRewards}
                                    projects={projects}
                                    isDesktop={true}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={updateRewardModal} onOpenChange={setUpdateRewardModal}>
                        <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle className="text-xl font-semibold text-gray-800">Update Reward</DialogTitle>
                            </DialogHeader>
                            {updateRewardModal && (
                                <Updaterewardmodal
                                    closeUpdateRewardModal={closeUpdateRewardModal}
                                    rewardData={selectedReward}
                                    refreshRewards={refreshRewards}
                                    projects={projects}
                                    isDesktop={true}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </>
            ) : (
                <>
                    <Drawer open={addRewardModal} onOpenChange={setAddRewardModal}>
                        <DrawerContent>
                            <DrawerHeader className="text-left px-6 pt-4 pb-0">
                                <DrawerTitle className="text-xl font-semibold text-gray-800">Add Reward</DrawerTitle>
                            </DrawerHeader>
                            {addRewardModal && (
                                <Addreward
                                    closeAddRewardModal={closeAddRewardModal}
                                    refreshRewards={refreshRewards}
                                    projects={projects}
                                    isDesktop={false}
                                />
                            )}
                        </DrawerContent>
                    </Drawer>

                    <Drawer open={updateRewardModal} onOpenChange={setUpdateRewardModal}>
                        <DrawerContent>
                            <DrawerHeader className="text-left px-6 pt-4 pb-0">
                                <DrawerTitle className="text-xl font-semibold text-gray-800">Update Reward</DrawerTitle>
                            </DrawerHeader>
                            {updateRewardModal && (
                                <Updaterewardmodal
                                    closeUpdateRewardModal={closeUpdateRewardModal}
                                    rewardData={selectedReward}
                                    refreshRewards={refreshRewards}
                                    projects={projects}
                                    isDesktop={false}
                                />
                            )}
                        </DrawerContent>
                    </Drawer>
                </>
            )}
        </>
    );
};

export default Rewardstab;
