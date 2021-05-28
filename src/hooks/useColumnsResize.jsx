import { useRef } from "react";
import { useResizeEvents } from "./";

const useColumnsResize = (props, tableManager) => {
    const {
        config: { minColumnResizeWidth },
        refs: { tableRef },
        columnsApi: { columns, visibleColumns, setColumns },
    } = tableManager;

    const columnsResizeApi = useRef({ isColumnResizing: false }).current;
    const lastPos = useRef(null);

    Object.defineProperty(columnsResizeApi, "onResizeStart", {
        enumerable: false,
        writable: true,
    });
    Object.defineProperty(columnsResizeApi, "onResize", {
        enumerable: false,
        writable: true,
    });
    Object.defineProperty(columnsResizeApi, "onResizeEnd", {
        enumerable: false,
        writable: true,
    });
    Object.defineProperty(columnsResizeApi, "useResizeRef", {
        enumerable: false,
        writable: true,
    });

    columnsResizeApi.onResizeStart = ({ event, target, column }) => {
        columnsResizeApi.isColumnResizing = true;
        props.onColumnResizeStart?.({ event, target, column }, tableManager);
    };

    columnsResizeApi.onResize = ({ event, target, column }) => {
        const containerEl = tableRef.current;
        const gridTemplateColumns = containerEl.style.gridTemplateColumns;
        const currentColWidth = target.offsetParent.clientWidth;
        lastPos.current = lastPos.current ?? event.clientX;

        const diff = event.clientX - lastPos.current;

        if (!diff) return;

        const minResizeWidth = column.minResizeWidth ?? minColumnResizeWidth;
        let newColWidth = currentColWidth + diff;
        if (minResizeWidth && newColWidth < minResizeWidth)
            newColWidth = minResizeWidth;
        if (column.maxResizeWidth && column.maxResizeWidth < newColWidth)
            newColWidth = column.maxResizeWidth;

        const colIndex = visibleColumns.findIndex((cd) => cd.id === column.id);
        const gtcArr = gridTemplateColumns.split(" ").reduce((gtcArr, gtc) => {
            if (
                gtcArr[gtcArr.length - 1] &&
                gtcArr[gtcArr.length - 1][
                    gtcArr[gtcArr.length - 1].length - 1
                ] === ","
            ) {
                gtcArr[gtcArr.length - 1] = gtcArr[gtcArr.length - 1] + gtc;
                return gtcArr;
            }
            return gtcArr.concat(gtc);
        }, []);
        gtcArr[colIndex] = `${newColWidth}px`;

        containerEl.style.gridTemplateColumns = gtcArr.join(" ");

        lastPos.current = event.clientX;
        props.onColumnResize?.({ event, target, column }, tableManager);
    };

    columnsResizeApi.onResizeEnd = ({ event, target, column }) => {
        setTimeout(() => (columnsResizeApi.isColumnResizing = false), 0);

        lastPos.current = null;
        const containerEl = tableRef.current;
        const gtcArr = containerEl.style.gridTemplateColumns
            .split(" ")
            .reduce((gtcArr, gtc) => {
                if (
                    gtcArr[gtcArr.length - 1] &&
                    gtcArr[gtcArr.length - 1][
                        gtcArr[gtcArr.length - 1].length - 1
                    ] === ","
                ) {
                    gtcArr[gtcArr.length - 1] = gtcArr[gtcArr.length - 1] + gtc;
                    return gtcArr;
                }
                return gtcArr.concat(gtc);
            }, []);

        columns.forEach((column) => {
            if (!column.visible) return;

            const colIndex = visibleColumns.findIndex(
                (cd) => cd.id === column.id
            );
            column.width = gtcArr[colIndex];
        });

        setColumns(columns);
        props.onColumnResizeEnd?.({ event, target, column }, tableManager);
    };

    const useResizeRef = (column) => {
        const resizeHandleRef = useRef(null);

        useResizeEvents(
            resizeHandleRef,
            column,
            columnsResizeApi.onResizeStart,
            columnsResizeApi.onResize,
            columnsResizeApi.onResizeEnd
        );

        return resizeHandleRef;
    };

    columnsResizeApi.useResizeRef = useResizeRef;

    return columnsResizeApi;
};

export default useColumnsResize;
