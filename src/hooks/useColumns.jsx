import { useState, useMemo, useCallback, useRef } from 'react';

export default (props, tableManager) => {
    let {
        config: {
            minColumnWidth,
            components: {
                CellRenderer,
                EditorCellRenderer,
                SelectionCellRenderer,
            }
        }
    } = tableManager;

    const columnsApi = useRef({}).current;
    let [columns, setColumns] = useState(props.columns);

    columns = props.onColumnsChange ? props.columns : columns;

    columnsApi.columns = useMemo(() => {
        return columns.map((cd, idx) => {

            let isPinnedColumn = idx === 0 && cd.pinned || idx === columns.length - 1 && cd.pinned;
            let isVisibleColumn = cd.visible !== false;

            if (cd.id === 'checkbox') return {
                className: '',
                width: 'max-content',
                minWidth: 0,
                maxWidth: null,
                searchable: false,
                editable: false,
                sortable: false,
                resizable: false,
                cellRenderer: SelectionCellRenderer,
                ...cd,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            };

            return {
                label: cd.field,
                className: '',
                width: '200px',
                minWidth: cd.minWidth || minColumnWidth,
                maxWidth: null,
                getValue: ({ value, column }) => value,
                setValue: ({ value, data, setRow, column }) => { setRow({ ...data, [column.field]: value }) },
                searchable: true,
                editable: true,
                sortable: true,
                resizable: true,
                search: ({ value, searchText }) => value.toString().toLowerCase().includes(searchText.toLowerCase()),
                sort: ({ a, b, isAscending }) => {
                    let aa = typeof a === 'string' ? a.toLowerCase() : a;
                    let bb = typeof b === 'string' ? b.toLowerCase() : b;
                    if (aa > bb) return isAscending ? 1 : -1;
                    else if (aa < bb) return isAscending ? -1 : 1;
                    return 0;
                },
                cellRenderer: CellRenderer,
                editorCellRenderer: EditorCellRenderer,
                ...cd,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            }
        })
    }, [columns, minColumnWidth]); 

    columnsApi.visibleColumns = useMemo(() => {
        let visibleColumns = columnsApi.columns.filter(cd => cd.visible !== false);

        let virtualColIndex = visibleColumns.length;
        if (visibleColumns[visibleColumns.length - 1]?.pinned) virtualColIndex--;
        visibleColumns.splice(virtualColIndex, 0, { id: 'virtual', visible: true, width: "auto" });
        return visibleColumns;
    }, [columnsApi.columns])

    columnsApi.setColumns = useCallback(cols => {
        if (!props.onColumnsChange) setColumns(cols);
        else props.onColumnsChange(cols, tableManager);
    })

    return columnsApi;
}