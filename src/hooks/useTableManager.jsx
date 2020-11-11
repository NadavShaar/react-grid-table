import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useVirtual } from 'react-virtual';
import { Search, ColumnVisibility, Header, Footer, Loader, NoResults, Information, PageSize, Pagination } from '../components/';
import defaultIcons from './../defaultIcons'; 

var isColumnReordering;

export default function useTableManager(props) {


    // **************** State ****************

    let [columns, setCols] = useState(props.columns);
    let [sort, setSort] = useState(props.sort || {});
    let [page, setPage] = useState(1);
    let [updatedRow, setUpdatedRow] = useState(null);
    let [searchText, setSearchText] = useState(props.searchText || "");
    let [pageSize, setPageSize] = useState(props.pageSize || 20);
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);
    let [tableManager] = useState({
        refs: {},
        handlers: {},
        components: {},
        columnsData: {},
        params: {},
        rowsData: {},
        additionalProps: {},
        icons: {},
        rowVirtualizer: {}
    });

    // **************** Refs ****************

    const tableRef = useRef(null);
    const rgtRef = useRef(null);


    // **************** Table params ****************

    searchText = props.searchText ?? searchText;
    selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    sort = props.sort ?? sort;
    page = props.page ?? page;
    pageSize = props.pageSize ?? pageSize;
    columns = useMemo(getColumns, [props.columns, columns, props.minColumnWidth]); 
    let { pageItems, totalPages } = useMemo(getPageItems, [props.rows, sort, page, pageSize, totalPages, searchText])

    let visibleColumns = columns.filter(cd => cd.visible !== false);

    let lastColIsPinned = visibleColumns[visibleColumns.length-1]?.pinned;

    let virtualColConfig = {id: 'virtual', visible: true, width: "auto"};
    if(!lastColIsPinned) visibleColumns.push(virtualColConfig) 
    else visibleColumns.splice(visibleColumns.length-1, 0, virtualColConfig);

    let tableHasSelection = !!columns.find(cd => cd.id === 'checkbox');

    let textConfig = {
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

    // implements smooth scrolling when using virtual scrolling
    const scrollingRef = React.useRef();
    const scrollToFn = React.useCallback((offset, defaultScrollTo) => {
        const duration = 1000;
        const start = parentRef.current.scrollTop;
        const startTime = (scrollingRef.current = Date.now());

        const run = () => {
            if (scrollingRef.current !== startTime) return;
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
            const interpolated = start + (offset - start) * progress;

            if (elapsed < duration) {
                defaultScrollTo(interpolated);
                requestAnimationFrame(run);
            } else {
                defaultScrollTo(interpolated);
            }
        };

        requestAnimationFrame(run);
    }, []);

    if (props.isVirtualScrolling) {
        tableManager.rowVirtualizer = Object.assign(tableManager.rowVirtualizer, useVirtual({
            size: pageItems.length,
            parentRef: tableRef,
            scrollToFn,
            ...props.rowVirtualizerProps
        }));
    }

    tableManager.refs = Object.assign(tableManager.refs, {
        tableRef,
        rgtRef
    })
    tableManager.handlers = Object.assign(tableManager.handlers, {
        handlePageSizeChange,
        handleRowEdit,
        updateSelectedItems,
        toggleItemSelection,
        handlePagination,
        toggleColumnVisibility,
        handleSearchChange,
        handleRowEditIdChange,
        getHighlightedSearch,
        onRowClick: props.onRowClick,
        getIsRowEditable: props.getIsRowEditable,
        getIsRowSelectable: props.getIsRowSelectable,
        handleSort,
        setColumns,
        onResize: props.onResize,
        onResizeEnd: props.onResizeEnd,
        onColumnReorderStart,
        onColumnReorderEnd
    })
    tableManager.components = Object.assign(tableManager.components, {
        searchComponent: props.searchComponent || Search,
        columnVisibilityComponent: props.columnVisibilityComponent || ColumnVisibility,
        headerComponent: props.headerComponent || Header,
        footerComponent: props.footerComponent || Footer,
        loaderComponent: props.loaderComponent || Loader,
        noResultsComponent: props.noResultsComponent || NoResults,
        informationComponent: props.informationComponent || Information,
        pageSizeComponent: props.pageSizeComponent || PageSize,
        paginationComponent: props.paginationComponent || Pagination,
        dragHandleComponent: props.dragHandleComponent || null,
    })
    tableManager.columnsData = Object.assign(tableManager.columnsData, {
        columns,
        visibleColumns,
    })
    tableManager.params = Object.assign(tableManager.params, {
        lastColIsPinned,
        sort,
        page,
        searchText,
        highlightSearch: props.highlightSearch,
        searchMinChars: props.searchMinChars,
        totalPages,
        pageSize,
        tableHasSelection,
        showSearch: props.showSearch,
        showRowsInformation: props.showRowsInformation,
        showColumnVisibilityManager: props.showColumnVisibilityManager,
        isHeaderSticky: props.isHeaderSticky !== false,
        isPaginated: props.isPaginated,
        isVirtualScrolling: props.isVirtualScrolling,
        disableColumnsReorder: props.disableColumnsReorder,
        pageSizes: props.pageSizes,
        textConfig
    })
    tableManager.rowsData = Object.assign(tableManager.rowsData, {
        items: props.rows,
        pageItems,
        updatedRow,
        selectedRowsIds,
        rowIdField: props.rowIdField
    })
    tableManager.additionalProps = Object.assign(tableManager.additionalProps, {
        headerCell: props.headerCellProps || {},
        cell: props.cellProps || {},
        rowVirtualizer: props.rowVirtualizerProps || {}
    })
    tableManager.icons = Object.assign(tableManager.icons, {
        sortAscending: props.icons?.sortAscending || defaultIcons.sortAscending,
        sortDescending: props.icons?.sortDescending || defaultIcons.sortDescending,
        clearSelection: props.icons?.clearSelection || defaultIcons.clearSelection,
        columnVisibility: props.icons?.columnVisibility || defaultIcons.columnVisibility,
        loader: props.icons?.loader || defaultIcons.loader,
        search: props.icons?.search || defaultIcons.search
    })

    // **************** Life cycles ****************

    useEffect(() => {
        if (page !== 1) handlePageChange(1);
    }, [searchText, pageSize])

    useEffect(() => {
        if (updatedRow) handleRowEditIdChange(null);
    }, [searchText, sort, page])

    useEffect(() => {
        setUpdatedRow(pageItems.find(item => item[props.rowIdField] === props.editRowId) || null);
    }, [props.editRowId])

    useEffect(() => {
        props.onLoad?.(tableManager)
    }, [])


    // **************** Handlers ****************

    function getPageItems() {
        let pageItems = [...props.rows];

        var conf = columns.reduce((conf, coldef) => {
            conf[coldef.field] = coldef;
            return conf;
        }, {})
        var conf2 = columns.reduce((conf, coldef) => {
            conf[coldef.id] = coldef;
            return conf;
        }, {})

        if (searchText.length >= props.searchMinChars) {
            pageItems = pageItems.filter(item => Object.keys(item).some(key => {
                if (conf[key] && conf[key].searchable !== false) {
                    let displayValue = conf[key].getValue({ value: item[key], column: conf[key] });
                    return conf[key].search({ value: displayValue.toString(), searchText: searchText });
                }
                return false;
            }));
        }

        if (sort?.colId) {
            pageItems.sort((a, b) => {
                let aVal = conf2[sort.colId].getValue({ value: a[conf2[sort.colId].field], column: conf2[sort.colId] });
                let bVal = conf2[sort.colId].getValue({ value: b[conf2[sort.colId].field], column: conf2[sort.colId] });

                if (conf2[sort.colId].sortable === false) return 0;
                return conf2[sort.colId].sort({ a: aVal, b: bVal, isAscending: sort.isAsc });
            });
        }

        let totalPages = (pageItems.length % pageSize > 0) ? Math.trunc(pageItems.length / pageSize) + 1 : Math.trunc(pageItems.length / pageSize);

        if (props.isPaginated !== false) pageItems = pageItems.slice((pageSize * page - pageSize), (pageSize * page));

        return { pageItems, totalPages }
    }

    function setColumns(cols){
        if (!props.onColumnsChange) setCols(cols);
        else props.onColumnsChange(cols);
    }

    function handleRowEditIdChange(rowEditId){
        setUpdatedRow(rowEditId && pageItems.find(item => item[props.rowIdField] === rowEditId) || null);
        props.onRowEditIdChange?.(rowEditId);
    }

    function handleRowEdit(updatedRow) {
        setUpdatedRow(updatedRow);
    }

    function getColumns() {
        let cols = props.onColumnsChange ? props.columns : columns;
        return cols.map((cd, idx) => { 

            let isPinnedColumn =  idx === 0 && cd.pinned || idx === cols.length-1 && cd.pinned;
            let isVisibleColumn = cd.visible !== false;
            
            if(cd.id === 'checkbox') return {
                className: '',
                width: 'max-content',
                minWidth: 0,
                maxWidth: null,
                resizable: false,
                ...cd,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            };
            
            return {
                label: cd.field,
                className: '',
                width: '200px',
                minWidth: cd.minWidth || props.minColumnWidth,
                maxWidth: null,
                getValue: ({value, column}) => value, 
                setValue: ({ value, data, setRow, column }) => { setRow({ ...data, [column.field]: value}) },
                searchable: true,
                editable: true,
                sortable: true,
                resizable: true,
                search: ({value, searchText}) => value.toString().toLowerCase().includes(searchText.toLowerCase()), 
                sort: ({a, b, isAscending}) => {
                    let aa = typeof a === 'string' ? a.toLowerCase() : a;
                    let bb = typeof b === 'string' ? b.toLowerCase() : b;
                    if(aa > bb) return isAscending ? 1 : -1;
                    else if(aa < bb) return isAscending ? -1 : 1;
                    return 0;
                }, 
                ...cd,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            }
        });
    }

    function onColumnReorderStart(sortData) {
        isColumnReordering = true;
        props.onColumnReorderStart?.(sortData);
    }

    function onColumnReorderEnd(sortData) {
        setTimeout(() => { isColumnReordering = false }, 0);
        props.onColumnReorderEnd?.(sortData);
    }

    function handleSort(colId, isAsc) {
        if (isColumnReordering) return;

        if (props.sort === undefined || props.onSortChange === undefined) setSort({colId, isAsc});
        props.onSortChange?.({colId, isAsc});
    }

    function handleSearchChange(searchText) {
        if (props.searchText === undefined || props.onSearchChange === undefined) setSearchText(searchText);
        props.onSearchChange?.(searchText);
    }

    function handlePageChange(page) {
        if (props.page === undefined || props.onPageChange === undefined) setPage(page);
        props.onPageChange?.(page);
    }

    function handlePageSizeChange(pageSize) {
        if (props.pageSize === undefined || props.onPageSizeChange === undefined) setPageSize(pageSize);
        props.onPageSizeChange?.(pageSize);
    }

    function handlePagination(goToPage) {
        if((goToPage >= 1) && (goToPage <= totalPages)) {
            handlePageChange(goToPage);
            setTimeout(() => { tableRef.current.scrollTop = 0 }, 0);
        };
    }

    function updateSelectedItems(newSelectedItems) {
        if (props.selectedRowsIds === undefined || props.onSelectedRowsChange === undefined) setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems);
    }

    function toggleItemSelection(rowId) {
        selectedRowsIds = [...selectedRowsIds];

        let itemIndex = selectedRowsIds.findIndex(s => s === rowId);

        if(itemIndex !== -1) selectedRowsIds.splice(itemIndex, 1);
        else selectedRowsIds.push(rowId);

        updateSelectedItems(selectedRowsIds);
    }

    function toggleColumnVisibility(colId) {
        columns = [...columns];
        let colIndex = columns.findIndex(cd => cd.id === colId);

        columns[colIndex].visible = !columns[colIndex].visible;
        setColumns(columns);
    }

    function getHighlightedSearch(cellValue) {
        if(cellValue === searchText) return <span className='rgt-search-highlight'>{cellValue}</span> ;

        let re = new RegExp(searchText,"gi");
        let restArr = cellValue.split(re, cellValue.length);
        let restItemsLength = 0;

        return restArr.map((a, idx) => {
            restItemsLength += a.length;

            const el = (
                <span key={idx}>
                    {a} 
                    { 
                        (restArr.length !== idx+1) ? 
                            <span className='rgt-search-highlight'>
                                {cellValue.slice(restItemsLength, searchText.length + restItemsLength)}
                            </span> 
                            : null
                    }
                </span>
            )
            restItemsLength += searchText.length;

            return el;
        })
    }

    return tableManager
}