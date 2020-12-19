import { useMemo, useRef, useState } from 'react';

export default (props, tableManager) => {
    let {
        mode,
        searchApi: {
            searchRows,
        },
        sortApi: {
            sortRows,
        }
    } = tableManager;

    const rowsApi = useRef({}).current;
    const [rows, setRows] = useState([]);
    const [totalRows, setTotalRows] = useState();

    Object.defineProperty(rowsApi, "onRowClick", { enumerable: false, writable: true });
    
    rowsApi.onRowClick = props.onRowClick;

    rowsApi.rows = useMemo(() => {
        let rows1 = props.rows ?? rows;
        
        if (mode === 'sync') {
            rows1 = searchRows(rows1);
            rows1 = sortRows(rows1);
        }

        return rows1;
    }, [props.rows, rows, mode, searchRows, sortRows]);

    rowsApi.setRows = rows => {
        if (props.onRowsChange === undefined) setRows(rows);
        props.onRowsChange?.(rows, tableManager);
    };

    rowsApi.totalRows = mode === 'sync' ? rowsApi.rows?.length : (props.totalRows ?? totalRows);

    rowsApi.setTotalRows = totalRows => {
        if (props.onTotalRowsChange === undefined) setTotalRows(totalRows);
        props.onTotalRowsChange?.(totalRows, tableManager);
    };;

    return rowsApi;
}