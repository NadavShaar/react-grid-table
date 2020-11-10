import React from 'react';

const Information = props => {

    let { 
        totalCount, 
        pageCount, 
        selectedCount,
        tableManager
    } = props;

    let {
        params: {
            page,
            tableHasSelection,
            isPaginated,
            textConfig
        },
        handlers: {
            updateSelectedItems
        },
        icons: {
            clearSelection: clearSelectionIcon
        }
    } = tableManager;

    return (
        <div className='rgt-footer-items-information-inner'>
            { textConfig.totalRows } { totalCount } | { isPaginated ? `${textConfig.rows} ${pageCount * page - pageCount} - ${pageCount * page}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedCount} ${textConfig.selected}`}{selectedCount ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={e => updateSelectedItems([])}>{ clearSelectionIcon }</span> : null}</React.Fragment> : ''}
        </div>
    )
}

export default Information;