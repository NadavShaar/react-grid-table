import React from 'react';
import { getHighlightedText } from '../utils/';

export default props => {

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
        config: {
            highlightSearch,
            tableHasSelection,
            additionalProps: {
                cell: additionalProps
            }
        },
        rowsApi: {
            onRowClick,
        },
        rowEditApi: {
            editRow,
            setEditRow,
        },
        rowSelectionApi: {
            toggleRowSelection,
        },
        searchApi: {
            searchText,
            valuePassesSearch,
        },
        columnsApi: {
            visibleColumns
        },
    } = tableManager;

    let value;
    let classNames;
    switch (column.id) {

        case 'virtual':
            classNames = `rgt-cell rgt-cell-virtual rgt-row-${rowIndex} rgt-row-${(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${isSelected ? ' rgt-row-selected' : ''}`;
            break;
        
        case 'checkbox':
            classNames = `rgt-cell rgt-cell-checkbox rgt-row-${rowIndex} rgt-row-${(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}${column.pinned && colIndex === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${column.pinned && colIndex === visibleColumns.length - 1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isSelected ? ' rgt-row-selected' : ''} ${column.className}`;
            style = { ...style, ...additionalProps.style, minWidth: column.minWidth, maxWidth: column.maxWidth };
            value = isSelected;
            break;
        
        default:
            classNames = `rgt-cell rgt-cell-${column.field} rgt-row-${rowIndex} rgt-row-${(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${column.pinned && colIndex === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${column.pinned && colIndex === visibleColumns.length - 1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isSelected ? ' rgt-row-selected' : ''}  ${column.className}`;
            style = { ...style, ...additionalProps.style, minWidth: column.minWidth, maxWidth: column.maxWidth };
            value = data && column.getValue?.({ tableManager, value: isEdit ? editRow[column.field] : data[column.field], column })?.toString?.();
            if (!isEdit && highlightSearch && valuePassesSearch(value, column)) {
                value = getHighlightedText(value, searchText);
            }
            break;
    }
    if (data && onRowClick) {
        additionalProps = {
            onClick: event => onRowClick({ rowIndex, data, column, event }, tableManager),
            ...additionalProps
        };
    }

    let cellProps = { tableManager, value, field: column.field, data, column, colIndex, rowIndex, isEdit };

    return (
        <div
            className={classNames.trim()}
            onMouseEnter={e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.add('rgt-row-hover'))}
            onMouseLeave={e => document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.remove('rgt-row-hover'))}
            data-row-id={rowId.toString()}
            data-row-index={rowIndex.toString()}
            data-column-id={column.id.toString()}
            {...additionalProps}
            style={style}
            ref={forwardRef}
        >
            {
                !data || column.id === 'virtual' ?
                    null
                    :
                    column.id === 'checkbox' ?
                        column.cellRenderer({ ...cellProps, onChange: e => toggleRowSelection(rowId), disabled: disableSelection })
                        :
                        column.editable && isEdit ?
                            column.editorCellRenderer({ ...cellProps, onChange: setEditRow })
                            :
                            column.cellRenderer(cellProps)
            }
        </div>
    )
}