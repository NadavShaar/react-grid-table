import React, { useRef, useEffect } from 'react';

export default props => {
    let {
        column,
        tableManager
    } = props;

    let {
        config: {
            rowIdField,
            additionalProps: {
                headerSelectionCell: additionalProps = {}
            },
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

    let selectableItemsIds = pageRows.filter(r => r).filter(getIsRowSelectable).map(item => item[rowIdField]);
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

    let classNames = selectAllIsDisabled ? 'rgt-disabled' : 'rgt-clickable';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <input
            {...additionalProps}
            className={classNames.trim()}
            type="checkbox"
            ref={selectAllRef}
            onChange={onChange}
            checked={selectAllIsChecked}
            disabled={selectAllIsDisabled}
        />
    )
}