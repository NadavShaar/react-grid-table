import React from 'react';

export default props => {
    let {
        value,
        field,
        data,
        colIndex,
        onChange,
        tableManager: {
            columnsApi: {
                visibleColumns
            },
            rowEditApi: {
                setEditRow,
            },
        }
    } = props;

    return (
        <div className='rgt-cell-inner rgt-cell-editor'>
            <div className='rgt-cell-editor-inner'>
                <input
                    tabIndex={0}
                    autoFocus={visibleColumns.findIndex(c => c.id !== 'checkbox' && c.editable !== false) === colIndex}
                    className='rgt-cell-editor-input'
                    type="text"
                    value={value}
                    onChange={e => onChange({ ...data, [field]: e.target.value})}
                />
            </div>
        </div>
    )
}