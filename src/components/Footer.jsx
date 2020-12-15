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
            }
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


    return (
        <div className="rgt-footer">
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