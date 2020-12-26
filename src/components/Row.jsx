import React from 'react';
import { CellContainer } from './';

const Row = ({
    index,
    data,
    tableManager,
    measureRef
}) => {
    const {
        config: { isVirtualScroll, rowIdField },
        rowEditApi: { editRow, getIsRowEditable },
        rowSelectionApi: { getIsRowSelectable, selectedRowsIds },
        columnsApi: { visibleColumns },
        paginationApi: { pageRows, page },
        rowVirtualizer: { virtualItems, totalSize },
    } = tableManager;

    if (isVirtualScroll) {
        if (index === 'virtual-start') {
            return visibleColumns.map((vc, colIndex) => (
                <div key={index + colIndex} style={{ minHeight: virtualItems[0]?.start }} />
            ));
        }
        if (index === 'virtual-end') {
            return visibleColumns.map((vc, colIndex) => (
                <div key={index + colIndex} style={{ minHeight: totalSize - virtualItems[virtualItems.length - 1]?.end || 0 }} />
            ));
        }
    }

    let rowIndex = (index+1) + (pageRows.length * page - pageRows.length);
    let rowId = data?.[rowIdField] || rowIndex;
    let disableSelection = !data || !getIsRowSelectable(data);
    let isSelected = !!data && !!(selectedRowsIds.find(si => si === rowId));
    let isEdit = !!data && editRow?.[rowIdField] === rowId && !!getIsRowEditable(data);

    return visibleColumns.map((cd, colIndex) => {
        return (
            <CellContainer 
                key={rowIndex+colIndex}
                rowId={rowId}
                data={rowId && (editRow?.[rowIdField] === rowId) ? editRow : data} 
                rowIndex={rowIndex} 
                colIndex={colIndex}
                column={cd}
                isSelected={isSelected}
                isEdit={isEdit}
                disableSelection={disableSelection}
                forwardRef={colIndex === 0 ? measureRef : undefined}
                tableManager={tableManager}
            />
        )
    })
};

export default Row;