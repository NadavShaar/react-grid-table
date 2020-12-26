import React from 'react';

const SelectionCell = ({
    value,
    disabled,
    onChange,
    tableManager
}) => {
    const {
        config: { additionalProps: { selectionCell: additionalProps = {} } }
    } = tableManager;

    let classNames =`${disabled ? 'rgt-disabled' : 'rgt-clickable'} ${additionalProps.className || ''}`.trim();

    return (
        <input
            {...additionalProps}
            className={classNames.trim()}
            type="checkbox"
            onChange={onChange}
            onClick={e => e.stopPropagation()}
            checked={value}
            disabled={disabled}
        />
    )
};

export default SelectionCell;