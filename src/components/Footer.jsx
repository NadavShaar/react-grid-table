import React from 'react';

const Footer = (props) => {

    let { 
        totalPages, 
        page, 
        pageSize, 
        handlePagination, 
        setPageSize, 
        pageSizes, 
        footerRenderer,
        selectedRowsLength,
        numberOfRows,
        totalItems,
        tableHasSelection,
        isPaginated,
    } = props;

    let backButtonDisabled = page-1 < 1;
    let nextButtonDisabled = page+1 > totalPages;

    const renderSelectedItems = () => {
    return <span className='rgt-footer-items-information'>Total Rows: {totalItems} | {isPaginated ? `Rows: ${numberOfRows * page - numberOfRows} - ${numberOfRows * page}` : ''} { tableHasSelection ? `| ${selectedRowsLength} Selected` : ''}</span>;
    }

    const renderPageSize = () => {
        return <React.Fragment>
                <span>Items per page: </span>
                <select 
                    className='rgt-footer-items-per-page'
                    value={pageSize} 
                    onChange={e => {setPageSize(e.target.value); handlePagination(1)}}
                >
                    { pageSizes.map((op, idx) => <option key={idx} value={op}>{op}</option>) }
                </select>
            </React.Fragment>
    }

    const renderPagination = () => {
        return <React.Fragment>
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
    }

    return (
        <div className="rgt-footer">
            {
                footerRenderer ?
                    footerRenderer({
                        page, 
                        totalPages, 
                        handlePagination, 
                        pageSize, 
                        pageSizes, 
                        setPageSize, 
                        totalRows: totalItems,
                        selectedRowsLength,
                        numberOfRows
                    })
                    : 
                    <React.Fragment>
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
                    </React.Fragment>
            }

        </div>
    )
}

export default Footer;