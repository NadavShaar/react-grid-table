import React from 'react';

const TRASH_ICON = <svg height="16" viewBox="0 0 21 21" width="16" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 2)">
        <path d="m2.5 2.5h10v12c0 1.1045695-.8954305 2-2 2h-6c-1.1045695 0-2-.8954305-2-2zm5-2c1.1045695 0 2 .8954305 2 2h-4c0-1.1045695.8954305-2 2-2z"/>
        <path d="m.5 2.5h14"/>
        <path d="m5.5 5.5v8"/>
        <path d="m9.5 5.5v8"/>
    </g>
</svg>;

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
        setSelectedItems,
    } = props;

    let backButtonDisabled = page-1 < 1;
    let nextButtonDisabled = page+1 > totalPages;

    const renderSelectedItems = () => {
    return <span className='rgt-footer-items-information'>Total Rows: {totalItems} | {isPaginated ? `Rows: ${numberOfRows * page - numberOfRows} - ${numberOfRows * page}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedRowsLength} Selected`}{selectedRowsLength ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={e => setSelectedItems([])}>{TRASH_ICON}</span> : null}</React.Fragment> : ''}</span>;
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