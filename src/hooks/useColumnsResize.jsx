import { useCallback, useRef } from 'react';
import { useResizeEvents } from './';

export default (props, tableManager) => {
    const columnsResizeApi = useRef({
        lastPos: null
    }).current;

    let {
        refs: {
            tableRef
        },
        columnsApi: {
            columns,
            visibleColumns,
            setColumns
        }
    } = tableManager;

    columnsResizeApi.onResizeStart = useCallback(({ e, target, column }) => {
        columnsResizeApi.isColumnResizing = true;
        props.onColumnResizeStart?.({ e, target, column });
    })

    columnsResizeApi.onResize = useCallback(({ e, target, column }) => {
        let containerEl = tableRef.current;
        let gridTemplateColumns = containerEl.style.gridTemplateColumns;
        let currentColWidth = target.offsetParent.clientWidth;
        if (!columnsResizeApi.lastPos) columnsResizeApi.lastPos = e.clientX;

        let diff = columnsResizeApi.lastPos - e.clientX;

        let colIndex = visibleColumns.findIndex(cd => cd.id === column.id);

        if (e.clientX > columnsResizeApi.lastPos || e.clientX < columnsResizeApi.lastPos && currentColWidth - diff > column.minWidth) {
            let gtcArr = gridTemplateColumns.split(" ");

            if ((column.minWidth && ((currentColWidth - diff) <= column.minWidth)) || (column.maxWidth && ((currentColWidth - diff) >= column.maxWidth))) return;

            gtcArr[colIndex] = `${currentColWidth - diff}px`;
            let newGridTemplateColumns = gtcArr.join(" ");

            containerEl.style.gridTemplateColumns = newGridTemplateColumns;
        }

        columnsResizeApi.lastPos = e.clientX;
        props.onColumnResize?.({ event: e, target, column });
    })

    columnsResizeApi.onResizeEnd = useCallback(({ e, target, column }) => {
        columnsResizeApi.lastPos = null;
        let containerEl = tableRef.current;
        let gridTemplateColumns = containerEl.style.gridTemplateColumns;
        let gtcArr = gridTemplateColumns.split(" ");

        columns.forEach(col => {
            let colIndex = visibleColumns.findIndex(cd => cd.id === col.id);
            if (col.visible) {
                col.width = gtcArr[colIndex];
            }
        })
        setColumns(columns);
        props.onColumnResizeEnd?.({ e, target, column });
        setTimeout(() => columnsResizeApi.isColumnResizing = false, 0);
    })

    columnsResizeApi.useResizeRef = column => {
        let resizeHandleRef = useRef(null);

        useResizeEvents(resizeHandleRef, column, columnsResizeApi.onResizeStart, columnsResizeApi.onResize, columnsResizeApi.onResizeEnd);

        return resizeHandleRef;
    }

    return columnsResizeApi;
}