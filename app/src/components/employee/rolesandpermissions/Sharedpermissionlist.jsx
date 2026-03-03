'use client'
import React from 'react'

function Sharedpermissionlist({
    mainPages, updateMainPages,
    employeePage, updateEmployeePage,
    settingsPage, updateSettingsPage,
    customersPage, updateCustomersPage,
    flatsPage, updateFlatsPage,
    leadsPage, updateLeadsPage,
    paymentsPage, updatePaymentsPage,
    ageingPage, updateAgeingPage,
    groupOwnerDefaultPage, updateGroupOwnerDefaultPage,
    assigningSetting, updateAssigningSetting,
    refundPage, updateRefundPage,
    rewardRecordsPage, updateRewardRecordsPage,
    projectAllocation, updateProjectAllocation,
}) {
    // Handler functions for checkbox changes
    const handleMainPagesChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newMainPages = isChecked
            ? [...mainPages, value]
            : mainPages.filter(item => item !== value);
        updateMainPages(newMainPages);
    };

    const handleEmployeePageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newEmployeePage = isChecked
            ? [...employeePage, value]
            : employeePage.filter(item => item !== value);
        updateEmployeePage(newEmployeePage);
    };

    const handleRefundPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newRefundPage = isChecked
            ? [...refundPage, value]
            : refundPage.filter(item => item !== value);
        updateRefundPage(newRefundPage);
    };

    const handleProjectAllocationChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newProjectAllocation = isChecked
            ? [...projectAllocation, value]
            : projectAllocation.filter(item => item !== value);
        updateProjectAllocation(newProjectAllocation);
    };

    const handleRewardRecordsPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newRewardRecordsPage = isChecked
            ? [...rewardRecordsPage, value]
            : rewardRecordsPage.filter(item => item !== value);
        updateRewardRecordsPage(newRewardRecordsPage);
    };

    const handleCustomerPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newCustomersPage = isChecked
            ? [...customersPage, value]
            : customersPage.filter(item => item !== value);
        updateCustomersPage(newCustomersPage);
    };

    const handleAgeingPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newAgeingPage = isChecked
            ? [...ageingPage, value]
            : ageingPage.filter(item => item !== value);
        updateAgeingPage(newAgeingPage);
    };

    const handleAssigningSettingChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newAssigningSetting = isChecked
            ? [...assigningSetting, value]
            : assigningSetting.filter(item => item !== value);
        updateAssigningSetting(newAssigningSetting);
    };

    const handleLeadsPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newLeadsPage = isChecked
            ? [...leadsPage, value]
            : leadsPage.filter(item => item !== value);
        updateLeadsPage(newLeadsPage);
    };

    const handleFlatsPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newFlatsPage = isChecked
            ? [...flatsPage, value]
            : flatsPage.filter(item => item !== value);
        updateFlatsPage(newFlatsPage);
    };

    const handlePaymentsPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newPaymentsPage = isChecked
            ? [...paymentsPage, value]
            : paymentsPage.filter(item => item !== value);
        updatePaymentsPage(newPaymentsPage);
    };

    const handleSettingsPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newSettingsPage = isChecked
            ? [...settingsPage, value]
            : settingsPage.filter(item => item !== value);
        updateSettingsPage(newSettingsPage);
    };

    const handleGroupOwnerDefaultPageChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        const newGroupOwnerDefaultPage = isChecked
            ? [...groupOwnerDefaultPage, value]
            : groupOwnerDefaultPage.filter(item => item !== value);
        updateGroupOwnerDefaultPage(newGroupOwnerDefaultPage);
    };

    return (
        <div className="pt-4">
            {/* Main Pages Section */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Main Pages</p>
                <div className="flex flex-wrap gap-4">
                    {[
                        { value: "employee_page", label: "Employees" },
                        { value: "project_allocation", label: "Project Allocation" },
                        { value: "ageing_page", label: "Ageing Records" },
                        { value: "assigning_settings", label: "Assigning Flat Settings" },
                        { value: "leads_page", label: "Leads" },
                        { value: "flats_page", label: "Flats" },
                        { value: "customers_page", label: "Customers" },
                        { value: "payments_page", label: "Payments" },
                        { value: "refund_page", label: "Refunds Records" },
                        { value: "reward_records_page", label: "Reward Records" },
                        { value: "settings_page", label: "Settings" },
                        // { value: "group_owner_default_page", label: "Group/Owner" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={mainPages?.includes(item.value)}
                                onChange={handleMainPagesChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <hr className="my-4 border-gray-200" />

            {/* //Employee section */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Employee Page</p>
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "add_employee", label: "Add Employee" },
                        { value: "edit_employee", label: "Edit Employee" },
                        { value: "delete_employee", label: "Delete Employee" },
                        { value: "view_employee", label: "View Employee" },
                        { value: "personalinfo_tab", label: "Edit Personal Info" },
                        // { value: "change_password_tab", label: "Edit Password" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={employeePage?.includes(item.value)}
                                onChange={handleEmployeePageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* //Project Allocation section */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Project Allocation</p>
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "save_project_allocation", label: "Save Project Allocation" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={projectAllocation?.includes(item.value)}
                                onChange={handleProjectAllocationChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* //Records section */}
            {/* <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Refunds Page</p>
                <div className="flex flex-wrap gap-4 mt-3">
                    {[].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={refundPage?.includes(item.value)}
                                onChange={handleRefundPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" /> */}


            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Ageing Page</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "update_loan_details", label: "Update Loan Details" },
                        { value: "view_ageing_details", label: "Ageing Details" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={ageingPage?.includes(item.value)}
                                onChange={handleAgeingPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>


            <hr className="my-4 border-gray-200" />

            {/* Reward Records */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Reward Records</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "view_reward_records", label: "View Reward Records" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={rewardRecordsPage?.includes(item.value)}
                                onChange={handleRewardRecordsPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Assigning Flat Settings */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Assigning Flat Settings</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "discount_assigning", label: "Discount Assigning" },
                        { value: "booking_date_assigning", label: "Booking Date Assigning" }
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={assigningSetting?.includes(item.value)}
                                onChange={handleAssigningSettingChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Leads Section */}

            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Leads Page</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "add_lead", label: "Add Lead" },
                        { value: "edit_lead", label: "Edit Lead" },
                        { value: "view_lead", label: "View Lead" },
                        { value: "delete_lead", label: "Delete Lead" },
                        { value: "assign_bulk_leads_to_employee", label: "Assign Multi Leads to Employee" },
                        { value: "download_lead_template", label: "Download Lead Template" },
                        { value: "upload_bulk_leads", label: "Upload Bulk Lead" },
                        { value: "transfer_lead", label: "Transfer Lead" },
                        { value: "assign_lead", label: "Assign Lead" },
                        { value: "update_lead_stage", label: "Upload Lead Stage" },
                        { value: "convert_lead_to_customer", label: "Convert Lead to Customer" },
                        { value: "lead_documents", label: "Lead Document" },
                        { value: "add_folder_in_document_in_lead", label: "Add Folder in Lead Document" },
                        { value: "upload_file_in_lead", label: "Upload File in Lead Document" },
                        { value: "view_file_in_lead", label: "View File in Lead Document" },
                        { value: "delete_file_in_lead", label: "Delete File in Lead Document" },
                        { value: "delete_folder_in_lead", label: "Delete Folder in Lead Document" },
                        { value: "lead_notes", label: "Lead Note" },
                        { value: "add_notes_in_lead", label: "Add Notes in Lead" },
                        { value: "generate_cost_sheet", label: "Generate Cost Sheet" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={leadsPage?.includes(item.value)}
                                onChange={handleLeadsPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <hr className="my-4 border-gray-200" />

            {/* Flats Page Section */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Flats Page</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "add_flat", label: "Add Flat" },
                        { value: "edit_flat", label: "Edit Flat" },
                        { value: "delete_flat", label: "Delete Flat" },
                        { value: "view_flat", label: "View Flat" },
                        { value: "assign_flat_to_customer", label: "Assign flat to customer" },
                        { value: "edit_flat_image_single_flat", label: "Edit Flat Image" },
                        { value: "flat_info_single_flat", label: "Single Flat Info" },
                        { value: "customer_flat_single_flat", label: "Customer Flat Info" },
                        { value: "documents_single_flat", label: "Flat Documents" },
                        { value: "add_folder_in_document_in_flat", label: "Add Folder in Documents" },
                        { value: "updload_file_in_flat", label: "Upload File in Documents" },
                        { value: "delete_folder_in_flat", label: "Delete Folder in Documents" },
                        { value: "view_file_in_flat", label: "View File in Documents" },
                        { value: "delete_file_in_flat", label: "Delete File in Documents" },
                        { value: "payments_single_flat", label: "Flat payments" },
                        { value: "notes_single_flat", label: "Flat Notes" },
                        { value: "activities_single_flat", label: "Flat Activities" },
                        { value: "download_flat_excel", label: "Download Excel (Flat)" },
                        { value: "upload_flat_excel", label: "Upload Excel (Flats)" },
                        { value: "export_flat_to_excel", label: "Export to Excel (Flats)" },
                        { value: "upload_sale_deed_template", label: "Upload Sale Deed Template" },
                        { value: "download_sale_deed", label: "Download Sale Deed" }
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={flatsPage?.includes(item.value)}
                                onChange={handleFlatsPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <hr className="my-4 border-gray-200" />

            {/* //Customers section */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Customers Page</p>
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "add_customer", label: "Add Customer" },
                        { value: "edit_customer", label: "Edit Customer" },
                        { value: "delete_customer", label: "Delete Customer" },
                        { value: "uploading_customer_image_in_single_customer", label: "Uploading Image of Customer" },
                        { value: "other_info_single_customer", label: "Other Info of Customer" },
                        { value: "flats_info_single_customer", label: "Flats Info of Customer" },
                        { value: "payments_info_single_customer", label: "Payments Info of Customer" },
                        { value: "documents_single_customer", label: "Documents of Customer" },
                        { value: "add_folder_in_document_in_customer", label: "Add Folder in Documents" },
                        { value: "upload_file_in_customer", label: "Upload File in Documents" },
                        { value: "delete_folder_in_customer", label: "Delete Folder in Documents" },
                        { value: "view_file_in_customer", label: "View File in Documents" },
                        { value: "delete_file_in_customer", label: "Delete File in Documents" },
                        { value: "notes_single_customer", label: "Customer Notes" },
                        { value: "add_notes_single_customer", label: "Add Notes of Customer" },
                        { value: "activities_single_customer", label: "Activities of Customer" },
                        { value: "download_customer_excel", label: "Download Excel (Customer)" },
                        { value: "upload_customer_excel", label: "Upload Excel (Customers)" },
                        { value: "export_customer_to_excel", label: "Export to Excel (Customers)" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={customersPage?.includes(item.value)}
                                onChange={handleCustomerPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" />


            {/* Payments Page Section */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Payments Page</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "add_payment", label: "Add Payment" },
                        { value: "view_payment", label: "View Payment" },
                        { value: "edit_payment", label: "Edit Payment" },
                        { value: "delete_payment", label: "Delete Payment" },
                        { value: "view_single_payment", label: "View Single Payment" },
                        { value: "download_payment_excel", label: "Download Excel (Payment)" },
                        { value: "upload_payment_excel", label: "Upload Excel (Payments)" },
                        { value: "export_payment_to_excel", label: "Export to Excel (Payments)" },
                        { value: "print_all_payments", label: "Print All Payments" },
                        { value: "print_single_payment", label: "Print Single Payment" },
                        { value: "cancel_booking", label: "Cancel Booking" }
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={paymentsPage?.includes(item.value)}
                                onChange={handlePaymentsPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Settings Page Section */}
            <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Settings Page</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "company_info_tab", label: "Company info Tab" },
                        { value: "update_company_info", label: "Update company info" },
                        { value: "project_tab", label: "Project Tab" },
                        { value: "create_project", label: "Create Project" },
                        { value: "update_project_info", label: "Update Project info" },
                        { value: "delete_project", label: "Delete Project" },
                        { value: "blocks_tab", label: "Blocks Tab" },
                        { value: "add_block", label: "Add Block" },
                        { value: "edit_block", label: "Edit Block" },
                        { value: "delete_block", label: "Delete Block" },
                        { value: "amenities_tab", label: "Amenities Tab" },
                        { value: "add_amenities", label: "Add Amenities" },
                        { value: "edit_amenities", label: "Edit Amenities" },
                        { value: "delete_amenities", label: "Delete Amenities" },
                        { value: "backup_tab", label: "Backup Tab" },
                        { value: "group_owner_tab", label: "Group Owner Tab" },
                        { value: "add_group_owner", label: "Add Group Owner" },
                        { value: "edit_group_owner", label: "Edit Group Owner" },
                        { value: "global_tab", label: "Global Upload Tab" },
                        { value: "reward_records_tab", label: "Reward Records Tab" },
                        { value: "reward_records_add", label: "Add Reward Records" },
                        { value: "reward_records_edit", label: "Edit Reward Records" },
                        { value: "lead_stage_tab", label: "Lead Stage Tab" },
                        { value: "lead_stage_add", label: "Add Lead Stage" },
                        { value: "lead_stage_edit", label: "Edit Lead Stage" },
                        { value: "lead_stage_delete", label: "Delete Lead Stage" },
                        { value: "templates_tab", label: "Templates Tab" },
                        { value: "template_upload", label: "Upload Template" },
                        // { value: "delete_group_owner", label: "Delete Group Owner" },
                    ].map((item) => (
                        <label key={item.value} className="flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={settingsPage?.includes(item.value)}
                                onChange={handleSettingsPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <hr className="my-4 border-gray-200" />

            {/* Group Owner Default Page Section */}
            {/* <div className="mb-6">
                <p className='font-bold text-sm mb-2'>Group/Owner Assiging Page</p>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-4 mt-3">
                    {[
                        { value: "assign_group_owner_to_flat", label: "Flat Group/Owner Allocation" },
                        { value: "mortgage", label: "Mortgage" },
                    ].map((item) => (
                        <label key={item.value} className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                value={item.value}
                                checked={groupOwnerDefaultPage?.includes(item.value)}
                                onChange={handleGroupOwnerDefaultPageChange}
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div> */}
        </div>
    );
}

export default Sharedpermissionlist;