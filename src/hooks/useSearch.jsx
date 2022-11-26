import { useState, useCallback, useRef } from "react";

const useSearch = (props, tableManager) => {
    const {
        config: { minSearchChars },
        columnsApi: { columns },
    } = tableManager;

    const searchApi = useRef({}).current;
    const [searchText, setSearchText] = useState("");

    searchApi.searchText = props.searchText ?? searchText;
    searchApi.validSearchText =
        searchApi.searchText.length >= minSearchChars
            ? searchApi.searchText
            : "";

    searchApi.setSearchText = (searchText) => {
        if (
            props.searchText === undefined ||
            props.onSearchTextChange === undefined
        )
            setSearchText(searchText);
        props.onSearchTextChange?.(searchText, tableManager);
    };

    searchApi.valuePassesSearch = (value, column) => {
        if (!value) return false;
        if (!column?.searchable) return false;
        if (!searchApi.validSearchText) return false;

        return column.search({
            value: value.toString(),
            searchText: searchApi.validSearchText,
        });
    };

    searchApi.searchRows = useCallback(
        (rows) => {
            if (searchApi.validSearchText) {
                rows = rows.filter((item) =>
                    Object.keys(item).some((key) => {
                        var cols = columns.filter(
                            (column) =>
                                column.searchable && column.field === key
                        );

                        let isValid = false;

                        for (let index = 0; index < cols.length; index++) {
                            const currentColumn = cols[index];
                            const value = currentColumn.getValue({
                                tableManager,
                                value: item[key],
                                column: currentColumn,
                                rowData: item,
                            });
                            isValid = currentColumn.search({
                                value: value?.toString() || "",
                                searchText: searchApi.validSearchText,
                            });

                            if (isValid) break;
                        }

                        return isValid;
                    })
                );
            }

            return rows;
        },
        [columns, searchApi.validSearchText, tableManager]
    );

    return searchApi;
};

export default useSearch;
