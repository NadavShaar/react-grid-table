import { useState, useMemo, useCallback, useRef } from 'react';

export default (props, tableManager) => {
    const columnsReorderApi = useRef({}).current;

    let {
        columnsApi: {
            columns,
            visibleColumns,
            setColumns
        }
    } = tableManager;

    columnsReorderApi.disableColumnsReorder = props.disableColumnsReorder;

    columnsReorderApi.onColumnReorderStart = useCallback(sortData => {
        columnsReorderApi.isColumnReordering = true;

        sortData.helper.classList.add('rgt-column-sort-ghost');

        props.onColumnReorderStart?.(sortData);
    })

    columnsReorderApi.onColumnReorderEnd = useCallback(sortData => {
        columnsReorderApi.isColumnReordering = false

        if (sortData.oldIndex === sortData.newIndex) return;

        let colDefNewIndex = columns.findIndex(oc => oc.id === visibleColumns[sortData.newIndex].id);
        let colDefOldIndex = columns.findIndex(oc => oc.id === visibleColumns[sortData.oldIndex].id);

        columns = [...columns];
        columns.splice(colDefNewIndex, 0, ...columns.splice(colDefOldIndex, 1));

        setColumns(columns);

        props.onColumnReorderEnd?.(sortData);
    })

    return columnsReorderApi;
}