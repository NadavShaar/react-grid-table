import React from "react";

const PageSize = ({
    tableManager,
    value = tableManager.paginationApi.pageSize,
    onChange = tableManager.paginationApi.setPageSize,
    options = tableManager.config.pageSizes,
}) => {
    const {
        config: {
            texts: { rowsPerPage: rowsPerPageText },
            additionalProps: { pageSize: additionalProps = {} },
        },
    } = tableManager;

    let classNames = (
        "rgt-footer-page-size " + (additionalProps.className || "")
    ).trim();

    return (
        <div {...additionalProps} className={classNames}>
            <span>{rowsPerPageText} </span>
            <select
                className="rgt-footer-page-size-select"
                value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PageSize;
