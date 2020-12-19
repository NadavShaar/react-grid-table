import React from 'react';

export default props => {
    let {
        value,
        disabled,
        onChange,
    } = props;

    return (
        <input
            className={disabled ? 'rgt-disabled' : 'rgt-clickable'}
            type="checkbox"
            onChange={onChange}
            onClick={e => e.stopPropagation()}
            checked={value}
            disabled={disabled}
        />
    )
}