import React from 'react';
import Cell from './../components/Cell';

const Row = props => {

    let {
        index,
        data,
        tableManager,
    } = props;

    let {
        params: {
            page,
        },
        handlers: {
            getIsRowEditable,
            getIsRowSelectable
        },
        rowsData: {
            rowIdField,
            pageItems,
            selectedRows,
            updatedRow,
        },
        columnsData: {
            visibleColumns
        },
    } = tableManager;

    let rowId = data[rowIdField];
    let disableSelection = !getIsRowSelectable(data);
    let rowIndex = (index+1) + (pageItems.length * page - pageItems.length);
    let isSelected = !!(selectedRows.find(si => si === rowId));
    let isEdit = updatedRow?.[rowIdField] === rowId && !!getIsRowEditable(data);

    return visibleColumns.map((cd, colIndex) => {
        return (
            <Cell 
                key={rowIndex+colIndex}
                rowId={rowId}
                data={updatedRow?.[rowIdField] === rowId ? updatedRow : data} 
                rowIndex={rowIndex} 
                colIndex={colIndex}
                isSelected={isSelected}
                column={cd}
                isEdit={isEdit}
                disableSelection={disableSelection}
                tableManager={tableManager}
            />
        )
    })
}

export default Row;