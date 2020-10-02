import React, { useState, useEffect, useRef } from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import HeaderCell from './components/HeaderCell';
import Cell from './components/Cell';
import Header from './components/Header';
import Footer from './components/Footer';
import PropTypes from 'prop-types';
import tableManager from './tableManager';

const DEFAULT_LOADER = <svg width="46" height="46" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="3">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" stroke="#9e9e9e" />
            <path d="M36 18c0-9.94-8.06-18-18-18" stroke="#607D8B">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite"/>
            </path>
        </g>
    </g>
</svg>;

const SortableList = SortableContainer(({style, className, children}) => <div className={className} style={style}>{children}</div>);
 
const GridTable = (props) => {

    // initial colDefs with defaults
    let initColDefs = props.columns?.map?.(cd => { 
        
        if(cd.field === 'checkbox') return {
            className: '',
            width: 'max-content',
            minWidth: null,
            maxWidth: null,
            resizable: false,
            visible: cd.pinned || cd.visible !== false,
            ...cd
        };
        
        return {
            label: cd.field,
            className: '',
            width: 'max-content',
            minWidth: null,
            maxWidth: null,
            getValue: ({value, column}) => value, 
            setValue: ({value, row, setRow, column}) => { setRow({...row, [column.field]: value}) },
            searchable: true,
            editable: true,
            sortable: true,
            resizable: true,
            sortableColumn: true,
            search: ({value, searchText}) => {
                if(typeof value !== 'string' && typeof value !== 'number') {
                    console.warn(`Failed to search on "${cd.field}" column, type is not a string or a number, you should add a custom search function in the column definition in order to handle search for this column`);
                    return false;
                }
                return value.toLowerCase().includes(searchText.toLowerCase());
            }, 
            sort: ({a, b, isAscending}) => {
                if(typeof a !== 'string' || typeof b !== 'string') {
                    console.warn(`Failed to sort on "${cd.field}" column, type is not a string or a number, you should add a custom sort function in the column definition in order to handle sort for this column`);
                    return 0;
                } 
                if(a.toLowerCase() > b.toLowerCase()) return isAscending ? 1 : -1;
                else if(a.toLowerCase() < b.toLowerCase()) return isAscending ? -1 : 1;
                return 0;
            }, 
            ...cd, 
            visible: cd.pinned || cd.visible !== false, 
        }
    });
    

    // ** state **

    const [colDefs, setColDefs] = useState(initColDefs);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [listEl, setListEl] = useState(null);
    const [sortByState, setSortBy] = useState(props.sortBy);
    const [sortAsc, setSortAsc] = useState(props.sortAscending);
    const [pageSizeState, setPageSize] = useState(props.pageSize);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTextState, setSearchText] = useState(props.searchText);
    const [updatedRow, setUpdatedRow] = useState(null);
    
    
    // ** refs **

    const rgtRef = useRef(null);
    const tableRef = useRef(null);


    // ** data preparations **

    // check if table has a 'checkbox' column
    let tableHasSelection = !!colDefs.find(cd => cd.field === 'checkbox');
    // set selectable items
    let selectableItems = items.filter(it => props.isRowSelectable(it));
    // set visible columns
    let visibleColumns = colDefs.filter(cd => cd.visible !== false);
    // recheck if last visible column is pinned
    let lastColIsPinned = visibleColumns[visibleColumns.length-1]?.pinned;
    // virtual column insertion
    let visibleColumnsWithVirtual = [ ...visibleColumns ];
    let virtualColConfig = {id: 'virtual', visible: true, width: "auto"};
    if(!lastColIsPinned) visibleColumnsWithVirtual.push(virtualColConfig) 
    else visibleColumnsWithVirtual.splice(visibleColumns.length-1, 0, virtualColConfig);


    // ** life cycles **

    // set item in edit mode
    useEffect(() => {
        setUpdatedRow(items.find(item => item[props.rowIdField] === props.editRowId) || null);
    }, [props.editRowId])

    // update search term
    useEffect(() => {
        setSearchText(props.searchText || "");
    }, [props.searchText])

    // update search while reseting page & edit mode
    useEffect(() => {
        setPage(1);
        setUpdatedRow(null);
        props.onSearchChange?.(searchTextState);
    }, [searchTextState])

    // update selected items
    useEffect(() => {
        setSelectedItems(props.selectedRowsIds || []);
    }, [props.selectedRowsIds])

    // update colDefs
    useEffect(() => {
        props.onColumnsChange?.(colDefs);
    }, [colDefs])

    // set grid's wrapper ref (used for auto scrolling the page to top when moving between pages)
    useEffect(() => {
        if(!rgtRef?.current?.children) return;
        let children = [ ...rgtRef.current.children ];
        setListEl(children.find(el => el.classList.contains('rgt-container')));
    }, [listEl])
    
    // update items data if one of the following has changed
    // props: rows, sortBy, pageSize
    // state: sortByState, sortAsc, page, pageSizeState, totalPages, searchTextState
    useEffect(() => {
        tableManager.getNormalizedItems({columns: colDefs, items: props.rows, searchText: searchTextState, isPaginated, page, pageSize: pageSizeState, sortBy: sortByState, sortAsc, setItems, setTotalPages, searchMinChars: props.searchMinChars});
    }, [props.rows, props.sortBy, sortByState, sortAsc, page, pageSizeState, props.pageSize, totalPages, searchTextState])

    
    // ** setters **
    
    const updateSelectedItems = (newSelectedItems) => {
        setSelectedItems(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems);
    }


    // ** renderers **

    const handleSearchHighlight = (cellValue) => {
        if(cellValue === searchTextState) return <span className='rgt-search-highlight'>{cellValue}</span> ;

        let re = new RegExp(searchTextState,"gi");
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
                                {cellValue.slice(restItemsLength, searchTextState.length + restItemsLength)}
                            </span> 
                            : null
                    }
                </span>
            )
            restItemsLength += searchTextState.length;

            return el;
        })
    }

    const renderHeader = () => {
        if(props.headerRenderer) return props.headerRenderer({searchText: searchTextState, setSearchText, setColumnVisibility: colId => tableManager.handleColumnVisibility({colId, columns: colDefs, setColumns: setColDefs}), columns: colDefs});
        if(!manageColumnVisibility && !showSearch) return null;

        return (
            <Header 
                showSearch={props.showSearch}
                manageColumnVisibility={props.manageColumnVisibility}
                columnVisibilityRenderer={props.columnVisibilityRenderer}
                colDefs={colDefs}
                setColDefs={setColDefs}
                searchRenderer={searchRenderer}
                searchTextState={searchTextState}
                setSearchText={setSearchText}
            />
        )
    }

    const renderHeaderCells = () => {

        let selectAllIsChecked = selectableItems.length && (selectedItems.length === selectableItems.length);
        let selectAllIsDisabled = !selectableItems.length;

        let virtualCell = <HeaderCell 
            key='virtual-col-header'
            index={visibleColumns.length}
            className={`rgt-cell-header rgt-cell-header-virtual-col${props.isHeaderSticky !== false ? ' rgt-cell-header-sticky' : ''}`}
            column={{id: "virtual-col", name: "", isVirtual: true }} 
            handleResize={({e, target, column}) => tableManager.handleResize({e, target, column, tableRef, visibleColumns, minColumnWidth: props.minColumnWidth})}
            stickyHeader={props.isHeaderSticky !== false}
        />;
        
        let arr = [];
        for (let idx = 0; idx < visibleColumns.length; idx++) {

            let cd = visibleColumns[idx];
            arr.push(
                <HeaderCell 
                    key={idx} 
                    className={`rgt-cell-header rgt-cell-header-${cd.field}${(cd.sortable !== false && cd.field  !== 'checkbox' && !cd.isVirtual) ? ' rgt-clickable' : ''}${cd.sortable !== false && cd.field !== 'checkbox' ? ' rgt-cell-header-sortable' : ' rgt-cell-header-not-sortable'}${props.isHeaderSticky !== false ? ' rgt-cell-header-sticky' : ''}${cd.resizable !== false ? ' rgt-cell-header-resizable' : ' rgt-cell-header-not-resizable'}${cd.searchable !== false && cd.field !== 'checkbox' ? ' rgt-cell-header-searchable' : ' rgt-cell-header-not-searchable'}${cd.sortableColumn !== false && !cd.pinned ? ' rgt-cell-header-sortable-column' : ' rgt-cell-header-not-sortable-column'}${cd.pinned && idx === 0 ? ' rgt-cell-header-pinned rgt-cell-header-pinned-left' : ''}${cd.pinned && idx === visibleColumns.length-1 ? ' rgt-cell-header-pinned rgt-cell-header-pinned-right' : ''} ${cd.className}`.trim()}
                    index={idx} 
                    column={cd} 
                    handleResizeEnd={() => tableManager.handleResizeEnd({tableRef, columns: colDefs, setColumns: setColDefs})}
                    handleResize={({e, target, column}) => tableManager.handleResize({e, target, column, tableRef, visibleColumns, minColumnWidth: props.minColumnWidth})}
                    stickyHeader={props.isHeaderSticky !== false}
                    handleSort={colId => tableManager.handleSort({colId, onSortChange: props.onSortChange, setSortBy, setSortAsc, sortByState, sortAsc})}
                    sortBy={sortByState}
                    sortAsc={sortAsc}
                    toggleSelectAll={() => tableManager.toggleSelectAll({selectAllIsChecked, selectableItems, onSelectedItemsChange: updateSelectedItems, rowIdField: props.rowIdField})}
                    selectAllIsChecked={selectAllIsChecked}
                    selectAllIsDisabled={selectAllIsDisabled}
                    isPinnedLeft={cd.pinned && idx === 0}
                    isPinnedRight={cd.pinned && idx+1 === visibleColumns.length}
                    sortIcons={props.icons.sort}
                    dragHandleRenderer={props.dragHandleRenderer}
                    { ...props.headerCellProps }
                />
            )
        }

        if(lastColIsPinned) arr.splice(visibleColumns.length-1, 0, virtualCell);
        else arr.push(virtualCell);

        return arr;
    }

    const renderDataCells = () => {
        return items.map((d, idx1) => {

            // check whether the row selection should be disabled
            let disableSelection = !(selectableItems.find(si => si[props.rowIdField] === d[props.rowIdField]));
            
            return(
                <React.Fragment key={idx1}>
                    {
                        visibleColumns.map((cd, idx2) => {

                            // getting the cell value from the getValue function on the column
                            let cellValue = cd.getValue?.({value: (updatedRow?.[props.rowIdField] === d[props.rowIdField]) ? updatedRow[cd.field] : d[cd.field], column: cd});
                            
                            // highlight searched text if...
                            if(updatedRow?.[props.rowIdField] !== d[props.rowIdField] && props.highlightSearch !== false && searchTextState && searchTextState.length >= props.searchMinChars && cellValue?.toLowerCase?.().includes(searchTextState.toLowerCase())) {
                                cellValue = handleSearchHighlight(cellValue);
                            }

                            // row index by page
                            let rowIndex = (idx1+1) + (items.length * page - items.length);

                            // class selectors
                            let classNames = cd.field === 'checkbox' ? 
                                `rgt-cell rgt-cell-checkbox rgt-row-${rowIndex} rgt-row-${(idx1+1) % 2 === 0 ? 'even' : 'odd'} ${cd.pinned && idx2 === 0 ? 'rgt-cell-pinned rgt-cell-pinned-left' : ''} ${cd.pinned && idx2 === visibleColumns.length-1 ? 'rgt-cell-pinned rgt-cell-pinned-right' : ''} ${cd.className}`
                                :
                                `rgt-cell rgt-cell-${cd.field} rgt-row-${rowIndex} rgt-row-${(idx1+1) % 2 === 0 ? 'even' : 'odd'}${!tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${cd.pinned && idx2 === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${cd.pinned && idx2 === visibleColumns.length-1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''} ${cd.className}`

                            return (
                                <React.Fragment key={idx1+idx2} >
                                    {
                                        lastColIsPinned && idx2 === visibleColumns.length-1 ?
                                            <div className={`rgt-cell rgt-cell-virtual rgt-row-${rowIndex} rgt-row-${(idx1+1) % 2 === 0 ? 'even' : 'odd'} ${!tableHasSelection ? '' : disableSelection ? 'rgt-row-not-selectable' : 'rgt-row-selectable'}`} {...props.cellProps}></div>
                                            : null
                                    }
                                    <Cell 
                                        rowId={d[props.rowIdField]}
                                        row={updatedRow?.[props.rowIdField] === d[props.rowIdField] ? updatedRow : d} 
                                        rows={props.rows}
                                        rowIndex={rowIndex} 
                                        onRowClick={props.onRowClick}
                                        colIndex={idx2} 
                                        colDefs={colDefs} 
                                        column={cd}
                                        value={cellValue}
                                        className={classNames.trim()}
                                        cellRenderer={cd.cellRenderer}
                                        editorCellRenderer={cd.editorCellRenderer}
                                        searchText={searchTextState}
                                        isEdit={updatedRow?.[props.rowIdField] === d[props.rowIdField] && !!props.isRowEditable(d)}
                                        setUpdatedRow={setUpdatedRow}
                                        selectedItems={selectedItems}
                                        onSelectedItemsChange={updateSelectedItems}
                                        disableSelection={disableSelection}
                                        {...props.cellProps}
                                    />
                                </React.Fragment>
                            )
                        })
                    }
                    {
                        !lastColIsPinned ?
                            <div className={`rgt-cell rgt-cell-virtual rgt-row-${idx1+1} rgt-row-${(idx1+1) % 2 === 0 ? 'even' : 'odd'} ${!tableHasSelection ? '' : disableSelection ? 'rgt-row-not-selectable' : 'rgt-row-selectable'}`}></div>
                            : null
                    }
                </React.Fragment>
            )
        })
    }

    const renderFooter = () => {
        return (
            <Footer 
                totalPages={totalPages} 
                page={page} 
                pageSize={pageSizeState} 
                handlePagination={goToPage => tableManager.handlePagination({goToPage, listEl, totalPages, setPage, selectedItems, onSelectedItemsChange: updateSelectedItems})}
                setPageSize={setPageSize} 
                pageSizes={props.pageSizes}
                isPaginated={props.isPaginated}
                footerRenderer={props.footerRenderer}
                selectedRowsLength={selectedItems.length}
                numberOfRows={items.length}
                totalItems={props.rows.length}
                tableHasSelection={tableHasSelection}
            />
        )
    }

    const renderLoader = () => (
            <div className='rgt-no-data-container'>
                {
                    props.loaderRenderer ?
                        props.loaderRenderer() 
                        :
                        DEFAULT_LOADER
                }
            </div>
    )

    const renderNoResults = () => (
            <div className='rgt-no-data-container'>
                {
                    props.noResultsRenderer ?
                        props.noResultsRenderer() 
                        : 
                        'No Results :('
                }
            </div>
    )

    let { 
        columns,
        rows,
        isLoading,
        onColumnsChange,
        onSelectedRowsChange,
        editRowId,
        isRowSelectable,
        isRowEditable,
        onSortChange,
        minColumnWidth,
        pageSizes,
        pageSize,
        dragHandleRenderer,
        headerRenderer,
        columnVisibilityRenderer,
        footerRenderer,
        selectedRowsIds,
        noResultsRenderer,
        manageColumnVisibility,
        isHeaderSticky,
        searchText,
        highlightSearch,
        onSearchChange,
        searchRenderer,
        isPaginated,
        showSearch,
        sortBy,
        sortAscending,
        cellProps,
        headerCellProps,
        searchMinChars,
        onRowClick,
        rowIdField,
        ...rest
     } = props;
console.log(visibleColumnsWithVirtual.filter(t => t.visible))
    return (
        <div ref={rgtRef} className='rgt-wrapper' {...rest} >
            { renderHeader() }
            <SortableList
                ref={tableRef}
                className='rgt-container'
                helperContainer={listEl}
                axis="x" 
                lockToContainerEdges 
                distance={10} 
                lockAxis="x" 
                useDragHandle={!!dragHandleRenderer}
                onSortStart={tableManager.handleColumnSortStart}
                onSortEnd={sortObj => tableManager.handleColumnSortEnd({sortObj, visibleColumns, columns: colDefs, setColumns: setColDefs})}
                style={{
                    gridTemplateColumns: (visibleColumnsWithVirtual.filter(t => t.visible).map(g => g.width)).join(" "),
                    gridTemplateRows: `repeat(${rows.length}, max-content)`,
                }}
            >
                { renderHeaderCells() }
                { isLoading ? renderLoader() : items.length ? renderDataCells() : renderNoResults() }
            </SortableList>
            { renderFooter() }
        </div>
    )
}

GridTable.defaultProps = {
    columns: [],
    rows: [],
    rowIdField: 'id',
    minColumnWidth: 70,
    pageSizes: [20, 50, 100],
    pageSize: 20,
    isLoading: false,
    manageColumnVisibility: true,
    isHeaderSticky: true,
    searchText: '',
    highlightSearch: true,
    searchMinChars: 2,
    isPaginated: true,
    showSearch: true,
    sortBy: null,
    sortAscending: true,
    isRowSelectable: row => true,
    isRowEditable: row => true,
    icons: { sort: { ascending: <React.Fragment>&#9650;</React.Fragment>, descending: <React.Fragment>&#9660;</React.Fragment> } }
};

GridTable.propTypes = {
    // general
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowIdField: PropTypes.string,
    selectedRowsIds: PropTypes.arrayOf(PropTypes.object),
    searchText: PropTypes.string,
    isRowSelectable: PropTypes.func,
    isRowEditable: PropTypes.func,
    editRowId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    cellProps: PropTypes.object,
    headerCellProps: PropTypes.object,
    // table config
    isPaginated: PropTypes.bool,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    pageSize: PropTypes.number,
    sortBy: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    sortAscending: PropTypes.bool,
    minColumnWidth: PropTypes.number,
    highlightSearch: PropTypes.bool,
    showSearch: PropTypes.bool,
    searchMinChars: PropTypes.number,
    isLoading: PropTypes.bool,
    isHeaderSticky: PropTypes.bool,
    manageColumnVisibility: PropTypes.bool,
    icons: PropTypes.object,
    // events
    onColumnsChange: PropTypes.func,
    onSearchChange: PropTypes.func,
    onSelectedRowsChange: PropTypes.func,
    onSortChange: PropTypes.func,
    onRowClick: PropTypes.func,
    // custom renderers
    headerRenderer: PropTypes.func,
    footerRenderer: PropTypes.func,
    loaderRenderer: PropTypes.func,
    noResultsRenderer: PropTypes.func,
    searchRenderer: PropTypes.func,
    columnVisibilityRenderer: PropTypes.func,
    dragHandleRenderer: PropTypes.func,

};

export default GridTable;