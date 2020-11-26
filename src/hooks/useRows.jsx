import { useMemo, useRef, useEffect, useCallback } from 'react';

const DEFAULT_ROWS_REQUEST_DATA = {
    from: -1,
    to: 0
}

export default (props, tableManager) => {
    let {
        searchApi: {
            searchRows,
        },
        sortApi: {
            sortRows,
        }
    } = tableManager;

    const rowsApi = useRef({}).current;
    const requestRowsData = useRef(DEFAULT_ROWS_REQUEST_DATA);

    Object.defineProperty(rowsApi, "onRowClick", { enumerable: false, writable: true });
    
    rowsApi.allRows = props.rows
    rowsApi.onRowClick = props.onRowClick
    rowsApi.requestRowsData = props.requestRowsData

    rowsApi.rows = useMemo(() => {
        let rows = props.rows;
        
        if (!props.onRowsRequest) {
            rows = searchRows(rows);
            rows = sortRows(rows);
        }

        return rows;
    }, [rowsApi.allRows, props.onRowsRequest, searchRows, sortRows]);

    rowsApi.totalRows = props.totalRows ?? rowsApi.rows.length;

    rowsApi.resetRows = useCallback(() => {
        if (!props.onRowsRequest) return;

        requestRowsData.current = DEFAULT_ROWS_REQUEST_DATA;
        props.onRowsReset?.();
    })

    useEffect(() => {
        if (!props.onRowsRequest) return;

        let {
            config: {
                isPaginated,
                isVirtualScroll,
            },
            paginationApi: {
                page,
                pageSize,
            },
            rowVirtualizer: {
                virtualItems,
            },
        } = tableManager;
        
        let {
            from,
            to
        } = requestRowsData.current

        let lastIndex = 0;
        if (isPaginated && !isVirtualScroll) {
            lastIndex = page * pageSize;
        }
        else {
            lastIndex = virtualItems[virtualItems.length - 1]?.index + ((page - 1) * pageSize) || 0;
        }
        lastIndex = Math.min(lastIndex, rowsApi.totalRows);

        if ((lastIndex <= to) && (from !== -1)) return;

        from = to;
        to = from + pageSize - (isPaginated ? ((from) % pageSize) : 0);
        if (Number(rowsApi.totalRows)) to = Math.min(to, rowsApi.totalRows);
        requestRowsData.current = {
            from,
            to
        }
        props.onRowsRequest(requestRowsData.current, tableManager)
    });

    return rowsApi;
}