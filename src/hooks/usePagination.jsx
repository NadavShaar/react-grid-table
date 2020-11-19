import { useState, useCallback } from 'react';

const usePagination = (props, tableManager, { rows, totalRows }) => {
    let [page, setPage] = useState(props.page || 1);
    let [pageSize, setPageSize] = useState(props.pageSize || 20);

    page = props.page ?? page;
    pageSize = props.pageSize ?? pageSize;
    const totalPages = Math.ceil(totalRows / pageSize);
    if (props.isPaginated) rows = rows.slice((pageSize * page - pageSize), (pageSize * page));

    const onPageChange = useCallback(page => {
        if ((page < 1) || (totalPages < page)) return;

        if (props.page === undefined || props.onPageChange === undefined) setPage(page);
        props.onPageChange?.(page);

        setTimeout(() => { tableManager.refs.tableRef.current.scrollTop = 0 }, 0);
    })

    const onPageSizeChange = useCallback(pageSize => {
        if (props.pageSize === undefined || props.onPageSizeChange === undefined) setPageSize(pageSize);
        props.onPageSizeChange?.(pageSize);
    })


    return [{ page, pageSize, totalPages, pageRows: rows }, onPageChange, onPageSizeChange];
}

export default usePagination;