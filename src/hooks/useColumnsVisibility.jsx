import { useState, useMemo, useCallback, useRef } from 'react';

export default (props, tableManager) => {
    const columnsVisibilityApi = useRef({}).current;

    let {
        columnsApi: {
            columns,
            setColumns
        }
    } = tableManager;

    columnsVisibilityApi.toggleColumnVisibility = useCallback((colId) =>{
        columns = [...columns];
        let colIndex = columns.findIndex(cd => cd.id === colId);

        columns[colIndex].visible = !columns[colIndex].visible;
        setColumns(columns);
    })

    return columnsVisibilityApi;
}