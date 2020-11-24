import { useRef } from 'react';
import { useVirtual } from 'react-virtual';

export default (props, tableManager) => {
    const rowVirtualizer = useRef({}).current;

    const {
        refs: {
            tableRef
        },
        paginationApi: {
            page,
            pageSize,
            totalPages,
            isPaginated
        },
        rowsApi: {
            totalRows
        },
        additionalProps: {
            rowVirtualizer: rowVirtualizerProps
        },
    } = tableManager;

    rowVirtualizer.isVirtualScrolling = props.isVirtualScrolling || (!isPaginated && props.onRowsRequest);

    let useVirtualProps = {
        size: isPaginated ? (totalPages === page) ? (totalRows - (totalPages - 1) * pageSize) : pageSize : totalRows,
        parentRef: rowVirtualizer.isVirtualScrolling ? tableRef : {},
        ...rowVirtualizerProps,
    }

    Object.assign(rowVirtualizer, useVirtual(useVirtualProps));

    return rowVirtualizer;
}