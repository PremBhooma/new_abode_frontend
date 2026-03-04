import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../ui/dialog";
import { Button } from '@nayeshdaggula/tailify';

const Skippedrecords = ({ insertedCount, skippedCount, skippedData, closeModal }) => {
    return (
        <Dialog open={true} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto w-full">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        Upload Summary - Skipped Records
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-3 text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span>Successfully Processed: <span className="font-bold text-green-600">{insertedCount}</span></span>
                            <span className="h-4 w-[1px] bg-gray-300 mx-4"></span>
                            <span>Skipped due to Errors: <span className="font-bold text-red-600">{skippedCount}</span></span>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-5 border rounded-lg overflow-hidden bg-white shadow-sm border-gray-200">
                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 border-b">
                                <tr>
                                    <th className="px-5 py-4 font-semibold tracking-wider">Payment Details</th>
                                    <th className="px-5 py-4 font-semibold tracking-wider">Reason for Skipping</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {skippedData?.map((item, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-5 py-4 align-top w-[30%]">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">Flat</span>
                                                        {item.flat || 'N/A'}
                                                    </div>
                                                    <div className="text-[13px] text-gray-600">
                                                        <span className="text-gray-400 font-medium">Txn:</span> {item.transaction_id || 'N/A'}
                                                    </div>
                                                    <div className="text-[13px] text-gray-600">
                                                        <span className="text-gray-400 font-medium">Amount:</span> ₹{item.amount || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 align-top">
                                                <div className="flex flex-wrap gap-2">
                                                    {item.reason?.split(' | ').map((err, i) => (
                                                        <div key={i} className="flex items-start gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100/50 text-[13px] leading-relaxed">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                                                            {err}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {(!skippedData || skippedData.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                <p className="text-sm">No detailed error logs found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-2 text-[11px] text-gray-400 italic">
                    * Showing top 10 errors. Please correct these and try re-uploading the file.
                </div>

                <DialogFooter className="mt-6 border-t pt-4">
                    <Button
                        onClick={closeModal}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-2.5 rounded-md font-medium transition-all shadow-sm"
                    >
                        Dismiss & Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Skippedrecords;
