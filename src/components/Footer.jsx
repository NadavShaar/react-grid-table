import React from 'react';

const Footer = (props) => {

    let { 
        footerRenderer,
        ...rest
    } = props;

    let { 
        totalPages, 
        page, 
        pageSize, 
        handlePagination, 
        setPageSize, 
        pageSizes, 
        selectedRowsLength,
        numberOfRows,
        totalRows,
        tableHasSelection,
        isPaginated,
        clearSelection,
        clearSelectionIcon
    } = rest;

    if(footerRenderer) return footerRenderer(rest);

    let backButtonDisabled = page-1 < 1;
    let nextButtonDisabled = page+1 > totalPages;

    const renderSelectedItems = () => (
        <span className='rgt-footer-items-information'>Total Rows: {totalRows} | {isPaginated ? `Rows: ${numberOfRows * page - numberOfRows} - ${numberOfRows * page}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedRowsLength} Selected`}{selectedRowsLength ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={clearSelection}>{ clearSelectionIcon }</span> : null}</React.Fragment> : ''}</span>
    )

    const renderPageSize = () => (
        <React.Fragment>
            <span>Items per page: </span>
            <select 
                className='rgt-footer-items-per-page'
                value={pageSize} 
                onChange={e => {setPageSize(e.target.value); handlePagination(1)}}
            >
                { pageSizes.map((op, idx) => <option key={idx} value={op}>{op}</option>) }
            </select>
        </React.Fragment>
    )

    const renderPagination = () => (
        <React.Fragment>
            <button 
                className={`rgt-footer-pagination-button${backButtonDisabled ? ' rgt-disabled-button' : ''}`}
                disabled={page-1 < 1} 
                onClick={e => handlePagination(page-1)}
            >Prev</button>

            <div className='rgt-footer-pagination-container'>
                <span>Page: </span>
                <input 
                    onClick={e => e.target.select()}
                    className='rgt-footer-page-input'
                    type='number' 
                    value={totalPages ? page : 0} 
                    onChange={e => handlePagination(e.target.value*1)}
                />
                <span>of {totalPages}</span>
            </div>

            <button 
                className={`rgt-footer-pagination-button${nextButtonDisabled ? ' rgt-disabled-button' : ''}`}
                disabled={page+1 > totalPages} 
                onClick={e => handlePagination(page+1)}
            >Next</button>
        </React.Fragment>
    )

    return (
        <div className="rgt-footer">
            { renderSelectedItems() }
            {
                isPaginated ?
                    <div className='rgt-footer-right-container'>
                        { renderPageSize() }
                        { renderPagination() }
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Footer;