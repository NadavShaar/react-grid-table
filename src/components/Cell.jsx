import React from 'react';

const Cell = (props) => {

    let {
        rowId,
        data,
        column,
        className,
        rowIndex,
        value,
        isEdit,
        disableSelection,
        isChecked,
        tableManager,
    } = props;

    let {
        params: {
            searchText,
        },
        handlers: {
            onRowClick,
            setUpdatedRow,
            toggleItemSelection,
        },
        rowsData: {
            rowIdField,
            pageItems,
            updatedRow,
            items
        },
        columnsData: {
            columns
        },
        additionalProps: {
            cell: additionalProps
        }
    } = tableManager;

    let rowEvents = {
        onMouseEnter: e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.add('rgt-row-hover')),
        onMouseLeave: e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.remove('rgt-row-hover'))
    }
    if (onRowClick) rowEvents.onClick = event => onRowClick({ rowIndex, data, column, event});

    let dataAttributes = {"data-row-id": (rowId).toString(), "data-row-index": rowIndex.toString(), "data-column-id": (column.id).toString()};

    let virtualCell = <div { ...dataAttributes } className={className} { ...rowEvents } {...additionalProps}></div>;

    const renderCheckboxCell = () => {
        let callback = e => toggleItemSelection(rowId);
    
        return (
            <React.Fragment>
                {
                    column.id === 'virtual' ?
                        virtualCell
                        : 
                        <div
                            className={className}
                            {...dataAttributes}
                            {...rowEvents}
                            {...additionalProps}
                        >
                            {
                                (column.cellRenderer) ?
                                    column.cellRenderer({ isChecked, callback, disabled: disableSelection, rowIndex })
                                    :
                                    <input
                                        className={disableSelection ? 'rgt-disabled' : 'rgt-clickable'}
                                        type="checkbox"
                                        onChange={callback}
                                        onClick={e => e.stopPropagation()}
                                        checked={isChecked}
                                        disabled={disableSelection}
                                    />
                            }
                        </div>
                }
            </React.Fragment>
        )
    }

    if(column.id === 'checkbox') return renderCheckboxCell();

    return (
        <React.Fragment>
            {
                column.id === 'virtual' ?
                    virtualCell
                    : 
                    <div
                        className={className}
                        style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                        {...dataAttributes}
                        {...rowEvents}
                        {...additionalProps}
                    >
                        {
                            column.editable !== false && isEdit ?
                                column.editorCellRenderer ?
                                    column.editorCellRenderer({ value, field: column.field, onChange: setUpdatedRow, data, column, rowIndex })
                                    :
                                    <div className='rgt-cell-inner rgt-cell-editor'>
                                        {
                                            <div className='rgt-cell-editor-inner'>
                                                <input
                                                    tabIndex={0}
                                                    autoFocus={columns.some(c => c.id === column.id && c.id !== 'checkbox' && c.editable !== false)}
                                                    className='rgt-cell-editor-input'
                                                    type="text"
                                                    value={value}
                                                    onChange={e => column.setValue({ value: e.target.value, data, setRow: setUpdatedRow, column })}
                                                />
                                            </div>
                                        }
                                    </div>
                                :
                                column.cellRenderer ?
                                    column.cellRenderer({ value, data, column, rowIndex, searchText })
                                    :
                                    <div className='rgt-cell-inner'>{value}</div>
                        }
                    </div>
            }
        </React.Fragment>
    )
}

export default Cell;