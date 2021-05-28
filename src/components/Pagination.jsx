import React from "react";

const Pagination = ({
    tableManager,
    page = tableManager.paginationApi.page,
    onChange = tableManager.paginationApi.setPage,
}) => {
    const {
        config: {
            texts: {
                prev: prevText,
                page: pageText,
                next: nextText,
                of: ofText,
            },
            additionalProps: { pagination: additionalProps = {} },
        },
        paginationApi: { totalPages },
    } = tableManager;

    let backButtonDisabled = page - 1 < 1;
    let nextButtonDisabled = page + 1 > totalPages;

    let classNames = (
        "rgt-footer-pagination " + (additionalProps.className || "")
    ).trim();

    return (
        <div {...additionalProps} className={classNames}>
            <button
                className={`rgt-footer-pagination-button${
                    backButtonDisabled ? " rgt-disabled-button" : ""
                }`}
                disabled={page - 1 < 1}
                onClick={() => onChange(page - 1)}
            >
                {prevText}
            </button>

            <div className="rgt-footer-pagination-input-container">
                <span>{pageText} </span>
                <input
                    onClick={(event) => event.target.select()}
                    className="rgt-footer-page-input"
                    type="number"
                    value={totalPages ? page : 0}
                    onChange={(event) => onChange(event.target.value * 1)}
                />
                <span>
                    {ofText} {totalPages}
                </span>
            </div>

            <button
                className={`rgt-footer-pagination-button${
                    nextButtonDisabled ? " rgt-disabled-button" : ""
                }`}
                disabled={page + 1 > totalPages}
                onClick={() => onChange(page + 1)}
            >
                {nextText}
            </button>
        </div>
    );
};

export default Pagination;
