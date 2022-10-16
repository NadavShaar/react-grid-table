import { useState, useEffect, useRef } from "react";

const useRowEdit = (props, tableManager) => {
    const {
        config: { rowIdField },
        paginationApi: { pageRows },
    } = tableManager;

    const rowEditApi = useRef({}).current;
    const [editRow, setEditRow] = useState(null);
    const [editRowId, setEditRowId] = useState(null);

    rowEditApi.editRowId = props.editRowId ?? editRowId;
    rowEditApi.setEditRow = setEditRow;
    rowEditApi.editRow = editRow;
    rowEditApi.getIsRowEditable = props.getIsRowEditable;

    rowEditApi.setEditRowId = (rowEditId) => {
        if (
            props.rowEditId === undefined ||
            props.onEditRowIdChange === undefined
        )
            setEditRowId(rowEditId);
        props.onEditRowIdChange?.(rowEditId, tableManager);
    };

    useEffect(() => {
        if (rowEditApi.editRow?.[rowIdField] === rowEditApi.editRowId) return;

        rowEditApi.setEditRow(
            pageRows.find(
                (item) => item?.[rowIdField] === rowEditApi.editRowId
            ) || null
        );
    }, [pageRows, rowEditApi, rowEditApi.editRowId, rowIdField]);

    // reset edit row
    useEffect(() => {
        if (
            !tableManager.paginationApi.pageRows.find(
                (row, i) =>
                    (row?.[tableManager.config.rowIdField] || i) ===
                    rowEditApi.editRowId
            )
        )
            tableManager.rowEditApi.setEditRowId(null);
    }, [
        rowEditApi.editRowId,
        tableManager.config.rowIdField,
        tableManager.paginationApi.pageRows,
        tableManager.rowEditApi,
    ]);

    return rowEditApi;
};

export default useRowEdit;
