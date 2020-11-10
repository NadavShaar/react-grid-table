import React, { useRef, useEffect, useState } from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useResizeEvents } from '../hooks/';

const SortableItem = SortableElement(({children, index, columnId, className}) => <div className={className} data-column-id={columnId} key={index}>{children}</div>);
const DragHandle = SortableHandle(({children, index}) => <React.Fragment>{children}</React.Fragment>);

const SelectAll = ({tableManager, column, style}) => {

    let selectAllRef = useRef(null);

    let {
        handlers: {
            getIsRowSelectable,
            updateSelectedItems
        },
        rowsData: {
            selectedRowsIds,
            pageItems,
            rowIdField
        }
    } = tableManager;

    let selectableItemsIds = pageItems.filter(it => getIsRowSelectable(it)).map(item => item[rowIdField]);
    let selectAllIsChecked = selectableItemsIds.length && selectableItemsIds.every(si => selectedRowsIds.find(id => si === id));
    let selectAllIsDisabled = !selectableItemsIds.length;
    let isSelectAllIndeterminate = !!(selectedRowsIds.length && !selectAllIsChecked && selectableItemsIds.some(si => selectedRowsIds.find(id => si === id)));

    useEffect(() => {
        if (!selectAllRef.current) return;

        if (isSelectAllIndeterminate) selectAllRef.current.indeterminate = true;
        else selectAllRef.current.indeterminate = false;
    }, [isSelectAllIndeterminate])

    const onChange = () => {
        let selectedIds = [...selectedRowsIds];

        if(selectAllIsChecked || isSelectAllIndeterminate) selectedIds = selectedIds.filter(si => !selectableItemsIds.find(itemId => si === itemId));
        else selectableItemsIds.forEach(s => selectedIds.push(s));
        
        updateSelectedItems(selectedIds);
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

var lastPos;

const HeaderCell = (props) => {

    let {
        index, 
        column,
        tableManager,
        style = {}
    } = props;

    let {
        refs: {
            tableRef
        },
        params: {
            sort,
            isHeaderSticky,
            disableColumnsReorder
        },
        components: {
            dragHandleComponent
        },
        handlers: {
            handleSort,
            setColumns,
            onResize,
            onResizeEnd
        },
        icons: {
            sortAscending: sortAscendingIcon,
            sortDescending: sortDescendingIcon,
        },
        columnsData: {
            columns,
            visibleColumns
        },
        additionalProps: {
            headerCell: additionalProps
        }
    } = tableManager;
    
    let resizeHandleRef = useRef(null);

    const [target, setTarget] = useState(resizeHandleRef?.current || null);

    function handleResize({e, target, column}) {
        let containerEl = tableRef.current;
        let gridTemplateColumns = containerEl.style.gridTemplateColumns;
        let currentColWidth = target.offsetParent.clientWidth;
        if(!lastPos) lastPos = e.clientX;
        
        let diff = lastPos - e.clientX;

        let colIndex = visibleColumns.findIndex(cd => cd.id === column.id);

        if (e.clientX > lastPos || e.clientX < lastPos && currentColWidth - diff > column.minWidth) {
            let gtcArr = gridTemplateColumns.split(" ");
            
            if((column.minWidth && ((currentColWidth - diff) <= column.minWidth)) || (column.maxWidth && ((currentColWidth - diff) >= column.maxWidth))) return;

            gtcArr[colIndex] = `${currentColWidth - diff}px`;
            let newGridTemplateColumns = gtcArr.join(" ");

            containerEl.style.gridTemplateColumns = newGridTemplateColumns;
        }
        
        lastPos = e.clientX;
        onResize?.({event: e, target, column});
    }

    function handleResizeEnd() {
        lastPos = null;
        let containerEl = tableRef.current;
        let gridTemplateColumns = containerEl.style.gridTemplateColumns;
        let gtcArr = gridTemplateColumns.split(" ");
        
        columns.forEach(col => {
            let colIndex = visibleColumns.findIndex(cd => cd.id === col.id);
            if (col.visible) {
                col.width = gtcArr[colIndex];
            }
        })
        setColumns(columns);
        onResizeEnd?.();
    }

    useResizeEvents(target, column, handleResize, handleResizeEnd);

    useEffect(() => {
        setTarget(resizeHandleRef.current);
    }, [column])

    let isPinnedRight = column.pinned && index === visibleColumns.length - 1;
    let isPinnedLeft = column.pinned && index === 0;
    let classes = column.id === 'virtual' ? `rgt-cell-header rgt-cell-header-virtual-col${isHeaderSticky ? ' rgt-cell-header-sticky' : ''}`.trim() : `rgt-cell-header rgt-cell-header-${column.id === 'checkbox' ? 'checkbox' : column.field}${(column.sortable !== false && column.id !== 'checkbox' && column.id !== 'virtual') ? ' rgt-clickable' : ''}${column.sortable !== false && column.id !== 'checkbox' ? ' rgt-cell-header-sortable' : ' rgt-cell-header-not-sortable'}${isHeaderSticky ? ' rgt-cell-header-sticky' : ''}${column.resizable !== false ? ' rgt-cell-header-resizable' : ' rgt-cell-header-not-resizable'}${column.searchable !== false && column.id !== 'checkbox' ? ' rgt-cell-header-searchable' : ' rgt-cell-header-not-searchable'}${isPinnedLeft ? ' rgt-cell-header-pinned rgt-cell-header-pinned-left' : ''}${isPinnedRight ? ' rgt-cell-header-pinned rgt-cell-header-pinned-right' : ''} ${column.className}`.trim() 

    let colId = column.id;
    let isAsc = true;
    if (sort.colId === colId) isAsc = sort.isAsc ? false : sort.isAsc === false ? null : true;
    if (isAsc === null) colId = null;
    let sortingProps = (column.sortable !== false && column.id !== 'checkbox' && column.id !== 'virtual') ? { onClick: e => handleSort(column.id, isAsc) } : {};

    style = { ...style, ...additionalProps.style, minWidth: column.minWidth, maxWidth: column.maxWidth };

    return (
        <div 
            data-column-id={(column.id).toString()}
            className={classes}
            {...sortingProps}
            {...additionalProps}
            style={style}
        >
            {
                (column.id !== 'virtual') ?
                    <React.Fragment>
                        <SortableItem 
                            className={`rgt-cell-header-inner${column.id === 'checkbox' ? ' rgt-cell-header-inner-checkbox-column' : ''}${!isPinnedRight ? ' rgt-cell-header-inner-not-pinned-right' : '' }`}
                            index={index} 
                            disabled={disableColumnsReorder || isPinnedLeft || isPinnedRight}
                            columnId={(column.id).toString()}
                            collection={isPinnedLeft || isPinnedRight ? 0 : 1}
                        >
                            {
                                dragHandleComponent ?
                                    <DragHandle index={index}>{dragHandleComponent()}</DragHandle>
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
                            column.resizable !== false ?
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

export default HeaderCell;