import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { HeaderCell, Row } from './components/';
import { useTableManager } from './hooks/';
import PropTypes from 'prop-types';
import './index.css';
import { useVirtual } from 'react-virtual';

const SortableList = SortableContainer(({ style, className, children, forwardRef }) => <div ref={forwardRef} className={className} style={style}>{children}</div>);
 
const GridTable = (props) => {

    const tableManager = useTableManager(props);

    const {
        refs: {
            rgtRef,
            tableRef,
            parentRef
        },
        handlers,
        components: {
            headerComponent: Header,
            footerComponent: Footer,
            loaderComponent: Loader,
            noResultsComponent: NoResults
        },
        columnsData,
        params,
        rowsData: {
            pageItems
        },
        additionalProps,
        icons
    } = tableManager;

    let { 
        isLoading,
        dragHandleComponent,
    } = props;

    let rest = Object.keys(props).reduce((rest, key) => {
        if (GridTable.propTypes[key] === undefined) rest = { ...rest, [key]: props[key] };
        return rest;
    }, {})

    const rowVirtualizer = useVirtual({
        size: pageItems.length,
        parentRef: parentRef
    });

    return (
        <div ref={rgtRef} className='rgt-wrapper' {...rest} >
            <Header tableManager={tableManager}/>
            <div ref={parentRef} style={{width: '100%', height: '100%', overflow: 'auto'}}>
                <SortableList
                    forwardRef={tableRef}
                    className='rgt-container'
                    axis="x"
                    lockToContainerEdges
                    distance={10}
                    lockAxis="x"
                    useDragHandle={!!dragHandleComponent}
                    onSortStart={handlers.handleColumnSortStart}
                    onSortEnd={handlers.handleColumnSortEnd}
                    style={{
                        display: 'grid',
                        height: rowVirtualizer.totalSize,
                        gridTemplateColumns: (columnsData.visibleColumns.map(g => g.width)).join(" "),
                        gridTemplateRows: `repeat(${pageItems.length + 1}, max-content)`,
                    }}
                // onScroll={onScroll}
                >
                    {
                        columnsData.visibleColumns.map((cd, idx) => (
                            <HeaderCell key={idx} index={idx} column={cd} tableManager={tableManager} style={{ marginBottom: rowVirtualizer.virtualItems[0]?.start}}/>
                        ))
                    }
                    {
                        !isLoading && pageItems.length
                            ?
                            rowVirtualizer.virtualItems.map(vr => <Row key={vr.index} index={vr.index} data={pageItems[vr.index]} tableManager={tableManager} row={vr} />)
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
            </div>
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
    showSearch: true,
    disableColumnsReorder: false,
    getIsRowSelectable: row => true,
    getIsRowEditable: row => true,
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
    // table config
    isPaginated: PropTypes.bool,
    disableColumnsReorder: PropTypes.bool,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    pageSize: PropTypes.number,
    sort: PropTypes.object,
    minColumnWidth: PropTypes.number,
    highlightSearch: PropTypes.bool,
    showSearch: PropTypes.bool,
    searchMinChars: PropTypes.number,
    isLoading: PropTypes.bool,
    isHeaderSticky: PropTypes.bool,
    showColumnVisibilityManager: PropTypes.bool,
    icons: PropTypes.object,
    textConfig: PropTypes.object,
    // events
    onColumnsChange: PropTypes.func,
    onSearchChange: PropTypes.func,
    onSelectedRowsChange: PropTypes.func,
    onSortChange: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowEditIdChange: PropTypes.func,
    onLoad: PropTypes.func,
    // custom components
    headerComponent: PropTypes.func,
    footerComponent: PropTypes.func,
    loaderRenderer: PropTypes.func,
    noResultsRenderer: PropTypes.func,
    searchComponent: PropTypes.func,
    columnVisibilityComponent: PropTypes.func,
    informationComponent: PropTypes.func,
    pageSizeComponent: PropTypes.func,
    paginationComponent: PropTypes.func,
    dragHandleComponent: PropTypes.func,
};

export default GridTable;