import { useState, useRef } from 'react';

export default (props, tableManager) => {
    const rowSelectionApi = useRef({}).current;
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);

    rowSelectionApi.selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    rowSelectionApi.getIsRowSelectable = props.getIsRowSelectable;
    
    rowSelectionApi.setSelectedRowsIds = newSelectedItems => {
        if (props.selectedRowsIds === undefined || props.onSelectedRowsChange === undefined) setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems, tableManager);
    }

    rowSelectionApi.toggleRowSelection = rowId => {
        selectedRowsIds = [...rowSelectionApi.selectedRowsIds];

        let itemIndex = selectedRowsIds.findIndex(s => s === rowId);

        if (itemIndex !== -1) selectedRowsIds.splice(itemIndex, 1);
        else selectedRowsIds.push(rowId);

        rowSelectionApi.setSelectedRowsIds(selectedRowsIds);
    }

    return rowSelectionApi;
}