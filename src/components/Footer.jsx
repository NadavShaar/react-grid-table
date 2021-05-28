import React from "react";

const Footer = ({ tableManager }) => {
    const {
        config: {
            isPaginated,
            showRowsInformation,
            pageSizes,
            components: { Information, PageSize, Pagination },
            additionalProps: { footer: additionalProps = {} },
        },
        rowsApi: { totalRows },
        rowSelectionApi: { selectedRowsIds },
        paginationApi: { page, pageSize, setPage, setPageSize, pageRows },
    } = tableManager;

    const classNames = (
        "rgt-footer " + (additionalProps.className || "")
    ).trim();

    return (
        <div {...additionalProps} className={classNames}>
            {showRowsInformation !== false ? (
                <Information
                    totalCount={totalRows}
                    pageSize={pageSize}
                    pageCount={pageRows.length}
                    selectedCount={selectedRowsIds.length}
                    tableManager={tableManager}
                />
            ) : (
                <span></span>
            )}
            {isPaginated ? (
                <div className="rgt-footer-right-container">
                    <PageSize
                        value={pageSize}
                        onChange={setPageSize}
                        options={pageSizes}
                        tableManager={tableManager}
                    />
                    <Pagination
                        page={page}
                        onChange={setPage}
                        tableManager={tableManager}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default Footer;
