import React from 'react';

export default props => {
    let {
        column,
        tableManager
    } = props;

    let {
        config: {
            additionalProps: {
                headerCell: additionalProps = {}
            },
        }
    } = tableManager;

    let classNames = 'rgt-text-truncate';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <span {...additionalProps} className={classNames.trim()} data-column-id={column.id.toString()}>
            {column.label}
        </span>
    )
}