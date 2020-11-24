//TODO: fill the config

import { useEffect, useRef } from 'react';
import * as components from '../components';
import { additionalProps, icons, texts } from '../defaults';
import {
    useRowVirtualizer,
    useColumns,
    useSort,
    useSearch,
    usePagination,
    useRowSelection,
    useRowEdit,
    useRows,
    useColumnsReorder,
    useColumnsVisibility,
    useColumnsResize
} from '../hooks/';

export default (props) => {
    let tableManager = useRef({
        isMounted: false,
        isInitialized: false
    }).current;
    
    // initialization
    useEffect(() => {
        tableManager.isMounted = true;
        props.onLoad?.(tableManager);

        return () => tableManager.isMounted = false;
    }, [])

    tableManager.components = { ...components, ...props.components };
    tableManager.additionalProps = { ...additionalProps, ...props.additionalProps };
    tableManager.icons = { ...icons, ...props.icons };
    tableManager.texts = { ...texts, ...props.texts };
    tableManager.config = {
        showRowsInformation: props.showRowsInformation,
        isHeaderSticky: props.isHeaderSticky
    }

    tableManager.refs = {
        tableRef: useRef(null),
        rgtRef: useRef(null)
    }
    tableManager.columnsApi = useColumns(props, tableManager);
    tableManager.columnsReorderApi = useColumnsReorder(props, tableManager);
    tableManager.columnsResizeApi = useColumnsResize(props, tableManager);
    tableManager.columnsVisibilityApi = useColumnsVisibility(props, tableManager);
    tableManager.searchApi = useSearch(props, tableManager);
    tableManager.sortApi = useSort(props, tableManager);
    tableManager.rowsApi = useRows(props, tableManager);
    tableManager.paginationApi = usePagination(props, tableManager);
    tableManager.rowSelectionApi = useRowSelection(props, tableManager);
    tableManager.rowEditApi = useRowEdit(props, tableManager);
    tableManager.rowVirtualizer = useRowVirtualizer(props, tableManager);
    
    // reset page number
    useEffect(() => {
        if (!tableManager.isInitialized) return;
        if (tableManager.paginationApi.page === 1) return;

        tableManager.paginationApi.setPage(1);
    }, [tableManager.searchApi.searchText, tableManager.paginationApi.pageSize])

    // reset rows
    useEffect(() => {
        if (!tableManager.isInitialized) return;

        if (props.onRowsRequest) {
            tableManager.rowsApi.requestRowsData = {
                from: -1,
                to: 0
            }
            props.onRowsReset?.();
            tableManager.rowSelectionApi.setSelectedRowsIds([]);
        }
    }, [tableManager.searchApi.searchText, tableManager.sortApi.sort])

    // reset edit row
    useEffect(() => {
        if (tableManager.rowEditApi.editRow) tableManager.rowEditApi.onRowEditIdChange(null);
    }, [tableManager.searchApi.searchText, tableManager.sortApi.sort, tableManager.paginationApi.page])

    // initialization completion
    useEffect(() => {
        tableManager.isInitialized = true;
    }, [])

    return tableManager
}