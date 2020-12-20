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
            additionalProps: {
                header: additionalProps = {}
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

    let classNames = 'rgt-header-container';
    if (additionalProps.className) classNames += ' ' + additionalProps.className;

    return (
        <div {...additionalProps} className={classNames.trim()}>
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