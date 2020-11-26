import React from 'react';

export default props => {
    let { 
        totalCount, 
        pageSize,
        pageCount, 
        selectedCount,
        tableManager
    } = props;

    let {
        config: {
            isPaginated,
            tableHasSelection,
            texts: {
                totalRows: totalRowsText,
                rows: rowsText,
                selected: selectedText
            },
            icons: {
                clearSelection: clearSelectionIcon
            }
        },
        paginationApi: {
            page,
        },
        rowSelectionApi: {
            setSelectedRowsIds
        },
    } = tableManager;

    return (
        <div className='rgt-footer-items-information-inner'>
            { totalRowsText} { totalCount} { isPaginated ? `| ${rowsText} ${pageSize * (page - 1)} - ${pageSize * (page - 1) + pageCount}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedCount} ${selectedText}`}{selectedCount ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={e => setSelectedRowsIds([])}>{ clearSelectionIcon }</span> : null}</React.Fragment> : ''}
        </div>
    )
}