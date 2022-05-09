import React from "react";

const SearchColumn = ({ tableManager, name, value, onChange }) => {
    const {
        config: {
            texts: { search: searchText },
        },
    } = tableManager;

    return (
        <input
            name={name}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            placeholder={searchText}
            className="rgt-search-column-input"
        />
    );
};

export default SearchColumn;
