import { useState, useCallback, useRef } from 'react';

export default (props, tableManager) => {
    let {
        config: {
            isPaginated
        },
        rowsApi: {
            rows,
            totalRows
        }
    } = tableManager;

    const paginationApi = useRef({}).current;
    let [page, setPage] = useState(props.page || 1);
    let [pageSize, setPageSize] = useState(props.pageSize || 20);

    paginationApi.page = props.page ?? page;
    paginationApi.pageSize = props.pageSize ?? pageSize;
    paginationApi.totalPages = Math.ceil(totalRows / paginationApi.pageSize);
    paginationApi.pageRows = rows;

    if (isPaginated) paginationApi.pageRows = rows.slice((paginationApi.pageSize * paginationApi.page - paginationApi.pageSize), (paginationApi.pageSize * paginationApi.page));

    paginationApi.setPage = useCallback(page => {
        page = ~~page;
        if ((page < 1) || (paginationApi.totalPages < page)) return;

        if (props.page === undefined || props.onPageChange === undefined) setPage(page);
        props.onPageChange?.(page);

        setTimeout(() => { tableManager.refs.tableRef.current.scrollTop = 0 }, 0);
    })

    paginationApi.setPageSize = useCallback(pageSize => {
        pageSize = ~~pageSize;
        if (props.pageSize === undefined || props.onPageSizeChange === undefined) setPageSize(pageSize);
        props.onPageSizeChange?.(pageSize);
    })

    return paginationApi;
}