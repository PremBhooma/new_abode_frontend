import dayjs from 'dayjs'

const Leadinfo = ({ leadData }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <h3 className="text-md font-semibold text-gray-900">Project:</h3>
                <p className="text-sm text-green-500 bg-green-100 font-semibold px-2 py-1 rounded-md">{leadData?.project_name}</p>
            </div>
            <div className="border-t border-[#ebecef]"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-md font-semibold text-gray-900">Lead Preferences</h3>
                <div className="w-full grid grid-cols-3 gap-4">
                    {["Interested", "New Lead"].includes(leadData?.lead_stage_name) && (
                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm text-gray-600">Lead Status</p>
                            <p className={`text-sm font-semibold break-all ${leadData?.lead_status === 'Hot' ? 'text-orange-500' : leadData?.lead_status === 'Cold' ? 'text-blue-500' : 'text-gray-900'}`}>
                                {leadData?.lead_status || "---"}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Budget Range</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">
                            {leadData?.min_budget || leadData?.max_budget
                                ? `₹${leadData?.min_budget?.toLocaleString('en-IN') || '0'} - ₹${leadData?.max_budget?.toLocaleString('en-IN') || '0'}`
                                : "---"}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Bedroom Preference</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{leadData?.bedroom || "---"}</p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Purpose</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">
                            {leadData?.purpose === 'Enduse' ? 'End Use' : leadData?.purpose === 'Investment' ? 'Investment' : leadData?.purpose || "---"}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Funding</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">
                            {leadData?.funding === 'Selfloan' ? 'Self Loan' : leadData?.funding === 'Bankloan' ? 'Bank Loan' : leadData?.funding || "---"}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Lead Age</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">
                            {leadData?.lead_age ? `${leadData.lead_age} days` : "---"}
                        </p>
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
                            {[leadData?.correspondenceAddress, leadData?.correspondenceCityName, leadData?.correspondenceStateName, leadData?.correspondenceCountryName].filter(Boolean).join(", ") || "---"}
                            {" - "}
                            {leadData?.correspondencePincode || "---"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm text-gray-600">Permanent Address</p>
                        <p className="text-sm text-gray-900 font-semibold break-all capitalize">
                            {[leadData?.permanentAddress, leadData?.permanentCityName, leadData?.permanentStateName, leadData?.permanentCountryName].filter(Boolean).join(", ") || "---"}
                            {" - "}
                            {leadData?.permanentPincode || "---"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leadinfo