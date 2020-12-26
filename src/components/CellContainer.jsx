import React, { useCallback } from 'react';
import { getHighlightedText } from '../utils';

const CellContainer = ({
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
}) => {

    let {
        config: {
            highlightSearch,
            tableHasSelection,
            additionalProps: { cellContainer: additionalProps = {} }
        },
        rowsApi: { onRowClick },
        rowEditApi: { editRow, setEditRow },
        rowSelectionApi: { toggleRowSelection },
        searchApi: { searchText, valuePassesSearch },
        columnsApi: { visibleColumns },
    } = tableManager;

    const getClassNames = () => {
        let classNames;

        switch (column.id) {
            case 'virtual': classNames = `rgt-cell rgt-cell-virtual rgt-row-${rowIndex} rgt-row-${rowIndex % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${isSelected ? ' rgt-row-selected' : ''}`;
                break;
            case 'checkbox': classNames = `rgt-cell rgt-cell-checkbox rgt-row-${rowIndex} rgt-row-${rowIndex % 2 === 0 ? 'even' : 'odd'}${column.pinned && colIndex === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${column.pinned && colIndex === visibleColumns.length - 1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isSelected ? ' rgt-row-selected' : ''} ${column.className}`;
                break;
            default: classNames = `rgt-cell rgt-cell-${column.field} rgt-row-${rowIndex} rgt-row-${rowIndex % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${column.pinned && colIndex === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${column.pinned && colIndex === visibleColumns.length - 1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isSelected ? ' rgt-row-selected' : ''}  ${column.className}`;
        }

        return classNames.trim() + ' ' + (additionalProps.className || '').trim();
    }

    const getValue = () => {
        let value;

        switch (column.id) {   
            case 'checkbox': value = isSelected;
                break;
            default: value = data && column.getValue?.({ tableManager, value: isEdit ? editRow[column.field] : data[column.field], column })?.toString?.();
                if (!isEdit && highlightSearch && valuePassesSearch(value, column)) return getHighlightedText(value, searchText);
        }

        return value;
    }

    const getStyle = () => {
        switch (column.id) {   
            case 'checkbox': return { ...style, ...additionalProps.style, minWidth: column.minWidth, maxWidth: column.maxWidth };
            default: return { ...style, ...additionalProps.style, minWidth: column.minWidth, maxWidth: column.maxWidth };
        }
    }

    const onMouseEnter = useCallback(
        e => {
            document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.add('rgt-row-hover')); 
            additionalProps.onMouseEnter?.(e);
        },
        [rowIndex, additionalProps.onMouseEnter]
    )
    
    const onMouseLeave = useCallback(
        e => { 
            document.querySelectorAll(`.rgt-row-${rowIndex}`).forEach(c => c.classList.remove('rgt-row-hover')); 
            additionalProps.onMouseLeave?.(e);
        },
        [rowIndex, additionalProps.onMouseLeave]
    )

    if (data && onRowClick) {
        additionalProps = {
            onClick: event => onRowClick({ rowIndex, data, column, event }, tableManager),
            ...additionalProps
        };
    }

    let classNames = getClassNames();
    let value = getValue();
    style = getStyle();

    let cellProps = { tableManager, value, data, column, colIndex, rowIndex };

    return (
        <div
            data-row-id={ rowId.toString() }
            data-row-index={ rowIndex.toString() }
            data-column-id={ column.id.toString() }
            { ...additionalProps }
            onMouseEnter={ onMouseEnter }
            onMouseLeave={ onMouseLeave }
            className={ classNames }
            style={ style }
            ref={ forwardRef }
        >
            {
                column.id === 'virtual' ?
                    null
                    :
                    column.id === 'checkbox' ?
                        column.cellRenderer({ 
                            ...cellProps, 
                            onChange: e => toggleRowSelection(rowId), disabled: disableSelection 
                        })
                        :
                        !data ?
                            column.placeHolderRenderer(cellProps)
                            :
                            column.editable && isEdit ?
                                column.editorCellRenderer({ ...cellProps, onChange: setEditRow })
                                :
                                column.cellRenderer(cellProps)
            }
        </div>
    )
};

export default CellContainer;