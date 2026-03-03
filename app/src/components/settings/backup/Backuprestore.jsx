import React, { useEffect, useState } from 'react'
import Settingsapi from "../../api/Settingsapi";
import Errorpanel from '../../shared/Errorpanel';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { Button, Card, Group, Loadingoverlay, Select, Text } from '@nayeshdaggula/tailify';

function Backuprestore({ closeBackupRestore, backupRestoreValue }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { resetEmployeeAuthdetails, permissions } = useEmployeeDetails();

    const handleBackupUpload = async (backupPath) => {
        setIsLoading(true);

        if (backupPath === '') {
            toast.error("Please select a backup file");
            setIsLoading(false);
            return false;
        }

        try {
            const response = await Settingsapi.post('restore-backup', {
                backup_path: backupPath,
            });
            const data = response.data;

            if (data.status === 'error') {
                toast.error(data.message);
                setIsLoading(false);
                return false;
            }
            closeBackupRestore();
            // toast.success("Backup Restored Successfully", {
            //     onClose: () => {
            //         resetEmployeeAuthdetails();
            //         navigate("/login");
            //     },
            // });
            resetEmployeeAuthdetails();
            navigate("/login");
            setIsLoading(false);
            return false;
        } catch (error) {
            setErrorMessage(error);
            setIsLoading(false);
            return false;
        }
    };

    return (
        <>
            <Card withBorder={false} className='!shadow-none' padding='0'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-3 items-center px-2'>
                        <Text color='#2b2b2b' c={"#000000"} className="!font-semibold text-[16px]">Backup Restoration - {backupRestoreValue?.backup_name}</Text>

                        <Button onClick={closeBackupRestore} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>
                            Restoring a backup will replace your current data with the selected backup data.
                            <p className="text-sm text-gray-600 mt-1">This ensures your system reflects the state of the chosen backup.</p>
                        </li>
                        <li>
                            If the data is restored, you will be logged out and redirected to the login page.
                            <p className="text-sm text-gray-600 mt-1">This step is taken to maintain security during the restoration process.</p>
                        </li>
                        <li>
                            Only the selected data from the backup will be restored, leaving other data unchanged.
                            <p className="text-sm text-gray-600 mt-1">This allows for targeted restoration without affecting unrelated data.</p>
                        </li>
                        <li>
                            Ensure you have saved any unsaved changes before initiating the restoration process.
                            <p className="text-sm text-gray-600 mt-1">Unsaved changes will be lost once the restoration begins.</p>
                        </li>
                        <li>
                            Backup restoration may take a few moments depending on the size of the data.
                            <p className="text-sm text-gray-600 mt-1">Larger backups may require additional processing time.</p>
                        </li>
                        <li>
                            Verify the backup file's integrity before restoration to avoid data corruption.
                            <p className="text-sm text-gray-600 mt-1">Corrupted backups may result in incomplete or erroneous data restoration.</p>
                        </li>
                        <li>
                            Restoration cannot be undone; proceed with caution and confirm your selection.
                            <p className="text-sm text-gray-600 mt-1">Double-check your backup choice to avoid unintended data loss.</p>
                        </li>
                    </ul>
                </Card.Section>
                {isLoading ? (
                    isLoading && (
                        <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                            <Loadingoverlay visible={isLoading} overlayBg="" />
                        </div>
                    )
                ) : (
                    <Card.Section className='flex justify-end mt-2 !p-0'>
                        <button onClick={() => handleBackupUpload(backupRestoreValue?.backup_path)} disabled={isLoading} className="px-3 text-[14px] bg-[#0083bf] hover:!bg-[#0083bf]/90 text-white py-2 rounded cursor-pointer">Submit</button>
                    </Card.Section>
                )}
            </Card>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </>
    )
}

export default Backuprestore