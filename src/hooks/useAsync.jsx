import { useRef, useEffect } from "react";
import { uuid } from "../utils";
import { useRequestDebounce } from ".";

function getRowsRequest(tableManager, rowsRequests) {
    const {
        config: { isPaginated, isVirtualScroll },
        rowsApi: { totalRows },
        searchApi: { searchText },
        sortApi: { sort },
        paginationApi: { page, pageSize },
        rowVirtualizer: { virtualItems },
        asyncApi: { batchSize },
    } = tableManager;

    // get starting indexes (100, 100)
    let from = isPaginated ? (page - 1) * pageSize : 0;
    let to = from;

    // get exact indexes via virtualItems (113, 157)
    if (isVirtualScroll) {
        from += virtualItems[0]?.index || 0;
        to += virtualItems[virtualItems.length - 1]?.index || 0;
    }

    // get the required batch limits (100, 200)
    from -= from % batchSize;
    to += batchSize - (to % batchSize);

    // make sure "to" does not exceed "totalRows"
    if (rowsRequests.length) {
        to = Math.min(to, totalRows);
    }

    // make sure "from" does not overlap previous requests
    rowsRequests.forEach((request) => {
        if (request.from <= from && from <= request.to) {
            from = request.to;
        }
    });

    // make sure "to" does not overlap previous requests
    // make sure no previous requests are between "from" & "to"
    rowsRequests
        .slice()
        .reverse()
        .find((request) => {
            if (request.from <= to && to <= request.to) {
                to = request.from;
            }
            if (from < request.from && request.to < to) {
                to = request.from;
            }
        });

    // make sure "to" does not exceed "batchSize"
    to = Math.min(to, from + batchSize);

    return {
        from,
        to,
        searchText,
        sort,
        id: uuid(),
    };
}

const useAsync = (props, tableManager) => {
    const {
        mode,
        config: { requestDebounceTimeout },
        rowsApi: { rows, totalRows },
        paginationApi: { pageSize },
        searchApi: { validSearchText },
    } = tableManager;

    const asyncApi = useRef({}).current;
    const rowsRequests = useRef([]);

    asyncApi.batchSize = props.batchSize ?? pageSize;
    asyncApi.isLoading = (() => {
        if (!rowsRequests.current.length) return true;
        if (totalRows === 0) return false;
        if (!rowsRequests.current.every((request) => rows[request.from]))
            return true;
    })();

    const onRowsRequest = async (rowsRequest) => {
        rowsRequests.current = [...rowsRequests.current, rowsRequest];
        asyncApi.lastRowsRequestId = rowsRequest.id;

        const result = await props.onRowsRequest(rowsRequest, tableManager);

        if (
            !rowsRequests.current.find(
                (request) => request.id === rowsRequest.id
            )
        )
            return;

        const {
            rowsApi: { rows, setRows, setTotalRows },
        } = tableManager;

        if (result?.rows) {
            const newRows = asyncApi.mergeRowsAt(
                rows,
                result.rows,
                rowsRequest.from
            );
            setRows(newRows);
        }
        if (result?.totalRows !== undefined) setTotalRows(result.totalRows);
    };

    const debouncedOnRowsRequest = useRequestDebounce(
        onRowsRequest,
        requestDebounceTimeout
    );

    asyncApi.resetRows = () => {
        if (mode === "sync") return;

        const {
            rowsApi: { setRows, setTotalRows },
            rowSelectionApi: { setSelectedRowsIds },
            rowEditApi: { editRow, setEditRowId },
        } = tableManager;

        setSelectedRowsIds([]);
        if (editRow) setEditRowId(null);

        rowsRequests.current = [];
        if (props.onRowsReset) props.onRowsReset(tableManager);
        else {
            setRows([]);
            setTotalRows(null);
        }
    };

    asyncApi.mergeRowsAt = (rows, newRows, at) => {
        const holes = [];
        holes.length = Math.max(at - rows.length, 0);
        holes.fill(null);

        rows = rows.concat(holes);
        rows.splice(at, newRows.length, ...newRows);
        return rows;
    };

    // reset rows
    useEffect(() => {
        if (!tableManager.isInitialized) return;
        if (mode === "sync") return;

        asyncApi.resetRows();
    }, [
        validSearchText,
        asyncApi,
        mode,
        tableManager.isInitialized,
        tableManager.sortApi.sort.colId,
        tableManager.sortApi.sort.isAsc,
    ]);

    useEffect(() => {
        if (mode === "sync") return;

        const rowsRequest = getRowsRequest(tableManager, rowsRequests.current);

        if (rowsRequest.to <= rowsRequest.from) return;

        const isFirstRequest = !rowsRequests.current.length;
        if (isFirstRequest) onRowsRequest(rowsRequest);
        else debouncedOnRowsRequest(rowsRequest);
    });

    return asyncApi;
};

export default useAsync;
