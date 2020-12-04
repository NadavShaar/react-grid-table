import { useState, useCallback, useMemo, useRef } from 'react';

export default (props, tableManager) => {
    const rowSelectionApi = useRef({}).current;
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);

    rowSelectionApi.selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    rowSelectionApi.getIsRowSelectable = props.getIsRowSelectable;
    
    rowSelectionApi.setSelectedRowsIds = useCallback(newSelectedItems => {
        if (props.selectedRowsIds === undefined || props.onSelectedRowsChange === undefined) setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems, tableManager);
    })

    rowSelectionApi.toggleRowSelection = useCallback(rowId => {
        selectedRowsIds = [...rowSelectionApi.selectedRowsIds];

        let itemIndex = selectedRowsIds.findIndex(s => s === rowId);

        if (itemIndex !== -1) selectedRowsIds.splice(itemIndex, 1);
        else selectedRowsIds.push(rowId);

        rowSelectionApi.setSelectedRowsIds(selectedRowsIds);
    })

    return rowSelectionApi;
}