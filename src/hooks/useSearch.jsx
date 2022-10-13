import { useState, useCallback, useRef } from "react";

const useSearch = (props, tableManager) => {
    const {
        config: { minSearchChars, searchByColumn },
        columnsApi: { columns, setColumns },
    } = tableManager;

    const searchApi = useRef({}).current;
    const [searchText, setSearchText] = useState("");

    searchApi.searchText = props.searchText ?? searchText;

    searchApi.setSearchText = (searchText) => {
        if (
            props.searchText === undefined ||
            props.onSearchTextChange === undefined
        )
            setSearchText(searchText);
        props.onSearchTextChange?.(searchText, tableManager);
    };

    searchApi.setColumnSearchText = (columnField, searchText) => {
        const columnsClone = [...columns];
        const columnIndex = columnsClone.findIndex(
            (col) => col.field === columnField
        );

        if (columnIndex !== -1) {
            columnsClone[columnIndex].searchText = searchText;
            setColumns(columnsClone);

            props.onColumnSearchTextChange?.(
                searchText,
                columnField,
                tableManager
            );
        }
    };

    searchApi.valuePassesSearch = (value, column) => {
        if (!value) return false;
        if (!column?.searchable) return false;
        if (!searchByColumn && searchApi.searchText.length < minSearchChars) {
            return false;
        } else if (
            searchByColumn &&
            column.searchText.length < minSearchChars
        ) {
            return false;
        }

        return column.search({
            value: value.toString(),
            searchText: searchByColumn
                ? column.searchText
                : searchApi.searchText,
        });
    };

    searchApi.searchRows = useCallback(
        (rows) => {
            const searchValue = ({ searchText, cellValue, column }) => {
                const value = column.getValue({
                    value: cellValue,
                    column,
                });
                return column.search({
                    value: value?.toString() || "",
                    searchText,
                });
            };

            if (searchApi.searchText.length >= minSearchChars) {
                rows = rows.filter((item) =>
                    columns.some((column) => {
                        if (column.searchable) {
                            return searchValue({
                                searchText: searchApi.searchText,
                                cellValue: item[column.field],
                                column,
                            });
                        }
                        return false;
                    })
                );
            }

            if (searchByColumn) {
                columns.forEach((column) => {
                    if (
                        column.searchable &&
                        column.searchText.length >= minSearchChars
                    ) {
                        rows = rows.filter((item) => {
                            return searchValue({
                                searchText: column.searchText,
                                cellValue: item[column.field],
                                column,
                            });
                        });
                    }
                });
            }

            return rows;
        },
        [searchApi.searchText, searchByColumn, columns, minSearchChars]
    );

    return searchApi;
};

export default useSearch;
