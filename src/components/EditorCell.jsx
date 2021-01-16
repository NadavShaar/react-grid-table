import React from 'react';

const EditorCell = ({ tableManager, value, data, column, colIndex, rowIndex, onChange }) => {
    const {
        config: { additionalProps: { editorCell: additionalProps = {} }, },
        columnsApi: { visibleColumns },
    } = tableManager;

    const classNames = ('rgt-cell-inner rgt-cell-editor ' + (additionalProps.className || '')).trim();
    const firstEditableCell = visibleColumns.findIndex(visibleColumn => visibleColumn.id !== 'checkbox' && visibleColumn.editable !== false) === colIndex;

    return (
        <div {...additionalProps} className={classNames}>
            <div className='rgt-cell-editor-inner'>
                <input
                    tabIndex={0}
                    autoFocus={firstEditableCell}
                    className='rgt-cell-editor-input'
                    type="text"
                    value={value}
                    onChange={event => onChange({ ...data, [column.field]: event.target.value})}
                />
            </div>
        </div>
    )
};

export default EditorCell;