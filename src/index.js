import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import HeaderCell from './components/HeaderCell';
import Row from './components/Row';
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

    const renderTableHeader = () => {
        return columnsData.visibleColumnsWithVirtual.map((cd, idx) => (
            <HeaderCell 
                key={idx} 
                index={idx} 
                column={cd} 
                handleResizeEnd={handlers.handleResizeEnd}
                handleResize={handlers.handleResize}
                isHeaderSticky={params.isHeaderSticky !== false}
                handleSort={handlers.handleSort}
                sortBy={params.sortBy}
                sortAsc={params.sortAsc}
                disableColumnsReorder={params.disableColumnsReorder}
                toggleSelectAll={handlers.toggleSelectAll}
                selectAllIsChecked={params.selectAllIsChecked}
                selectAllIsDisabled={params.selectAllIsDisabled}
                isSelectAllIndeterminate={params.isSelectAllIndeterminate}
                isPinnedLeft={cd.pinned && idx === 0}
                isPinnedRight={cd.pinned && idx+1 === columnsData.visibleColumnsWithVirtual.length}
                sortIcons={{ascending: icons.sortAscending, descending: icons.sortDescending}}
                dragHandleRenderer={renderers.dragHandleRenderer}
                visibleColumnsLength={columnsData.visibleColumns.length}
                { ...additionalProps.headerCell }
            />
        ))
    }

    const renderTableRows = () => {
        return rowsData.pageItems.map((d, idx) => (
            <Row 
                key={idx} 
                index={idx}
                data={d} 
                rowsData={rowsData}
                params={params}
                handlers={handlers}
                columnsData={columnsData} 
                additionalProps={additionalProps} 
            />
        ))
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
                { renderTableHeader() }
                { isLoading ? renderLoader() : rowsData.pageItems.length ? renderTableRows() : renderNoResults() }
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