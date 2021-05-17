import React from "react";

const Search = ({
    tableManager,
    value = tableManager.searchApi.searchText,
    onChange = tableManager.searchApi.setSearchText,
}) => {
    const {
        config: {
            texts: { search: searchText },
            icons: { search: searchIcon },
            additionalProps: { search: additionalProps = {} },
        },
    } = tableManager;

    let classNames = (
        "rgt-search-container " + (additionalProps.className || "")
    ).trim();

    return (
        <div {...additionalProps} className={classNames}>
            <label htmlFor="rgt-search" className="rgt-search-label">
                <span className="rgt-search-icon">{searchIcon}</span>
                {searchText}
            </label>
            <input
                name="rgt-search"
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="rgt-search-input"
            />
        </div>
    );
};

export default Search;
