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
        }
    } = tableManager;

    return (
        <React.Fragment>
            <span>{rowsPerPageText} </span>
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