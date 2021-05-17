import React from "react";

const getHighlightedText = (text, searchTerm) => {
    if (text === searchTerm)
        return <span className="rgt-search-highlight">{text}</span>;

    const regex = new RegExp(searchTerm, "gi");
    const restArr = text.split(regex, text.length);
    let restItemsLength = 0;

    const highlightedSearch = restArr.map((textSlice, idx) => {
        restItemsLength += textSlice.length;
        let element = null;

        if (textSlice) {
            element = (
                <React.Fragment key={idx}>
                    <span>{textSlice}</span>
                    {restArr.length !== idx + 1 ? (
                        <span className="rgt-search-highlight">
                            {text.slice(
                                restItemsLength,
                                searchTerm.length + restItemsLength
                            )}
                        </span>
                    ) : null}
                </React.Fragment>
            );
        } else if (restArr.length !== idx + 1) {
            element = (
                <span key={idx} className="rgt-search-highlight">
                    {text.slice(
                        restItemsLength,
                        searchTerm.length + restItemsLength
                    )}
                </span>
            );
        }

        restItemsLength += searchTerm.length;

        return element;
    });

    return <span>{highlightedSearch}</span>;
};

export default getHighlightedText;
