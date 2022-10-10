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
        rowEditApi.setEditRow((prevState) => {
            if (prevState?.[rowIdField] === rowEditApi.editRowId) {
                return prevState;
            }

            return (
                pageRows.find(
                    (item) => item?.[rowIdField] === rowEditApi.editRowId
                ) || null
            );
        });
    }, [pageRows, rowEditApi, rowEditApi.editRowId, rowIdField]);

    return rowEditApi;
};

export default useRowEdit;
