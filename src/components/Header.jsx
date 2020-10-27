import React from 'react';
import PopoverButton from './PopoverButton';

const Header = (props) => {

    let {
        tableManager,
        headerRenderer
    } = props;

    let { 
        params: {
            showSearch,
            searchText,
            showColumnVisibilityManager,
        },
        renderers: {
            columnVisibilityRenderer,
            searchRenderer,
        },
        columnsData: {
            columns,
        },
        handlers: {
            setSearchText,
            handleColumnVisibility,
        },
        icons: {
            columnVisibility: columnVisibilityIcon,
            search: searchIcon
        }
    } = tableManager;

    if (headerRenderer) return headerRenderer({ tableManager });

    const renderSearch = ({searchText, setSearchText}) => (
        <div className='rgt-search-container'>
            <label htmlFor="rgt-search" className='rgt-search-label'>
            <span className='rgt-search-icon'>{ searchIcon }</span>
                Search:
            </label>
            <input 
                name="rgt-search"
                type="search" 
                value={searchText} 
                onChange={e => setSearchText(e.target.value)} 
                className='rgt-search-input'
            />
        </div>
    )

    const renderColumnVisibilityManager = ({columns, handleColumnVisibility}) => {

        return (
            <PopoverButton 
                buttonChildren={ columnVisibilityIcon }
                popoverChildren={
                    columns.map((cd, idx) => {
                        if(cd.pinned && idx === 0 || cd.pinned && idx === columns.length-1) return null;
                        return (
                            <div key={idx} className='rgt-clickable rgt-columns-manager-popover-row' onClick={ e => handleColumnVisibility(cd.id) } >
                                <label htmlFor={`checkbox-${idx}`} onClick={ e => handleColumnVisibility(cd.id) } className='rgt-clickable rgt-flex-child rgt-text-truncate'>{cd.label || cd.field || cd.id}</label>
                                <input 
                                    id={`checkbox-${idx}`}
                                    className='rgt-clickable'
                                    type="checkbox" 
                                    onChange={ e => { } } 
                                    checked={ cd.visible !== false } 
                                />
                            </div>
                        )
                    })
                }
            />
        )
    }

    return (
        <div className='rgt-header-container'>
            {
                showSearch !== false ?
                    searchRenderer ? 
                        searchRenderer({searchText, setSearchText})
                        :
                        renderSearch({searchText, setSearchText})
                    :
                    <span></span>
            }
            {
                showColumnVisibilityManager !== false ?
                    columnVisibilityRenderer ?
                        columnVisibilityRenderer({columns, handleColumnVisibility})
                        :
                        renderColumnVisibilityManager({columns, handleColumnVisibility})
                    :
                    <span></span>
            }
        </div>
    )
}

export default Header;