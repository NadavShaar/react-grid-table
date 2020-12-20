import React from 'react';

export default (props) => {

    let { 
        tableManager
    } = props;

    let {
        config: {
            isPaginated,
            showRowsInformation,
            pageSizes,
            components: {
                Information,
                PageSize,
                Pagination
            },
            additionalProps: {
                footer: additionalProps = {}
            },
        },
        rowsApi: {
            totalRows,
        },
        rowSelectionApi: {
            selectedRowsIds,
        },
        paginationApi: {
            page,
            pageSize,
            setPage,
            setPageSize,
            pageRows,
        },
    } = tableManager;

    let classNames = 'rgt-footer';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <div {...additionalProps} className={classNames.trim()}>
            <div className='rgt-footer-items-information'>
                {
                    showRowsInformation !== false ?
                        <Information 
                            totalCount={totalRows}
                            pageSize={pageSize} 
                            pageCount={ pageRows.length } 
                            selectedCount={ selectedRowsIds.length } 
                            tableManager={ tableManager } 
                        />
                        :
                        null
                }
            </div>
            {
                isPaginated ?
                    <div className='rgt-footer-right-container'>
                        <PageSize 
                            value={ pageSize } 
                            onChange={ setPageSize } 
                            options={ pageSizes } 
                            tableManager={ tableManager } 
                        />
                        <Pagination 
                            page={ page } 
                            onChange={setPage } 
                            tableManager={ tableManager } 
                        />
                    </div>
                    :
                    null
            }
        </div>
    )
}