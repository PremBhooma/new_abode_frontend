import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';

/**
 * Skippedrecords — shows the result of a global bulk upload.
 * Props:
 *   sections: { [name: string]: { inserted: number, skipped: number, skippedRows: { row: object, reason: string }[] } }
 *   status: "success" | "partial" | "error"
 */
const Skippedrecords = ({ sections = {}, status, onClose }) => {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (key) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sectionEntries = Object.entries(sections).filter(([, v]) => v);

    const totalInserted = sectionEntries.reduce((a, [, v]) => a + (v?.inserted || 0), 0);
    const totalSkipped = sectionEntries.reduce((a, [, v]) => a + (v?.skipped || 0), 0);

    return (
        <div className="flex flex-col gap-4">
            {/* Summary Banner */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${status === 'success' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                {status === 'success'
                    ? <CheckCircle size={22} className="text-green-600 flex-shrink-0" />
                    : <AlertTriangle size={22} className="text-amber-500 flex-shrink-0" />
                }
                <div>
                    <p className="font-semibold text-sm text-neutral-800">Upload Complete</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        <span className="text-green-600 font-medium">{totalInserted} records inserted</span>
                        {totalSkipped > 0 && (
                            <> · <span className="text-red-500 font-medium">{totalSkipped} skipped</span></>
                        )}
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-auto text-xs px-3 py-1.5 rounded-md bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 cursor-pointer"
                    >
                        Close
                    </button>
                )}
            </div>

            {/* Per-section breakdown */}
            <div className="flex flex-col gap-3">
                {sectionEntries.map(([key, section]) => {
                    const hasSkipped = section?.skipped > 0;
                    const isOpen = expanded[key];

                    return (
                        <div key={key} className="border border-neutral-200 rounded-xl overflow-hidden">
                            {/* Section header */}
                            <div
                                onClick={() => hasSkipped && toggleExpand(key)}
                                className={`w-full flex items-center justify-between px-4 py-3 bg-white text-left ${hasSkipped ? 'cursor-pointer hover:bg-neutral-50' : 'opacity-70'}`}
                            >
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                    <span className="text-sm font-semibold text-neutral-800 capitalize">{key}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50/80 px-2 py-0.5 rounded border border-green-100 font-medium">
                                            <CheckCircle size={12} /> {section?.inserted || 0} inserted
                                        </span>
                                        {hasSkipped && (
                                            <span className="flex items-center gap-1 text-[11px] text-red-600 bg-red-50/80 px-2 py-0.5 rounded border border-red-100 font-medium">
                                                <XCircle size={12} /> {section?.skipped || 0} skipped
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {hasSkipped && (
                                    isOpen
                                        ? <ChevronDown size={16} className="text-neutral-400" />
                                        : <ChevronRight size={16} className="text-neutral-400" />
                                )}
                            </div>

                            {/* Skipped rows detail */}
                            {hasSkipped && isOpen && (
                                <div className="border-t border-neutral-100 divide-y divide-neutral-100 bg-red-50/30">
                                    {section.skippedRows?.map((item, idx) => (
                                        <div key={idx} className="px-4 py-3">
                                            <div className="flex items-start gap-2 mb-2">
                                                <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs font-medium text-red-600 leading-snug">
                                                    {item.reason}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 pl-5">
                                                {Object.entries(item.row || {}).map(([field, val]) => (
                                                    val !== undefined && val !== null && val !== '' && (
                                                        <span key={field} className="text-[10px] bg-white border border-neutral-200 shadow-sm rounded px-1.5 py-0.5 text-neutral-600">
                                                            <span className="font-semibold text-neutral-800">{field}:</span> {String(val)}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Skippedrecords;
