import React from "react";

const HeaderSelectionCell = ({
    tableManager,
    ref = tableManager.rowSelectionApi.selectAll.ref,
    onChange = tableManager.rowSelectionApi.selectAll.onChange,
    checked = tableManager.rowSelectionApi.selectAll.checked,
    disabled = tableManager.rowSelectionApi.selectAll.disabled,
}) => {
    const {
        config: {
            additionalProps: { headerSelectionCell: additionalProps = {} },
        },
    } = tableManager;

    let classNames = (
        disabled
            ? "rgt-disabled"
            : "rgt-clickable" + " " + additionalProps.className || ""
    ).trim();

    return (
        <input
            {...additionalProps}
            className={classNames}
            type="checkbox"
            ref={ref}
            onChange={onChange}
            checked={checked}
            disabled={disabled}
        />
    );
};

export default HeaderSelectionCell;
