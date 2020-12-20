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
            },
            additionalProps: {
                information: additionalProps = {}
            },
        },
        paginationApi: {
            page,
        },
        rowSelectionApi: {
            setSelectedRowsIds
        },
    } = tableManager;

    let classNames = 'rgt-footer-items-information-inner';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <div {...additionalProps} className={classNames.trim()}>
            { totalRowsText} { totalCount} { isPaginated ? `| ${rowsText} ${pageSize * (page - 1)} - ${pageSize * (page - 1) + pageCount}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedCount} ${selectedText}`}{selectedCount ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={e => setSelectedRowsIds([])}>{ clearSelectionIcon }</span> : null}</React.Fragment> : ''}
        </div>
    )
}