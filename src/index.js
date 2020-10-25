import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import HeaderCell from './components/HeaderCell';
import Cell from './components/Cell';
import Header from './components/Header';
import Footer from './components/Footer';
import PropTypes from 'prop-types';
import useTableManager from './hooks/useTableManager';
import './index.css';

const SortableList = SortableContainer(({style, className, children}) => <div className={className} style={style}>{children}</div>);
 
const GridTable = (props) => {

    const tableManager = useTableManager(props);

    const { nodes, handlers, renderers, columnsData, params, rowsData, additionalProps, icons } = tableManager;

    const renderHeader = () => (
        <Header 
            columns={columnsData.columns}
            showColumnVisibilityManager={params.showColumnVisibilityManager}
            handleColumnVisibility={handlers.handleColumnVisibility}
            columnVisibilityRenderer={renderers.columnVisibilityRenderer}
            columnVisibilityIcon={icons.columnVisibility}
            showSearch={params.showSearch}
            searchText={params.searchText} 
            setSearchText={handlers.setSearchText} 
            searchRenderer={renderers.searchRenderer}
            searchIcon={icons.search}
            headerRenderer={renderers.headerRenderer}
        />
    )

    const renderHeaderCells = () => {

        let virtualCell = <HeaderCell 
            key='virtual-col-header'
            index={columnsData.visibleColumns.length}
            className={`rgt-cell-header rgt-cell-header-virtual-col${params.isHeaderSticky !== false ? ' rgt-cell-header-sticky' : ''}`}
            column={{id: "virtual-col", name: "", isVirtual: true }} 
            handleResize={handlers.handleResize}
            stickyHeader={params.isHeaderSticky !== false}
        />;
        
        let arr = [];
        for (let idx = 0; idx < columnsData.visibleColumns.length; idx++) {

            let cd = columnsData.visibleColumns[idx];
            arr.push(
                <HeaderCell 
                    key={idx} 
                    className={`rgt-cell-header rgt-cell-header-${cd.id === 'checkbox' ? 'checkbox' : cd.field}${(cd.sortable !== false && cd.id  !== 'checkbox' && !cd.isVirtual) ? ' rgt-clickable' : ''}${cd.sortable !== false && cd.id !== 'checkbox' ? ' rgt-cell-header-sortable' : ' rgt-cell-header-not-sortable'}${params.isHeaderSticky !== false ? ' rgt-cell-header-sticky' : ''}${cd.resizable !== false ? ' rgt-cell-header-resizable' : ' rgt-cell-header-not-resizable'}${cd.searchable !== false && cd.id !== 'checkbox' ? ' rgt-cell-header-searchable' : ' rgt-cell-header-not-searchable'}${cd.pinned && idx === 0 ? ' rgt-cell-header-pinned rgt-cell-header-pinned-left' : ''}${cd.pinned && idx === columnsData.visibleColumns.length-1 ? ' rgt-cell-header-pinned rgt-cell-header-pinned-right' : ''} ${cd.className}`.trim()}
                    index={idx} 
                    column={cd} 
                    handleResizeEnd={handlers.handleResizeEnd}
                    handleResize={handlers.handleResize}
                    stickyHeader={params.isHeaderSticky !== false}
                    handleSort={handlers.handleSort}
                    sortBy={params.sortBy}
                    sortAsc={params.sortAsc}
                    disableColumnsReorder={params.disableColumnsReorder}
                    toggleSelectAll={handlers.toggleSelectAll}
                    selectAllIsChecked={params.selectAllIsChecked}
                    selectAllIsDisabled={params.selectAllIsDisabled}
                    isSelectAllIndeterminate={params.isSelectAllIndeterminate}
                    isPinnedLeft={cd.pinned && idx === 0}
                    isPinnedRight={cd.pinned && idx+1 === columnsData.visibleColumns.length}
                    sortIcons={{ascending: icons.sortAscending, descending: icons.sortDescending}}
                    dragHandleRenderer={renderers.dragHandleRenderer}
                    { ...additionalProps.headerCell }
                />
            )
        }

        if(params.lastColIsPinned) arr.splice(columnsData.visibleColumns.length-1, 0, virtualCell);
        else arr.push(virtualCell);

        return arr;
    }

    const renderDataCells = () => {
        return rowsData.pageItems.map((d, idx1) => {

            // row's id
            let rowId = d[rowsData.rowIdField];

            // check whether the row selection should be disabled
            let disableSelection = !(rowsData.selectableItemsIds.find(si => si === rowId));

            // row index by page
            let rowIndex = (idx1+1) + (rowsData.pageItems.length * params.page - rowsData.pageItems.length);

            // check if row is selected
            let isChecked = !!(rowsData.selectedItems.find(si => si === rowId));
            
            return(
                <React.Fragment key={idx1}>
                    {
                        columnsData.visibleColumns.map((cd, idx2) => {

                            // getting the cell value from the getValue function on the column
                            let cellValue = cd.getValue?.({value: (rowsData.updatedRow?.[rowsData.rowIdField] === rowId) ? rowsData.updatedRow[cd.field] : d[cd.field], column: cd});
                            cellValue = cellValue && cellValue.toString();
                            
                            // highlight searched text if...
                            if(cd.searchable !== false && rowsData.updatedRow?.[rowsData.rowIdField] !== rowId && params.highlightSearch !== false && params.searchText && params.searchText.length >= params.searchMinChars && cellValue?.toLowerCase?.().includes(params.searchText.toLowerCase())) {
                                cellValue = handlers.handleSearchHighlight(cellValue);
                            }

                            // class selectors
                            let classNames = cd.id === 'checkbox' ? 
                                `rgt-cell rgt-cell-checkbox rgt-row-${rowIndex} rgt-row-${(idx1+1) % 2 === 0 ? 'even' : 'odd'}${cd.pinned && idx2 === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${cd.pinned && idx2 === columnsData.visibleColumns.length-1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isChecked ? ' rgt-row-selected' : ''} ${cd.className}`
                                :
                                cd.id === 'virtual' ?
                                    `rgt-cell rgt-cell-virtual rgt-row-${rowIndex} rgt-row-${(idx1+1) % 2 === 0 ? 'even' : 'odd'}${!params.tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${isChecked ? ' rgt-row-selected' : ''}`
                                    :
                                    `rgt-cell rgt-cell-${cd.field} rgt-row-${rowIndex} rgt-row-${(idx1+1) % 2 === 0 ? 'even' : 'odd'}${!params.tableHasSelection ? '' : disableSelection ? ' rgt-row-not-selectable' : ' rgt-row-selectable'}${cd.pinned && idx2 === 0 ? ' rgt-cell-pinned rgt-cell-pinned-left' : ''}${cd.pinned && idx2 === columnsData.visibleColumns.length-1 ? ' rgt-cell-pinned rgt-cell-pinned-right' : ''}${isChecked ? ' rgt-row-selected' : ''}  ${cd.className}`

                            return (
                                <Cell 
                                    key={rowIndex+idx2}
                                    rowId={rowId}
                                    row={rowsData.updatedRow?.[rowsData.rowIdField] === rowId ? rowsData.updatedRow : d} 
                                    rows={rowsData.items}
                                    rowIndex={rowIndex} 
                                    onRowClick={handlers.onRowClick}
                                    isChecked={isChecked}
                                    colIndex={idx2} 
                                    columns={columnsData.columns} 
                                    column={cd}
                                    value={cellValue}
                                    lastColIsPinned={params.lastColIsPinned}
                                    className={classNames.trim()}
                                    visibleColumns={columnsData.visibleColumns}
                                    cellRenderer={cd.cellRenderer}
                                    editorCellRenderer={cd.editorCellRenderer}
                                    searchText={params.searchText}
                                    isEdit={rowsData.updatedRow?.[rowsData.rowIdField] === rowId && !!handlers.handleIsRowEditable(d)}
                                    setUpdatedRow={handlers.setUpdatedRow}
                                    selectedItems={rowsData.selectedItems}
                                    disableSelection={disableSelection}
                                    toggleItemSelection={handlers.toggleItemSelection}
                                    { ...additionalProps.cell }
                                />
                            )
                        })
                    }
                </React.Fragment>
            )
        })
    }

    const renderFooter = () => (
        <Footer 
            totalPages={params.totalPages} 
            page={params.page} 
            pageSize={params.pageSize} 
            handlePagination={handlers.handlePagination}
            setPageSize={handlers.setPageSize} 
            pageSizes={params.pageSizes}
            isPaginated={params.isPaginated}
            footerRenderer={renderers.footerRenderer}
            selectedRowsLength={rowsData.selectedItems.length}
            clearSelection={() => handlers.updateSelectedItems([])}
            clearSelectionIcon={icons.clearSelection}
            numberOfRows={rowsData.pageItems.length}
            totalRows={rowsData.items.length}
            tableHasSelection={params.tableHasSelection}
        />
    )

    const renderLoader = () => (
        <div className='rgt-no-data-container'>
            { renderers.loaderRenderer?.() || icons.loader }
        </div>
    )

    const renderNoResults = () => (
        <div className='rgt-no-data-container'>
            { renderers.noResultsRenderer?.() || 'No Results :(' }
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
        handleIsRowEditable,
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
        showColumnVisibilityManager,
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
        disableColumnsReorder,
        loaderRenderer,
        ...rest
    } = props;

    return (
        <div ref={nodes.rgtRef} className='rgt-wrapper' {...rest} >
            { renderHeader() }
            <SortableList
                ref={nodes.tableRef}
                className='rgt-container'
                helperContainer={nodes.listEl}
                axis="x" 
                lockToContainerEdges 
                distance={10} 
                lockAxis="x" 
                useDragHandle={!!dragHandleRenderer}
                onSortStart={handlers.handleColumnSortStart}
                onSortEnd={handlers.handleColumnSortEnd}
                style={{
                    display: 'grid',
                    overflow: 'auto',
                    gridTemplateColumns: (columnsData.visibleColumnsWithVirtual.filter(t => t.visible).map(g => g.width)).join(" "),
                    gridTemplateRows: `repeat(${rowsData.pageItems.length+1}, max-content)`,
                }}
            >
                { renderHeaderCells() }
                { isLoading ? renderLoader() : rowsData.pageItems.length ? renderDataCells() : renderNoResults() }
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
    showColumnVisibilityManager: true,
    isHeaderSticky: true,
    searchText: '',
    highlightSearch: true,
    searchMinChars: 2,
    isPaginated: true,
    showSearch: true,
    sortBy: null,
    sortAscending: true,
    disableColumnsReorder: false,
    isRowSelectable: row => true,
    handleIsRowEditable: row => true
};

GridTable.propTypes = {
    // general
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowIdField: PropTypes.string,
    selectedRowsIds: PropTypes.array,
    searchText: PropTypes.string,
    isRowSelectable: PropTypes.func,
    handleIsRowEditable: PropTypes.func,
    editRowId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    cellProps: PropTypes.object,
    headerCellProps: PropTypes.object,
    // table config
    isPaginated: PropTypes.bool,
    disableColumnsReorder: PropTypes.bool,
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
    showColumnVisibilityManager: PropTypes.bool,
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