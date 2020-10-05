import React from 'react';
import tableManager from '../tableManager';

const Cell = (props) => {

    let {
        row,
        rowId,
        rows,
        column,
        className,
        cellRenderer,
        editorCellRenderer,
        rowIndex,
        value,
        searchText,
        isEdit,
        setUpdatedRow,
        colIndex,
        colDefs,
        disableSelection,
        selectedItems,
        onSelectedItemsChange,
        page,
        onRowClick,
        isChecked,
        lastColIsPinned,
        visibleColumns,
        ...rest
    } = props;

    let rowEvents = {
        onMouseEnter: e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.add('rgt-row-hover')),
        onMouseLeave: e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.remove('rgt-row-hover'))
    }
    if(onRowClick) rowEvents.onClick = event => onRowClick({rowIndex, row, column, event});

    let dataAttributes = {"data-row-id": (rowId).toString(), "data-row-index": rowIndex.toString(), "data-column-id": (column.id).toString()};

    let virtualCell = <div { ...dataAttributes } className={className} { ...rowEvents } {...rest}></div>;

    const renderCheckboxCell = () => {
        let callback = e => tableManager.toggleItemSelection({id: rowId, selectedItems, onSelectedItemsChange});
    
        return (
            <React.Fragment>
                {
                    lastColIsPinned && colIndex === visibleColumns.length-1 ?
                        virtualCell
                        : null
                }
                <div 
                    className={className} 
                    { ...dataAttributes }
                    { ...rowEvents }
                    { ...rest }
                >
                    {
                        (column.cellRenderer) ? 
                            column.cellRenderer({isChecked, callback, disabled: disableSelection, rowIndex})
                            :
                            <input 
                                className={disableSelection ? 'rgt-disabled' : 'rgt-clickable'}
                                type="checkbox" 
                                onChange={ callback } 
                                onClick={ e => e.stopPropagation() } 
                                checked={ isChecked } 
                                disabled={ disableSelection }
                            />
                    }
                </div>
                {
                    !lastColIsPinned && colIndex === visibleColumns.length-1 ?
                        virtualCell
                        : null
                }
            </React.Fragment>
        )
    }

    if(column.field === 'checkbox') return renderCheckboxCell();

    let isInputFocused = colIndex === colDefs.findIndex(column => column.field !== 'checkbox' && column.editable !== false);

    return (
        <React.Fragment>
            {
                lastColIsPinned && colIndex === visibleColumns.length-1 ?
                    virtualCell
                    : null
            }
            <div 
                className={className} 
                style={{minWidth: column.minWidth, maxWidth: column.maxWidth}}
                { ...dataAttributes }
                { ...rowEvents }
                { ...rest }
            >
                {
                    column.editable !== false && isEdit ?
                        editorCellRenderer ? 
                            editorCellRenderer({value, field: column.field, onChange: setUpdatedRow, row, rows, column, rowIndex})
                            :
                            <div className='rgt-cell-inner rgt-cell-editor'>
                                {
                                    <div className='rgt-cell-editor-inner'>
                                        <input
                                            tabIndex={0}
                                            autoFocus={isInputFocused}
                                            className='rgt-cell-editor-input' 
                                            type="text" 
                                            value={value} 
                                            onChange={e => column.setValue({value: e.target.value, row, setRow: setUpdatedRow, column})} 
                                        />
                                    </div>
                                }
                            </div>
                    :
                    cellRenderer ? 
                        cellRenderer({value, row, column, rowIndex, searchText})
                        :
                        <div className='rgt-cell-inner'>{value}</div>
                }
            </div>
            {
                !lastColIsPinned && colIndex === visibleColumns.length-1 ?
                    virtualCell
                    : null
            }
        </React.Fragment>
    )
}

export default Cell;