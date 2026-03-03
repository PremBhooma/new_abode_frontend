
import { Textinput } from '@nayeshdaggula/tailify'
import { IconArrowUp, IconFolder, IconHome, IconSearch } from '@tabler/icons-react'
import React from 'react'

function SearchAndPath({ folderPath, folderBack, mainFolder, currentFolderParentId }) {
    return (
        <div className="flex flex-row gap-3 border-y border-slate-300 py-2 max-sm:px-3 mt-5">
            <div className="basis-[10%] flex flex-row items-center justify-start gap-2">
                <div className='flex flex-row items-center justify-start gap-1 cursor-pointer border-2 border-slate-100 rounded-md p-1' onClick={mainFolder}>
                    <IconHome size={14} color="#00000099" />
                    <p className='text-xs font-medium'>Main</p>
                </div>
                <div className='flex flex-row items-center gap-[5px]'>
                    <div className='cursor-pointer border-2 border-slate-100 p-1 rounded-md' onClick={() => folderBack(currentFolderParentId)}>
                        <IconArrowUp size={15} />
                    </div>
                </div>
            </div>
            <div className="basis-[90%]">
                <Textinput
                    placeholder='Path...'
                    className='w-full'
                    size="xs"
                    value={folderPath}
                    readOnly
                    onChange={() => { }}
                    rightIcon={<IconFolder size={15} />}
                />
            </div>
            {/* <div className="basis-[35%] max-sm:hidden">
                <div className="flex flex-col justify-start items-start gap-2.5 pl-2 pr-[20px] rounded bg-white border-2 border-slate-100">
                    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative opacity-70 gap-1.5">
                        <IconSearch size={15} />
                        <input
                            type="text"
                            placeholder="Search here...."
                            className="flex-grow text-sm bg-transparent border-none text-black placeholder-black pl-4 pr-1 py-[4px] rounded outline-none"
                        />
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default SearchAndPath
