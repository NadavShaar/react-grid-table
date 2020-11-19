import { useState, useCallback, useEffect } from 'react';

const useRowEdit = (props, tableManager) => {
    let [updatedRow, setUpdatedRow] = useState(null);

    const handleRowEditIdChange = useCallback(rowEditId => {
        setUpdatedRow(rowEditId && props.rows.find(item => item[props.rowIdField] === rowEditId) || null);
        props.onRowEditIdChange?.(rowEditId);
    })

    useEffect(() => {
        setUpdatedRow(props.rows.find(item => item[props.rowIdField] === props.editRowId) || null);
    }, [props.editRowId])

    return [updatedRow, setUpdatedRow, handleRowEditIdChange];
}

export default useRowEdit;