import React from 'react';

const Footer = (props) => {

    let { 
        tableManager
    } = props;

    let {
        params: {
            page,
            pageSize,
            pageSizes,
            isPaginated,
        },
        rowsData: {
            selectedRowsIds,
            pageItems,
            items,
        },
        components: {
            informationComponent: Information,
            pageSizeComponent: PageSize,
            paginationComponent: Pagination
        },
        handlers: {
            handlePagination,
            handlePageSizeChange,
        },
    } = tableManager;


    return (
        <div className="rgt-footer">
            <Information 
                totalCount={ items.length } 
                pageCount={ pageItems.length } 
                selectedCount={ selectedRowsIds.length } 
                tableManager={ tableManager } 
            />
            {
                isPaginated ?
                    <div className='rgt-footer-right-container'>
                        <PageSize 
                            value={ pageSize } 
                            onChange={ handlePageSizeChange } 
                            options={ pageSizes } 
                            tableManager={ tableManager } 
                        />
                        <Pagination 
                            page={ page } 
                            onChange={ handlePagination } 
                            tableManager={ tableManager } 
                        />
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Footer;