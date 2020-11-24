import { useState, useCallback, useEffect, useRef } from 'react';

export default (props, tableManager) => {
    const rowEditApi = useRef({}).current;

    let {
        rowsApi: {
            rowIdField
        },
        paginationApi: {
            pageRows,
        }
    } = tableManager;

    let [editRow, setEditRow] = useState(null);

    rowEditApi.setEditRow = setEditRow;
    rowEditApi.editRow = editRow;
    rowEditApi.getIsRowEditable = props.getIsRowEditable;

    rowEditApi.onRowEditIdChange = useCallback(rowEditId => {
        setEditRow(rowEditId && pageRows.find(item => item[rowIdField] === rowEditId) || null);
        props.onRowEditIdChange?.(rowEditId);
    })

    useEffect(() => {
        setEditRow(pageRows.find(item => item[rowIdField] === props.editRowId) || null);
    }, [props.editRowId, pageRows, rowIdField])

    return rowEditApi;
}