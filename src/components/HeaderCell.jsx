import React, { useRef, useEffect, useState } from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

const SortableItem = SortableElement(({children, index, columnId, className}) => <div className={className} data-column-id={columnId} key={index}>{children}</div>);
const SortableDragHandle = SortableHandle(({children, index}) => <React.Fragment>{children}</React.Fragment>);

const SelectAll = ({tableManager, column, style}) => {
    let selectAllRef = useRef(null);

    let {
        config: {
            rowIdField
        },
        rowSelectionApi: {
            getIsRowSelectable,
            setSelectedRowsIds,
            selectedRowsIds,
        },
        paginationApi: {
            pageRows,
        },
    } = tableManager;

    let selectableItemsIds = pageRows.filter(getIsRowSelectable).map(item => item[rowIdField]);
    let selectAllIsDisabled = !selectableItemsIds.length;
    let selectAllIsChecked = selectableItemsIds.length && selectableItemsIds.every(si => selectedRowsIds.find(id => si === id));
    let isSelectAllIndeterminate = !!(selectedRowsIds.length && !selectAllIsChecked && selectableItemsIds.some(si => selectedRowsIds.find(id => si === id)));

    useEffect(() => {
        if (!selectAllRef.current) return;

        selectAllRef.current.indeterminate = isSelectAllIndeterminate;
    }, [isSelectAllIndeterminate])

    const onChange = () => {
        let selectedIds = [...selectedRowsIds];

        if(selectAllIsChecked || isSelectAllIndeterminate) selectedIds = selectedIds.filter(si => !selectableItemsIds.find(itemId => si === itemId));
        else selectableItemsIds.forEach(s => selectedIds.push(s));
        
        setSelectedRowsIds(selectedIds);
    }

    return (
        <div className="rgt-cell-header-select-all" style={style}>
            {
                column.headerCellRenderer ?
                    column.headerCellRenderer({ isSelected: selectAllIsChecked, isIndeterminate: isSelectAllIndeterminate, callback: onChange, disabled: selectAllIsDisabled })
                    :
                    <input
                        ref={selectAllRef}
                        className={selectAllIsDisabled ? 'rgt-disabled' : 'rgt-clickable'}
                        disabled={selectAllIsDisabled}
                        type="checkbox"
                        onChange={onChange}
                        checked={selectAllIsChecked}
                    />
            }
        </div>
    )
}

export default (props) => {

    let {
        index, 
        column,
        tableManager,
        style = {}
    } = props;

    let {
        config: {
            isHeaderSticky,
            components: {
                DragHandle
            },
            additionalProps: {
                headerCell: additionalProps
            },
            icons: {
                sortAscending: sortAscendingIcon,
                sortDescending: sortDescendingIcon,
            },
        },
        sortApi: {
            sort,
            toggleSort,
        },
        columnsApi: {
            visibleColumns,
        },
        config: {
            allowColumnsReorder,
        },
        columnsResizeApi: {
            useResizeRef
        },
    } = tableManager;
    
    let resizeHandleRef = useResizeRef(column);

    let isPinnedRight = column.pinned && index === visibleColumns.length - 1;
    let isPinnedLeft = column.pinned && index === 0;
    let classes = column.id === 'virtual' ? `rgt-cell-header rgt-cell-header-virtual-col${isHeaderSticky ? ' rgt-cell-header-sticky' : ''}`.trim() : `rgt-cell-header rgt-cell-header-${column.id === 'checkbox' ? 'checkbox' : column.field}${(column.sortable !== false && column.id !== 'checkbox' && column.id !== 'virtual') ? ' rgt-clickable' : ''}${column.sortable !== false && column.id !== 'checkbox' ? ' rgt-cell-header-sortable' : ' rgt-cell-header-not-sortable'}${isHeaderSticky ? ' rgt-cell-header-sticky' : ''}${column.resizable !== false ? ' rgt-cell-header-resizable' : ' rgt-cell-header-not-resizable'}${column.searchable !== false && column.id !== 'checkbox' ? ' rgt-cell-header-searchable' : ' rgt-cell-header-not-searchable'}${isPinnedLeft ? ' rgt-cell-header-pinned rgt-cell-header-pinned-left' : ''}${isPinnedRight ? ' rgt-cell-header-pinned rgt-cell-header-pinned-right' : ''} ${column.className}`.trim() 

    additionalProps = {
        ...additionalProps,
        style: {
            ...style,
            ...additionalProps.style,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth
        }
    }
    if (column.sortable) {
        let onClick = additionalProps.onClick;
        additionalProps.onClick = e => {
            toggleSort(column.id);
            onClick?.(e)
        }
    }

    return (
        <div 
            data-column-id={(column.id).toString()}
            className={classes}
            {...additionalProps}
        >
            {
                (column.id !== 'virtual') ?
                    <React.Fragment>
                        <SortableItem 
                            className={`rgt-cell-header-inner${column.id === 'checkbox' ? ' rgt-cell-header-inner-checkbox-column' : ''}${!isPinnedRight ? ' rgt-cell-header-inner-not-pinned-right' : '' }`}
                            index={index} 
                            disabled={!allowColumnsReorder || isPinnedLeft || isPinnedRight}
                            columnId={(column.id).toString()}
                            collection={isPinnedLeft || isPinnedRight ? 0 : 1}
                        >
                            {
                                DragHandle ?
                                    <SortableDragHandle index={index}>{<DragHandle/>}</SortableDragHandle>
                                    :
                                    null
                            }
                            {
                                (column.id === 'checkbox') ? 
                                    <SelectAll tableManager={tableManager} column={column} style={style} />
                                    :
                                    column.headerCellRenderer ? 
                                        column.headerCellRenderer({label: (typeof column.label === 'string' ? column.label : column.field), column: column})
                                        :
                                        <span className='rgt-text-truncate' data-column-id={(column.id).toString()}>
                                            {typeof column.label === 'string' ? column.label : column.field}
                                        </span>
                            }
                            {
                                (sort.colId === column.id) ? 
                                    sort.isAsc ? 
                                        <span className='rgt-sort-icon rgt-sort-icon-ascending'>{sortAscendingIcon}</span> 
                                        :
                                        sort.isAsc === false ?
                                            <span className='rgt-sort-icon rgt-sort-icon-descending'>{sortDescendingIcon}</span> 
                                            : 
                                            null
                                    : 
                                    null
                            }
                        </SortableItem>
                        {
                            column.resizable ?
                                <span 
                                    ref={resizeHandleRef} 
                                    className='rgt-resize-handle'
                                    onClick={e => {e.preventDefault(); e.stopPropagation();}}
                                >
                                </span>
                                : null
                        }
                    </React.Fragment>
                :
                null
            }
        </div>
    )
}