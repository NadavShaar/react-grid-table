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
        ...rest
    } = props;

    let rowEvents = {
        onMouseEnter: e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.add('rgt-row-hover')),
        onMouseLeave: e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.remove('rgt-row-hover'))
    }
    if(onRowClick) rowEvents.onClick = event => onRowClick({rowIndex, row, column, event});

    const renderCheckboxCell = () => {
        let callback = e => tableManager.toggleItemSelection({id: rowId, selectedItems, onSelectedItemsChange});
    
        return (
            <div 
                data-row-id={(rowId).toString()}
                data-row-index={rowIndex.toString()}
                data-column-id={(column.id).toString()}
                className={className} 
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
        )
    }

    if(column.field === 'checkbox') return renderCheckboxCell();

    let isInputFocused = colIndex === colDefs.findIndex(column => column.field !== 'checkbox' && column.editable !== false);

    return (
        <div 
            data-row-id={(rowId).toString()}
            data-row-index={rowIndex.toString()}
            data-column-id={(column.id).toString()}
            style={{minWidth: column.minWidth, maxWidth: column.maxWidth}}
            className={className} 
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
    )
}

export default Cell;