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
        texts,
        paginationApi: {
            page,
            isPaginated,
        },
        rowSelectionApi: {
            tableHasSelection,
            setSelectedRowsIds
        },
        icons: {
            clearSelection: clearSelectionIcon
        }
    } = tableManager;

    return (
        <div className='rgt-footer-items-information-inner'>
            { texts.totalRows} { totalCount} { isPaginated ? `| ${texts.rows} ${pageSize * (page - 1)} - ${pageSize * (page - 1) + pageCount}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedCount} ${texts.selected}`}{selectedCount ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={e => setSelectedRowsIds([])}>{ clearSelectionIcon }</span> : null}</React.Fragment> : ''}
        </div>
    )
}