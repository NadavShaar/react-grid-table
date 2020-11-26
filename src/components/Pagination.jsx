import React from 'react';

export default props => {

    let {
        page, 
        onChange,
        tableManager
    } = props;

    let {
        config: {
            texts: {
                prev: prevText,
                page: pageText,
                next: nextText,
                of: ofText
            },  
        },
        paginationApi: {
            totalPages
        },
    } = tableManager;

    let backButtonDisabled = page-1 < 1;
    let nextButtonDisabled = page+1 > totalPages;

    return (
        <React.Fragment>
            <button 
                className={`rgt-footer-pagination-button${backButtonDisabled ? ' rgt-disabled-button' : ''}`}
                disabled={page-1 < 1} 
                onClick={e => onChange(page-1)}
            >{prevText}</button>

            <div className='rgt-footer-pagination-container'>
                <span>{pageText} </span>
                <input 
                    onClick={e => e.target.select()}
                    className='rgt-footer-page-input'
                    type='number' 
                    value={totalPages ? page : 0} 
                    onChange={e => onChange(e.target.value*1)}
                />
                <span>{ofText} {totalPages}</span>
            </div>

            <button 
                className={`rgt-footer-pagination-button${nextButtonDisabled ? ' rgt-disabled-button' : ''}`}
                disabled={page+1 > totalPages} 
                onClick={e => onChange(page+1)}
            >{nextText}</button>
        </React.Fragment>
    )
}