import React from 'react';

export default props => {
    let {
        value,
        tableManager
    } = props;

    let {
        config: {
            additionalProps: {
                cell: additionalProps = {}
            },
        }
    } = tableManager;

    let classNames = 'rgt-cell-inner rgt-text-truncate';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <div {...additionalProps} className={classNames.trim()}>{value}</div>
    )
}