import { useMemo } from 'react';

export default (props, tableManager) => {
    return useMemo(() => {
        return {
            headerCell: {},
            cell: {},
            rowVirtualizer: {},
            ...props.additionalProps
        }
    }, [props.additionalProps]);
}