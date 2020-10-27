import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import HeaderCell from './components/HeaderCell';
import Row from './components/Row';
import Header from './components/Header';
import Footer from './components/Footer';
import PropTypes from 'prop-types';
import useTableManager from './hooks/useTableManager';
import './index.css';

const SortableList = SortableContainer(({ style, className, children }) => <div className={className} style={style}>{children}</div>);
 
const GridTable = (props) => {

    const tableManager = useTableManager(props);

    const { nodes, handlers, renderers, columnsData, params, rowsData, additionalProps, icons } = tableManager;

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
        isLoading,
        dragHandleRenderer,
    } = props;

    let rest = Object.keys(props).reduce((rest, key) => {
        if (GridTable.propTypes[key] === undefined) rest = { ...rest, [key]: props[key] };
        return rest;
    }, {})

    return (
        <div ref={nodes.rgtRef} className='rgt-wrapper' {...rest} >
            <Header tableManager={tableManager} headerRenderer={tableManager.renderers.headerRenderer} />
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
                    gridTemplateColumns: (columnsData.visibleColumns.map(g => g.width)).join(" "),
                    gridTemplateRows: `repeat(${rowsData.pageItems.length+1}, max-content)`,
                }}
            >
                {
                    columnsData.visibleColumns.map((cd, idx) => (
                        <HeaderCell key={idx} index={idx} column={cd} isPinnedRight={cd.pinned && idx + 1 === columnsData.visibleColumns.length} tableManager={tableManager}/>
                    ))
                }
                {isLoading ? renderLoader() : rowsData.pageItems.length ? rowsData.pageItems.map((d, idx) => <Row key={idx} index={idx} data={d} tableManager={tableManager}/>) : renderNoResults() }
            </SortableList>
            <Footer tableManager={tableManager} footerRenderer={tableManager.renderers.footerRenderer}/>
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