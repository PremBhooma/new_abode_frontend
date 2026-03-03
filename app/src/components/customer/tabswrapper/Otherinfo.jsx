import dayjs from "dayjs";

function Otherinfo({ customerData }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="w-full grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.date_of_birth ? dayjs(customerData.date_of_birth).format("DD/MM/YYYY") : "---"}</p>
                </div>
                {/* <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Landline Number</p>
                    <p className="text-sm text-gray-900 font-semibold break-all"> {customerData?.landline_number ? `+${customerData.landline_country_code} ${customerData.landline_city_code} ${customerData.landline_number}` : "---"}</p>
                </div> */}
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Alternate Email Address</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.email_2 || "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.gender || "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Father Name</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.father_name || "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Marriage Status</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.marital_status || "---"}</p>
                </div>
                {customerData?.marital_status !== "Single" && (
                    <>
                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm text-gray-600">Spouse Prefix</p>
                            <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.spouse_prefixes || "---"}</p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm text-gray-600">Spouse Name</p>
                            <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.spouse_name || "---"}</p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm text-gray-600">Spouse DOB</p>
                            <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.spouse_dob ? dayjs(customerData.spouse_dob).format("DD/MM/YYYY") : "---"}</p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm text-gray-600">Number of Children</p>
                            <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.number_of_children || "---"}</p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm text-gray-600">Wedding Anniversary</p>
                            <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.wedding_aniversary ? dayjs(customerData.wedding_aniversary).format("DD/MM/YYYY") : "---"}</p>
                        </div>
                    </>
                )}
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Pan Card No</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.pan_card_no || "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Aadhar Card No</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.aadhar_card_no ? customerData.aadhar_card_no.replace(/(\d{4})(?=\d)/g, "$1-") : "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Country of Citizenship</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.country_of_citizenship_details || "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Country of Residence</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.country_of_residence_details || "---"}</p>
                </div>
                {/* <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Name of Power of Attorney (POA) Holder, (if any)</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.name_of_poa || "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">If POA Holder is Indian, specify status</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.holder_poa || "---"}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <p className="text-sm text-gray-600">Have you ever owned a abode home / property?</p>
                    <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.have_you_owned_abode === "true" ? "Yes" : "No"}</p>
                </div>
                {customerData?.have_you_owned_abode === "true" && (
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">If Yes, Project Name</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.if_owned_project_name || "---"}</p>
                    </div>
                )} */}
            </div>
            <div className="border-t border-[#ebecef]"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-md font-semibold text-gray-900">Professioanl Info</h3>
                <div className="w-full grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Current Designation</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.current_designation || "---"}</p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Current Organization</p>
                        <p className="text-sm text-gray-900 font-semibold break-all"> {customerData?.name_of_current_organization || "---"}</p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Organization Address</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.address_of_current_organization || "---"}</p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Work Experience</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.no_of_years_work_experience || "---"}</p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Annual Income</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.current_annual_income ? Number(customerData.current_annual_income).toLocaleString('en-IN') : "---"}</p>
                    </div>
                </div>
            </div>
            <div className="border-t border-[#ebecef]"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-md font-semibold text-gray-900">Address Info</h3>
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Address of Correspondence</p>
                        <p className="text-sm text-gray-900 font-semibold break-all capitalize">
                            {[customerData?.correspondenceAddress, customerData?.correspondenceCityName, customerData?.correspondenceStateName, customerData?.correspondenceCountryName].filter(Boolean).join(", ") || "---"}
                            {" - "}
                            {customerData?.correspondencePincode || "---"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Permanent Address</p>
                        <p className="text-sm text-gray-900 font-semibold break-all capitalize">
                            {[customerData?.permanentAddress, customerData?.permanentCityName, customerData?.permanentStateName, customerData?.permanentCountryName].filter(Boolean).join(", ") || "---"}
                            {" - "}
                            {customerData?.permanentPincode || "---"}
                        </p>
                    </div>

                    {/* <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Number of years residing at correspondence address</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.no_of_years_correspondence_address || "---"}</p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Number of years residing in the city</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{customerData?.no_of_years_city || "---"}</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Otherinfo;
