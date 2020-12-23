import { useState, useRef, useEffect, useMemo } from 'react';

export default (props, tableManager) => {
    let {
        config: {
            rowIdField,
        },
        rowsApi: {
            rows,
        },
        paginationApi: {
            pageRows,
        },
    } = tableManager;

    const rowSelectionApi = useRef({}).current;
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);

    rowSelectionApi.selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    rowSelectionApi.getIsRowSelectable = props.getIsRowSelectable;
    
    rowSelectionApi.setSelectedRowsIds = newSelectedItems => {
        if (props.selectedRowsIds === undefined || props.onSelectedRowsChange === undefined) setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems, tableManager);
    }

    rowSelectionApi.toggleRowSelection = rowId => {
        selectedRowsIds = [...rowSelectionApi.selectedRowsIds];

        let itemIndex = selectedRowsIds.findIndex(s => s === rowId);

        if (itemIndex !== -1) selectedRowsIds.splice(itemIndex, 1);
        else selectedRowsIds.push(rowId);

        rowSelectionApi.setSelectedRowsIds(selectedRowsIds);
    }

    let selectAllRef = useRef(null);

    rowSelectionApi.selectAll = useMemo(() => {
        const mode = props.selectAllMode;
        const availableRows = mode === 'available' ? rows : pageRows;
        const selectableItemsIds = availableRows.filter(r => r).filter(rowSelectionApi.getIsRowSelectable).map(item => item[rowIdField]);
        const checked = selectableItemsIds.length && selectableItemsIds.every(si => selectedRowsIds.find(id => si === id));
        const disabled = !selectableItemsIds.length;
        const indeterminate = !!(selectedRowsIds.length && !checked && selectableItemsIds.some(si => selectedRowsIds.find(id => si === id)));

        return {
            mode,
            ref: selectAllRef,
            checked,
            disabled,
            indeterminate,
            onChange: () => {
                let selectedIds = [...selectedRowsIds];

                if (checked || indeterminate) selectedIds = selectedIds.filter(si => !selectableItemsIds.find(itemId => si === itemId));
                else selectableItemsIds.forEach(s => selectedIds.push(s));

                rowSelectionApi.setSelectedRowsIds(selectedIds);
            }
        }
    }, [props.selectAllMode, pageRows, rows, rowSelectionApi.getIsRowSelectable, rowIdField, selectedRowsIds]);

    useEffect(() => {
        if (!selectAllRef.current) return;

        selectAllRef.current.indeterminate = rowSelectionApi.selectAll.indeterminate;
    })

    return rowSelectionApi;
}