import React from "react";
import { PopoverButton } from "./";

const ColumnVisibility = ({
    tableManager,
    columns = tableManager.columnsApi.columns,
    onChange = tableManager.columnsVisibilityApi.toggleColumnVisibility,
}) => {
    const {
        config: {
            additionalProps: { columnVisibility: additionalProps = {} },
            texts: { columnVisibility: columnVisibilityText },
            icons: { columnVisibility: columnVisibilityIcon },
        },
    } = tableManager;

    return (
        <PopoverButton
            title={columnVisibilityText}
            buttonChildren={columnVisibilityIcon}
            popoverChildren={columns
                .filter((column) => column.label)
                .map((column, idx) => (
                    <div
                        key={column.id}
                        className="rgt-clickable rgt-columns-manager-popover-row"
                    >
                        <label
                            htmlFor={`checkbox-${idx}`}
                            title={column.label}
                            onClick={() => onChange(column.id)}
                            className="rgt-clickable rgt-flex-child rgt-text-truncate"
                        >
                            {column.label}
                        </label>
                        <input
                            id={`checkbox-${idx}`}
                            className="rgt-clickable"
                            type="checkbox"
                            onChange={() => {}}
                            checked={column.visible !== false}
                        />
                    </div>
                ))}
            {...additionalProps}
        />
    );
};

export default ColumnVisibility;
