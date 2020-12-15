import React from 'react';

export default (text, searchTerm) => {
    if (text === searchTerm) return <span className='rgt-search-highlight'>{text}</span>;

    let re = new RegExp(searchTerm, "gi");
    let restArr = text.split(re, text.length);
    let restItemsLength = 0;

    let highlightedSearch = restArr.map((a, idx) => {
        restItemsLength += a.length;
        let el = null;

        if (a) {
            el = (
                <React.Fragment key={idx}>
                    <span>{a}</span>
                    {
                        (restArr.length !== idx + 1) ?
                            <span className='rgt-search-highlight'>
                                {text.slice(restItemsLength, searchTerm.length + restItemsLength)}
                            </span>
                            : null
                    }
                </React.Fragment>
            )
        } else if (restArr.length !== idx + 1) {
            el = (
                <span key={idx} className='rgt-search-highlight'>
                    {text.slice(restItemsLength, searchTerm.length + restItemsLength)}
                </span>
            )
        }

        restItemsLength += searchTerm.length;

        return el;
    });

    return <span>{highlightedSearch}</span>;
};