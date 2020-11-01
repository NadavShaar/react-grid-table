import React from 'react';

const Pagination = props => {

    let {
        page, 
        onChange,
        tableManager
    } = props;

    let {
        params: {
            textConfig,
            totalPages
        }
    } = tableManager;

    let backButtonDisabled = page-1 < 1;
    let nextButtonDisabled = page+1 > totalPages;

    return (
        <React.Fragment>
            <button 
                className={`rgt-footer-pagination-button${backButtonDisabled ? ' rgt-disabled-button' : ''}`}
                disabled={page-1 < 1} 
                onClick={e => onChange(page-1)}
            >{textConfig.prev}</button>

            <div className='rgt-footer-pagination-container'>
                <span>{textConfig.page} </span>
                <input 
                    onClick={e => e.target.select()}
                    className='rgt-footer-page-input'
                    type='number' 
                    value={totalPages ? page : 0} 
                    onChange={e => onChange(e.target.value*1)}
                />
                <span>{textConfig.of} {totalPages}</span>
            </div>

            <button 
                className={`rgt-footer-pagination-button${nextButtonDisabled ? ' rgt-disabled-button' : ''}`}
                disabled={page+1 > totalPages} 
                onClick={e => onChange(page+1)}
            >{textConfig.next}</button>
        </React.Fragment>
    )
}

export default Pagination;