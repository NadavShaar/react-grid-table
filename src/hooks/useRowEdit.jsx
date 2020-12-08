import { useState, useCallback, useEffect, useRef } from 'react';

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

    rowEditApi.editRowId = props.editRowId;
    rowEditApi.setEditRow = setEditRow;
    rowEditApi.editRow = editRow;
    rowEditApi.getIsRowEditable = props.getIsRowEditable;

    rowEditApi.setEditRowId = useCallback(rowEditId => {
        setEditRow(rowEditId && pageRows.find(item => item && (item[rowIdField] === rowEditId)) || null);
        props.onEditRowIdChange?.(rowEditId, tableManager);
    })

    useEffect(() => {
        setEditRow(pageRows.find(item => item && (item[rowIdField] === rowEditApi.editRowId)) || null);
    }, [rowEditApi.editRowId, pageRows, rowIdField])

    return rowEditApi;
}