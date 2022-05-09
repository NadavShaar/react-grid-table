import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import GridTable from "../../../src";
import { ControllersDrawer } from "../components";
import getColumns from "../getColumns";
import MOCK_DATA from "../MOCK_DATA.json";
import "../index.css";

const MyAwesomeTable = () => {
    const [, setTableManager] = useState(null);
    const [rowsData, setRowsData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [editRowId, setEditRowId] = useState(null);
    let [searchText, setSearchText] = useState("");
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);
    let [sort, setSort] = useState({ colId: null, isAsc: true });
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(20);
    let [pageSizes, setPageSizes] = useState([20, 50, 100]);
    let [enableColumnsReorder, setEnableColumnsReorder] = useState(true);
    let [highlightSearch, setHighlightSearch] = useState(true);
    let [showSearch, setShowSearch] = useState(true);
    let [showRowsInformation, setShowRowsInformation] = useState(true);
    let [showColumnVisibilityManager, setShowColumnVisibilityManager] =
        useState(true);
    let [isHeaderSticky, setIsHeaderSticky] = useState(true);
    let [isVirtualScroll, setIsVirtualScroll] = useState(true);
    let [isPaginated, setIsPaginated] = useState(true);
    let [minSearchChars, setMinSearchChars] = useState(2);
    let [minColumnResizeWidth, setMinColumnWidth] = useState(70);
    let [columns, setColumns] = useState(getColumns({ setRowsData }));
    let [isSettingsOpen, setIsSettingsOpen] = useState(false);
    let [selectAllMode, setSelectAllMode] = useState("page");
    let [searchByColumn, setSearchByColumn] = useState(true);

    const controllers = {
        columns: [columns, setColumns],
        editRowId: [editRowId, setEditRowId],
        searchText: [searchText, setSearchText],
        selectedRowsIds: [selectedRowsIds, setSelectedRowsIds],
        sort: [sort, setSort],
        page: [page, setPage],
        pageSize: [pageSize, setPageSize],
        pageSizes: [pageSizes, setPageSizes],
        enableColumnsReorder: [enableColumnsReorder, setEnableColumnsReorder],
        highlightSearch: [highlightSearch, setHighlightSearch],
        showSearch: [showSearch, setShowSearch],
        showRowsInformation: [showRowsInformation, setShowRowsInformation],
        showColumnVisibilityManager: [
            showColumnVisibilityManager,
            setShowColumnVisibilityManager,
        ],
        isHeaderSticky: [isHeaderSticky, setIsHeaderSticky],
        isVirtualScroll: [isVirtualScroll, setIsVirtualScroll],
        isPaginated: [isPaginated, setIsPaginated],
        minSearchChars: [minSearchChars, setMinSearchChars],
        minColumnResizeWidth: [minColumnResizeWidth, setMinColumnWidth],
        selectAllMode: [selectAllMode, setSelectAllMode],
        searchByColumn: [searchByColumn, setSearchByColumn],
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRowsData(MOCK_DATA);
            setLoading(false);
        }, 1500);
    }, []);

    return (
        <div className="demo">
            <ControllersDrawer
                isOpen={isSettingsOpen}
                onToggle={setIsSettingsOpen}
                controllers={controllers}
            />
            <div className="tableWrapper">
                <GridTable
                    columns={columns}
                    onColumnsChange={setColumns}
                    rows={rowsData}
                    isLoading={isLoading}
                    editRowId={editRowId}
                    onEditRowIdChange={setEditRowId}
                    selectedRowsIds={selectedRowsIds}
                    onSelectedRowsChange={setSelectedRowsIds}
                    onRowClick={({ data, isEdit }, tableManager) =>
                        !isEdit &&
                        tableManager.rowSelectionApi.getIsRowSelectable(
                            data.id
                        ) &&
                        tableManager.rowSelectionApi.toggleRowSelection(data.id)
                    }
                    style={{
                        boxShadow: "rgb(0 0 0 / 30%) 0px 40px 40px -20px",
                        border: "none",
                    }}
                    onLoad={setTableManager}
                    searchText={searchText}
                    onSearchTextChange={setSearchText}
                    sort={sort}
                    onSortChange={setSort}
                    page={page}
                    onPageChange={setPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    pageSizes={pageSizes}
                    enableColumnsReorder={enableColumnsReorder}
                    highlightSearch={highlightSearch}
                    showSearch={showSearch}
                    showRowsInformation={showRowsInformation}
                    showColumnVisibilityManager={showColumnVisibilityManager}
                    isHeaderSticky={isHeaderSticky}
                    isVirtualScroll={isVirtualScroll}
                    isPaginated={isPaginated}
                    minSearchChars={minSearchChars}
                    minColumnResizeWidth={minColumnResizeWidth}
                    selectAllMode={selectAllMode}
                    searchByColumn={searchByColumn}
                />
            </div>
        </div>
    );
};

export default MyAwesomeTable;

ReactDOM.render(<MyAwesomeTable />, document.getElementById("root"));
