import { useMemo } from 'react';

const useRows = (props, tableManager, { sort, searchText, columns }) => {
    return useMemo(() => {
        let rows = props.rows;
        
        if (!props.onRowsRequest) {
            var conf = columns.reduce((conf, coldef) => {
                conf[coldef.field] = coldef;
                return conf;
            }, {})
            var conf2 = columns.reduce((conf, coldef) => {
                conf[coldef.id] = coldef;
                return conf;
            }, {})

            if (searchText.length >= props.searchMinChars) {
                rows = rows.filter(item => Object.keys(item).some(key => {
                    if (conf[key] && conf[key].searchable !== false) {
                        let displayValue = conf[key].getValue({ value: item[key], column: conf[key] });
                        return conf[key].search({ value: displayValue.toString(), searchText: searchText });
                    }
                    return false;
                }));
            }

            if (sort?.colId) {
                rows = [...props.rows];
                rows.sort((a, b) => {
                    let aVal = conf2[sort.colId].getValue({ value: a[conf2[sort.colId].field], column: conf2[sort.colId] });
                    let bVal = conf2[sort.colId].getValue({ value: b[conf2[sort.colId].field], column: conf2[sort.colId] });

                    if (conf2[sort.colId].sortable === false) return 0;
                    return conf2[sort.colId].sort({ a: aVal, b: bVal, isAscending: sort.isAsc });
                });
            }
        }

        return { rows, totalRows: props.totalRows ?? rows.length };
    }, [props.rows, props.onRowsRequest, sort, searchText, columns]);
}

export default useRows;