import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { Row, HeaderCellContainer } from './components/';
import { useTableManager } from './hooks/';
import PropTypes from 'prop-types';
import './index.css';

const SortableList = SortableContainer(({ forwardRef, className, style, children }) => 
    <div ref={forwardRef} className={className} style={style}>{children}</div>);
 
const GridTable = props => {

    const tableManager = useTableManager(props);

    const {
        isLoading,
        config: {
            isVirtualScroll,
            rowIdField,
            components: { Header, Footer, Loader, NoResults, DragHandle },
        },
        refs: { rgtRef, tableRef },
        columnsApi: { visibleColumns },
        columnsReorderApi: { onColumnReorderStart, onColumnReorderEnd },
        rowVirtualizer: { virtualItems },
        paginationApi: { pageRows },
        rowsApi: { totalRows }
    } = tableManager;

    const rest = Object.keys(props).reduce((rest, key) => {
        if (GridTable.propTypes[key] === undefined) rest = { ...rest, [key]: props[key] };
        return rest;
    }, {})

    const classNames = ('rgt-wrapper ' + (props.className || '')).trim();

    return (
        <div {...rest} ref={rgtRef} className={classNames}>
            <Header tableManager={tableManager} />
            <SortableList
                forwardRef={tableRef}
                className='rgt-container'
                axis="x"
                lockToContainerEdges
                distance={10}
                lockAxis="x"
                useDragHandle={!!DragHandle}
                onSortStart={onColumnReorderStart}
                onSortEnd={onColumnReorderEnd}
                style={{
                    display: 'grid',
                    overflow: 'auto',
                    flex: 1,
                    gridTemplateColumns: (visibleColumns.map(column => column.width)).join(" "),
                    gridTemplateRows: `repeat(${pageRows.length + 1 + (isVirtualScroll ? 1 : 0)}, max-content)`,
                }}
            >
                {
                    visibleColumns.map((visibleColumn, idx) => (
                        <HeaderCellContainer key={visibleColumn.id} index={idx} column={visibleColumn} tableManager={tableManager}/>
                    ))
                }
                {
                    totalRows && visibleColumns.length > 1 ?
                        isVirtualScroll ? 
                            [
                                <Row key={'virtual-start'} index={'virtual-start'} tableManager={tableManager} />,
                                ...virtualItems.map(virtualizedRow => <Row key={virtualizedRow.index} index={virtualizedRow.index} data={pageRows[virtualizedRow.index]} measureRef={virtualizedRow.measureRef} tableManager={tableManager} />),
                                <Row key={'virtual-end'} index={'virtual-end'} tableManager={tableManager} />
                            ]
                            :
                            pageRows.map((rowData, index) => <Row key={rowData?.[rowIdField]} index={index} data={rowData} tableManager={tableManager} />)
                        :
                        <div className='rgt-container-overlay'>
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
    rowIdField: 'id',
    minColumnResizeWidth: 70,
    pageSizes: [20, 50, 100],
    isHeaderSticky: true,
    highlightSearch: true,
    minSearchChars: 2,
    isPaginated: true,
    isVirtualScroll: true,
    showSearch: true,
    showRowsInformation: true,
    showColumnVisibilityManager: true,
    enableColumnsReorder: true,
    requestDebounceTimeout: 300,
    getIsRowSelectable: row => true,
    getIsRowEditable: row => true,
    selectAllMode: 'page' // ['page', 'all']
};

GridTable.propTypes = {
    // general
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    selectedRowsIds: PropTypes.array,
    searchText: PropTypes.string,
    getIsRowSelectable: PropTypes.func,
    getIsRowEditable: PropTypes.func,
    editRowId: PropTypes.any,
    // table config
    rowIdField: PropTypes.string,
    batchSize: PropTypes.number,
    isPaginated: PropTypes.bool,
    enableColumnsReorder: PropTypes.bool,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    pageSize: PropTypes.number,
    page: PropTypes.number,
    sort: PropTypes.object,
    minColumnResizeWidth: PropTypes.number,
    highlightSearch: PropTypes.bool,
    showSearch: PropTypes.bool,
    showRowsInformation: PropTypes.bool,
    showColumnVisibilityManager: PropTypes.bool,
    minSearchChars: PropTypes.number,
    isLoading: PropTypes.bool,
    isHeaderSticky: PropTypes.bool,
    isVirtualScroll: PropTypes.bool,
    icons: PropTypes.object,
    texts: PropTypes.object,
    additionalProps: PropTypes.object,
    components: PropTypes.object,
    totalRows: PropTypes.number,
    requestDebounceTimeout: PropTypes.number,
    selectAllMode: PropTypes.string,
    // events
    onColumnsChange: PropTypes.func,
    onSearchTextChange: PropTypes.func,
    onSelectedRowsChange: PropTypes.func,
    onSortChange: PropTypes.func,
    onRowClick: PropTypes.func,
    onEditRowIdChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onLoad: PropTypes.func,
    onColumnResizeStart: PropTypes.func,
    onColumnResize: PropTypes.func,
    onColumnResizeEnd: PropTypes.func,
    onColumnReorderStart: PropTypes.func,
    onColumnReorderEnd: PropTypes.func, 
    onRowsRequest: PropTypes.func, 
    onRowsReset: PropTypes.func,
    onRowsChange: PropTypes.func,
    onTotalRowsChange: PropTypes.func,
};

export default GridTable;

export * from './components';
export * from './hooks';