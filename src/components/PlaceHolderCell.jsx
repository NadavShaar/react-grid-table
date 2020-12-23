import React from 'react';

export default props => {

    let {
        tableManager
    } = props;

    let {
        config: {
            additionalProps: {
                placeHolderCell: additionalProps = {}
            },
        },
    } = tableManager;

    let classNames = 'rgt-placeholder-cell';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;
    
    return <span {...additionalProps} className={classNames.trim()}></span>
}