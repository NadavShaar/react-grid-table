import { useState, useCallback } from 'react';

const useRowSelection = (props, tableManager) => {
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);

    selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    
    const updateSelectedItems = useCallback(newSelectedItems => {
        if (props.selectedRowsIds === undefined || props.onSelectedRowsChange === undefined) setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems);
    })

    const toggleItemSelection = useCallback(rowId => {
        selectedRowsIds = [...selectedRowsIds];

        let itemIndex = selectedRowsIds.findIndex(s => s === rowId);

        if (itemIndex !== -1) selectedRowsIds.splice(itemIndex, 1);
        else selectedRowsIds.push(rowId);

        updateSelectedItems(selectedRowsIds);
    })

    return [selectedRowsIds, updateSelectedItems, toggleItemSelection];
}

export default useRowSelection;