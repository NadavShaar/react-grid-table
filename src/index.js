import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { useTableManager } from './hooks/';
import PropTypes from 'prop-types';
import './index.css';

const SortableList = SortableContainer(({ forwardRef, className, style, children }) => <div ref={forwardRef} className={className} style={style}>{children}</div>);
 
const GridTable = (props) => {

    const tableManager = useTableManager(props);

    const {
        isLoading,
        config: {
            isVirtualScroll,
            components: {
                Header,
                HeaderCell,
                Row,
                Footer,
                Loader,
                NoResults,
                DragHandle
            },
        },
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
        rowVirtualizer: {
            virtualItems
        },
        paginationApi: {
            pageRows
        },
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
                useDragHandle={!!DragHandle}
                onSortStart={onColumnReorderStart}
                onSortEnd={onColumnReorderEnd}
                style={{
                    display: 'grid',
                    overflow: 'auto',
                    flex: 1,
                    gridTemplateColumns: (visibleColumns.map(g => g.width)).join(" "),
                    gridTemplateRows: `repeat(${pageRows.length + 1 + (isVirtualScroll ? 1 : 0)}, max-content)`,
                }}
            >
                {
                    visibleColumns.map((cd, idx) => (
                        <HeaderCell key={idx} index={idx} column={cd} tableManager={tableManager}/>
                    ))
                }
                {
                    pageRows.length && visibleColumns.length > 1 ?
                        isVirtualScroll ? 
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
    isVirtualScroll: true,
    showSearch: true,
    showRowsInformation: true,
    disableColumnsReorder: false,
    getIsRowSelectable: row => true,
    getIsRowEditable: row => true
};

GridTable.propTypes = {
    // general
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedRowsIds: PropTypes.array,
    searchText: PropTypes.string,
    getIsRowSelectable: PropTypes.func,
    getIsRowEditable: PropTypes.func,
    editRowId: PropTypes.any,
    // table config
    rowIdField: PropTypes.string,
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
    showColumnVisibilityManager: PropTypes.bool,
    searchMinChars: PropTypes.number,
    isLoading: PropTypes.bool,
    isHeaderSticky: PropTypes.bool,
    isVirtualScroll: PropTypes.bool,
    icons: PropTypes.object,
    texts: PropTypes.object,
    additionalProps: PropTypes.object,
    components: PropTypes.object,
    totalRows: PropTypes.number,
    // events
    onColumnsChange: PropTypes.func,
    onSearchChange: PropTypes.func,
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
};

export default GridTable;

export * from './components';