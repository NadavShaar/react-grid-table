import { useState, useCallback, useRef } from 'react';

export default (props, tableManager) => {
    const sortApi = useRef({}).current;

    let {
        columnsApi: {
            columns,
        },
    } = tableManager;

    let [sort, setSort] = useState(props.sort || {});

    sortApi.sort = props.sort ?? sort;

    sortApi.setSort = useCallback((colId, isAsc) => {
        let {
            columnsReorderApi: {
                isColumnReordering
            },
            columnsResizeApi: {
                isColumnResizing
            }
        } = tableManager;

        if (isColumnReordering) return;
        if (isColumnResizing) return;

        if (props.sort === undefined || props.onSortChange === undefined) setSort({ colId, isAsc });
        props.onSortChange?.({ colId, isAsc });
    })

    sortApi.sortRows = useCallback(rows => {
        var cols = columns.reduce((conf, coldef) => {
            conf[coldef.id] = coldef;
            return conf;
        }, {})

        if (sortApi.sort?.colId) {
            rows = [...rows];
            rows.sort((a, b) => {
                let aVal = cols[sortApi.sort.colId].getValue({ value: a[cols[sortApi.sort.colId].field], column: cols[sortApi.sort.colId] });
                let bVal = cols[sortApi.sort.colId].getValue({ value: b[cols[sortApi.sort.colId].field], column: cols[sortApi.sort.colId] });

                if (cols[sortApi.sort.colId].sortable === false) return 0;
                return cols[sortApi.sort.colId].sort({ a: aVal, b: bVal, isAscending: sortApi.sort.isAsc });
            });
        }

        return rows;
    }, [sortApi.sort, columns])

    return sortApi;
}