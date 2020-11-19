import { useState, useCallback } from 'react';

const useSearch = (props, tableManager) => {
    let [searchText, setSearch] = useState(props.searchText || "");

    searchText = props.searchText ?? searchText;

    const setSearchText = useCallback(searchText => {
        if (props.searchText === undefined || props.onSearchChange === undefined) setSearch(searchText);
        props.onSearchChange?.(searchText);
    })

    return [searchText, setSearchText];
}

export default useSearch;