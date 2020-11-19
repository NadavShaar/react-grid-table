import React from 'react';
import { getHighlightedText } from '../hooks/';

const Cell = (props) => {

    let {
        rowId,
        data,
        column,
        rowIndex,
        colIndex,
        isEdit,
        disableSelection,
        isSelected,
        tableManager,
        style = {},
        forwardRef,
    } = props;

    let {
        params: {
            searchText,
            highlightSearch,
            searchMinChars,
            tableHasSelection,
        },
        handlers: {
            onRowClick,
            handleRowEdit,
            toggleItemSelection
        },
        rowsData: {
            rowIdField,
            updatedRow,
        },
        columnsData: {
            visibleColumns
        },
        additionalProps: {
            cell: additionalProps
        }
    } = tableManager;

    let value = data && column.getValue?.({ value: (updatedRow?.[rowIdField] === rowId) ? updatedRow[column.field] : data[column.field], column: column })?.toString?.();

    if (value && column.searchable !== false && updatedRow?.[rowIdField] !== rowId && highlightSearch !== false && searchText && searchText.length >= searchMinChars && value?.toLowerCase?.()?.includes?.(searchText.toLowerCase())) {
        value = getHighlightedText(value, searchText);
    }

    let classNames = column.id === 'checkbox' ?
        `rgt-cell rgt-cell-checkbox rgt-row-${rowIndex} rgt-row-${(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}${column.pinned && colIndex === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${column.pinned && colIndex === visibleColumns.length - 1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isSelected ? ' rgt-row-selected' : ''} ${column.className}`
        :
        column.id === 'virtual' ?
            `rgt-cell rgt-cell-virtual rgt-row-${rowIndex} rgt-row-${(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${isSelected ? ' rgt-row-selected' : ''}`
            :
            `rgt-cell rgt-cell-${column.field} rgt-row-${rowIndex} rgt-row-${(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${column.pinned && colIndex === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${column.pinned && colIndex === visibleColumns.length - 1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isSelected ? ' rgt-row-selected' : ''}  ${column.className}`

    let moreProps = {};
    switch (column.id) {
        case 'virtual':
            break;
    
        default:
            style = { ...style, ...additionalProps?.style, minWidth: column.minWidth, maxWidth: column.maxWidth }
            break;
    }
    if (onRowClick) moreProps.onClick = event => onRowClick({ rowIndex, data, column, event });
    return (
        <div
            className={classNames.trim()}
            onMouseEnter={e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.add('rgt-row-hover'))}
            onMouseLeave={e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.remove('rgt-row-hover'))}
            data-row-id={(rowId).toString()}
            data-row-index={rowIndex.toString()}
            data-column-id={column.id.toString()}
            {...moreProps}
            {...additionalProps}
            style={style}
            ref={forwardRef}
        >
            {
                !data || column.id === 'virtual' ?
                    null
                    :
                column.id === 'checkbox' ?
                    (column.cellRenderer) ?
                            column.cellRenderer({ isSelected, callback: e => toggleItemSelection(rowId), disabled: disableSelection, rowIndex })
                        :
                        <input
                            className={disableSelection ? 'rgt-disabled' : 'rgt-clickable'}
                            type="checkbox"
                            onChange={e => toggleItemSelection(rowId)}
                            onClick={e => e.stopPropagation()}
                            checked={isSelected}
                            disabled={disableSelection}
                        />
                    :
                column.editable !== false && isEdit ?
                    column.editorCellRenderer ?
                        column.editorCellRenderer({ tableManager, value, field: column.field, onChange: handleRowEdit, data, column, rowIndex })
                        :
                        <div className='rgt-cell-inner rgt-cell-editor'>
                            {
                                <div className='rgt-cell-editor-inner'>
                                    <input
                                        tabIndex={0}
                                        autoFocus={visibleColumns.findIndex(c => c.id !== 'checkbox' && c.editable !== false) === colIndex}
                                        className='rgt-cell-editor-input'
                                        type="text"
                                        value={value}
                                        onChange={e => column.setValue({ value: e.target.value, data, setRow: handleRowEdit, column })}
                                    />
                                </div>
                            }
                        </div>
                    :
                    column.cellRenderer ?
                        column.cellRenderer({ tableManager, value, data, column, rowIndex, searchText })
                        :
                        <div className='rgt-cell-inner rgt-text-truncate'>{value}</div>
            }
        </div>
    )
}

export default Cell;