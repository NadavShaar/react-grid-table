import React from "react";

const Header = ({ tableManager }) => {
    const {
        config: {
            showColumnVisibilityManager,
            components: { ColumnVisibility, Search },
            additionalProps: { header: additionalProps = {} },
            showSearch,
        },
        columnsApi: { columns },
        columnsVisibilityApi: { toggleColumnVisibility },
        searchApi: { setSearchText, searchText },
    } = tableManager;

    const classNames = (
        "rgt-header-container " + (additionalProps.className || "")
    ).trim();

    return (
        <div {...additionalProps} className={classNames}>
            {showSearch !== false ? (
                <Search
                    value={searchText}
                    onChange={setSearchText}
                    tableManager={tableManager}
                />
            ) : (
                <span></span>
            )}
            {showColumnVisibilityManager !== false ? (
                <ColumnVisibility
                    columns={columns}
                    onChange={toggleColumnVisibility}
                    tableManager={tableManager}
                />
            ) : (
                <span></span>
            )}
        </div>
    );
};

export default Header;
