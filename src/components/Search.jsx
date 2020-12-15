import React from 'react';

export default props => {

    let {
        value,
        onChange,
        tableManager,
    } = props;

    let {
        config: {
            texts: {
                search: searchText
            },
            icons: {
                search: searchIcon
            },
        }
    } = tableManager;

    return (
        <div className='rgt-search-container'>
            <label htmlFor="rgt-search" className='rgt-search-label'>
                <span className='rgt-search-icon'>{searchIcon}</span>
                {searchText}
            </label>
            <input
                name="rgt-search"
                type="search"
                value={value}
                onChange={e => onChange(e.target.value)}
                className='rgt-search-input'
            />
        </div>
    )
}