import React, { useRef, useEffect } from 'react';

export default props => {
    let {
        column,
        tableManager
    } = props;

    let {
        config: {
            additionalProps: {
                headerSelectionCell: additionalProps = {}
            },
        },
        rowSelectionApi: {
            selectAll: selectionProps
        },
    } = tableManager;

    let classNames = selectionProps.disabled ? 'rgt-disabled' : 'rgt-clickable';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <input
            {...additionalProps}
            className={classNames.trim()}
            type="checkbox"
            ref={selectionProps.ref}
            onChange={selectionProps.onChange}
            checked={selectionProps.checked}
            disabled={selectionProps.disabled}
        />
    )
}