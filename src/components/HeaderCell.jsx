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
        stickyHeader,
        handleResizeEnd,
        handleResize,
        ...rest
    } = props;
    
    let resizeHandleRef = useRef(null);
    const [target, setTarget] = useState(resizeHandleRef?.current || null);
    useResizeEvents(target, column, handleResize, handleResizeEnd);

    useEffect(() => {
        setTarget(resizeHandleRef.current);
    }, [column])

    let sortingProps = (column.sortable !== false && column.field  !== 'checkbox' && !column.isVirtual) ? {onClick: e => handleSort(column.id)} : {};
    let disabledColumnSort = column.sortableColumn === false || isPinnedRight || isPinnedLeft;

    return (
        <div 
            data-column-id={(column.id).toString()}
            id={`rgt-column-${column.isVirtual ? 'virtual' : column.field.toLowerCase()}`}
            style={{minWidth: column.minWidth, maxWidth: column.maxWidth}}
            className={className}
            {...sortingProps}
            { ...rest }
        >
            {
                (!column.isVirtual) ?
                    <React.Fragment>
                        <SortableItem 
                            disabled={disabledColumnSort} 
                            className={`rgt-cell-header-inner${column.field === 'checkbox' ? ' rgt-cell-header-inner-checkbox-column' : ''}${!isPinnedRight ? ' rgt-cell-header-inner-not-pinned-right' : '' }`}
                            index={index} 
                            columnId={(column.id).toString()}
                            collection={isPinnedLeft || isPinnedRight ? 0 : 1}
                        >
                            {
                                dragHandleRenderer && !disabledColumnSort ?
                                    <DragHandle index={index}>{dragHandleRenderer()}</DragHandle>
                                    :
                                    null
                            }
                            {
                                (column.field === 'checkbox') ?
                                    <div className="rgt-header-checkbox-cell">
                                        {
                                            column.headerCellRenderer ?
                                                column.headerCellRenderer({isChecked: selectAllIsChecked, callback: toggleSelectAll, disabled: selectAllIsDisabled})
                                                :
                                                <input 
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
                                        <span className='rgt-sort-icon rgt-sort-icon-ascending'>{sortIcons.ascending}</span> 
                                        :
                                        sortAsc === false ?
                                            <span className='rgt-sort-icon rgt-sort-icon-descending'>{sortIcons.descending}</span> 
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