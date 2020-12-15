import { useRef } from 'react';

export default (props, tableManager) => {
    let {
        columnsApi: {
            columns,
            visibleColumns,
            setColumns
        }
    } = tableManager;

    const columnsReorderApi = useRef({
        isColumnReordering: false
    }).current;

    Object.defineProperty(columnsReorderApi, "onColumnReorderStart", { enumerable: false, writable: true })
    Object.defineProperty(columnsReorderApi, "onColumnReorderEnd", { enumerable: false, writable: true })

    columnsReorderApi.onColumnReorderStart = sortData => {
        columnsReorderApi.isColumnReordering = true;

        sortData.helper.classList.add('rgt-column-sort-ghost');

        props.onColumnReorderStart?.(sortData, tableManager);
    }

    columnsReorderApi.onColumnReorderEnd = sortData => {
        setTimeout(() => columnsReorderApi.isColumnReordering = false, 0);
        
        if (sortData.oldIndex === sortData.newIndex) return;

        let colDefNewIndex = columns.findIndex(oc => oc.id === visibleColumns[sortData.newIndex].id);
        let colDefOldIndex = columns.findIndex(oc => oc.id === visibleColumns[sortData.oldIndex].id);

        columns = [...columns];
        columns.splice(colDefNewIndex, 0, ...columns.splice(colDefOldIndex, 1));

        setColumns(columns);

        props.onColumnReorderEnd?.(sortData, tableManager);
    }

    return columnsReorderApi;
}