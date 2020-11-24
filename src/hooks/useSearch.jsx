import { useState, useCallback, useRef } from 'react';

export default (props, tableManager) => {
    const searchApi = useRef({}).current;

    let {
        columnsApi: {
            columns
        }
    } = tableManager;

    let [searchText, setSearchText] = useState(props.searchText || "");

    searchApi.searchText = props.searchText ?? searchText;
    searchApi.highlightSearch = props.highlightSearch; 
    searchApi.searchMinChars = props.searchMinChars;
    searchApi.showSearch = props.showSearch;

    searchApi.setSearchText = useCallback(searchText => {
        if (props.searchText === undefined || props.onSearchChange === undefined) setSearchText(searchText);
        props.onSearchChange?.(searchText);
    })

    searchApi.valuePassesSearch = useCallback((value, column) => {
        if (!value) return false;
        if (!column?.searchable) return false;
        if (searchApi.searchText.length < searchApi.searchMinChars) return false;

        return column.search({ value: value.toString(), searchText: searchApi.searchText });
    })

    searchApi.searchRows = useCallback(rows => {
        var cols = columns.reduce((cols, coldef) => {
            cols[coldef.field] = coldef;
            return cols;
        }, {})
        if (searchApi.searchText.length >= searchApi.searchMinChars) {
            rows = rows.filter(item => Object.keys(item).some(key => {
                if (cols[key] && cols[key].searchable) {
                    let value = cols[key].getValue({ value: item[key], column: cols[key] });
                    return cols[key].search({ value: value.toString(), searchText: searchApi.searchText });
                }
                return false;
            }));
        }

        return rows;
    }, [searchApi.searchText, columns])

    return searchApi;
}