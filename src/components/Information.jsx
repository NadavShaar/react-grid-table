import React from 'react';

const Information = ({
    totalCount, 
    pageSize,
    pageCount, 
    selectedCount,
    tableManager
}) => {
    const {
        config: {
            isPaginated,
            tableHasSelection,
            texts: {
                totalRows: totalRowsText,
                rows: rowsText,
                selected: selectedText
            },
            icons: { clearSelection: clearSelectionIcon },
            additionalProps: { information: additionalProps = {} },
        },
        paginationApi: { page },
        rowSelectionApi: { setSelectedRowsIds },
    } = tableManager;

    let classNames = 'rgt-footer-items-information-inner ' + (additionalProps.className || '').trim();

    return (
        <div {...additionalProps} className={classNames.trim()}>
            { totalRowsText} { totalCount} { isPaginated ? `| ${rowsText} ${pageSize * (page - 1)} - ${pageSize * (page - 1) + pageCount}` : ''} { tableHasSelection ? <React.Fragment>{`| ${selectedCount} ${selectedText}`}{selectedCount ? <span className="rgt-footer-clear-selection-button rgt-clickable" onClick={e => setSelectedRowsIds([])}>{ clearSelectionIcon }</span> : null}</React.Fragment> : ''}
        </div>
    )
};

export default Information;