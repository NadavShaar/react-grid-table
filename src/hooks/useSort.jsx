import { useState, useCallback, useRef } from 'react';

const DEFAULT_SORT = {
    colId: null,
    isAsc: null
}

export default (props, tableManager) => {
    let {
        columnsApi: {
            columns,
        },
    } = tableManager;

    const sortApi = useRef({}).current;
    let [sort, setSort] = useState(DEFAULT_SORT);

    sortApi.sort = props.sort ?? sort;

    sortApi.setSort = useCallback(({colId, isAsc}) => {
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

    sortApi.toggleSort = useCallback(colId => {
        let isAsc = true;
        if (sortApi.sort.colId === colId) isAsc = sortApi.sort.isAsc ? false : sortApi.sort.isAsc === false ? null : true;
        if (isAsc === null) colId = null;

        sortApi.setSort({ colId, isAsc })
    })

    return sortApi;
}