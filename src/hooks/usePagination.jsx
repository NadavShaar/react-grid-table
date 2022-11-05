import { useState, useRef, useMemo, useEffect } from "react";

const usePagination = (props, tableManager) => {
    const {
        mode,
        config: { isPaginated, pageSizes },
        rowsApi: { rows, totalRows },
    } = tableManager;

    const paginationApi = useRef({}).current;
    const [page, setPage] = useState(props.page || 1);
    const [pageSize, setPageSize] = useState(
        props.pageSize || pageSizes[0] || 20
    );

    paginationApi.pageSize = props.pageSize ?? pageSize;
    paginationApi.totalPages = Math.ceil(totalRows / paginationApi.pageSize);
    paginationApi.page = Math.max(
        1,
        Math.min(paginationApi.totalPages, props.page ?? page)
    );
    paginationApi.pageRows = useMemo(() => {
        if (!isPaginated) return rows;

        const pageRows = rows.slice(
            paginationApi.pageSize * paginationApi.page -
                paginationApi.pageSize,
            paginationApi.pageSize * paginationApi.page
        );

        // fill missing page rows with nulls - makes sure we display PlaceHolderCells when moving to a new page (while not using virtual scroll)
        if (mode !== "sync" && pageRows.length < paginationApi.pageSize) {
            let totalMissingRows = paginationApi.pageSize - pageRows.length;
            if (paginationApi.page === Math.max(paginationApi.totalPages, 1))
                totalMissingRows =
                    (totalRows % paginationApi.pageSize) - pageRows.length;
            for (let i = 0; i < totalMissingRows; i++) {
                pageRows.push(null);
            }
        }

        return pageRows;
    }, [
        isPaginated,
        rows,
        paginationApi.pageSize,
        paginationApi.page,
        paginationApi.totalPages,
        mode,
        totalRows,
    ]);

    paginationApi.setPage = (page) => {
        page = ~~page;
        page = Math.max(1, Math.min(paginationApi.totalPages, page));
        if (paginationApi.page === page) return;

        if (props.page === undefined || props.onPageChange === undefined)
            setPage(page);
        props.onPageChange?.(page, tableManager);

        setTimeout(() => (tableManager.refs.tableRef.current.scrollTop = 0), 0);
    };

    paginationApi.setPageSize = (pageSize) => {
        pageSize = ~~pageSize;

        if (
            props.pageSize === undefined ||
            props.onPageSizeChange === undefined
        )
            setPageSize(pageSize);
        props.onPageSizeChange?.(pageSize, tableManager);
    };

    // reset page number
    useEffect(() => {
        if (!tableManager.isInitialized) return;
        if (tableManager.paginationApi.page === 1) return;

        tableManager.paginationApi.setPage(1);
    }, [
        tableManager.searchApi.validSearchText,
        tableManager.isInitialized,
        paginationApi,
        paginationApi.pageSize,
        tableManager.paginationApi,
    ]);

    return paginationApi;
};

export default usePagination;
