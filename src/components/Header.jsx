import React from 'react';

export default (props) => {

    let {
        tableManager
    } = props;

    let { 
        config: {
            showColumnVisibilityManager,
            components: {
                ColumnVisibility,
                Search,
            },
        },
        columnsApi: {
            columns,
        },
        columnsVisibilityApi: {
            toggleColumnVisibility,
        },
        searchApi: {
            showSearch,
            setSearchText,
            searchText,
        },
    } = tableManager;

    return (
        <div className='rgt-header-container'>
            {
                showSearch !== false ?
                    <Search value={searchText} onChange={setSearchText} tableManager={tableManager}/>
                    :
                    <span></span>
            }
            {
                showColumnVisibilityManager !== false ?
                    <ColumnVisibility columns={columns} onChange={toggleColumnVisibility} tableManager={tableManager}/>
                    :
                    <span></span>
            }
        </div>
    )
}