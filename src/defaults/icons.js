import React from "react";

const LOADER = (
    <svg
        width="46"
        height="46"
        viewBox="-2 -2 42 42"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="3">
                <circle
                    strokeOpacity=".5"
                    cx="18"
                    cy="18"
                    r="18"
                    stroke="#9e9e9e"
                />
                <path d="M36 18c0-9.94-8.06-18-18-18" stroke="#607D8B">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </path>
            </g>
        </g>
    </svg>
);

const CLEAR_ICON = (
    <svg
        height="16"
        viewBox="0 0 21 21"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g
            fill="none"
            fillRule="evenodd"
            stroke="#125082"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(2 2)"
        >
            <circle cx="8.5" cy="8.5" r="8" />
            <g transform="matrix(0 1 -1 0 17 0)">
                <path d="m5.5 11.5 6-6" />
                <path d="m5.5 5.5 6 6" />
            </g>
        </g>
    </svg>
);

const MENU_ICON = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
    >
        <path d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
    </svg>
);

const SORT_ASCENDING_ICON = <React.Fragment>&uarr;</React.Fragment>;

const SORT_DESCENDING_ICON = <React.Fragment>&darr;</React.Fragment>;

const SEARCH_ICON = <React.Fragment>&#9906;</React.Fragment>;

export default {
    loader: LOADER,
    clearSelection: CLEAR_ICON,
    columnVisibility: MENU_ICON,
    sortAscending: SORT_ASCENDING_ICON,
    sortDescending: SORT_DESCENDING_ICON,
    search: SEARCH_ICON,
};
