import { useState, useCallback, useRef } from 'react';

const useSearch = (props, tableManager) => {
    const { config: { minSearchChars }, columnsApi: { columns } } = tableManager;

    const searchApi = useRef({}).current;
    const [searchText, setSearchText] = useState("");

    searchApi.searchText = props.searchText ?? searchText;

    searchApi.setSearchText = searchText => {
        if (props.searchText === undefined || props.onSearchTextChange === undefined) setSearchText(searchText);
        props.onSearchTextChange?.(searchText, tableManager);
    }

    searchApi.valuePassesSearch = (value, column) => {
        if (!value) return false;
        if (!column?.searchable) return false;
        if (searchApi.searchText.length < minSearchChars) return false;

        return column.search({ value: value.toString(), searchText: searchApi.searchText });
    }

    searchApi.searchRows = useCallback(rows => {
        var cols = columns.reduce((cols, coldef) => {
            cols[coldef.field] = coldef;
            return cols;
        }, {})

        if (searchApi.searchText.length >= minSearchChars) {
            rows = rows.filter(item => Object.keys(item).some(key => {
                if (cols[key] && cols[key].searchable) {
                    const value = cols[key].getValue({ value: item[key], column: cols[key] });
                    return cols[key].search({ value: value.toString(), searchText: searchApi.searchText });
                }
                return false;
            }));
        }

        return rows;
    }, [searchApi.searchText, columns, minSearchChars])

    return searchApi;
}

export default useSearch;