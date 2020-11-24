import { useState, useCallback, useMemo, useRef } from 'react';

export default (props, tableManager) => {
    const rowSelectionApi = useRef({}).current;

    let {
        columnsApi: {
            columns
        }
    } = tableManager;

    let [selectedRowsIds, setSelectedRowsIds] = useState([]);

    rowSelectionApi.selectedRowsIds = props.selectedRowsIds ?? selectedRowsIds;
    rowSelectionApi.getIsRowSelectable = props.getIsRowSelectable;
    rowSelectionApi.tableHasSelection = useMemo(() => !!columns.find(cd => cd.id === 'checkbox'), [columns]);
    
    rowSelectionApi.setSelectedRowsIds = useCallback(newSelectedItems => {
        if (props.selectedRowsIds === undefined || props.onSelectedRowsChange === undefined) setSelectedRowsIds(newSelectedItems);
        props.onSelectedRowsChange?.(newSelectedItems);
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