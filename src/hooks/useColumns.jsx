import { useState, useMemo, useRef } from "react";

const useColumns = (props, tableManager) => {
    const {
        config: {
            components: {
                Cell,
                EditorCell,
                SelectionCell,
                HeaderCell,
                HeaderSelectionCell,
                PlaceHolderCell,
            },
        },
    } = tableManager;

    const columnsApi = useRef({}).current;
    let [columns, setColumns] = useState(props.columns);

    columnsApi.columns = useMemo(() => {
        const newColumns = props.onColumnsChange ? props.columns : columns;

        return newColumns.map((column, idx) => {
            const isPinnedColumn =
                (idx === 0 && column.pinned) ||
                (idx === newColumns.length - 1 && column.pinned);
            const isVisibleColumn = column.visible !== false;

            if (column.id === "checkbox")
                return {
                    className: "",
                    width: "max-content",
                    minResizeWidth: 0,
                    maxResizeWidth: null,
                    resizable: false,
                    cellRenderer: SelectionCell,
                    headerCellRenderer: HeaderSelectionCell,
                    ...column,
                    searchable: false,
                    editable: false,
                    sortable: false,
                    pinned: isPinnedColumn,
                    visible: isVisibleColumn,
                    index: idx,
                };

            return {
                label: column.field,
                className: "",
                width: "200px",
                minResizeWidth: null,
                maxResizeWidth: null,
                getValue: ({ value }) => value,
                setValue: ({ value, data, setRow, column }) => {
                    setRow({ ...data, [column.field]: value });
                },
                searchable: true,
                editable: true,
                sortable: true,
                resizable: true,
                search: ({ value, searchText }) =>
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchText.toLowerCase()),
                sort: ({ a, b, isAscending }) => {
                    const aa = typeof a === "string" ? a.toLowerCase() : a;
                    const bb = typeof b === "string" ? b.toLowerCase() : b;
                    if (aa > bb) return isAscending ? 1 : -1;
                    else if (aa < bb) return isAscending ? -1 : 1;
                    return 0;
                },
                cellRenderer: Cell,
                editorCellRenderer: EditorCell,
                headerCellRenderer: HeaderCell,
                placeHolderRenderer: PlaceHolderCell,
                ...column,
                pinned: isPinnedColumn,
                visible: isVisibleColumn,
                index: idx,
            };
        });
    }, [
        props.onColumnsChange,
        props.columns,
        columns,
        SelectionCell,
        HeaderSelectionCell,
        Cell,
        EditorCell,
        HeaderCell,
        PlaceHolderCell,
    ]);

    columnsApi.visibleColumns = useMemo(() => {
        const visibleColumns = columnsApi.columns.filter(
            (column) => column.visible
        );

        const virtualColIndex = visibleColumns[visibleColumns.length - 1]
            ?.pinned
            ? visibleColumns.length - 1
            : visibleColumns.length;

        visibleColumns.splice(virtualColIndex, 0, {
            id: "virtual",
            visible: true,
            width: "auto",
        });

        return visibleColumns;
    }, [columnsApi.columns]);

    columnsApi.setColumns = (cols) => {
        if (!props.onColumnsChange) setColumns(cols);
        else props.onColumnsChange(cols, tableManager);
    };

    return columnsApi;
};

export default useColumns;
