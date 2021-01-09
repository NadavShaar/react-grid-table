import { useState, useRef, useEffect, useMemo } from 'react';

const useRowSelection = (props, tableManager) => {
    const { config: { rowIdField }, rowsApi: { rows }, paginationApi: { pageRows } } = tableManager;

    const rowSelectionApi = useRef({}).current;
    const [selectedRowsIds, setSelectedRowsIds] = useState([]);

    rowSelectionApi.selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    rowSelectionApi.getIsRowSelectable = props.getIsRowSelectable;

    rowSelectionApi.setSelectedRowsIds = newSelectedItems => {
        if (props.selectedRowsIds === undefined || props.onSelectedRowsChange === undefined) setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems, tableManager);
    }

    rowSelectionApi.toggleRowSelection = rowId => {
        const newSelectedRowsIds = [...rowSelectionApi.selectedRowsIds];

        const itemIndex = newSelectedRowsIds.findIndex(s => s === rowId);

        if (itemIndex !== -1) newSelectedRowsIds.splice(itemIndex, 1);
        else newSelectedRowsIds.push(rowId);

        rowSelectionApi.setSelectedRowsIds(newSelectedRowsIds);
    }

    const selectAllRef = useRef(null);

    rowSelectionApi.selectAll = useMemo(() => {
        const mode = props.selectAllMode;
        const availableRows = mode === 'available' ? rows : pageRows;
        const selectableItemsIds = availableRows.filter(r => r).filter(rowSelectionApi.getIsRowSelectable).map(item => item[rowIdField]);
        const checked = selectableItemsIds.length && selectableItemsIds.every(si => rowSelectionApi.selectedRowsIds.find(id => si === id));
        const disabled = !selectableItemsIds.length;
        const indeterminate = !!(rowSelectionApi.selectedRowsIds.length && !checked && selectableItemsIds.some(si => rowSelectionApi.selectedRowsIds.find(id => si === id)));

        return {
            mode,
            ref: selectAllRef,
            checked,
            disabled,
            indeterminate,
            onChange: () => {
                let newSelectedRowsIds = [...rowSelectionApi.selectedRowsIds];

                if (checked || indeterminate) newSelectedRowsIds = newSelectedRowsIds.filter(si => !selectableItemsIds.find(itemId => si === itemId));
                else selectableItemsIds.forEach(s => newSelectedRowsIds.push(s));

                rowSelectionApi.setSelectedRowsIds(newSelectedRowsIds);
            }
        }
    }, [props.selectAllMode, pageRows, rows, rowSelectionApi.getIsRowSelectable, rowIdField, rowSelectionApi.selectedRowsIds]);

    useEffect(() => {
        if (!selectAllRef.current) return;

        selectAllRef.current.indeterminate = rowSelectionApi.selectAll.indeterminate;
    }, [selectAllRef.current, rowSelectionApi.selectAll.indeterminate])

    return rowSelectionApi;
}

export default useRowSelection;