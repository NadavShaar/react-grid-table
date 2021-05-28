import { useRef } from "react";
import { useVirtual } from "react-virtual";

const useRowVirtualizer = (props, tableManager) => {
    const {
        config: {
            isPaginated,
            isVirtualScroll,
            additionalProps: { rowVirtualizer: rowVirtualizerProps },
        },
        refs: { tableRef },
        paginationApi: { page, pageSize, totalPages },
        rowsApi: { totalRows },
    } = tableManager;

    const rowVirtualizer = useRef({}).current;

    const useVirtualProps = {
        size: isPaginated
            ? totalPages === page
                ? totalRows - (totalPages - 1) * pageSize
                : pageSize
            : totalRows,
        overscan: 20,
        parentRef: isVirtualScroll ? tableRef : {},
        ...rowVirtualizerProps,
    };

    Object.assign(rowVirtualizer, useVirtual(useVirtualProps));

    return rowVirtualizer;
};

export default useRowVirtualizer;
