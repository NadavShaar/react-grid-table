import React from 'react';

const LOADER = <svg width="46" height="46" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="3">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" stroke="#9e9e9e" />
            <path d="M36 18c0-9.94-8.06-18-18-18" stroke="#607D8B">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite" />
            </path>
        </g>
    </g>
</svg>;

const TRASH_ICON = <svg height="16" viewBox="0 0 21 21" width="16" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 2)">
        <path d="m2.5 2.5h10v12c0 1.1045695-.8954305 2-2 2h-6c-1.1045695 0-2-.8954305-2-2zm5-2c1.1045695 0 2 .8954305 2 2h-4c0-1.1045695.8954305-2 2-2z" />
        <path d="m.5 2.5h14" />
        <path d="m5.5 5.5v8" />
        <path d="m9.5 5.5v8" />
    </g>
</svg>;

const MENU_ICON = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
    <path d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
</svg>;

const SORT_ASCENDING_ICON = <React.Fragment>&uarr;</React.Fragment>;

const SORT_DESCENDING_ICON = <React.Fragment>&darr;</React.Fragment>;

const SEARCH_ICON = <React.Fragment>&#9906;</React.Fragment>;

export default {
    loader: LOADER,
    clearSelection: TRASH_ICON,
    columnVisibility: MENU_ICON,
    sortAscending: SORT_ASCENDING_ICON,
    sortDescending: SORT_DESCENDING_ICON,
    search: SEARCH_ICON
}