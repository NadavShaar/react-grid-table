import { useMemo, useRef, useState } from 'react';

const useRows = (props, tableManager) => {
    const { mode, searchApi: { searchRows }, sortApi: { sortRows } } = tableManager;

    const rowsApi = useRef({}).current;
    let [rows, setRows] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    Object.defineProperty(rowsApi, "onRowClick", { enumerable: false, writable: true });
    
    rowsApi.rows = useMemo(() => {
        let newRows = props.rows ?? rows;

        if (mode === 'sync') {
            newRows = searchRows(newRows);
            newRows = sortRows(newRows);
        }

        return newRows;
    }, [props.rows, rows, mode, searchRows, sortRows]);

    rowsApi.onRowClick = props.onRowClick;
    rowsApi.totalRows = mode === 'sync' ? rowsApi.rows?.length : (props.totalRows ?? totalRows);

    rowsApi.setRows = rows => {
        if (props.onRowsChange === undefined) setRows(rows);
        props.onRowsChange?.(rows, tableManager);
    };

    rowsApi.setTotalRows = totalRows => {
        if (props.onTotalRowsChange === undefined) setTotalRows(totalRows);
        props.onTotalRowsChange?.(totalRows, tableManager);
    };

    return rowsApi;
}

export default useRows;