'use client'
import React, { useState } from 'react';
import Employeeapi from '../../api/Employeeapi';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';

function Editrole({ closeEditRoleEditModel, roleId, reloadGetroledata, roleDetails }) {
    const userInfo = useEmployeeDetails(state => state.employeeInfo);
    const access_token = useEmployeeDetails(state => state.access_token);
    let user_id = userInfo?.user_id;

    const [roleName, setRoleName] = useState(roleDetails.role_name);
    const [roleNameError, setRoleNameError] = useState('');
    const [errorMessages, setErrorMessages] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateRoleName = (e) => {
        setRoleName(e.target.value);
        setRoleNameError('');
    };

    const submiteRoleName = async () => {
        setIsLoading(true);

        if (roleName === '') {
            setRoleNameError('Role Name is required');
            setIsLoading(false);
            return;
        }
        else if (roleName.toLowerCase() === 'super admin' || roleName.toLowerCase() === 'superadmin') {
            setRoleNameError('Role name is already taken');
            setIsLoading(false);
            return false;
        }

        try {
            const response = await Employeeapi.post('/updaterole', {
                role_name: roleName.trim(),
                role_id: roleId,
            });
            let data = response.data;
            if (data.status === 'error') {
                setRoleNameError(data.message || 'Something went wrong');
                setIsLoading(false);
                return false;
            }
            setIsLoading(false);
            reloadGetroledata();
            closeEditRoleEditModel();
            return false;
        } catch (error) {
            console.error('API Error:', error);
            setRoleNameError('Server error. Please try again later.');
            setIsLoading(false);
            return false;
        }
    };


    return (
        <div className="relative">
            <div className="rounded-lg shadow-sm  bg-white">
                <div className="flex justify-between items-center border-b border-b-gray-300 pb-2">
                    <p className="text-lg font-semibold">Edit Role</p>
                    <button
                        onClick={closeEditRoleEditModel}
                        className="px-2 py-1 cursor-pointer text-gray-700 border border-gray-300 rounded text-xs hover:bg-red-500 hover:text-white"
                    >
                        Close
                    </button>
                </div>
                <div className="py-2 border-b border-b-gray-300">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Role Name"
                            name="rolename"
                            value={roleName}
                            onChange={updateRoleName}
                            className={`w-full px-4 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none ${roleNameError ? 'border-red-500' : 'border-gray-400'}`}
                        />

                        {roleNameError && <p className="text-red-500 text-sm">{roleNameError}</p>}

                        {errorMessages && (
                            <div
                                className="bg-red-50 border border-red-200 text-sm rounded-lg p-4"
                                role="alert"
                            >
                                <div className="flex items-center space-x-2 text-red-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.875 18.825L18 20.25l-1.425-4.125M12 9v2.25m0 4.5h.008v.008H12v-.008zm0 0c-4.833 0-8.75 3.417-8.75 7.625h17.5c0-4.208-3.917-7.625-8.75-7.625z"
                                        />
                                    </svg>
                                    <p>{errorMessages.message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="pt-2 flex justify-end">
                    <button
                        onClick={submiteRoleName}
                        disabled={isLoading}
                        className="px-4 py-2 text-white cursor-pointer bg-[#0083bf] rounded-md hover:bg-gray-700 disabled:opacity-50 text-xs"
                    >
                        Update Role
                    </button>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}

export default Editrole;
