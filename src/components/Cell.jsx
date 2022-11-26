import React from "react";

const Cell = ({ value, textValue, tableManager }) => {
    const {
        config: {
            additionalProps: { cell: additionalProps = {} },
        },
    } = tableManager;

    const classNames = (
        "rgt-cell-inner rgt-text-truncate " + (additionalProps.className || "")
    ).trim();

    return (
        <div {...additionalProps} className={classNames} title={textValue}>
            {value}
        </div>
    );
};

export default Cell;
