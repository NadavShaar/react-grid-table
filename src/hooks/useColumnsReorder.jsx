import { useRef } from 'react';

const useColumnsReorder = (props, tableManager) => {
    const columnsReorderApi = useRef({ isColumnReordering: false }).current;

    Object.defineProperty(columnsReorderApi, "onColumnReorderStart", { enumerable: false, writable: true })
    Object.defineProperty(columnsReorderApi, "onColumnReorderEnd", { enumerable: false, writable: true })

    columnsReorderApi.onColumnReorderStart = sortData => {
        columnsReorderApi.isColumnReordering = true;

        // sortData.helper.classList.add('rgt-column-sort-ghost');

        props.onColumnReorderStart?.(sortData, tableManager);
    }

    columnsReorderApi.onColumnReorderEnd = sortData => {
        const {
            columnsApi: { columns, visibleColumns, setColumns }
        } = tableManager;

        setTimeout(() => columnsReorderApi.isColumnReordering = false, 0);
        
        if (sortData.source.index === sortData.destination.index) return;

        const newColumns = [...columns];
        newColumns.splice(visibleColumns[sortData.destination.index].index, 0, ...newColumns.splice(visibleColumns[sortData.source.index].index, 1));

        setColumns(newColumns);

        props.onColumnReorderEnd?.(sortData, tableManager);
    }

    return columnsReorderApi;
}

export default useColumnsReorder;