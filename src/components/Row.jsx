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
            highlightSearch,
            searchText,
            searchMinChars,
            tableHasSelection,
        },
        handlers: {
            handleSearchHighlight,
            getIsRowEditable,
            getIsRowSelectable
        },
        rowsData: {
            rowIdField,
            pageItems,
            selectedItems,
            updatedRow,
        },
        columnsData: {
            visibleColumns
        },
    } = tableManager;

    // row's id
    let rowId = data[rowIdField];

    // check whether the row selection should be disabled
    let disableSelection = !getIsRowSelectable(data);

    // row index by page
    let rowIndex = (index+1) + (pageItems.length * page - pageItems.length);

    // check if row is selected
    let isChecked = !!(selectedItems.find(si => si === rowId));
    
    let isEdit = updatedRow?.[rowIdField] === rowId && !!getIsRowEditable(data);
    return(
        <React.Fragment>
            {
                visibleColumns.map((cd, idx2) => {

                    // getting the cell value from the getValue function on the column
                    let cellValue = cd.getValue?.({value: (updatedRow?.[rowIdField] === rowId) ? updatedRow[cd.field] : data[cd.field], column: cd});
                    cellValue = cellValue && cellValue.toString();
                    
                    // highlight searched text if...
                    if(cd.searchable !== false && updatedRow?.[rowIdField] !== rowId && highlightSearch !== false && searchText && searchText.length >= searchMinChars && cellValue?.toLowerCase?.().includes(searchText.toLowerCase())) {
                        cellValue = handleSearchHighlight(cellValue);
                    }

                    // class selectors
                    let classNames = cd.id === 'checkbox' ? 
                        `rgt-cell rgt-cell-checkbox rgt-row-${rowIndex} rgt-row-${(index + 1) % 2 === 0 ? 'even' : 'odd'}${cd.pinned && idx2 === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${cd.pinned && idx2 === visibleColumns.length-1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isChecked ? ' rgt-row-selected' : ''} ${cd.className}`
                        :
                        cd.id === 'virtual' ?
                            `rgt-cell rgt-cell-virtual rgt-row-${rowIndex} rgt-row-${(index+1) % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${isChecked ? ' rgt-row-selected' : ''}`
                            :
                            `rgt-cell rgt-cell-${cd.field} rgt-row-${rowIndex} rgt-row-${(index + 1) % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${cd.pinned && idx2 === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${cd.pinned && idx2 === visibleColumns.length-1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isChecked ? ' rgt-row-selected' : ''}  ${cd.className}`

                    return (
                        <Cell 
                            key={rowIndex+idx2}
                            rowId={rowId}
                            data={updatedRow?.[rowIdField] === rowId ? updatedRow : data} 
                            rowIndex={rowIndex} 
                            isChecked={isChecked}
                            column={cd}
                            value={cellValue}
                            className={classNames.trim()}
                            isEdit={isEdit}
                            disableSelection={disableSelection}
                            tableManager={tableManager}
                        />
                    )
                })
            }
        </React.Fragment>
    )
}

export default Row;