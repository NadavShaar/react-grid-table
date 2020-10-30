import React from 'react';

const Footer = (props) => {

    let { 
        tableManager
    } = props;

    let {
        params: {
            totalPages,
            page,
            pageSize,
            pageSizes,
            tableHasSelection,
            isPaginated,
        },
        components: {
        },
        rowsData: {
            selectedRows,
            pageItems,
            items,
        },
        handlers: {
            handlePagination,
            handlePageSizeChange,
            updateSelectedItems
        },
        icons: {
            clearSelection: clearSelectionIcon
        }
    } = tableManager;

    let backButtonDisabled = page-1 < 1;
    let nextButtonDisabled = page+1 > totalPages;

    const renderSelectedItems = () => (
        <span className='rgt-footer-items-information'>Total Rows: {items.length} | {isPaginated ? `Rows: ${pageItems.length * page - pageItems.length} - ${pageItems.length * page}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedRows.length} Selected`}{selectedRows.length ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={e => updateSelectedItems([])}>{ clearSelectionIcon }</span> : null}</React.Fragment> : ''}</span>
    )

    const renderPageSize = () => (
        <React.Fragment>
            <span>Rows per page: </span>
            <select 
                className='rgt-footer-items-per-page'
                value={pageSize} 
                onChange={e => { handlePageSizeChange(e.target.value);}}
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