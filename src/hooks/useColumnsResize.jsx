import { useCallback, useRef } from 'react';
import { useResizeEvents } from './';

export default (props, tableManager) => {
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

    const columnsResizeApi = useRef({}).current;
    const lastPos = useRef(null);

    Object.defineProperty(columnsResizeApi, "onResizeStart", { enumerable: false, writable: true });
    Object.defineProperty(columnsResizeApi, "onResize", { enumerable: false, writable: true });
    Object.defineProperty(columnsResizeApi, "onResizeEnd", { enumerable: false, writable: true });
    Object.defineProperty(columnsResizeApi, "useResizeRef", { enumerable: false, writable: true });

    columnsResizeApi.isColumnResizing = false;

    columnsResizeApi.onResizeStart = useCallback(({ e, target, column }) => {
        columnsResizeApi.isColumnResizing = true;
        props.onColumnResizeStart?.({ e, target, column });
    })

    columnsResizeApi.onResize = useCallback(({ e, target, column }) => {
        let containerEl = tableRef.current;
        let gridTemplateColumns = containerEl.style.gridTemplateColumns;
        let currentColWidth = target.offsetParent.clientWidth;
        if (!lastPos.current) lastPos.current = e.clientX;

        let diff = lastPos.current - e.clientX;

        let colIndex = visibleColumns.findIndex(cd => cd.id === column.id);

        if (e.clientX > lastPos.current || e.clientX < lastPos.current && currentColWidth - diff > column.minWidth) {
            let gtcArr = gridTemplateColumns.split(" ");

            if ((column.minWidth && ((currentColWidth - diff) <= column.minWidth)) || (column.maxWidth && ((currentColWidth - diff) >= column.maxWidth))) return;

            gtcArr[colIndex] = `${currentColWidth - diff}px`;
            let newGridTemplateColumns = gtcArr.join(" ");

            containerEl.style.gridTemplateColumns = newGridTemplateColumns;
        }

        lastPos.current = e.clientX;
        props.onColumnResize?.({ event: e, target, column });
    })

    columnsResizeApi.onResizeEnd = useCallback(({ e, target, column }) => {
        lastPos.current = null;
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