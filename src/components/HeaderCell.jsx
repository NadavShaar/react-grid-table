import React, { useRef, useEffect, useState } from 'react';
import {SortableElement, SortableHandle} from 'react-sortable-hoc';
import useResizeEvents from '../hooks/useResizeEvents';

const SortableItem = SortableElement(({children, index, columnId, className}) => <div className={className} data-column-id={columnId} key={index}>{children}</div>);
const DragHandle = SortableHandle(({children, index}) => <React.Fragment>{children}</React.Fragment>);

const HeaderCell = (props) => {

    let {
        index, 
        column,
        className,
        sortBy,
        sortAsc,
        handleSort,
        selectAllIsChecked,
        toggleSelectAll,
        selectAllIsDisabled,
        isPinnedLeft,
        isPinnedRight,
        sortIcons,
        dragHandleRenderer,
        isHeaderSticky,
        handleResizeEnd,
        handleResize,
        disableColumnsReorder,
        isSelectAllIndeterminate,
        visibleColumnsLength,
        ...rest
    } = props;
    
    let resizeHandleRef = useRef(null);
    let selectAllRef = useRef(null);

    const [target, setTarget] = useState(resizeHandleRef?.current || null);

    useResizeEvents(target, column, handleResize, handleResizeEnd);

    useEffect(() => {
        setTarget(resizeHandleRef.current);
    }, [column])
    
    useEffect(() => {
        if(!selectAllRef.current) return;

        if(isSelectAllIndeterminate) selectAllRef.current.indeterminate = true;
        else selectAllRef.current.indeterminate = false;
    }, [isSelectAllIndeterminate])

    let classes = column.id === 'virtual' ? `rgt-cell-header rgt-cell-header-virtual-col${isHeaderSticky ? ' rgt-cell-header-sticky' : ''}`.trim() : `rgt-cell-header rgt-cell-header-${column.id === 'checkbox' ? 'checkbox' : column.field}${(column.sortable !== false && column.id  !== 'checkbox' && column.id !== 'virtual') ? ' rgt-clickable' : ''}${column.sortable !== false && column.id !== 'checkbox' ? ' rgt-cell-header-sortable' : ' rgt-cell-header-not-sortable'}${isHeaderSticky ? ' rgt-cell-header-sticky' : ''}${column.resizable !== false ? ' rgt-cell-header-resizable' : ' rgt-cell-header-not-resizable'}${column.searchable !== false && column.id !== 'checkbox' ? ' rgt-cell-header-searchable' : ' rgt-cell-header-not-searchable'}${column.pinned && index === 0 ? ' rgt-cell-header-pinned rgt-cell-header-pinned-left' : ''}${column.pinned && index === visibleColumnsLength ? ' rgt-cell-header-pinned rgt-cell-header-pinned-right' : ''} ${column.className}`.trim() 

    let sortingProps = (column.sortable !== false && column.id  !== 'checkbox' && column.id !== 'virtual') ? {onClick: e => handleSort(column.id)} : {};

    return (
        <div 
            data-column-id={(column.id).toString()}
            id={`rgt-column-${column.id === 'virtual' ? 'virtual' : column.id === 'checkbox' ? 'checkbox' : column.field.toLowerCase()}`}
            style={{minWidth: column.minWidth, maxWidth: column.maxWidth}}
            className={classes}
            {...sortingProps}
            { ...rest }
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
                                dragHandleRenderer ?
                                    <DragHandle index={index}>{dragHandleRenderer()}</DragHandle>
                                    :
                                    null
                            }
                            {
                                (column.id === 'checkbox') ?
                                    <div className="rgt-header-checkbox-cell">
                                        {
                                            column.headerCellRenderer ?
                                                column.headerCellRenderer({isChecked: selectAllIsChecked, callback: toggleSelectAll, disabled: selectAllIsDisabled})
                                                :
                                                <input 
                                                    ref={selectAllRef}
                                                    className={selectAllIsDisabled ? 'rgt-disabled' : 'rgt-clickable'}
                                                    disabled={selectAllIsDisabled}
                                                    type="checkbox" 
                                                    onChange={toggleSelectAll} 
                                                    checked={selectAllIsChecked} 
                                                />
                                        }
                                    </div>
                                    :
                                    column.headerCellRenderer ? 
                                        column.headerCellRenderer({label: (typeof column.label === 'string' ? column.label : column.field), column: column})
                                        :
                                        <span className='rgt-text-truncate' data-column-id={(column.id).toString()}>
                                            {typeof column.label === 'string' ? column.label : column.field}
                                        </span>
                            }
                            {
                                (sortBy === column.id) ? 
                                    sortAsc ? 
                                        <span className='rgt-sort-icon rgt-sort-icon-ascending'>{sortIcons && sortIcons.ascending}</span> 
                                        :
                                        sortAsc === false ?
                                            <span className='rgt-sort-icon rgt-sort-icon-descending'>{sortIcons && sortIcons.descending}</span> 
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