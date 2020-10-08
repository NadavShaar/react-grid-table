import React from 'react';
import tableManager from '../tableManager';
import PopoverButton from './PopoverButton';

const DEFAULT_MENU_ICON = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
    <path d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/>
</svg>;

const Header = (props) => {

    let { 
        showSearch,
        manageColumnVisibility,
        columnVisibilityRenderer,
        colDefs,
        setColDefs,
        searchRenderer,
        searchTextState,
        setSearchText
    } = props;

    const renderSearch = () => (
        <div className='rgt-search-container'>
            {
                searchRenderer ?
                    searchRenderer({searchText: searchTextState, setSearchText})
                    :
                    <React.Fragment>
                        <label htmlFor="rgt-search" className='rgt-search-label'>
                            <span className='rgt-search-icon'>&#9906;</span>
                            Search:
                        </label>
                        <input 
                            name="rgt-search"
                            type="search" 
                            value={searchTextState} 
                            onChange={e => setSearchText(e.target.value)} 
                            className='rgt-search-input'
                        />
                    </React.Fragment>
            }
        </div>
    )

    const renderColumnVisibilityManager = () => {
        return (
            <PopoverButton 
                buttonChildren={ DEFAULT_MENU_ICON }
                popoverChildren={
                    colDefs.map((cd, idx) => {
                        if(cd.pinned && idx === 0 || cd.pinned && idx === colDefs.length-1) return null;
                        return (
                            <div key={idx} className='rgt-columns-manager-popover-row'>
                                <label htmlFor={`checkbox-${idx}`} className='rgt-clickable rgt-flex-child rgt-text-truncate'>{cd.label || cd.field}</label>
                                <input 
                                    id={`checkbox-${idx}`}
                                    className='rgt-clickable'
                                    type="checkbox" 
                                    onChange={ e => tableManager.handleColumnVisibility({colId: cd.id, columns: colDefs, setColumns: setColDefs}) } 
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
                    renderSearch()
                    :
                    <span></span>
            }
            {
                manageColumnVisibility !== false ?
                    columnVisibilityRenderer ?
                        columnVisibilityRenderer({columns: colDefs, setColumnVisibility: colId => tableManager.handleColumnVisibility({colId, columns: colDefs, setColumns: setColDefs})})
                        :
                        renderColumnVisibilityManager()
                    :
                    <span></span>
            }
        </div>
    )
}

export default Header;