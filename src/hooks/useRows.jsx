import { useMemo, useRef, useEffect, useCallback } from 'react';
import { requestDebounce, uuid } from '../utils';

const DEFAULT_ROWS_REQUEST_DATA = {
    from: -1,
    to: 0
}

export default (props, tableManager) => {
    let {
        config: {
            requestDebounceTimeout
        },
        searchApi: {
            searchRows,
        },
        sortApi: {
            sortRows,
        }
    } = tableManager;

    const rowsApi = useRef({}).current;
    const requestRowsData = useRef([]);
    const onRowsRequest = useCallback((currentRequestRowsData) => {
        requestRowsData.current.push(currentRequestRowsData);
        rowsApi.requestId = currentRequestRowsData.id;
        props.onRowsRequest(currentRequestRowsData, tableManager)
    }, [])
    const debouncedOnRowsRequest = useCallback(requestDebounce(onRowsRequest, requestDebounceTimeout), [])

    Object.defineProperty(rowsApi, "onRowClick", { enumerable: false, writable: true });
    
    rowsApi.allRows = props.rows
    rowsApi.onRowClick = props.onRowClick

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

        requestRowsData.current = [];
        props.onRowsReset?.(tableManager);
    })

    rowsApi.mergeRowsAt = useCallback((rows, newRows, at) => {
        let holes = [];
        holes.length = Math.max(at - rows.length, 0);
        holes.fill(null);

        rows = rows.concat(holes);
        rows.splice(at, newRows.length, ...newRows);
        return rows;
    }, [])

    useEffect(() => {
        if (!props.onRowsRequest) return;

        let {
            config: {
                isPaginated,
                isVirtualScroll,
                batchSize
            },
            paginationApi: {
                page,
                pageSize,
            },
            rowVirtualizer: {
                virtualItems,
            },
        } = tableManager;

        let from = (page - 1) * pageSize;
        let to = from;
        if (isVirtualScroll) {
            from += (virtualItems[0]?.index || 0);
            to += (virtualItems[virtualItems.length - 1]?.index || 0);
        }
        from -= (from % batchSize);
        to += (batchSize - (to % batchSize));
        if (requestRowsData.current.length) {
            to = Math.min(to, rowsApi.totalRows);
        }

        requestRowsData.current.forEach(r => {
            if ((r.from <= from) && (from <= r.to)) {
                from = r.to;
            };
        })

        requestRowsData.current.slice().reverse().find(r => {
            if ((r.from <= to) && (to <= r.to)) {
                to = r.from;
            };
            if ((from < r.from) && (r.to < to)) {
                to = r.from;
            };
        })

        to = Math.min(to, from + batchSize);

        if (to <= from) return;

        if (from === 0) onRowsRequest({ from, to, id: uuid() });
        else debouncedOnRowsRequest({ from, to, id: uuid() });
    });

    return rowsApi;
}