import React, { useState, useEffect, useRef, useMemo } from 'react';
import defaultIcons from './../defaultIcons';

var lastPos;
var isColumnSorting;

export default function useTableManager(props) {


    // **************** State ****************

    let [columns, setCols] = useState(generateColumns({cols: props.columns, minColumnWidth: props.minColumnWidth}));
    let [sortBy, setSortBy] = useState(props.sortBy);
    let [sortAsc, setSortAsc] = useState(props.sortAscending);
    let [listEl, setListEl] = useState(null);
    let [page, setPage] = useState(1);
    let [updatedRow, setUpdatedRow] = useState(null);
    let [searchText, setSearchText] = useState(props.searchText);
    let [pageSize, setPageSize] = useState(props.pageSize);
    let [selectedItems, setSelectedItems] = useState([]);
    let [tableManager] = useState({
        nodes: {},
        handlers: {},
        renderers: {},
        columnsData: {},
        params: {},
        rowsData: {},
        additionalProps: {},
        icons: {}
    });


    // **************** Refs ****************

    const tableRef = useRef(null);
    const rgtRef = useRef(null);


    // **************** Table params ****************

    let { pageItems, totalPages } = useMemo(getPageItems, [props.rows, props.sortBy, sortBy, sortAsc, page, pageSize, props.pageSize, totalPages, searchText])

    // set visible columns
    let visibleColumns = columns.filter(cd => cd.visible !== false);
    // recheck if last visible column is pinned
    let lastColIsPinned = visibleColumns[visibleColumns.length-1]?.pinned;
    // virtual column insertion
    let virtualColConfig = {id: 'virtual', visible: true, width: "auto"};
    if(!lastColIsPinned) visibleColumns.push(virtualColConfig) 
    else visibleColumns.splice(visibleColumns.length-1, 0, virtualColConfig);
    // check if table has a 'checkbox' column
    let tableHasSelection = !!columns.find(cd => cd.id === 'checkbox');

    tableManager.nodes = Object.assign(tableManager.nodes, {
        listEl,
        tableRef,
        rgtRef
    })
    tableManager.handlers = Object.assign(tableManager.handlers, {
        setColumns,
        // setRows,
        setSortBy,
        setSortAsc,
        setPage,
        setSearchText,
        setPageSize,
        setUpdatedRow,
        setSelectedItems,
        updateSelectedItems,
        toggleItemSelection,
        toggleSelectAll,
        handleResize,
        handleColumnSortStart,
        handleColumnSortEnd,
        handleResizeEnd,
        handleSort,
        handlePagination,
        handleColumnVisibility,
        getHighlightedSearch,
        onRowClick: props.onRowClick,
        getIsRowEditable: props.getIsRowEditable,
        getIsRowSelectable: props.getIsRowSelectable
    })
    tableManager.renderers = Object.assign(tableManager.renderers, {
        searchRenderer: props.searchRenderer,
        columnVisibilityRenderer: props.columnVisibilityRenderer,
        headerRenderer: props.headerRenderer,
        dragHandleRenderer: props.dragHandleRenderer,
        footerRenderer: props.footerRenderer,
        loaderRenderer: props.loaderRenderer,
        noResultsRenderer: props.noResultsRenderer
    })
    tableManager.columnsData = Object.assign(tableManager.columnsData, {
        columns,
        visibleColumns,
    })
    tableManager.params = Object.assign(tableManager.params, {
        lastColIsPinned,
        sortBy,
        sortAsc,
        page,
        searchText,
        highlightSearch: props.highlightSearch,
        searchMinChars: props.searchMinChars,
        totalPages,
        pageSize,
        tableHasSelection,
        showSearch: props.showSearch,
        showColumnVisibilityManager: props.showColumnVisibilityManager,
        isHeaderSticky: props.isHeaderSticky !== false,
        isPaginated: props.isPaginated,
        disableColumnsReorder: props.disableColumnsReorder,
        pageSizes: props.pageSizes
    })
    tableManager.rowsData = Object.assign(tableManager.rowsData, {
        items: props.rows,
        pageItems,
        updatedRow,
        selectedItems,
        rowIdField: props.rowIdField
    })
    tableManager.additionalProps = Object.assign(tableManager.additionalProps, {
        headerCell: props.headerCellProps,
        cell: props.cellProps
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

    // update columns by props
    useEffect(() => {
        setCols(generateColumns({cols: props.columns, minColumnWidth: props.minColumnWidth}));
    }, [props.columns])

    // set grid's wrapper ref (used for auto scrolling the page to top when moving between pages)
    useEffect(() => {
        if(!rgtRef?.current?.children) return;
        let children = [].slice.call(rgtRef.current.children);
        setListEl(children.find(el => el.classList.contains('rgt-container')));
    }, [listEl])

    // update search while reseting page & edit mode
    useEffect(() => {
        setPage(1);
        setUpdatedRow(null);
        props.onSearchChange?.(searchText);
    }, [searchText])

    // set item in edit mode
    useEffect(() => {
        setUpdatedRow(pageItems.find(item => item[props.rowIdField] === props.editRowId) || null);
    }, [props.editRowId])

    // update search term
    useEffect(() => {
        setSearchText(props.searchText || "");
    }, [props.searchText])

    // update selected items
    useEffect(() => {
        setSelectedItems(props.selectedRowsIds || []);
    }, [props.selectedRowsIds])

    // sort by
    useEffect(() => {
        setSortBy(props.sortBy)
    }, [props.sortBy])

    // sort ascending
    useEffect(() => {
        setSortAsc(props.sortAscending)
    }, [props.sortAscending])

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

        // sort
        if (sortBy) {
            pageItems.sort((a, b) => {
                let aVal = conf2[sortBy].getValue({ value: a[conf2[sortBy].field], column: conf2[sortBy] });
                let bVal = conf2[sortBy].getValue({ value: b[conf2[sortBy].field], column: conf2[sortBy] });

                if (conf2[sortBy].sortable === false) return 0;
                return conf2[sortBy].sort({ a: aVal, b: bVal, isAscending: sortAsc });
            });
        }

        let totalPages = (pageItems.length % pageSize > 0) ? Math.trunc(pageItems.length / pageSize) + 1 : Math.trunc(pageItems.length / pageSize);

        // paginate
        if (props.isPaginated !== false) pageItems = pageItems.slice((pageSize * page - pageSize), (pageSize * page));

        return { pageItems, totalPages }
    }

    const setColumns = (cols) => {
        props.onColumnsChange ? props.onColumnsChange?.(cols) : setCols(generateColumns({ cols, minColumnWidth: props.minColumnWidth }));
    }

    function generateColumns({ cols, minColumnWidth }) {
        let visibleIndex = 0;
        return cols.map((cd, idx) => { 

            let isPinnedColumn =  idx === 0 && cd.pinned || idx === cols.length-1 && cd.pinned;
            let isVisibleColumn =  isPinnedColumn || cd.visible !== false;
            
            if(cd.id === 'checkbox') return {
                className: '',
                width: 'max-content',
                minWidth: 0,
                maxWidth: null,
                resizable: false,
                ...cd,
                index: idx,
                visibleIndex: isVisibleColumn ? visibleIndex++ : null,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            };
            
            return {
                label: cd.field,
                className: '',
                width: 'max-content',
                minWidth: cd.minWidth || minColumnWidth,
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
                index: idx,
                visibleIndex: isVisibleColumn ? visibleIndex++ : null,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            }
        });
    }

    function handleResize({e, target, column}) {
        let containerEl = tableRef.current.container;
        let gridTemplateColumns = containerEl.style.gridTemplateColumns;
        let currentColWidth = target.offsetParent.clientWidth;
        if(!lastPos) lastPos = e.clientX;
        
        let diff = lastPos - e.clientX;

        let colIndex = visibleColumns.findIndex(cd => cd.id === column.id);

        if (e.clientX > lastPos || e.clientX < lastPos && currentColWidth - diff > column.minWidth) {
            let gtcArr = gridTemplateColumns.split(" ");
            
            if((column.minWidth && ((currentColWidth - diff) <= column.minWidth)) || (column.maxWidth && ((currentColWidth - diff) >= column.maxWidth))) return;

            gtcArr[colIndex] = `${currentColWidth - diff}px`;
            let newGridTemplateColumns = gtcArr.join(" ");

            containerEl.style.gridTemplateColumns = newGridTemplateColumns;
        }
        
        lastPos = e.clientX;
    }

    function handleResizeEnd() {
        lastPos = null;
        let containerEl = tableRef.current.container;
        let gridTemplateColumns = containerEl.style.gridTemplateColumns;
        let gtcArr = gridTemplateColumns.split(" ");
        
        columns.forEach(col => {
            let colIndex = visibleColumns.findIndex(cd => cd.id === col.id);
            if (col.visible) {
                col.width = gtcArr[colIndex];
            }
        })
        setColumns(columns)
    }

    function handleColumnSortStart(obj) {
        obj.helper.classList.add('rgt-column-sort-ghost');
        isColumnSorting = true;
    }

    function handleColumnSortEnd(sortObj) {
        setTimeout(() => { isColumnSorting = false }, 0);
        if(sortObj.oldIndex === sortObj.newIndex) return;

        let colDefNewIndex = columns.findIndex(oc => oc.id === visibleColumns[sortObj.newIndex].id);
        let colDefOldIndex = columns.findIndex(oc => oc.id === visibleColumns[sortObj.oldIndex].id);

        columns = [...columns];
        columns.splice(colDefNewIndex, 0, ...columns.splice(colDefOldIndex, 1));
        
        setColumns(columns);
    }

    function handleSort(colId) {
        if(isColumnSorting) return;
        
        if(sortBy !== colId) {
            setSortBy(colId);
            setSortAsc(true);
            if(props.onSortChange) props.onSortChange(colId, true);
            return;
        }
        let sort = sortAsc ? false : sortAsc === false ? null : true;
        if(sort === null) setSortBy(null);
        if(props.onSortChange) props.onSortChange(colId, sort);
        setSortAsc(sort);
    }

    function handlePagination(goToPage) {
        if((goToPage >= 1) && (goToPage <= totalPages)) {
            setPage(goToPage);
            setTimeout(() => { listEl.scrollTop = 0 }, 0);
        };
    }

    function toggleSelectAll(selectableItemsIds, selectAllIsChecked, isSelectAllIndeterminate) {
        let selectedIds = [...selectedItems];

        if(selectAllIsChecked || isSelectAllIndeterminate) selectedIds = selectedIds.filter(si => !selectableItemsIds.find(itemId => si === itemId));
        else selectableItemsIds.forEach(s => selectedIds.push(s));
        
        updateSelectedItems(selectedIds);
    }

    function updateSelectedItems(newSelectedItems) {
        props.onSelectedRowsChange ? props.onSelectedRowsChange(newSelectedItems) : setSelectedItems(newSelectedItems);
    }

    function toggleItemSelection(rowId) {
        selectedItems = [...selectedItems];

        let itemIndex = selectedItems.findIndex(s => s === rowId);

        if(itemIndex !== -1) selectedItems.splice(itemIndex, 1);
        else selectedItems.push(rowId);

        updateSelectedItems(selectedItems);
    }

    function handleColumnVisibility(colId) {
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