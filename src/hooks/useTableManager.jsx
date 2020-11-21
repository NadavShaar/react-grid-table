import { useState, useEffect, useRef, useMemo } from 'react';
import { useRowVirtualizer, useColumns, useSort, useSearch, usePagination, useRowSelection, useRowEdit, useRows, useOnRowsRequest } from '../hooks/';
import defaultIcons from '../defaultIcons'; 

export default function useTableManager(props) {
    props = {
        ...props,
        isVirtualScrolling: props.isVirtualScrolling || (!props.isPaginated && props.onRowsRequest),
        textConfig: {
            search: 'Search:',
            totalRows: 'Total rows:',
            rows: 'Rows:',
            selected: 'Selected',
            rowsPerPage: 'Rows per page:',
            page: 'Page:',
            of: 'of',
            prev: 'Prev',
            next: 'Next',
            columnVisibility: 'Column visibility',
            ...props.textConfig
        }
    }

    // **************** State ****************

    let [tableManager] = useState({
        refs: {},
        handlers: {},
        components: {},
        columnsData: {},
        params: {},
        rowsData: {},
        additionalProps: {},
        icons: {},
        rowVirtualizer: {},
        request: {
            from: -1,
            to: 0
        },
        isMounted: false,
        isColumnReordering: false
    });
    let [{ columns, visibleColumns }, setColumns, toggleColumnVisibility, onColumnReorderStart, onColumnReorderEnd] = useColumns(props, tableManager);
    let [sort, handleSort] = useSort(props, tableManager);
    let [searchText, handleSearchChange] = useSearch(props, tableManager);
    let [selectedRowsIds, updateSelectedItems, toggleItemSelection] = useRowSelection(props, tableManager);
    let [updatedRow, handleRowEdit, handleRowEditIdChange] = useRowEdit(props, tableManager);
    let { rows, totalRows } = useRows(props, tableManager, { sort, searchText, columns });
    let [{ page, pageSize, totalPages, pageRows }, handlePagination, handlePageSizeChange] = usePagination(props, tableManager, { rows, totalRows });
    // **************** Table params ****************

    Object.assign(tableManager.refs, {
        tableRef: useRef(null),
        rgtRef: useRef(null)
    })
    Object.assign(tableManager.handlers, {
        handlePageSizeChange,
        handleRowEdit,
        updateSelectedItems,
        toggleItemSelection,
        handlePagination,
        toggleColumnVisibility,
        handleSearchChange,
        handleRowEditIdChange,
        onRowClick: props.onRowClick,
        getIsRowEditable: props.getIsRowEditable,
        getIsRowSelectable: props.getIsRowSelectable,
        handleSort,
        setColumns,
        onResize: props.onResize,
        onResizeEnd: props.onResizeEnd,
        onColumnReorderStart,
        onColumnReorderEnd,
        onRowsChange: props.onRowsChange
    })
    Object.assign(tableManager.components, {
        searchComponent: props.searchComponent,
        columnVisibilityComponent: props.columnVisibilityComponent,
        headerComponent: props.headerComponent,
        footerComponent: props.footerComponent,
        loaderComponent: props.loaderComponent,
        noResultsComponent: props.noResultsComponent,
        informationComponent: props.informationComponent,
        pageSizeComponent: props.pageSizeComponent,
        paginationComponent: props.paginationComponent,
        dragHandleComponent: props.dragHandleComponent,
    })
    Object.assign(tableManager.columnsData, {
        columns,
        visibleColumns,
    })
    Object.assign(tableManager.params, {
        sort,
        page,
        searchText,
        totalPages,
        pageSize,
        tableHasSelection: !!columns.find(cd => cd.id === 'checkbox'),
        highlightSearch: props.highlightSearch,
        searchMinChars: props.searchMinChars,
        showSearch: props.showSearch,
        showRowsInformation: props.showRowsInformation,
        showColumnVisibilityManager: props.showColumnVisibilityManager,
        isHeaderSticky: props.isHeaderSticky,
        isPaginated: props.isPaginated,
        isVirtualScrolling: props.isVirtualScrolling,
        disableColumnsReorder: props.disableColumnsReorder,
        pageSizes: props.pageSizes,
        textConfig: props.textConfig
    })
    Object.assign(tableManager.rowsData, {
        allRows: props.rows,
        rows,
        pageItems: pageRows,
        updatedRow,
        selectedRowsIds,
        rowIdField: props.rowIdField,
        totalRows
    })
    Object.assign(tableManager.additionalProps, {
        headerCell: props.headerCellProps || {},
        cell: props.cellProps || {},
        rowVirtualizer: props.rowVirtualizerProps || {}
    })
    Object.assign(tableManager.icons, {
        ...defaultIcons,
        ...props.icons
    })

    Object.assign(tableManager.rowVirtualizer, useRowVirtualizer(props, tableManager));

    // **************** Life cycles ****************

    useEffect(() => {
        if (!tableManager.isMounted) return;
        if (page === 1) return;
        
        handlePagination(1);
    }, [searchText, pageSize])

    useEffect(() => {
        if (!tableManager.isMounted) return;
        
        if (props.onRowsRequest) {
            tableManager.request = {
                from: -1,
                to: 0
            }
            props.onRowsReset?.();
            updateSelectedItems([]);
        }
    }, [searchText, sort])

    useEffect(() => {
        if (updatedRow) handleRowEditIdChange(null);
    }, [searchText, sort, page])

    useEffect(() => {
        tableManager.isMounted = true;
        props.onLoad?.(tableManager);
    }, [])


    // **************** Handlers ****************

    useOnRowsRequest(props, tableManager);

    return tableManager
}