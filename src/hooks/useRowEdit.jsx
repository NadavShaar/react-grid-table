import { useState, useEffect, useRef } from 'react';

const useRowEdit = (props, tableManager) => {
    const { config: { rowIdField }, paginationApi: { pageRows } } = tableManager;

    const rowEditApi = useRef({}).current;
    const [editRow, setEditRow] = useState(null);
    const [editRowId, setEditRowId] = useState(null);

    rowEditApi.editRowId = props.editRowId ?? editRowId;
    rowEditApi.setEditRow = setEditRow;
    rowEditApi.editRow = editRow;
    rowEditApi.getIsRowEditable = props.getIsRowEditable;

    rowEditApi.setEditRowId = rowEditId => {
        if (props.rowEditId === undefined || props.onEditRowIdChange === undefined) setEditRowId(rowEditId);
        props.onEditRowIdChange?.(rowEditId, tableManager);
    }

    useEffect(() => {
        rowEditApi.setEditRow(rowEditApi.editRowId && pageRows.find(item => item && (item[rowIdField] === rowEditApi.editRowId)) || null);
    }, [rowEditApi.editRowId, rowIdField])

    return rowEditApi;
}

export default useRowEdit;