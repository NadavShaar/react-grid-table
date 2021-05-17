import React from "react";

const HeaderCell = ({ column, tableManager }) => {
    const {
        config: {
            additionalProps: { headerCell: additionalProps = {} },
        },
    } = tableManager;

    let classNames = (
        "rgt-text-truncate " + (additionalProps.className || "")
    ).trim();

    return (
        <span
            {...additionalProps}
            className={classNames}
            data-column-id={column.id.toString()}
        >
            {column.label}
        </span>
    );
};

export default HeaderCell;
