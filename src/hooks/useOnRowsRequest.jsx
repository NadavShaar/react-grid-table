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

    let lastIndex = tableManager.rowVirtualizer.virtualItems[tableManager.rowVirtualizer.virtualItems.length - 1]?.index + ((page - 1) * pageSize);
    if (props.isPaginated && props.onRowsRequest) {
        lastIndex = Math.min(page * pageSize, totalRows);
    }
    lastIndex = Math.min(lastIndex, totalRows);

    if (lastIndex <= tableManager.request.to) return;

    let from = tableManager.request.to;
    tableManager.request = {
        from,
        to: from + Math.min(pageSize - (props.isPaginated ? ((from) % pageSize) : 0), totalRows - from)
    }
    props.onRowsRequest(tableManager.request, tableManager)
};