import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import HeaderCell from './components/HeaderCell';
import Row from './components/Row';
import PropTypes from 'prop-types';
import useTableManager from './hooks/useTableManager';
import './index.css';

const SortableList = SortableContainer(({ style, className, children }) => <div className={className} style={style}>{children}</div>);
 
const GridTable = (props) => {

    const tableManager = useTableManager(props);

    const {
        refs: {
            rgtRef,
            tableRef,
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
        rowsData,
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

    return (
        <div ref={rgtRef} className='rgt-wrapper' {...rest} >
            <Header tableManager={tableManager}/>
            <SortableList
                ref={tableRef}
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
                    overflow: 'auto',
                    gridTemplateColumns: (columnsData.visibleColumns.map(g => g.width)).join(" "),
                    gridTemplateRows: `repeat(${rowsData.pageItems.length+1}, max-content)`,
                }}
            >
                {
                    columnsData.visibleColumns.map((cd, idx) => (
                        <HeaderCell key={idx} index={idx} column={cd} isPinnedRight={cd.pinned && idx + 1 === columnsData.visibleColumns.length} tableManager={tableManager}/>
                    ))
                }
                {
                    !isLoading && rowsData.pageItems.length
                        ?
                        rowsData.pageItems.map((d, idx) => <Row key={idx} index={idx} data={d} tableManager={tableManager} />)
                        :
                        <div className='rgt-no-data-container'>
                            {
                                isLoading
                                    ?
                                    <Loader tableManager={tableManager}/>
                                    :
                                    <NoResults tableManager={tableManager}/>
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
    pageSize: 20,
    isLoading: false,
    showColumnVisibilityManager: true,
    isHeaderSticky: true,
    highlightSearch: true,
    searchMinChars: 2,
    isPaginated: true,
    showSearch: true,
    disableColumnsReorder: false,
    getIsRowSelectable: row => true,
    getIsRowEditable: row => true
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
    editRowId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    cellProps: PropTypes.object,
    headerCellProps: PropTypes.object,
    selectedRows: PropTypes.array,
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
    dragHandleComponent: PropTypes.func,
};

export default GridTable;