import { Group, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import React, { useState } from 'react';
import file_icon from '@/public/assets/file_icon.png';

function Filesidebar({ fileStructure, folderselect, currentFolderId, filePreview }) {
    const renderFolders = (folders) => {
        return folders.map((folder) => (
            <div key={folder.uuid} style={{ marginLeft: folder.parent_id ? '20px' : '0px' }}>
                <Group gap={0} mb={10} onClick={() => { folderselect(folder.uuid, folder.id) }}>
                    <IconChevronRight size={12} />
                    <Image src={file_icon} width={20} height={20} />
                    <Text size='sm'>{folder.name}</Text>
                </Group>

                {/* Recursively render subfolders */}
                {folder.subfolder && folder.subfolder.length > 0 && (
                    <div style={{ marginLeft: '20px' }}>
                        {renderFolders(folder.subfolder)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <>
            {fileStructure.length !== 0 ? renderFolders(fileStructure) : <Text>No data</Text>}
        </>
    );
}

export default Filesidebar;




