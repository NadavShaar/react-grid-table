import React from "react";

const HeaderCell = ({ column, tableManager }) => {
    const {
        config: {
            additionalProps: { headerCell: additionalProps = {} },
            components: { SearchColumn },
            searchByColumn,
        },
        searchApi: { setColumnSearchText },
    } = tableManager;

    let classNames = (
        "rgt-text-truncate " + (additionalProps.className || "")
    ).trim();

    return (
        <div className="rgt-cell-header-content-container">
            <span
                {...additionalProps}
                className={classNames}
                data-column-id={column.id.toString()}
            >
                {column.label}
            </span>
            {searchByColumn && column.searchable && (
                <SearchColumn
                    tableManager={tableManager}
                    name={`search-column-${column.field}`}
                    value={column.searchText}
                    onChange={(value) =>
                        setColumnSearchText(column.field, value)
                    }
                />
            )}
        </div>
    );
};

export default HeaderCell;
