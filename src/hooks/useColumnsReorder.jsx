import { useRef } from 'react';

const useColumnsReorder = (props, tableManager) => {
    const columnsReorderApi = useRef({ isColumnReordering: false }).current;

    Object.defineProperty(columnsReorderApi, "onColumnReorderStart", { enumerable: false, writable: true })
    Object.defineProperty(columnsReorderApi, "onColumnReorderEnd", { enumerable: false, writable: true })

    columnsReorderApi.onColumnReorderStart = sortData => {
        columnsReorderApi.isColumnReordering = true;

        sortData.helper.classList.add('rgt-column-sort-ghost');

        props.onColumnReorderStart?.(sortData, tableManager);
    }

    columnsReorderApi.onColumnReorderEnd = sortData => {
        const {
            columnsApi: { columns, visibleColumns, setColumns }
        } = tableManager;

        setTimeout(() => columnsReorderApi.isColumnReordering = false, 0);
        
        if (sortData.oldIndex === sortData.newIndex) return;

        const colDefNewIndex = columns.findIndex(oc => oc.id === visibleColumns[sortData.newIndex].id);
        const colDefOldIndex = columns.findIndex(oc => oc.id === visibleColumns[sortData.oldIndex].id);

        const newColumns = [...columns];
        newColumns.splice(colDefNewIndex, 0, ...newColumns.splice(colDefOldIndex, 1));

        setColumns(newColumns);

        props.onColumnReorderEnd?.(sortData, tableManager);
    }

    return columnsReorderApi;
}

export default useColumnsReorder;