import { useRef, useEffect, useState } from 'react';
import { uuid } from '../utils';
import { useRequestDebounce } from '.';

function getRowsRequest(tableManager, rowsRequests) {
    let {
        config: {
            isPaginated,
            isVirtualScroll,
            batchSize
        },
        rowsApi: {
            totalRows
        },
        paginationApi: {
            page,
            pageSize,
        },
        rowVirtualizer: {
            virtualItems,
        },
    } = tableManager;

    // get starting indexes (100, 100)
    let from = isPaginated ? (page - 1) * pageSize : 0;
    let to = from;

    // get exact indexes via virtualItems (113, 157)
    if (isVirtualScroll) {
        from += (virtualItems[0]?.index || 0);
        to += (virtualItems[virtualItems.length - 1]?.index || 0);
    }

    // get the required batch limits (100, 200)
    from -= (from % batchSize);
    to += (batchSize - (to % batchSize));

    // make sure "to" does not exceed "totalRows"
    if (rowsRequests.length) {
        to = Math.min(to, totalRows);
    }

    // make sure "from" does not overlap previous requests 
    rowsRequests.forEach(r => {
        if ((r.from <= from) && (from <= r.to)) {
            from = r.to;
        };
    })

    // make sure "to" does not overlap previous requests 
    // make sure no previous requests are between "from" & "to"
    rowsRequests.slice().reverse().find(r => {
        if ((r.from <= to) && (to <= r.to)) {
            to = r.from;
        };
        if ((from < r.from) && (r.to < to)) {
            to = r.from;
        };
    })

    // make sure "to" does not exceed "batchSize"
    to = Math.min(to, from + batchSize);

    return {
        from,
        to,
        id: uuid()
    };
}

export default (props, tableManager) => {
    let {
        mode,
        config: {
            requestDebounceTimeout
        },
        rowsApi: {
            rows
        }
    } = tableManager;

    const asyncApi = useRef({}).current;
    const [rowsRequests, setRowsRequests] = useState([]);

    asyncApi.isLoading = !rowsRequests.length || !rowsRequests.every(r => rows[r.from]);

    const onRowsRequest = async rowsRequest => {
        setRowsRequests([...rowsRequests, rowsRequest]);
        asyncApi.lastRowsRequestId = rowsRequest.id;
        const result = await props.onRowsRequest(rowsRequest, tableManager);
        let {
            rowsApi: {
                rows,
                setRows,
                setTotalRows
            }
        } = tableManager;
        if (result?.rows) {
            rows = asyncApi.mergeRowsAt(rows, result.rows, rowsRequest.from);
            setRows(rows);
        }
        if (result?.totalRows) setTotalRows(result.totalRows);
    };

    const debouncedOnRowsRequest = useRequestDebounce(onRowsRequest, requestDebounceTimeout);

    asyncApi.resetRows = () => {
        if (mode === 'sync') return;

        let {
            rowsApi: {
                setRows,
                setTotalRows
            }
        } = tableManager;

        setRowsRequests([]);
        if (props.onRowsReset === undefined) {
            setRows([]);
            setTotalRows(null);
        }
        props.onRowsReset?.(tableManager);
    }

    asyncApi.mergeRowsAt = (rows, newRows, at) => {
        let holes = [];
        holes.length = Math.max(at - rows.length, 0);
        holes.fill(null);

        rows = rows.concat(holes);
        rows.splice(at, newRows.length, ...newRows);
        return rows;
    }

    useEffect(() => {
        if (mode === 'sync') return;

        let rowsRequest = getRowsRequest(tableManager, rowsRequests);

        if (rowsRequest.to <= rowsRequest.from) return;

        let isFirstRequest = !rowsRequests.length;
        if (isFirstRequest) onRowsRequest(rowsRequest);
        else debouncedOnRowsRequest(rowsRequest);
    });

    return asyncApi;
}