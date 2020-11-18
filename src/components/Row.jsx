import React from 'react';
import { Cell } from './';

const Row = props => {

    let {
        index,
        data,
        tableManager,
        measureRef
    } = props;

    let {
        params: {
            page,
            isVirtualScrolling
        },
        handlers: {
            getIsRowEditable,
            getIsRowSelectable
        },
        rowsData: {
            rowIdField,
            pageItems,
            selectedRowsIds,
            updatedRow,
        },
        columnsData: {
            visibleColumns
        },
        rowVirtualizer,
    } = tableManager;

    if (isVirtualScrolling) {
        if (index === 'virtual-start') {
            return visibleColumns.map((vc, colIndex) => <div key={index + colIndex} style={{ minHeight: rowVirtualizer.virtualItems[0]?.start }} />)
        }
        if (index === 'virtual-end') {
            return visibleColumns.map((vc, colIndex) => <div key={index + colIndex} style={{ minHeight: rowVirtualizer.totalSize - rowVirtualizer.virtualItems[rowVirtualizer.virtualItems.length - 1]?.end || 0 }} />)
        }
    }

    let rowIndex = (index+1) + (pageItems.length * page - pageItems.length);
    let rowId = data?.[rowIdField] || rowIndex;
    let disableSelection = !data || !getIsRowSelectable(data);
    let isSelected = !!data && !!(selectedRowsIds.find(si => si === rowId));
    let isEdit = !!data && updatedRow?.[rowIdField] === rowId && !!getIsRowEditable(data);

    return visibleColumns.map((cd, colIndex) => {
        return (
            <Cell 
                key={rowIndex+colIndex}
                rowId={rowId}
                data={rowId && (updatedRow?.[rowIdField] === rowId) ? updatedRow : data} 
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
}

export default Row;