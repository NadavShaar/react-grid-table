import React from 'react';
import Cell from './../components/Cell';

const Row = props => {

    const { 
        data, 
        columnsData,
        rowsData,
        params,
        handlers,
        additionalProps,
        index
    } = props;

    // row's id
    let rowId = data[rowsData.rowIdField];

    // check whether the row selection should be disabled
    let disableSelection = !(rowsData.selectableItemsIds.find(si => si === rowId));

    // row index by page
    let rowIndex = (index+1) + (rowsData.pageItems.length * params.page - rowsData.pageItems.length);

    // check if row is selected
    let isChecked = !!(rowsData.selectedItems.find(si => si === rowId));
    
    return(
        <React.Fragment>
            {
                columnsData.visibleColumns.map((cd, idx2) => {

                    // getting the cell value from the getValue function on the column
                    let cellValue = cd.getValue?.({value: (rowsData.updatedRow?.[rowsData.rowIdField] === rowId) ? rowsData.updatedRow[cd.field] : data[cd.field], column: cd});
                    cellValue = cellValue && cellValue.toString();
                    
                    // highlight searched text if...
                    if(cd.searchable !== false && rowsData.updatedRow?.[rowsData.rowIdField] !== rowId && params.highlightSearch !== false && params.searchText && params.searchText.length >= params.searchMinChars && cellValue?.toLowerCase?.().includes(params.searchText.toLowerCase())) {
                        cellValue = handlers.handleSearchHighlight(cellValue);
                    }

                    // class selectors
                    let classNames = cd.id === 'checkbox' ? 
                        `rgt-cell rgt-cell-checkbox rgt-row-${rowIndex} rgt-row-${(index+1) % 2 === 0 ? 'even' : 'odd'}${cd.pinned && idx2 === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${cd.pinned && idx2 === columnsData.visibleColumns.length-1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isChecked ? ' rgt-row-selected' : ''} ${cd.className}`
                        :
                        cd.id === 'virtual' ?
                            `rgt-cell rgt-cell-virtual rgt-row-${rowIndex} rgt-row-${(index+1) % 2 === 0 ? 'even' : 'odd'}${!params.tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${isChecked ? ' rgt-row-selected' : ''}`
                            :
                            `rgt-cell rgt-cell-${cd.field} rgt-row-${rowIndex} rgt-row-${(index+1) % 2 === 0 ? 'even' : 'odd'}${!params.tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${cd.pinned && idx2 === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${cd.pinned && idx2 === columnsData.visibleColumns.length-1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isChecked ? ' rgt-row-selected' : ''}  ${cd.className}`

                    return (
                        <Cell 
                            key={rowIndex+idx2}
                            rowId={rowId}
                            row={rowsData.updatedRow?.[rowsData.rowIdField] === rowId ? rowsData.updatedRow : data} 
                            rows={rowsData.items}
                            rowIndex={rowIndex} 
                            onRowClick={handlers.onRowClick}
                            isChecked={isChecked}
                            colIndex={idx2} 
                            columns={columnsData.columns} 
                            column={cd}
                            value={cellValue}
                            lastColIsPinned={params.lastColIsPinned}
                            className={classNames.trim()}
                            visibleColumns={columnsData.visibleColumns}
                            cellRenderer={cd.cellRenderer}
                            editorCellRenderer={cd.editorCellRenderer}
                            searchText={params.searchText}
                            isEdit={rowsData.updatedRow?.[rowsData.rowIdField] === rowId && !!handlers.handleIsRowEditable(data)}
                            setUpdatedRow={handlers.setUpdatedRow}
                            selectedItems={rowsData.selectedItems}
                            disableSelection={disableSelection}
                            toggleItemSelection={handlers.toggleItemSelection}
                            { ...additionalProps.cell }
                        />
                    )
                })
            }
        </React.Fragment>
    )
}

export default Row;