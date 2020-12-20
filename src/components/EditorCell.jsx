import React from 'react';

export default props => {
    let {
        value,
        column,
        data,
        colIndex,
        onChange,
        tableManager: {
            config: {
                additionalProps: {
                    editorCell: additionalProps = {}
                },
            },
            columnsApi: {
                visibleColumns
            },
            rowEditApi: {
                setEditRow,
            },
        }
    } = props;

    let classNames = 'rgt-cell-inner rgt-cell-editor';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <div {...additionalProps} className={classNames.trim()}>
            <div className='rgt-cell-editor-inner'>
                <input
                    tabIndex={0}
                    autoFocus={visibleColumns.findIndex(c => c.id !== 'checkbox' && c.editable !== false) === colIndex}
                    className='rgt-cell-editor-input'
                    type="text"
                    value={value}
                    onChange={e => onChange({ ...data, [column.field]: e.target.value})}
                />
            </div>
        </div>
    )
}