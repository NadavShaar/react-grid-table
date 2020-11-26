import { useCallback, useRef } from 'react';

export default (props, tableManager) => {
    let {
        columnsApi: {
            columns,
            setColumns
        }
    } = tableManager;

    const columnsVisibilityApi = useRef({}).current;

    columnsVisibilityApi.toggleColumnVisibility = useCallback((colId) =>{
        columns = [...columns];
        let colIndex = columns.findIndex(cd => cd.id === colId);

        columns[colIndex].visible = !columns[colIndex].visible;
        setColumns(columns);
    })

    return columnsVisibilityApi;
}