import { useVirtual } from 'react-virtual';

const useRowVirtualizer = (tableManager) => {
    const {
        refs: {
            tableRef
        },
        params: {
            page,
            pageSize,
            totalPages,
            isPaginated
        },
        rowsData: {
            totalRows
        },
        additionalProps: {
            rowVirtualizer: rowVirtualizerProps
        },
    } = tableManager;

    let useVirtualProps = {
        size: isPaginated ? (totalPages === page) ? (totalRows - (totalPages - 1) * pageSize) : pageSize : totalRows,
        parentRef: tableRef,
        ...rowVirtualizerProps,
    }

    return useVirtual(useVirtualProps);
}

export default useRowVirtualizer;