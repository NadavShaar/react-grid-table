import React, { useRef, useEffect } from 'react';

export default props => {
    let {
        column,
        style,
        tableManager
    } = props;

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

    let selectAllRef = useRef(null);

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

        if (selectAllIsChecked || isSelectAllIndeterminate) selectedIds = selectedIds.filter(si => !selectableItemsIds.find(itemId => si === itemId));
        else selectableItemsIds.forEach(s => selectedIds.push(s));

        setSelectedRowsIds(selectedIds);
    }

    return (
        <div className="rgt-cell-header-select-all" style={style}>
            <input
                ref={selectAllRef}
                className={selectAllIsDisabled ? 'rgt-disabled' : 'rgt-clickable'}
                disabled={selectAllIsDisabled}
                type="checkbox"
                onChange={onChange}
                checked={selectAllIsChecked}
            />
        </div>
    )
}