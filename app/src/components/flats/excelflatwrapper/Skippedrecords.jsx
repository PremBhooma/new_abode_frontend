import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../../components/ui/dialog";
import { Button } from '@nayeshdaggula/tailify';

const Skippedrecords = ({ isOpen, onClose, skippedData, skippedCount, insertedCount }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto w-full">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-red-600">
                        Upload Completed with Skipped Records
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-2 text-gray-600">
                        <span className="font-semibold text-green-600">{insertedCount}</span> flats were successfully imported, but <span className="font-semibold text-red-600">{skippedCount}</span> flats were skipped due to errors.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 border rounded-md overflow-hidden bg-white shadow-sm">
                    <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Row Details</th>
                                    <th className="px-4 py-3 font-medium">Reason for Skipping</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skippedData?.map((item, index) => {
                                    // Extract useful info from the row object
                                    const row = item.row || {};
                                    const project = row["Project"] || 'N/A';
                                    const block = row["Block"] || 'N/A';
                                    const flatNo = row["Flat No"] || 'N/A';

                                    return (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 align-top max-w-[200px]">
                                                <div className="font-medium text-gray-900 truncate" title={`Flat No: ${flatNo}`}>Flat: {flatNo}</div>
                                                <div className="text-xs text-gray-500 truncate mt-1">
                                                    <div>🏢 Project: {project}</div>
                                                    <div>🏗️ Block: {block}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-top text-red-600 font-medium">
                                                {item.reason}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {skippedData && skippedData.length === 0 && (
                            <div className="p-4 text-center text-gray-500">No detailed records available.</div>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-4 sm:justify-end">
                    <Button onClick={onClose} variant="default">Close & Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Skippedrecords;
