import React from 'react';

export default props => {

    let { 
        value,
        onChange,
        options,
        tableManager
    } = props;

    let {
        config: {
            texts: {
                rowsPerPage: rowsPerPageText
            },
            additionalProps: {
                pageSize: additionalProps = {}
            },
        }
    } = tableManager;

    let classNames = 'rgt-footer-page-size';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

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
}