import { useMemo, useRef, useState } from "react";

const useRows = (props, tableManager) => {
    const {
        mode,
        searchApi: { searchRows },
        sortApi: { sortRows },
    } = tableManager;

    const rowsApi = useRef({}).current;
    let [rows, setRows] = useState([]);
    const [totalRows, setTotalRows] = useState(null);

    Object.defineProperty(rowsApi, "onRowClick", {
        enumerable: false,
        writable: true,
    });

    rowsApi.originalRows = props.rows ?? rows;

    rowsApi.rows = useMemo(() => {
        let newRows = rowsApi.originalRows;

        if (mode === "sync") {
            newRows = searchRows(newRows);
            newRows = sortRows(newRows);
        }

        return newRows;
    }, [rowsApi.originalRows, mode, searchRows, sortRows]);

    rowsApi.onRowClick = props.onRowClick;
    rowsApi.totalRows =
        mode === "sync" ? rowsApi.rows?.length : props.totalRows ?? totalRows;

    rowsApi.setRows = (rows) => {
        if (props.onRowsChange === undefined) setRows(rows);
        props.onRowsChange?.(rows, tableManager);
    };

    rowsApi.setTotalRows = (totalRows) => {
        if (props.onTotalRowsChange === undefined) setTotalRows(totalRows);
        props.onTotalRowsChange?.(totalRows, tableManager);
    };

    return rowsApi;
};

export default useRows;
