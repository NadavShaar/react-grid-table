import React from 'react';

export default props => {

    let { 
        value,
        onChange,
        options,
        tableManager
    } = props;

    let {
        texts,
    } = tableManager;

    return (
        <React.Fragment>
            <span>{texts.rowsPerPage} </span>
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