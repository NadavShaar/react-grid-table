import React from 'react';

export default props => {
    let {
        value,
    } = props;

    return (
        <div className='rgt-cell-inner rgt-text-truncate'>{value}</div>
    )
}