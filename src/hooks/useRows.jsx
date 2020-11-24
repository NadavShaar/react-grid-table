import { useMemo, useRef, useEffect } from 'react';

export default (props, tableManager) => {
    const rowsApi = useRef({
        requestRowsData: {
            from: -1,
            to: 0
        }
    }).current;

    let {
        searchApi: {
            searchRows,
        },
        sortApi: {
            sortRows,
        }
    } = tableManager;

    rowsApi.onRowClick = props.onRowClick;
    rowsApi.setRows = props.onRowsChange;
    rowsApi.allRows = props.rows
    rowsApi.rowIdField = props.rowIdField;
    rowsApi.isLoading = props.isLoading;

    rowsApi.rows = useMemo(() => {
        let rows = props.rows;
        
        if (!props.onRowsRequest) {
            rows = searchRows(rows);
            rows = sortRows(rows);
        }

        return rows;
    }, [props.rows, props.onRowsRequest, searchRows, sortRows]);

    rowsApi.totalRows = props.totalRows ?? rowsApi.rows.length;

    useEffect(() => {
        if (!props.onRowsRequest) return;

        let {
            paginationApi: {
                page,
                pageSize,
                isPaginated,
            },
            rowVirtualizer: {
                virtualItems,
                isVirtualScrolling
            },
        } = tableManager;
        
        let {
            from,
            to
        } = rowsApi.requestRowsData

        let lastIndex = virtualItems[virtualItems.length - 1]?.index + ((page - 1) * pageSize) || 0;
        if (isPaginated && !isVirtualScrolling) {
            lastIndex = Math.min(page * pageSize, rowsApi.totalRows);
        }
        lastIndex = Math.min(lastIndex, rowsApi.totalRows);

        if ((lastIndex <= to) && (from !== -1)) return;

        from = to;
        to = from + pageSize - (isPaginated ? ((from) % pageSize) : 0);
        if (Number(rowsApi.totalRows)) to = Math.min(to, rowsApi.totalRows);
        rowsApi.requestRowsData = {
            from,
            to
        }
        props.onRowsRequest(rowsApi.requestRowsData, tableManager)
    });

    return rowsApi;
}