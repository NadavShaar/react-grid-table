import React from 'react';

const PageSize = props => {

    let { 
        value,
        onChange,
        options,
        tableManager
    } = props;

    let {
        params: {
            textConfig
        },
    } = tableManager;

    return (
        <React.Fragment>
            <span>{textConfig.rowsPerPage} </span>
            <select 
                className='rgt-footer-items-per-page'
                value={value} 
                onChange={e => { onChange(e.target.value);}}
            >
                { options.map((op, idx) => <option key={idx} value={op}>{op}</option>) }
            </select>
        </React.Fragment>
    )
}

export default PageSize;