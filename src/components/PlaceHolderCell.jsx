import React from "react";

const PlaceHolderCell = ({ tableManager }) => {
    const {
        config: {
            additionalProps: { placeHolderCell: additionalProps = {} },
        },
    } = tableManager;

    let classNames = (
        "rgt-placeholder-cell " + (additionalProps.className || "")
    ).trim();

    return <span {...additionalProps} className={classNames}></span>;
};

export default PlaceHolderCell;
