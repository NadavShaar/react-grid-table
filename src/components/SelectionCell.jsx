import React from 'react';

export default props => {
    let {
        value,
        disabled,
        onChange,
        tableManager
    } = props;

    let {
        config: {
            additionalProps: {
                selectionCell: additionalProps = {}
            },
        }
    } = tableManager;

    let classNames = disabled ? 'rgt-disabled' : 'rgt-clickable';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

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
}