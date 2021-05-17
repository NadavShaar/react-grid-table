import React from "react";

const EditorCell = ({
    tableManager,
    value,
    data,
    column,
    onChange,
    isFirstEditableCell,
}) => {
    const {
        config: {
            additionalProps: { editorCell: additionalProps = {} },
        },
    } = tableManager;

    const classNames = (
        "rgt-cell-inner rgt-cell-editor " + (additionalProps.className || "")
    ).trim();

    return (
        <div {...additionalProps} className={classNames}>
            <div className="rgt-cell-editor-inner">
                <input
                    tabIndex={0}
                    autoFocus={isFirstEditableCell}
                    className="rgt-cell-editor-input"
                    type="text"
                    value={value}
                    onChange={(event) =>
                        onChange({
                            ...data,
                            [column.field]: event.target.value,
                        })
                    }
                />
            </div>
        </div>
    );
};

export default EditorCell;
