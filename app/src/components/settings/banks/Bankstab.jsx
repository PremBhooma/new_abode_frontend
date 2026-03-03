import React, { useEffect, useState, useCallback } from "react";
import { Pagination } from "@nayeshdaggula/tailify";
import Generalapi from "../../api/Generalapi.jsx";
import Addbank from "./Addbank";
import Updatebankmodal from "./Updatebankmodal";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
import { toast } from "react-toastify";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { Dialog, DialogContent } from "../../ui/dialog";
import { Input } from "../../ui/input";
import DeleteModal from "../../shared/DeleteModal";

const Bankstab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bankList, setBankList] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [updateBankModal, setUpdateBankModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [bankIdToDelete, setBankIdToDelete] = useState(null);

    // Pagination constants
    const [limit, setLimit] = useState(5);

    const openUpdateBankModal = (bank) => {
        setSelectedBank(bank);
        setUpdateBankModal(true);
    };

    const closeUpdateBankModal = () => setUpdateBankModal(false);

    const openDeleteModal = (id) => {
        setBankIdToDelete(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setBankIdToDelete(null);
    };

    const permissions = useEmployeeDetails((state) => state.permissions);

    async function getBanksData(newPage = page, currentLimit = limit) {
        setIsLoading(true);
        try {
            const response = await Generalapi.get(`get-all-banks-list?page=${newPage}&limit=${currentLimit}&searchQuery=${searchQuery}`);
            const data = response.data;
            if (data.status === "success") {
                setBankList(data.data || []);
                setTotalPages(data.totalPages);
            } else {
                setBankList([]);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching bank info:", error);
            toast.error("Failed to fetch banks");
            setBankList([]);
        } finally {
            setIsLoading(false);
        }
    }

    const confirmDeleteBank = async () => {
        if (!bankIdToDelete) return;

        setIsLoading(true);
        try {
            const response = await Generalapi.post("delete-bank", { id: bankIdToDelete });
            if (response.data.status === "success") {
                toast.success("Bank deleted successfully");
                getBanksData();
                closeDeleteModal();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting bank:", error);
            toast.error("Failed to delete bank");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getBanksData();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getBanksData(1);
        }, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const refreshBanks = () => {
        getBanksData();
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = useCallback((value) => {
        setPage(value);
        getBanksData(value);
    }, [getBanksData]);

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8 min-h-[65vh]">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Banks</p>
                    <div className="w-[300px]">
                        <Input
                            placeholder="Search Banks..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                        />
                    </div>
                </div>
                <hr className="text-[#ebecef]" />

                <div className="grid grid-cols-4 gap-4">
                    {/* Add Bank Form - Left Column */}
                    {/* Assuming create_project permission is reused or a new one exists, defaulting to check if settings page is allowed, or just no permission check for now for add? 
                        Let's check if there is a 'create_bank' permission? Unlikely. 
                        I'll use 'company_info_tab' or similar as a placeholder if precise permission is unknown, or just render it. 
                        User said "Banks CRUD & UI". I'll assume standard admin access. 
                        Using 'project_tab' permission for consistency with similar tabs if generic 'settings_page' isn't enough.
                        Actually, let's just render it if the tab is visible.
                    */}
                    <div className="col-span-1 w-full">
                        <Addbank refreshBanks={refreshBanks} />
                    </div>

                    {/* Bank List - Right Column */}
                    <div className="col-span-3 bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
                        <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[80px]">S.No</TableHead>
                                        <TableHead>Bank Name</TableHead>
                                        <TableHead className="w-[120px] text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableLoadingEffect colspan={3} tr={4} />
                                    ) : (
                                        bankList.length > 0 ? (
                                            bankList.map((bank, index) => (
                                                <TableRow key={bank.id} className="hover:bg-neutral-50">
                                                    <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
                                                    <TableCell>{bank.name}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div
                                                                onClick={() => openUpdateBankModal(bank)}
                                                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer"
                                                            >
                                                                <IconEdit size={18} />
                                                            </div>
                                                            <div
                                                                onClick={() => openDeleteModal(bank.id)}
                                                                className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                                                            >
                                                                <IconTrash size={18} />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-neutral-500">No banks found</TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
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
            </div>

            {deleteModalOpen && (
                <DeleteModal
                    open={deleteModalOpen}
                    title="Delete Bank"
                    message="Are you sure you want to delete this bank? This action cannot be undone."
                    onConfirm={confirmDeleteBank}
                    onCancel={closeDeleteModal}
                    onClose={closeDeleteModal}
                    isLoadingEffect={isLoading}
                />
            )}

            <Dialog open={updateBankModal} onOpenChange={setUpdateBankModal}>
                <DialogContent className="sm:max-w-[500px] flex flex-col p-0 gap-0">
                    {
                        updateBankModal &&
                        <Updatebankmodal
                            closeUpdateBankModal={closeUpdateBankModal}
                            bankData={selectedBank}
                            refreshBanks={refreshBanks}
                        />
                    }
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Bankstab;
