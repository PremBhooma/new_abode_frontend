import React from 'react';

function TableLoadingEffect({ colspan, tr }) {
    const rows = [];
    for (let i = 0; i < tr; i++) {
        rows.push(
            <tr key={`loader${i}`}>
                {Array(colspan)
                    .fill(1)
                    .map((_, index) => (
                        <td key={`loader2${index}`} className="p-2">
                            <div className="h-2 mt-1 bg-gray-200 rounded-full animate-pulse"></div>
                        </td>
                    ))}
            </tr>
        );
    }
    return rows;
}

export default TableLoadingEffect;
