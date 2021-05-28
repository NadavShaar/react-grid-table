import { useRef } from "react";

const useColumnsReorder = (props, tableManager) => {
    const columnsReorderApi = useRef({ isColumnReordering: false }).current;

    Object.defineProperty(columnsReorderApi, "onColumnReorderStart", {
        enumerable: false,
        writable: true,
    });
    Object.defineProperty(columnsReorderApi, "onColumnReorderEnd", {
        enumerable: false,
        writable: true,
    });

    columnsReorderApi.onColumnReorderStart = (sortData) => {
        columnsReorderApi.isColumnReordering = true;

        sortData.helper.classList.add("rgt-column-sort-ghost");

        props.onColumnReorderStart?.(sortData, tableManager);
    };

    columnsReorderApi.onColumnReorderEnd = (sortData) => {
        const {
            columnsApi: { columns, visibleColumns, setColumns },
        } = tableManager;

        setTimeout(() => (columnsReorderApi.isColumnReordering = false), 0);

        if (sortData.oldIndex === sortData.newIndex) return;

        const newColumns = [...columns];
        newColumns.splice(
            visibleColumns[sortData.newIndex].index,
            0,
            ...newColumns.splice(visibleColumns[sortData.oldIndex].index, 1)
        );

        setColumns(newColumns);

        props.onColumnReorderEnd?.(sortData, tableManager);
    };

    return columnsReorderApi;
};

export default useColumnsReorder;
