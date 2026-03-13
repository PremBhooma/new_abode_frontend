import { IconHome, IconChevronRight, IconArrowUp } from '@tabler/icons-react'
import { Folder } from 'lucide-react'
import React from 'react'

function SearchAndPath({ folderPath, folderBack, mainFolder, currentFolderParentId }) {
    // Convert path string to array for breadcrumbs
    const pathParts = folderPath.split('/').filter(part => part !== "");

    return (
        <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 rounded-xl px-4 py-2 mb-4 flex items-center justify-between">
            <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                    onClick={mainFolder}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50/50"
                    title="Home"
                >
                    <IconHome size={16} />
                </button>

                {pathParts.map((part, index) => (
                    <React.Fragment key={index}>
                        <IconChevronRight size={14} className="text-slate-300 shrink-0" />
                        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap
                            ${index === pathParts.length - 1
                                ? "bg-white text-blue-700 shadow-sm border border-blue-100"
                                : "text-slate-500 hover:text-slate-800"
                            }`}>
                            {index === 0 && <Folder size={14} className={index === pathParts.length - 1 ? "text-blue-500" : "text-slate-400"} />}
                            {part === "filemanager" ? "Main Storage" : part}
                        </div>
                    </React.Fragment>
                ))}
            </nav>

            <div className="flex items-center pl-4 border-l border-slate-200 ml-4">
                <button
                    onClick={() => folderBack(currentFolderParentId)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Go Back"
                >
                    <IconArrowUp size={18} />
                </button>
            </div>
        </div>
    )
}

export default SearchAndPath
