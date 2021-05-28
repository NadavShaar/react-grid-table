import { useRef } from "react";

const useColumnsVisibility = (props, tableManager) => {
    const {
        columnsApi: { columns, setColumns },
    } = tableManager;

    const columnsVisibilityApi = useRef({}).current;

    columnsVisibilityApi.toggleColumnVisibility = (columnId) => {
        const newColumns = [...columns];
        const colIndex = newColumns.findIndex(
            (column) => column.id === columnId
        );

        newColumns[colIndex].visible = !newColumns[colIndex].visible;
        setColumns(newColumns);
    };

    return columnsVisibilityApi;
};

export default useColumnsVisibility;
