import React from 'react';

export default (props) => {

    let { 
        tableManager
    } = props;

    let {
        config: {
            showRowsInformation
        },
        rowsApi: {
            totalRows,
        },
        rowSelectionApi: {
            selectedRowsIds,
        },
        components: {
            Information,
            PageSize,
            Pagination
        },
        paginationApi: {
            page,
            pageSize,
            pageSizes,
            isPaginated,
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