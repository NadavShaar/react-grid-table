import { useRef } from 'react';

const useColumnsVisibility = (props, tableManager) => {
    const { columnsApi: { columns, setColumns } } = tableManager;

    const columnsVisibilityApi = useRef({}).current;

    columnsVisibilityApi.toggleColumnVisibility = colId => {
        const newColumns = [...columns];
        const colIndex = newColumns.findIndex(cd => cd.id === colId);

        newColumns[colIndex].visible = !newColumns[colIndex].visible;
        setColumns(newColumns);
    }

    return columnsVisibilityApi;
}

export default useColumnsVisibility;