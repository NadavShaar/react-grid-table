import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import GridTable from '../../src';
import { IsControlled } from './components';
import getColumns from './getColumns';
import MOCK_DATA from "./MOCK_DATA.json";
// import './index.css';


const MyAwesomeTable = () => {
    const [unControlledProps, setUnControlledProps] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [rowsData, setRowsData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [tableManager, setTableManager] = useState(null);
    let [searchText, setSearchText] = useState('');
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);
    let [sort, setSort] = useState({ colId: null, isAsc: null });
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(20);
    let [pageSizes, setPageSizes] = useState([20, 50, 100]);
    let [enableColumnsReorder, setEnableColumnsReorder] = useState(true);
    let [highlightSearch, setHighlightSearch] = useState(true);
    let [showSearch, setShowSearch] = useState(true);
    let [showRowsInformation, setShowRowsInformation] = useState(true);
    let [showColumnVisibilityManager, setShowColumnVisibilityManager] = useState(true);
    let [isHeaderSticky, setIsHeaderSticky] = useState(true);
    let [isVirtualScroll, setIsVirtualScroll] = useState(true);
    let [isPaginated, setIsPaginated] = useState(true);
    let [minSearchChars, setMinSearchChars] = useState(2);
    let [minColumnWidth, setMinColumnWidth] = useState(70);

    let [columns, setColumns] = useState(getColumns({ setRowsData }));

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRowsData(MOCK_DATA)
            setLoading(false);
        }, 1500);
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
                <IsControlled propName='page' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='number' value={page} min='1' onChange={e => setPage(~~e.target.value)} />
                </IsControlled>
                <IsControlled propName='pageSize' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='number' value={pageSize} min='1' onChange={e => setPageSize(~~e.target.value)} />
                </IsControlled>
                <IsControlled propName='searchText' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input value={searchText} onChange={e => setSearchText(e.target.value)} />
                </IsControlled>
                <IsControlled propName='editRowId' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='number' value={editRowId} min='0' onChange={e => setEditRowId(~~e.target.value)} />
                </IsControlled>
                <IsControlled propName='sort' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input value={sort.colId} onChange={e => setSort({ ...sort, colId: e.target.value})} />
                    <select name='isAsc' value={sort.isAsc === null ? 'null' : sort.isAsc} onChange={e => setSort({ ...sort, isAsc: e.target.value === 'true' || (e.target.value === 'false' ? false : null) })}>
                        <option value={'true'}>Ascending</option>
                        <option value={'false'}>Descending</option>
                        <option value={'null'}>None</option>
                    </select>
                </IsControlled>
                <IsControlled propName='pageSizes' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    {/* <input type='checkbox' checked={showRowsInformation} onChange={e => setShowRowsInformation(!showRowsInformation)} /> */}
                </IsControlled>
                <IsControlled propName='enableColumnsReorder' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={enableColumnsReorder} onChange={e => setEnableColumnsReorder(!enableColumnsReorder)} />
                </IsControlled>
                <IsControlled propName='highlightSearch' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={highlightSearch} onChange={e => setHighlightSearch(!highlightSearch)} />
                </IsControlled>
                <IsControlled propName='showSearch' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={showSearch} onChange={e => setShowSearch(!showSearch)} />
                </IsControlled>
                <IsControlled propName='showColumnVisibilityManager' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={showColumnVisibilityManager} onChange={e => setShowColumnVisibilityManager(!showColumnVisibilityManager)} />
                </IsControlled>
                <IsControlled propName='showRowsInformation' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={showRowsInformation} onChange={e => setShowRowsInformation(!showRowsInformation)} />
                </IsControlled>
                <IsControlled propName='isHeaderSticky' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={isHeaderSticky} onChange={e => setIsHeaderSticky(!isHeaderSticky)} />
                </IsControlled>
                <IsControlled propName='isVirtualScroll' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={isVirtualScroll} onChange={e => setIsVirtualScroll(!isVirtualScroll)} />
                </IsControlled>
                <IsControlled propName='isPaginated' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='checkbox' checked={isPaginated} onChange={e => setIsPaginated(!isPaginated)} />
                </IsControlled>
                <IsControlled propName='minSearchChars' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='number' value={minSearchChars} min='0' onChange={e => setMinSearchChars(~~e.target.value)} />
                </IsControlled>
                <IsControlled propName='minColumnWidth' unControlledProps={unControlledProps} setUnControlledProps={setUnControlledProps}>
                    <input type='number' value={minColumnWidth} min='0' onChange={e => setMinColumnWidth(~~e.target.value)} />
                </IsControlled>
            </div>
            <GridTable
                columns={columns}
                onColumnsChange={!unControlledProps.includes('editRowId') ? setColumns : undefined}
                rows={rowsData}
                isLoading={isLoading}
                editRowId={!unControlledProps.includes('editRowId') ? editRowId : undefined}
                onEditRowIdChange={setEditRowId}
                selectedRowsIds={!unControlledProps.includes('editRowId') ? selectedRowsIds : undefined}
                onSelectedRowsChange={setSelectedRowsIds}
                style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 40px 40px -20px' }}
                onLoad={setTableManager}
                searchText={!unControlledProps.includes('searchText') ? searchText : undefined}
                onSearchTextChange={setSearchText}
                sort={!unControlledProps.includes('sort') ? sort : undefined}
                onSortChange={setSort}
                page={!unControlledProps.includes('page') ? page : undefined}
                onPageChange={setPage}
                pageSize={!unControlledProps.includes('pageSize') ? pageSize : undefined}
                onPageSizeChange={setPageSize}
                pageSizes={!unControlledProps.includes('pageSizes') ? pageSizes : undefined}
                enableColumnsReorder={!unControlledProps.includes('enableColumnsReorder') ? enableColumnsReorder : undefined}
                highlightSearch={!unControlledProps.includes('highlightSearch') ? highlightSearch : undefined}
                showSearch={!unControlledProps.includes('showSearch') ? showSearch : undefined}
                showRowsInformation={!unControlledProps.includes('showRowsInformation') ? showRowsInformation : undefined}
                showColumnVisibilityManager={!unControlledProps.includes('showColumnVisibilityManager') ? showColumnVisibilityManager : undefined}
                isHeaderSticky={!unControlledProps.includes('isHeaderSticky') ? isHeaderSticky : undefined}
                isVirtualScroll={!unControlledProps.includes('isVirtualScroll') ? isVirtualScroll : undefined}
                isPaginated={!unControlledProps.includes('isPaginated') ? isPaginated : undefined}
                minSearchChars={!unControlledProps.includes('minSearchChars') ? minSearchChars : undefined}
                minColumnWidth={!unControlledProps.includes('minColumnWidth') ? minColumnWidth : undefined}
            />
        </div>
    )
}

export default MyAwesomeTable;

ReactDOM.render(<MyAwesomeTable />, document.getElementById('root'));