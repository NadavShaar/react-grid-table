import { useState, useCallback } from 'react';

export default (props, tableManager) => {
    if (!props.onRowsRequest) return;

    const {
        params: {
            page,
            pageSize,
        },
        rowsData: {
            totalRows
        },
    } = tableManager;

    let lastIndex = tableManager.rowVirtualizer.virtualItems[tableManager.rowVirtualizer.virtualItems.length - 1]?.index + ((page - 1) * pageSize) || 0;
    if (props.isPaginated && !props.isVirtualScrolling) {
        lastIndex = Math.min(page * pageSize, totalRows);
    }
    lastIndex = Math.min(lastIndex, totalRows);

    if ((lastIndex <= tableManager.request.to) && (tableManager.request.from !== -1)) return;

    let from = tableManager.request.to;
    let to = from + pageSize - (props.isPaginated ? ((from) % pageSize) : 0);
    if (Number(totalRows)) to = Math.min(to, totalRows);
    tableManager.request = {
        from,
        to
    }
    props.onRowsRequest(tableManager.request, tableManager)
};