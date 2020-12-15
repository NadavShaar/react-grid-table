import React from 'react';

export default props => {
    let {
        column
    } = props;

    return (
        <span className='rgt-text-truncate' data-column-id={column.id.toString()}>
            {typeof column.label === 'string' ? column.label : column.field}
        </span>
    )
}