import React from 'react';

const PageSize = ({
    value,
    onChange,
    options,
    tableManager
}) => {
    const {
        config: {
            texts: { rowsPerPage: rowsPerPageText },
            additionalProps: { pageSize: additionalProps = {} },
        }
    } = tableManager;

    let classNames = 'rgt-footer-page-size ' + (additionalProps.className || '').trim();

    return (
        <div {...additionalProps} className={classNames.trim()}>
            <span>{rowsPerPageText} </span>
            <select 
                className='rgt-footer-page-size-select'
                value={value} 
                onChange={e => { onChange(e.target.value);}}
            >
                { options.map((op, idx) => <option key={idx} value={op}>{op}</option>) }
            </select>
        </div>
    )
};

export default PageSize;