import { useState, useMemo, useCallback } from 'react';

const useColumns = (props) => {
    let [columns, setCols] = useState(props.columns);

    columns = useMemo(() => {
        let cols = props.onColumnsChange ? props.columns : columns;
        return cols.map((cd, idx) => {

            let isPinnedColumn = idx === 0 && cd.pinned || idx === cols.length - 1 && cd.pinned;
            let isVisibleColumn = cd.visible !== false;

            if (cd.id === 'checkbox') return {
                className: '',
                width: 'max-content',
                minWidth: 0,
                maxWidth: null,
                resizable: false,
                ...cd,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            };

            return {
                label: cd.field,
                className: '',
                width: '200px',
                minWidth: cd.minWidth || props.minColumnWidth,
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
                ...cd,
                pinned: isPinnedColumn,
                visible: isVisibleColumn
            }
        })
    }, [props.columns, columns, props.minColumnWidth]); 

    const setColumns = useCallback(cols => {
        if (!props.onColumnsChange) setCols(cols);
        else props.onColumnsChange(cols);
    })

    const toggleColumnVisibility = useCallback((colId) =>{
        columns = [...columns];
        let colIndex = columns.findIndex(cd => cd.id === colId);

        columns[colIndex].visible = !columns[colIndex].visible;
        setColumns(columns);
    })

    const onColumnReorderStart = useCallback(sortData => {
        tableManager.isColumnReordering = true;
        props.onColumnReorderStart?.(sortData);
    })

    const onColumnReorderEnd = useCallback(sortData => {
        setTimeout(() => { tableManager.isColumnReordering = false }, 0);
        props.onColumnReorderEnd?.(sortData);
    })

    let visibleColumns = columns.filter(cd => cd.visible !== false);

    let lastColIsPinned = visibleColumns[visibleColumns.length - 1]?.pinned;
    let virtualColConfig = { id: 'virtual', visible: true, width: "auto" };
    if (!lastColIsPinned) visibleColumns.push(virtualColConfig)
    else visibleColumns.splice(visibleColumns.length - 1, 0, virtualColConfig);

    return [{ columns, visibleColumns }, setColumns, toggleColumnVisibility, onColumnReorderStart, onColumnReorderEnd];
}

export default useColumns;