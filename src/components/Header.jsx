import React from 'react';

const Header = (props) => {

    let {
        tableManager
    } = props;

    let { 
        params: {
            showSearch,
            searchText,
            showColumnVisibilityManager,
        },
        components: {
            columnVisibilityComponent: ColumnVisibility,
            searchComponent: Search,
        },
        columnsData: {
            columns,
        },
        handlers: {
            handleSearchChange,
            toggleColumnVisibility,
        }
    } = tableManager;

    return (
        <div className='rgt-header-container'>
            {
                showSearch !== false ?
                    <Search value={searchText} onChange={handleSearchChange} tableManager={tableManager}/>
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

export default Header;