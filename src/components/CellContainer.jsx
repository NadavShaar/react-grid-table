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
        const all = `rgt-cell rgt-row-${rowIndex} rgt-row-${rowIndex % 2 === 0 ? 'even' : 'odd'}${isSelected ? ' rgt-row-selected' : ''} ${additionalProps.className || ''}`.trim();
        const virtualDefault = `${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}`;
        const checkboxDefault = `${column.pinned && colIndex === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${column.pinned && colIndex === visibleColumns.length - 1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''} ${column.className}`.trim();

        switch (column.id) {
            case 'virtual': classNames = `${all} rgt-cell-virtual ${virtualDefault}`;
                break;
            case 'checkbox': classNames = `${all} rgt-cell-checkbox ${checkboxDefault}`;
                break;
            default: classNames = `${all} rgt-cell-${column.field} ${virtualDefault} ${checkboxDefault}`;
        }

        return classNames;
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
            ref={ forwardRef }
        >
            {
                column.id === 'virtual' ?
                    null
                    :
                    column.id === 'checkbox' ?
                        column.cellRenderer({ 
                            ...cellProps, 
                            onChange: e => toggleRowSelection(rowId),
                            disabled: disableSelection 
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