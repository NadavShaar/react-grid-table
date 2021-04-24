import { useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const useColumnsReorder = (props, tableManager) => {
    const columnsReorderApi = useRef({ isColumnReordering: false }).current;

    Object.defineProperty(columnsReorderApi, "onColumnReorderStart", { enumerable: false, writable: true })
    Object.defineProperty(columnsReorderApi, "onColumnReorderEnd", { enumerable: false, writable: true })

    // columnsReorderApi.onColumnReorderStart = sortData => {
    //     columnsReorderApi.isColumnReordering = true;

    //     sortData.helper.classList.add('rgt-column-sort-ghost');

    //     props.onColumnReorderStart?.(sortData, tableManager);
    // }

    columnsReorderApi.onColumnReorderEnd = sortData => {
        const {
            columnsApi: { columns, visibleColumns, setColumns }
        } = tableManager;
        const { active, over } = sortData;

        setTimeout(() => columnsReorderApi.isColumnReordering = false, 0);
        
        if (active.id === over.id) return;

        const oldIndex = visibleColumns.findIndex(column => column.id === active.id);
        const newIndex = visibleColumns.findIndex(column => column.id === over.id);
        // newColumns.splice(visibleColumns[sortData.newIndex].index, 0, ...newColumns.splice(visibleColumns[sortData.oldIndex].index, 1));
        const newColumns = arrayMove(columns, oldIndex, newIndex);

        setColumns(newColumns);

        props.onColumnReorderEnd?.(sortData, tableManager);
    }

    return columnsReorderApi;
}

export default useColumnsReorder;