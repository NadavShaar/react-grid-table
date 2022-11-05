import { useEffect, useRef } from "react";
import * as components from "../components";
import { icons, texts } from "../defaults";
import { uuid } from "../utils";
import {
    useRowVirtualizer,
    useColumns,
    useSort,
    useSearch,
    usePagination,
    useRowSelection,
    useRowEdit,
    useRows,
    useAsync,
    useColumnsReorder,
    useColumnsVisibility,
    useColumnsResize,
} from "../hooks/";

const useTableManager = (props) => {
    const tableManager = useRef({
        id: props.id || uuid(),
        isMounted: false,
        isInitialized: false,
    }).current;

    Object.defineProperty(tableManager, "columnsReorderApi", {
        enumerable: false,
        writable: true,
    });
    Object.defineProperty(tableManager, "columnsResizeApi", {
        enumerable: false,
        writable: true,
    });

    // initialization
    useEffect(() => {
        tableManager.isMounted = true;
        props.onLoad?.(tableManager);

        return () => (tableManager.isMounted = false);
    }, [props, tableManager]);

    tableManager.mode = !props.onRowsRequest ? "sync" : "async";
    tableManager.config = {
        rowIdField: props.rowIdField,
        minColumnResizeWidth: props.minColumnResizeWidth,
        minSearchChars: props.minSearchChars,
        isHeaderSticky: props.isHeaderSticky,
        isPaginated: props.isPaginated,
        enableColumnsReorder: props.enableColumnsReorder,
        highlightSearch: props.highlightSearch,
        showSearch: props.showSearch,
        showRowsInformation: props.showRowsInformation,
        showColumnVisibilityManager: props.showColumnVisibilityManager,
        pageSizes: props.pageSizes,
        requestDebounceTimeout: props.requestDebounceTimeout,
        isVirtualScroll:
            props.isVirtualScroll ||
            (!props.isPaginated && tableManager.mode !== "sync"),
        tableHasSelection: !!props.columns.find((cd) => cd.id === "checkbox"),
        components: { ...components, ...props.components },
        additionalProps: props.additionalProps || {},
        icons: { ...icons, ...props.icons },
        texts: { ...texts, ...props.texts },
    };

    tableManager.refs = {
        tableRef: useRef(null),
        rgtRef: useRef(null),
    };
    tableManager.columnsApi = useColumns(props, tableManager);
    tableManager.columnsReorderApi = useColumnsReorder(props, tableManager);
    tableManager.columnsResizeApi = useColumnsResize(props, tableManager);
    tableManager.columnsVisibilityApi = useColumnsVisibility(
        props,
        tableManager
    );
    tableManager.searchApi = useSearch(props, tableManager);
    tableManager.sortApi = useSort(props, tableManager);
    tableManager.rowsApi = useRows(props, tableManager);
    tableManager.paginationApi = usePagination(props, tableManager);
    tableManager.rowSelectionApi = useRowSelection(props, tableManager);
    tableManager.rowEditApi = useRowEdit(props, tableManager);
    tableManager.rowVirtualizer = useRowVirtualizer(props, tableManager);
    tableManager.asyncApi = useAsync(props, tableManager);
    tableManager.isLoading =
        props.isLoading ??
        (tableManager.mode !== "sync" && tableManager.asyncApi.isLoading);

    // initialization completion
    useEffect(() => {
        tableManager.isInitialized = true;
    }, [tableManager]);

    return tableManager;
};

export default useTableManager;
