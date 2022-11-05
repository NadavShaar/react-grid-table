import { useState, useRef, useEffect, useMemo } from "react";

const useRowSelection = (props, tableManager) => {
    const {
        config: { rowIdField },
        rowsApi: { rows },
        paginationApi: { pageRows },
    } = tableManager;

    const rowSelectionApi = useRef({}).current;
    const [selectedRowsIds, setSelectedRowsIds] = useState([]);

    rowSelectionApi.selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    rowSelectionApi.getIsRowSelectable = props.getIsRowSelectable;

    rowSelectionApi.setSelectedRowsIds = (newSelectedItems) => {
        if (
            props.selectedRowsIds === undefined ||
            props.onSelectedRowsChange === undefined
        )
            setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems, tableManager);
    };

    rowSelectionApi.toggleRowSelection = (rowId) => {
        const newSelectedRowsIds = [...rowSelectionApi.selectedRowsIds];

        const itemIndex = newSelectedRowsIds.findIndex((s) => s === rowId);

        if (itemIndex !== -1) newSelectedRowsIds.splice(itemIndex, 1);
        else newSelectedRowsIds.push(rowId);

        rowSelectionApi.setSelectedRowsIds(newSelectedRowsIds);
    };

    const selectAllRef = useRef(null);

    const {
        selectedRowsIds: selectedRows,
        setSelectedRowsIds: setSelectedRows,
        getIsRowSelectable,
    } = rowSelectionApi;

    rowSelectionApi.selectAll = useMemo(() => {
        const mode = props.selectAllMode;
        const allRows = mode === "all" ? rows : pageRows;
        const selectableItemsIds = allRows
            .filter((row) => row)
            .filter(getIsRowSelectable)
            .map((item) => item[rowIdField]);
        const checked =
            selectableItemsIds.length &&
            selectableItemsIds.every((selectableItemId) =>
                selectedRows.find((id) => selectableItemId === id)
            );
        const disabled = !selectableItemsIds.length;
        const indeterminate = !!(
            selectedRows.length &&
            !checked &&
            selectableItemsIds.some((selectableItemId) =>
                selectedRows.find((id) => selectableItemId === id)
            )
        );

        return {
            mode,
            ref: selectAllRef,
            checked,
            disabled,
            indeterminate,
            onChange: () => {
                let newSelectedRowsIds = [...selectedRows];

                if (checked || indeterminate)
                    newSelectedRowsIds = newSelectedRowsIds.filter(
                        (si) =>
                            !selectableItemsIds.find((itemId) => si === itemId)
                    );
                else
                    selectableItemsIds.forEach((s) =>
                        newSelectedRowsIds.push(s)
                    );

                setSelectedRows(newSelectedRowsIds);
            },
        };
    }, [
        props.selectAllMode,
        rows,
        pageRows,
        getIsRowSelectable,
        selectedRows,
        rowIdField,
        setSelectedRows,
    ]);

    useEffect(() => {
        if (!selectAllRef.current) return;

        selectAllRef.current.indeterminate =
            rowSelectionApi.selectAll.indeterminate;
    }, [rowSelectionApi.selectAll.indeterminate]);

    // filter selectedRows if their ids no longer exist in the rows
    useEffect(() => {
        if (!tableManager.isInitialized) return;

        const filteredSelectedRows = rowSelectionApi.selectedRowsIds.filter(
            (selectedRowId) =>
                tableManager.rowsApi.originalRows.find(
                    (row, i) =>
                        (row[tableManager.config.rowIdField] || i) ===
                        selectedRowId
                )
        );
        if (
            filteredSelectedRows.length !==
            rowSelectionApi.selectedRowsIds.length
        ) {
            rowSelectionApi.setSelectedRowsIds(filteredSelectedRows);
        }
    }, [
        tableManager.config.rowIdField,
        tableManager.isInitialized,
        tableManager.rowEditApi,
        rowSelectionApi,
        tableManager.rowsApi.originalRows,
    ]);

    return rowSelectionApi;
};

export default useRowSelection;
