import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { HeaderCell, Row, Search, ColumnVisibility, Header, Footer, Loader, NoResults, Information, PageSize, Pagination } from './components/';
import { useTableManager } from './hooks/';
import PropTypes from 'prop-types';
import './index.css';

const SortableList = SortableContainer(({ style, className, children, forwardRef }) => <div ref={forwardRef} className={className} style={style}>{children}</div>);
 
const GridTable = (props) => {

    const tableManager = useTableManager(props);

    const {
        refs: {
            rgtRef,
            tableRef
        },
        columnsApi: {
            visibleColumns,
        },
        columnsReorderApi: {
            onColumnReorderStart,
            onColumnReorderEnd
        },
        rowsApi: {
            isLoading
        },
        components: {
            Header,
            Footer,
            Loader,
            NoResults
        },
        rowVirtualizer: {
            isVirtualScrolling,
            virtualItems
        },
        paginationApi: {
            pageRows
        },
        components: {
            dragHandleComponent
        }
    } = tableManager;

    let rest = Object.keys(props).reduce((rest, key) => {
        if (GridTable.propTypes[key] === undefined) rest = { ...rest, [key]: props[key] };
        return rest;
    }, {})

    return (
        <div ref={rgtRef} className='rgt-wrapper' {...rest} >
            <Header tableManager={tableManager} />
            <SortableList
                forwardRef={tableRef}
                className='rgt-container'
                axis="x"
                lockToContainerEdges
                distance={10}
                lockAxis="x"
                useDragHandle={!!dragHandleComponent}
                onSortStart={onColumnReorderStart}
                onSortEnd={onColumnReorderEnd}
                style={{
                    display: 'grid',
                    overflow: 'auto',
                    flex: 1,
                    gridTemplateColumns: (visibleColumns.map(g => g.width)).join(" "),
                    gridTemplateRows: `repeat(${pageRows.length + 1 + (isVirtualScrolling ? 1 : 0)}, max-content)`,
                }}
            >
                {
                    visibleColumns.map((cd, idx) => (
                        <HeaderCell key={idx} index={idx} column={cd} tableManager={tableManager}/>
                    ))
                }
                {
                    pageRows.length && visibleColumns.length > 1 ?
                        isVirtualScrolling ? 
                            [
                                <Row key={'virtual-start'} index={'virtual-start'} tableManager={tableManager} />,
                                ...virtualItems.map(vr => <Row key={vr.index} index={vr.index} data={pageRows[vr.index]} measureRef={vr.measureRef} tableManager={tableManager} />),
                                <Row key={'virtual-end'} index={'virtual-end'} tableManager={tableManager} />
                            ]
                            :
                            pageRows.map((r, index) => <Row key={index} index={index} data={r} tableManager={tableManager} />)
                        :
                        <div className='rgt-no-data-container'>
                            {
                                isLoading
                                    ?
                                    <Loader tableManager={tableManager} />
                                    :
                                    <NoResults tableManager={tableManager} />
                            }
                        </div>
                }
            </SortableList>
            <Footer tableManager={tableManager}/>
        </div>
    )
}

GridTable.defaultProps = {
    columns: [],
    rows: [],
    rowIdField: 'id',
    minColumnWidth: 70,
    pageSizes: [20, 50, 100],
    isLoading: false,
    showColumnVisibilityManager: true,
    isHeaderSticky: true,
    highlightSearch: true,
    searchMinChars: 2,
    isPaginated: true,
    isVirtualScrolling: true,
    showSearch: true,
    showRowsInformation: true,
    disableColumnsReorder: false,
    getIsRowSelectable: row => true,
    getIsRowEditable: row => true,
    searchComponent: Search,
    columnVisibilityComponent: ColumnVisibility,
    headerComponent: Header,
    footerComponent: Footer,
    loaderComponent: Loader,
    noResultsComponent: NoResults,
    informationComponent: Information,
    pageSizeComponent: PageSize,
    paginationComponent: Pagination,
    dragHandleComponent: null,
};

GridTable.propTypes = {
    // general
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowIdField: PropTypes.string,
    selectedRowsIds: PropTypes.array,
    searchText: PropTypes.string,
    getIsRowSelectable: PropTypes.func,
    getIsRowEditable: PropTypes.func,
    editRowId: PropTypes.any,
    cellProps: PropTypes.object,
    headerCellProps: PropTypes.object,
    rowVirtualizerProps: PropTypes.object,
    // table config
    isPaginated: PropTypes.bool,
    disableColumnsReorder: PropTypes.bool,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    pageSize: PropTypes.number,
    page: PropTypes.number,
    sort: PropTypes.object,
    minColumnWidth: PropTypes.number,
    highlightSearch: PropTypes.bool,
    showSearch: PropTypes.bool,
    showRowsInformation: PropTypes.bool,
    searchMinChars: PropTypes.number,
    isLoading: PropTypes.bool,
    isHeaderSticky: PropTypes.bool,
    isVirtualScrolling: PropTypes.bool,
    showColumnVisibilityManager: PropTypes.bool,
    icons: PropTypes.object,
    texts: PropTypes.object,
    totalRows: PropTypes.number,
    // events
    onColumnsChange: PropTypes.func,
    onSearchChange: PropTypes.func,
    onSelectedRowsChange: PropTypes.func,
    onSortChange: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowEditIdChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onLoad: PropTypes.func,
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onColumnReorderStart: PropTypes.func,
    onColumnReorderEnd: PropTypes.func, 
    onRowsRequest: PropTypes.func, 
    onRowsReset: PropTypes.func,
    onRowsChange: PropTypes.func, 
    // custom components
    headerComponent: PropTypes.func,
    footerComponent: PropTypes.func,
    loaderComponent: PropTypes.func,
    noResultsComponent: PropTypes.func,
    searchComponent: PropTypes.func,
    columnVisibilityComponent: PropTypes.func,
    informationComponent: PropTypes.func,
    pageSizeComponent: PropTypes.func,
    paginationComponent: PropTypes.func,
    dragHandleComponent: PropTypes.func,
};

export default GridTable;

export {
    HeaderCell,
    Row
}