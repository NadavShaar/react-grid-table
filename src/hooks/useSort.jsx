import { useState, useCallback } from 'react';

const useSort = (props, tableManager) => {
    let [sort, setSort] = useState(props.sort || {});

    sort = props.sort ?? sort;

    const setSorting = useCallback((colId, isAsc) => {
        if (tableManager.isColumnReordering) return;

        if (props.sort === undefined || props.onSortChange === undefined) setSort({ colId, isAsc });
        props.onSortChange?.({ colId, isAsc });
    })

    return [sort, setSorting];
}

export default useSort;