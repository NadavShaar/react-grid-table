import { useState, useEffect, useRef } from 'react';

export default (props, tableManager) => {
    let {
        config: {
            rowIdField
        },
        paginationApi: {
            pageRows,
        }
    } = tableManager;

    const rowEditApi = useRef({}).current;
    let [editRow, setEditRow] = useState(null);
    let [editRowId, setEditRowId] = useState(null);

    rowEditApi.editRowId = props.editRowId ?? editRowId;
    rowEditApi.setEditRow = setEditRow;
    rowEditApi.editRow = editRow;
    rowEditApi.getIsRowEditable = props.getIsRowEditable;

    rowEditApi.setEditRowId = rowEditId => {
        if (props.rowEditId === undefined || props.onEditRowIdChange === undefined) setEditRowId(rowEditId);
        props.onEditRowIdChange?.(rowEditId, tableManager);
    }

    useEffect(() => {
        setEditRow(rowEditApi.editRowId && pageRows.find(item => item && (item[rowIdField] === rowEditApi.editRowId)) || null);
    }, [rowEditApi.editRowId, pageRows, rowIdField])

    return rowEditApi;
}